# Skill: Frontend Clean Code

**Name:** `frontend-clean-code`  
**Description:** Menegakkan pemisahan mutlak antara UI (Components) dan Logika (Hooks) menggunakan prinsip SRP dan DRY.

---

## 🎯 Core Principle

**Page = Composition | Component = UI | Hook = Logic.** File Page tidak boleh memiliki logika. Komponen tidak boleh mendefinisikan logika bisnis yang kompleks di dalamnya; logika tersebut harus diekstraksi ke Custom Hooks yang terorganisir di folder khusus.

---

## 🏗️ Architecture Rules

### Rule 1: Minimalist Page Component

Halaman utama hanya berfungsi sebagai _entry point_ dan pengatur tata letak.

- **Isi:** Layout, SEO/Head, Section wrappers, dan Komponen.
- **Dilarang:** State, hooks, types, atau fungsi pembantu.

### Rule 2: Strict File Organization

Pemisahan file harus mengikuti struktur berikut agar skalabilitas terjaga:

```text
src/
├── pages/
│   └── dashboard.tsx               <-- View Utama (Clean)
├── components/pages/dashboard/
│   ├── summary-card-grid.tsx       <-- UI Component
│   └── order-data-section.tsx      <-- UI Component
├── hooks/pages/dashboard/
│   └── use-order-filters.ts        <-- Business Logic/State
└── types/pages/dashboard/
    └── order.ts                    <-- Data Definitions
```

---

## 🛠️ Implementation Rules

### Rule 3: Page Hook Separation (New)

Setiap _state management_ atau _data manipulation_ yang berhubungan dengan halaman wajib diletakkan di `hooks/pages/<page-name>/`. Komponen hanya bertugas memanggil hook tersebut.

#### ❌ Bad: Hook bercampur di file Komponen

```tsx
// src/components/pages/dashboard/order-data-section.tsx
function useOrderFilters() { ... } // Logic di dalam file UI

export function OrderDataSection() {
    const { ... } = useOrderFilters();
    return <section>...</section>;
}
```

#### ✅ Good: Hook dipisah ke folder Hooks

```tsx
// src/hooks/pages/dashboard/use-order-filters.ts
export function useOrderFilters(orders: Order[]) {
    const [search, setSearch] = useState('');
    // ... logic filter ...
    return { search, setSearch, filteredOrders };
}

// src/components/pages/dashboard/order-data-section.tsx
import { useOrderFilters } from '@/hooks/pages/dashboard/use-order-filters';

export function OrderDataSection() {
    const { search, setSearch, filteredOrders } = useOrderFilters(DATA);
    return (
        <Card>
            <OrderFilters search={search} setSearch={setSearch} />
            <OrderTable orders={filteredOrders} />
        </Card>
    );
}
```

### Rule 4: Internal Component Structure

Jika file komponen memerlukan elemen pendukung kecil (Sub-components), ikuti urutan:

1. **Types** (Hanya yang lokal untuk UI ini).
2. **Constants**.
3. **Sub-components** (Private UI seperti `TableHeader`, `TableItem`).
4. **Main Component** (Export Default).
