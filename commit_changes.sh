#!/bin/bash
set -e

echo "=== Step 0: Resolve merge conflicts ==="
# Remove conflicting build artifacts (they shouldn't be tracked)
git rm --force public/build/assets/app-BssF3e3l.js 2>/dev/null || true
git rm --force public/build/manifest.json 2>/dev/null || true
# Also clean up any remaining build files
git rm -r --force --cached public/build 2>/dev/null || true

echo ""
echo "=== Step 1: Reset staging area ==="
git reset HEAD .

echo ""
echo "=== Commit 1: feat(order): add order status log model, migration, and service ==="
git add \
  database/migrations/2026_06_02_211639_create_order_status_logs_table.php \
  app/Models/Order/OrderStatusLog.php \
  app/Services/Order/OrderStatusLogService.php
git commit -m "feat(order): add order status log model, migration, and service

Introduce OrderStatusLog to track order status transitions with user
attribution. Add migration for order_status_logs table, Eloquent model
with scopes (today, forOutlet, toStatus), and service class for
creating log entries."

echo ""
echo "=== Commit 2: feat(order): add order timeline and estimated completion ==="
git add \
  database/migrations/2026_06_09_134040_add_estimated_completed_at_to_orders_table.php \
  database/migrations/2026_06_09_201957_remove_order_at_from_orders_table.php \
  database/migrations/2026_06_09_233039_add_picked_up_at_to_orders_table.php \
  app/Models/Order/Order.php \
  app/Http/Controllers/Order/OrderController.php \
  resources/js/components/feature/order/detail/order-timeline.tsx \
  resources/js/components/feature/order/detail/order-timeline-history.tsx \
  resources/js/types/feature/order/order.ts
git commit -m "feat(order): add order timeline and estimated completion tracking

Add estimated_completed_at and picked_up_at fields, remove deprecated
order_at column. Introduce order timeline UI components to visualize
status transition history. Restructure order types to new file."

echo ""
echo "=== Commit 3: feat(order): update order detail, items, and payment components ==="
git add \
  resources/js/components/feature/order/detail/order-detail-section.tsx \
  resources/js/components/feature/order/detail/order-info.tsx \
  resources/js/components/feature/order/detail/order-items.tsx \
  resources/js/components/feature/order/detail/order-payment.tsx \
  resources/js/components/feature/order/order-data-section.tsx \
  resources/js/components/feature/order/order-filters.tsx \
  resources/js/components/feature/order/order-table-edit.tsx \
  resources/js/components/feature/order/order-table.tsx \
  resources/js/pages/order/order-detail.tsx \
  resources/js/pages/order/order.tsx \
  resources/js/hooks/feature/order/use-order-edit.ts \
  resources/js/hooks/feature/order/use-order-filters.ts \
  resources/js/hooks/feature/order/use-order-print-data.ts \
  resources/js/hooks/feature/order/use-order-table-actions.tsx
git commit -m "refactor(order): update order detail, filters, and table components

Update order detail page to integrate timeline and revised payment
display. Improve order filters, table actions, and print data hooks
to work with new order status flow."

echo ""
echo "=== Commit 4: feat(order): add customer status tracking components ==="
git add \
  resources/js/components/feature/order/customer-status/order-customer-status-info.tsx \
  resources/js/components/feature/order/customer-status/order-customer-status-items.tsx \
  resources/js/components/feature/order/customer-status/order-customer-status-payment.tsx \
  resources/js/components/feature/order/customer-status/order-customer-status-section.tsx
git commit -m "feat(order): update customer order status tracking components

Improve customer-facing order status info, items, payment display,
and section components with updated data structure."

echo ""
echo "=== Commit 5: feat(dashboard): add role-based dashboard with stats services ==="
git add \
  app/Http/Controllers/Dashboard/DashboardController.php \
  app/Services/Order/OrderStatsService.php \
  app/Services/Outlet/OutletStatsService.php \
  app/Services/Service/ServiceStatsService.php \
  app/Services/User/UserStatsService.php
git commit -m "feat(dashboard): implement role-based dashboard with stats services

Refactor DashboardController to render different dashboards per role
(super_admin, admin, cashier, operator). Add stats services for
orders, outlets, services, and users with per-outlet and global
statistics methods including revenue trends and chart data."

echo ""
echo "=== Commit 6: feat(dashboard): add dashboard frontend components and hooks ==="
git add \
  resources/js/components/feature/dashboard/ \
  resources/js/hooks/feature/dashboard/ \
  resources/js/pages/dashboard.tsx
git commit -m "feat(dashboard): add role-based dashboard UI components and hooks

Add dashboard section, summary cards, charts grid, greeting, and
recent orders components. Create per-role chart hooks (superadmin,
admin, cashier, operator) and summary card grid hook for dynamic
dashboard rendering."

echo ""
echo "=== Commit 7: test(dashboard): add dashboard summary card tests ==="
git add \
  tests/Feature/Dashboard/ \
  tests/Feature/DashboardTest.php
git commit -m "test(dashboard): add summary card tests for all roles

Add comprehensive tests for dashboard summary cards including order
count, revenue, overdue, almost overdue, cancelled, completed,
picked up, and ready status cards across different user roles."

echo ""
echo "=== Commit 8: test(order): add order status log tests ==="
git add \
  tests/Feature/Order/OrderStatusLogTest.php
git commit -m "test(order): add order status log feature tests

Add tests for order status log creation and transition tracking."

echo ""
echo "=== Commit 9: feat(layanan): add time field and outlet picker for services ==="
git add \
  database/migrations/2026_06_05_200000_modify_time_fields_in_service_items_table.php \
  resources/js/components/feature/layanan/items/time-field.tsx \
  resources/js/components/feature/layanan/service-outlet-picker.tsx \
  resources/js/hooks/feature/layanan/use-service-outlet-picker.ts \
  resources/js/schema/feature/layanan/add-service-item-schema.ts \
  resources/js/schema/feature/layanan/edit-service-item-schema.ts \
  resources/js/types/feature/layanan/index.ts
git commit -m "feat(layanan): add time field component and outlet picker for services

Add TimeField component for duration input, ServiceOutletPicker for
outlet selection in service management. Update service item schemas
to support modified time fields. Modify time field columns in
service_items migration."

echo ""
echo "=== Commit 10: refactor(layanan): update service management components ==="
git add \
  resources/js/components/feature/layanan/items/edit/layanan-item-edit-form.tsx \
  resources/js/components/feature/layanan/items/service-items-card.tsx \
  resources/js/components/feature/layanan/items/tambah/layanan-item-tambah-form.tsx \
  resources/js/components/feature/layanan/service-card.tsx \
  resources/js/components/feature/layanan/service-search.tsx \
  resources/js/components/feature/layanan/service-section.tsx \
  resources/js/hooks/feature/layanan/use-layanan-edit.ts \
  resources/js/hooks/feature/layanan/use-layanan-item-edit.ts \
  resources/js/hooks/feature/layanan/use-layanan-item-tambah.ts \
  resources/js/hooks/feature/layanan/use-layanan-tambah.ts \
  resources/js/hooks/feature/layanan/use-service-actions.tsx \
  resources/js/hooks/feature/layanan/use-service-item-actions.tsx \
  resources/js/hooks/feature/layanan/use-service-search.ts \
  resources/js/pages/layanan/layanan-edit.tsx \
  resources/js/pages/layanan/layanan-item-edit.tsx \
  resources/js/pages/layanan/layanan-item-tambah.tsx \
  resources/js/pages/layanan/layanan-items.tsx \
  resources/js/pages/layanan/layanan-tambah.tsx
git commit -m "refactor(layanan): update service management components and hooks

Update service CRUD forms, cards, search, and section components.
Improve edit/tambah hooks and service action handlers to work with
outlet picker and updated time fields."

echo ""
echo "=== Commit 11: refactor(core): update shared components, layouts, and helpers ==="
git add \
  resources/js/components/layout/app-header.tsx \
  resources/js/components/layout/app-sidebar.tsx \
  resources/js/components/ui/combobox.tsx \
  resources/js/context/feature/cart/cart-context.tsx \
  resources/js/context/user-menu-content.tsx \
  resources/js/helper/esc-pos-styling.ts \
  resources/js/helper/formatted-date.ts \
  resources/js/helper/generate-order-invoice.ts \
  resources/js/helper/has-empty-string-obj.ts \
  resources/js/helper/indo-to-english-statuses.ts \
  resources/js/hooks/feature/cart/use-cart-step-two.ts \
  resources/js/layouts/auth/auth-simple-layout.tsx \
  resources/js/layouts/auth/auth-split-layout.tsx \
  resources/js/layouts/settings/layout.tsx \
  resources/js/pages/auth/login.tsx \
  resources/js/pages/settings/appearance.tsx \
  resources/js/pages/settings/printer.tsx \
  resources/js/pages/settings/profile.tsx \
  resources/js/pages/settings/security.tsx
git commit -m "refactor(core): update layouts, helpers, and shared UI components

Update app header, sidebar, combobox, auth layouts, and settings
pages. Add has-empty-string-obj helper. Update cart context, date
formatter, invoice generator, and status translation helpers."

echo ""
echo "=== Commit 12: refactor(pengguna): update user management components ==="
git add \
  resources/js/components/feature/pengguna/edit/pengguna-edit-form.tsx \
  resources/js/components/feature/pengguna/pengguna-filters.tsx \
  resources/js/components/feature/pengguna/pengguna-header.tsx \
  resources/js/components/feature/pengguna/pengguna-table.tsx \
  resources/js/components/feature/pengguna/tambah/pengguna-tambah-form.tsx \
  resources/js/hooks/feature/pengguna/use-pengguna-edit.ts \
  resources/js/hooks/feature/pengguna/use-pengguna-filters.ts \
  resources/js/hooks/feature/pengguna/use-pengguna-tambah.ts \
  resources/js/pages/pengguna/pengguna-detail.tsx \
  resources/js/pages/pengguna/pengguna-edit.tsx \
  resources/js/pages/pengguna/pengguna-tambah.tsx \
  resources/js/pages/pengguna/pengguna.tsx
git commit -m "refactor(pengguna): update user management components and hooks

Update user CRUD forms, filters, table, and detail pages. Improve
edit/tambah hooks and filter handling."

echo ""
echo "=== Commit 13: refactor(outlet): update outlet management components ==="
git add \
  resources/js/components/feature/outlet/outlet-filters.tsx \
  resources/js/components/feature/outlet/outlet-header.tsx \
  resources/js/components/feature/outlet/outlet-table.tsx \
  resources/js/hooks/feature/outlet/use-outlet-edit.ts \
  resources/js/hooks/feature/outlet/use-outlet-tambah.ts \
  resources/js/pages/outlet/outlet.tsx
git commit -m "refactor(outlet): update outlet management components and hooks

Update outlet filters, header, table components and edit/tambah
hooks for improved outlet management."

echo ""
echo "=== Commit 14: refactor(laporan): update report components ==="
git add \
  resources/js/components/feature/laporan/laporan-header.tsx \
  resources/js/pages/laporan/laporan.tsx \
  resources/js/types/feature/laporan/index.ts
git commit -m "refactor(laporan): update report header and page components

Update report header, page component, and report type definitions."

echo ""
echo "=== Commit 15: refactor(settings): update delete user component ==="
git add \
  resources/js/components/feature/settings/delete-user.tsx
git commit -m "refactor(settings): update delete user component"

echo ""
echo "=== Commit 16: Handle remaining changes ==="
# Delete removed files
git rm resources/js/helper/get-greeting.ts 2>/dev/null || true
git rm resources/js/types/feature/order/index.ts 2>/dev/null || true
git add resources/js/helper/get-greeting.ts resources/js/types/feature/order/index.ts 2>/dev/null || true
git commit -m "refactor: remove deprecated helper and type files

Remove get-greeting.ts (replaced by dashboard greeting component)
and order/index.ts (replaced by order/order.ts)." 2>/dev/null || true

echo ""
echo "=== Commit 17: Remaining backend changes ==="
# Add any remaining backend files
git add \
  app/Http/Controllers/ \
  app/Models/ \
  app/Enums/ \
  app/DTO/ \
  app/Services/ \
  config/ \
  routes/ \
  database/ 2>/dev/null || true
# Only commit if there are staged changes
git diff --cached --quiet || git commit -m "refactor: update backend controllers, models, and configurations

Update remaining backend files including controllers, models, enums,
DTOs, services, configs, routes, and database files."

echo ""
echo "=== Commit 18: Remaining frontend changes ==="
# Add any remaining frontend files
git add resources/ 2>/dev/null || true
git diff --cached --quiet || git commit -m "refactor: update remaining frontend components and assets

Update remaining frontend files not covered by previous commits."

echo ""
echo "=== Commit 19: Build and config changes ==="
git add package.json package-lock.json composer.json composer.lock vite.config.ts tsconfig.json 2>/dev/null || true
git diff --cached --quiet || git commit -m "build: update project dependencies and configuration

Update package.json, composer.json, vite and TypeScript configs."

echo ""
echo "=== Commit 20: Remaining test changes ==="
git add tests/ 2>/dev/null || true
git diff --cached --quiet || git commit -m "test: update remaining test files"

echo ""
echo "=== Final: Catch any remaining untracked changes ==="
git add -A 2>/dev/null || true
git diff --cached --quiet || git commit -m "chore: add remaining project files"

echo ""
echo "=== DONE! ==="
echo ""
git log --oneline -20
