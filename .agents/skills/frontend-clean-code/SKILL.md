---
name: frontend-clean-code
description: Menegakkan struktur modular berbasis fitur. Memisahkan UI, Logika (Hooks), dan Definisi (Types) secara ketat ke dalam direktori fitur masing-masing untuk mencapai SRP (Single Responsibility Principle) dan DRY yang maksimal.
---

# Skill: Frontend Clean Code

### Rule 1: Minimalist Page Component

Halaman (file di dalam folder `pages/`) hanya bertugas sebagai kanvas untuk menyusun komponen-komponen fitur. File page harus sangat bersih dari implementasi detail.

**❌ DON'T: Menulis Logika di Page**
Jangan mengelola _state_ kompleks, mendefinisikan tipe data, atau menulis logika bisnis dan _fetching_ langsung di dalam file _page_ (halaman utama).

```tsx
// ❌ DON'T: src/pages/dashboard.tsx
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/dashboard')
            .then((res) => res.json())
            .then(setData);
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {data.map((item) => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
}
```

**✅ DO: Impor dan Susun Komponen**
Impor komponen UI murni dari folder `features` dan atur tata letaknya secara deklaratif tanpa menyimpan _state_ bisnis.

```tsx
// ✅ DO: src/pages/dashboard.tsx
import { DashboardHeader } from '@/components/feature/dashboard/dashboard-header';
import { DashboardStats } from '@/components/feature/dashboard/dashboard-stats';

export default function DashboardPage() {
    return (
        <main className="flex flex-col gap-4">
            <DashboardHeader />
            <DashboardStats />
        </main>
    );
}
```

---

### Rule 2: Feature-Based Organization

Setiap modul besar harus memiliki folder sendiri di bawah kategori fitur. Struktur proyek harus dikelompokkan berdasarkan area fungsionalitas (fitur), bukan berdasarkan tipe file secara mentah.

**❌ DON'T: Mencampur File Berdasarkan Tipe (Flat Structure)**
Jangan meletakkan semua komponen dari berbagai fitur di satu folder `components/` yang datar, atau menumpuk semua hook di satu folder `hooks/` tanpa pengelompokan.

```text
// ❌ DON'T: Struktur yang berantakan
src/
├── components/
│   ├── order-table.tsx
│   ├── user-profile.tsx
│   └── product-card.tsx
├── hooks/
│   ├── use-orders.ts
│   └── use-users.ts
```

**✅ DO: Kelompokkan Berdasarkan Fitur**
Pisahkan komponen UI, hook logika, dan tipe data ke dalam direktori spesifik yang diberi nama sesuai dengan nama fiturnya.

```text
// ✅ DO: Struktur modular berbasis fitur
src/
├── components/feature/order/
│   ├── order-table.tsx               <-- STRICTLY UI Components
│   └── order-filters.tsx
├── hooks/feature/order/
│   └── use-order-filters.ts          <-- Business Logic & API Calls
└── types/feature/order/
    └── index.ts                      <-- Feature Types
```

---

### Rule 3: Strict Logic Extraction to Feature Hooks

Semua logika fitur (`useMemo`, `useCallback`, `useState`, atau fungsi API) wajib diekstrak ke direktori `hooks/feature/<nama-fitur>/`. Komponen UI hanya bertugas menerima data dan _handler_.

**❌ DON'T: Logika dan API Bercampur di File UI**
Dilarang keras mendefinisikan _state_ atau menjalankan pemanggilan fungsi _fetch_/_API_ di dalam file komponen presentasional (`.tsx`).

```tsx
// ❌ DON'T: src/components/feature/order/order-list.tsx
import { useState } from 'react';

export function OrderList() {
    const [search, setSearch] = useState('');

    const handleDelete = async (id: string) => {
        await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    };

    return <div>...</div>;
}
```

**✅ DO: Logika Murni Di-import dari Feature Hook**
Pastikan UI murni hanya mengonsumsi data dan aksi (fungsi) yang di-import dari _hook_ fitur khusus.

```tsx
// ✅ DO: src/components/feature/order/order-list.tsx
import { useOrderList } from '@/hooks/feature/order/use-order-list';

export function OrderList() {
    const { search, setSearch, handleDelete, filteredOrders } = useOrderList();

    return <Table data={filteredOrders} onDelete={handleDelete} />;
}
```

---

### Rule 4: Component Internal Order

Menjaga urutan deklarasi di dalam file komponen UI agar terstandarisasi, konsisten secara internal, dan mudah dibaca oleh seluruh anggota tim.

**❌ DON'T: Urutan Deklarasi Berantakan**
Jangan menempatkan tipe data di bawah komponen utama, atau menyisipkan sub-komponen secara acak di bagian bawah setelah komponen utama diekspor.

```tsx
// ❌ DON'T: Urutan acak
export function MainComponent() {
    return <SubComponent data={data} />;
}

interface LocalProps {
    id: string;
}

function SubComponent({ data }: { data: any }) {
    return <div>{data}</div>;
}
```

**✅ DO: Urutan Standar (Types -> Sub-components -> Main)**
Tulis _Local Types_ di bagian paling atas, diikuti _Sub-components_ (komponen UI pendukung murni visual), lalu _Main Component_ yang di-export di posisi terbawah.

```tsx
// ✅ DO: Urutan terstruktur
// 1. Local Types
interface ItemProps {
    title: string;
}

// 2. Sub-components
function ItemHeader({ title }: ItemProps) {
    return <h2>{title}</h2>;
}

// 3. Main Component
export function ItemList() {
    return <ItemHeader title="Daftar Item" />;
}
```

---

### Rule 5: Declarative Visibility Control (No Inline Ternary)

Menghindari percabangan kondisi UI yang kompleks di dalam JSX. Gunakan pendekatan deklaratif agar kode JSX tetap datar (flat) dan mudah di-scan secara visual.

**❌ DON'T: Inline Ternary / Nested Conditions**
Jangan menggunakan operator _ternary_ (`? :`) atau _short-circuit_ (`&&`) bersarang yang menyebabkan identasi JSX masuk terlalu dalam.

```tsx
// ❌ DON'T: Menggunakan ternary operator
export function ServiceList({ search }: Props) {
    return <div>{search ? <p>Tidak ada layanan untuk "{search}"</p> : <p>Belum ada layanan saat ini.</p>}</div>;
}
```

**✅ DO: Menggunakan Komponen Deklaratif**
Gunakan komponen deklaratif seperti `<Activity />` untuk membungkus kondisi visualisasi elemen UI.

```tsx
// ✅ DO: Menggunakan komponen Activity dari react versi terbaru
import { Activity } from 'react';

export function ServiceList({ search }: Props) {
    return (
        <div>
            <Activity mode={search ? 'visible' : 'hidden'}>
                <p>Tidak ada layanan untuk "{search}"</p>
            </Activity>

            <Activity mode={search ? 'hidden' : 'visible'}>
                <p>Belum ada layanan saat ini.</p>
            </Activity>
        </div>
    );
}
```

---

### Rule 6: File Size Discipline (Max 110 Lines) & Separation

Menjaga agar satu file `.tsx` UI tidak membengkak melebihi 110 baris. Jika lebih, wajib dievaluasi dengan cara mengekstrak logika atau memecah komponen UI.

**❌ DON'T: Menumpuk Segala Hal dalam Satu File Panjang**
Jangan mendefinisikan _hook_ buatan sendiri di dalam file `.tsx` yang sama, dan dilarang keras menuliskan logika _filter_/_map_ yang kompleks secara _inline_ di dalam blok JSX.

```tsx
// ❌ DON'T: File membengkak karena hook dan inline logic
function useServiceItem() {
    const handleDelete = () => {
        /* ... */
    };
    return { handleDelete };
}

export function ServiceItemCard({ items }) {
    const { handleDelete } = useServiceItem();
    return (
        <ul>
            {items
                .filter((x) => x.active)
                .map((x) => (
                    <li key={x.id} onClick={handleDelete}>
                        {x.name}
                    </li>
                ))}
        </ul>
    );
}
```

**✅ DO: Ekstrak Logika dan Pecah Sub-Component**
Pastikan logika yang tertinggal pindah ke `hooks/feature/`. Jika JSX masih terlalu panjang, pecah menjadi sub-komponen UI kecil di dalam file yang sama selama masih di bawah batas maksimal baris.

```tsx
// ✅ DO: Logika terpisah, UI terpecah rapi
import { useServiceItem } from '@/hooks/feature/service/use-service-item';

// Sub-component murni visual
function ServiceItemHeader() {
    return <div>Header</div>;
}

// Sub-component murni visual
function ServiceItemFooter() {
    return <div>Footer</div>;
}

// Main component
export function ServiceItemCard() {
    const { handleDelete } = useServiceItem();
    return (
        <>
            <ServiceItemHeader />
            <button onClick={() => handleDelete(1)}>Delete</button>
            <ServiceItemFooter />
        </>
    );
}
```

---

### Rule 7: No `any` in Component Props

Menjaga _Type Safety_ secara maksimal. TypeScript harus digunakan semestinya untuk mencegah _bug_ tipe data (runtime error) dan mempermudah auto-complete.

**❌ DON'T: Menggunakan Tipe Data `any`**
Dilarang keras mendefinisikan _props_ sebuah komponen dengan tipe `any`.

```tsx
// ❌ DON'T: Mengabaikan type safety
const Card = ({ name, description, onDelete }: any) => {
    return <div>{name}</div>;
};
```

**✅ DO: Mendefinisikan Interface / Tipe yang Jelas**
Semua _props_ komponen wajib memiliki _interface_ atau deklarasi _type_ spesifik untuk setiap nilai dan fungsinya.

```tsx
// ✅ DO: Menggunakan Interface
interface CardProps {
    name: string;
    description: string;
    onDelete: () => void;
}

const Card = ({ name, description, onDelete }: CardProps) => {
    return <div onClick={onDelete}>{name}</div>;
};
```
