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
├── components/features/order/
│   ├── order-table.tsx             <-- UI Components
│   └── order-filters.tsx
├── hooks/features/order/
│   └── use-order-filters.ts        <-- Business Logic
└── types/features/order/
    └── index.ts                    <-- Feature Types
```

---

## 🛠️ Implementation Rules

### Rule 3: Logic Extraction to Feature Hooks

Dilarang keras menulis `useMemo`, `useCallback`, atau `useState` yang berhubungan dengan data fitur langsung di dalam komponen UI jika logikanya lebih dari 3 baris. Ekstrak ke `hooks/features/<feature-name>/`.

#### ❌ Bad: Logika bercampur di UI

```tsx
// src/components/features/order/order-list.tsx
export function OrderList() {
    const [search, setSearch] = useState(''); // Logic dalam UI
    const filtered = orders.filter(...);      // Logic dalam UI
    return <div>...</div>;
}
```

#### ✅ Good: Logika di-import dari Feature Hook

```tsx
// src/components/features/order/order-list.tsx
import { useOrderFilters } from '@/hooks/features/order/use-order-filters';

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
