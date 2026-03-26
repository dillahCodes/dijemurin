# Skill: Frontend Clean Code

**Name:** `frontend-clean-code`  
**Description:** Menegakkan struktur modular berbasis fitur. Memisahkan UI, Logika (Hooks), dan Definisi (Types) ke dalam direktori fitur masing-masing untuk mencapai SRP dan DRY yang maksimal.

---

## 🎯 Core Principle

**Page is a Canvas, Feature is the Content.** Halaman (Page) hanya bertugas menyusun komponen-komponen fitur. Detail implementasi (UI, Logic, Types) harus dibungkus di dalam folder `features/`.

---

## 🏗️ Architecture Rules

### Rule 1: Minimalist Page Component

File di folder `pages/` harus sangat bersih.

- **Tugas:** Impor komponen dari folder `features` dan atur tata letaknya.
- **Dilarang:** Mengelola state kompleks, mendefinisikan tipe data, atau menulis logika bisnis.

### Rule 2: Feature-Based Organization

Setiap modul besar harus memiliki folder sendiri di bawah kategori `features`.

**Struktur Folder Standar:**

```text
src/
├── pages/
│   └── dashboard.tsx               <-- Entry point (Clean)
├── components/feature/order/
│   ├── order-table.tsx             <-- UI Components
│   └── order-filters.tsx
├── hooks/feature/order/
│   └── use-order-filters.ts        <-- Business Logic
└── types/feature/order/
    └── index.ts                    <-- Feature Types
```

---

## 🛠️ Implementation Rules

### Rule 3: Logic Extraction to Feature Hooks

Dilarang keras menulis `useMemo`, `useCallback`, atau `useState` yang berhubungan dengan data fitur langsung di dalam komponen UI jika logikanya lebih dari 3 baris. Ekstrak ke `hooks/feature/<feature-name>/`.

#### ❌ Bad: Logika bercampur di UI

```tsx
// src/components/feature/order/order-list.tsx
export function OrderList() {
    const [search, setSearch] = useState(''); // Logic dalam UI
    const filtered = orders.filter(...);      // Logic dalam UI
    return <div>...</div>;
}
```

#### ✅ Good: Logika di-import dari Feature Hook

```tsx
// src/components/feature/order/order-list.tsx
import { useOrderFilters } from '@/hooks/feature/order/use-order-filters';

export function OrderList() {
    const { search, setSearch, filteredOrders } = useOrderFilters();
    return <Table data={filteredOrders} />;
}
```

### Rule 4: Component Internal Order

Di dalam file komponen fitur, gunakan urutan berikut:

1. **Local Types** (Hanya yang tidak dipakai di file lain).
2. **Sub-components** (Komponen kecil pendukung fitur tersebut).
3. **Main Component** (Komponen yang di-export).

---

### Rule 5: Declarative Visibility Control (No Inline Ternary)

Hindari penggunaan operator ternary `{condition ? <A /> : <B />}` atau short-circuit `&&` untuk blok UI yang kompleks atau berbeda kondisi. Gunakan komponen `<Activity />` untuk menjaga struktur JSX tetap datar (_flat_) dan mudah dibaca secara visual.

#### ❌ Bad: Inline Ternary / Nested Conditions

```tsx
export function ServiceList({ search }: Props) {
    return (
        <div>
            {search ? (
                <p className="text-muted-foreground text-xs">
                    Tidak ada layanan yang cocok dengan{' '}
                    <span className="text-foreground font-medium">
                        "{search}"
                    </span>
                </p>
            ) : (
                <p className="text-muted-foreground text-xs">
                    Belum ada layanan yang tersedia saat ini.
                </p>
            )}
        </div>
    );
}
```

#### ✅ Good: Declarative Visibility with `<Activity />`

```tsx
import { Activity } from 'react';

export function ServiceList({ search }: Props) {
    return (
        <div>
            <Activity mode={search ? 'visible' : 'hidden'}>
                <p className="text-muted-foreground text-xs">
                    Tidak ada layanan yang cocok dengan{' '}
                    <span className="text-foreground font-medium">
                        "{search}"
                    </span>
                </p>
            </Activity>

            <Activity mode={search ? 'hidden' : 'visible'}>
                <p className="text-muted-foreground text-xs">
                    Belum ada layanan yang tersedia saat ini.
                </p>
            </Activity>
        </div>
    );
}
```

---

## 📏 Rule 6: File Size Discipline (Max 110 Lines)

Jika satu file `.tsx` melebihi **110 baris**, maka WAJIB dilakukan refactor berbasis SRP **tanpa memecah ke banyak file**. Semua tetap dalam **1 file yang sama**, hanya dipisahkan secara internal.

### ✅ DO (Refactor di DALAM 1 FILE yang sama)

#### 1. Extract Hook

```tsx
// file: service-item-card.tsx

function useServiceItem() {
    const handleDelete = () => {
        /* logic */
    };
    return { handleDelete };
}

export function ServiceItemCard() {
    const { handleDelete } = useServiceItem();
    return <button onClick={handleDelete}>Delete</button>;
}
```

#### 2. Pecah Sub Component

```tsx
// file: service-item-card.tsx

function ServiceItemHeader() {
    return <div>Header</div>;
}

function ServiceItemFooter() {
    return <div>Footer</div>;
}

export function ServiceItemCard() {
    return (
        <>
            <ServiceItemHeader />
            <ServiceItemFooter />
        </>
    );
}
```

#### 3. Pisahkan API Function

```tsx
// file: service-item-card.tsx

async function deleteServiceItem(id: number) {
    // request logic
}

function useServiceItem() {
    const handleDelete = async () => {
        await deleteServiceItem(1);
    };
    return { handleDelete };
}
```

---

### ❌ DON'T (Semua Ditumpuk di Satu Component)

#### 1. Semua Logic + API + UI Jadi Satu

```tsx
export function ServiceItemCard() {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        await fetch('/api/delete'); // ❌ API inline
        setLoading(false);
    };

    return (
        <div>
            <div>Header</div>
            <button onClick={handleDelete}>Delete</button>
            <div>Footer</div>
        </div>
    );
}
```

#### 2. JSX Panjang Tanpa Pemecahan

```tsx
export function ServiceItemCard() {
    return (
        <div>
            <div>Header</div>
            <div>Content A</div>
            <div>Content B</div>
            <div>Footer</div>
        </div>
    );
}
```

#### 3. Inline Logic di JSX

```tsx
export function ServiceItemCard({ items }) {
    return (
        <ul>
            {items
                .filter((x) => x.active)
                .map((x) => (
                    <li key={x.id}>{x.name}</li>
                ))}
        </ul>
    );
}
```

## 📏 Rule 8: No `any` in Component Props

---

### ❌ DON'T

```tsx
const Card = ({ name, description, onDelete }: any) => {};
```

---

### ✅ DO

```tsx
interface CardProps {
    name: string;
    description: string;
    onDelete: () => void;
}

const Card = ({ name, description, onDelete }: CardProps) => {};
```
