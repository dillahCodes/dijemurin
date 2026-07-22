# 🧺 Dijemurin.id — Multi-Outlet Laundry ERP

An integrated multi-outlet web-based laundry operational management system (ERP) built to digitize the laundry business lifecycle. Features dedicated operational panels for Cashier and Operator staff, automated completion estimation, garment incident/accident logging with compensation workflows, real-time financial dashboards, and direct thermal receipt printing via **Web Bluetooth** or **WebUSB** directly from the browser — no external drivers or backend printing servers required.

[![GitHub Repo](https://img.shields.io/badge/Repository-181717?style=for-the-badge&logo=github&logoColor=FFFFFF&labelColor=black)](https://github.com/dillahCodes/dijemurin)
[![Live Demo](https://img.shields.io/badge/Live_Demo-00C7B7?style=for-the-badge&logo=vercel&logoColor=FFFFFF&labelColor=black)](https://dijemurin.dillahcodes.my.id/)

---

## 🏷️ Tech Stack

![Laravel](https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white&labelColor=black)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js_v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white&labelColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF&labelColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF&labelColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=FFFFFF&labelColor=black)
![Web Bluetooth](https://img.shields.io/badge/Web_Bluetooth-0082FC?style=for-the-badge&logo=bluetooth&logoColor=FFFFFF&labelColor=black)
![WebUSB](https://img.shields.io/badge/WebUSB-F7DF1E?style=for-the-badge&logo=usb&logoColor=000000&labelColor=black)
![ESC/POS](https://img.shields.io/badge/ESC%2FPOS-FF6B35?style=for-the-badge&logo=receipt&logoColor=FFFFFF&labelColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white&labelColor=black)

---

## 📋 Requirements

- **PHP** v8.4+
- **Composer**
- **Node.js** v18+ and **npm** v9+
- A **Chromium-based browser** (Chrome, Edge, Chrome for Android)
  - Web Bluetooth & WebUSB are **not** supported on Firefox or Safari
- For Bluetooth printing: a thermal printer with BLE GATT support
- For USB printing: a thermal printer connected via USB

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dillahCodes/dijemurin.git
cd dijemurin
```

### 2. Run the Setup Command

This project includes a convenient setup script that installs dependencies, copies `.env.example` to `.env` (if not already present), generates the application key, runs migrations, and builds the assets.

```bash
composer run setup
```

### 3. Configure the Environment Variables (.env)

Open the `.env` file generated in your project root and configure the following important variables:

* **Application URL**: Ensure both `APP_URL` and `VITE_APP_URL` are set correctly. The application uses this to generate the customer self-service tracking QR codes on the printed receipts.
  ```env
  APP_URL=http://localhost:8000
  VITE_APP_URL=http://localhost:8000
  ```
* **Super Admin Configuration**: Define the default email address that will receive the global Super Admin role.
  ```env
  SUPER_ADMIN_EMAIL=your-admin-email@example.com
  ```
* **Database & Queues**: By default, Dijemurin.id uses SQLite and database-backed drivers for sessions and queues:
  ```env
  DB_CONNECTION=sqlite
  QUEUE_CONNECTION=database
  SESSION_DRIVER=database
  ```

### 4. Start the Development Servers

The development environment runs the Laravel server, queue worker, pail logs, and Vite asset bundler concurrently:

```bash
composer run dev
```

Open your browser at `http://localhost:8000`.

---

## 🔵 Bluetooth Printer Configuration

The hook for Bluetooth printing is located at `resources/js/hooks/feature/printer/use-connect-bluetooth.ts`.

### Step 1 — Find Your Printer's Service & Characteristic ID

1. Install the **nRF Connect** app on your mobile phone (iOS / Android).
2. Scan for BLE devices and locate your thermal printer.
3. Open the device and find a **Service** whose characteristics have the following properties: `indicate`, `notify`, `read`, and `write without response`.
4. Copy the **Service UUID** and the **Characteristic UUID** with write capability.

### Step 2 — Update the Constants

Open `resources/js/hooks/feature/printer/use-connect-bluetooth.ts` and update the following constants:

```ts
// Replace with your printer's Service UUID
const SERVICE_ID = "e7810a71-73ae-499d-8c15-faa9aef0c3f2";

// Replace with your printer's Characteristic UUID
const CHARACTERISTIC_ID = "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f";

// Adjust chunk size if data is lost during printing (default: 200 bytes)
const CHUNK_SIZE = 200;
```

### Usage

```tsx
import { useConnectBluetooth } from "@/hooks/feature/printer/use-connect-bluetooth";

function PrinterButton({ data, orderCode }) {
  const { connect, print, disconnect, status, isConnected, printStatus, errorMessage } = useConnectBluetooth();

  return (
    <div>
      <p>Status: {status}</p>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button
        onClick={() => print(data, orderCode)}
        disabled={!isConnected || printStatus === 'printing'}
      >
        {printStatus === 'printing' ? 'Printing...' : 'Print'}
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
    </div>
  );
}
```

### Hook Return Values

| Property       | Type                                               | Description                              |
| -------------- | -------------------------------------------------- | ---------------------------------------- |
| `device`       | `BluetoothDevice \| null`                          | The connected Bluetooth device           |
| `status`       | `"idle" \| "connecting" \| "connected" \| "error"` | Current connection status                |
| `printStatus`  | `"idle" \| "printing"`                             | Current printing action status           |
| `isConnected`  | `boolean`                                          | `true` when status is `"connected"`      |
| `errorMessage` | `string \| null`                                   | Error description if status is `"error"` |
| `connect()`    | `() => Promise<void>`                              | Opens device picker and connects         |
| `print()`      | `(data: Uint8Array, order_code: string) => Promise<void>` | Sends receipt data + QR to printer |
| `disconnect()` | `() => Promise<void>`                              | Disconnects and forgets the device       |

> **Auto-reconnect:** Once connected, the app saves `bt_autoconnect = "true"` in `localStorage`. On the next page load, it automatically reconnects to the last device.

---

## 🔌 USB Printer Configuration

The hook for USB printing is located at `resources/js/hooks/feature/printer/use-connect-usb.ts`.

### Step 1 — Find Your Printer's Vendor ID

Run the following command in your terminal while your USB printer is plugged in:

```bash
lsusb
```

Example output:
```
Bus 001 Device 003: ID 6868:0200 Printer Vendor Model
```
The **Vendor ID** is the first 4 hex digits before the colon (e.g., `6868`).

### Step 2 — Update the Constant

Open `resources/js/hooks/feature/printer/use-connect-usb.ts` and update the `VENDOR_ID` constant:

```ts
// Replace 0x6868 with your printer's Vendor ID (hexadecimal format)
const VENDOR_ID = 0x6868;
```

### Usage

```tsx
import { useConnectUsb } from "@/hooks/feature/printer/use-connect-usb";

function PrinterButton({ data, orderCode }) {
  const { connect, print, disconnect, status, isConnected, printStatus, errorMessage } = useConnectUsb();

  return (
    <div>
      <p>Status: {status}</p>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button
        onClick={() => print(data, orderCode)}
        disabled={!isConnected || printStatus === 'printing'}
      >
        {printStatus === 'printing' ? 'Printing...' : 'Print'}
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
    </div>
  );
}
```

### Hook Return Values

| Property       | Type                                               | Description                              |
| -------------- | -------------------------------------------------- | ---------------------------------------- |
| `device`       | `USBDevice \| null`                                | The connected USB device                 |
| `status`       | `"idle" \| "connecting" \| "connected" \| "error"` | Current connection status                |
| `printStatus`  | `"idle" \| "printing"`                             | Current printing action status           |
| `isConnected`  | `boolean`                                          | `true` when status is `"connected"`      |
| `errorMessage` | `string \| null`                                   | Error description if status is `"error"` |
| `connect()`    | `() => Promise<void>`                              | Opens device picker and connects         |
| `print()`      | `(data: Uint8Array, order_code: string) => Promise<void>` | Sends receipt data + QR to printer |
| `disconnect()` | `() => Promise<void>`                              | Disconnects and forgets the device       |

> **Auto-reconnect:** Once connected, the app saves `usb_autoconnect = "true"` in `localStorage`. On the next page load, it automatically reconnects to the same USB device.

---

## 📁 Project Structure

```
dijemurin/
├── app/                  # Backend Application Logic (Laravel)
│   ├── Actions/          # Business actions
│   ├── Enums/            # System Enums (Roles, Incident statuses, etc.)
│   ├── Http/             # Controllers, Middleware, Requests
│   ├── Models/           # Eloquent Models
│   └── Services/         # Backend services
├── config/               # App configuration files
├── database/             # SQLite migrations, seeders, and factories
├── resources/            # Frontend Assets & Views
│   ├── css/              # Tailwind CSS entry points
│   ├── js/               # React + Inertia codebase
│   │   ├── actions/      # Controllers-linked Wayfinder generated actions
│   │   ├── components/   # Shared & feature-based React components
│   │   ├── context/      # React contexts (Printer, theme, etc.)
│   │   ├── helper/       # ESC/POS styling & QR generators
│   │   ├── hooks/        # React hooks (e.g. useConnectBluetooth, useConnectUsb)
│   │   ├── layouts/      # Dashboard and settings layouts
│   │   ├── pages/        # Inertia React page components
│   │   └── routes/       # Named routes definitions
│   └── views/            # Root Blade layout template
├── routes/               # Modular Laravel route definitions
└── tests/                # Pest feature & unit tests
```

---

## 🛠️ Key Composer & NPM Scripts

| Command | Type | Description |
| ------- | ---- | ----------- |
| `composer run setup` | Setup | Full installation and build flow for new environments |
| `composer run dev` | Dev | Concurrently starts PHP server, queue listener, logs tail, and Vite |
| `composer run test` | Test | Clears configuration cache, runs Pint linter, and executes Pest tests |
| `composer run format` | Lint | Runs Laravel Pint linter in format mode |
| `npm run lint` | Lint | Checks and auto-fixes React/TypeScript style rules |
| `npm run build` | Build | Bundles Vite assets for production |

---

## ⚠️ Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
| ------- | ------ | ---- | ------- | ------ |
| Web Bluetooth | ✅ | ✅ | ❌ | ❌ |
| WebUSB | ✅ | ✅ | ❌ | ❌ |

> **Note:** Both APIs require a **secure context** (`https://` or `localhost`). Web Bluetooth on some desktop environments might require enabling the `#enable-web-bluetooth` flag in Chrome settings.

---

## 📄 License

MIT
