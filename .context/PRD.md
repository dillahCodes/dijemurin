# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Dijemurin.id

**STATUS: TEMPORARY DRAFT**

|                     |                          |
| ------------------- | ------------------------ |
| **Product Name**    | Dijemurin.id             |
| **Document Version**| v0.1                     |
| **Author**          | dillahcodes (Developer)  |
| **For**             | - (Client)               |
| **Date**            | July 20, 2026            |
| **Related Docs**    | -                        |

---

# 1. Product Overview

Multi-outlet laundry operational management often faces serious bottlenecks such as manual transaction recording prone to human error, lack of real-time visibility into garment processing status for customers, and ambiguous separation of responsibilities between cashier and operator staff. Furthermore, the absence of a structured lost or damaged clothing incident logging system (fading, shrinking, mixed up items) frequently leads to disputes with customers due to missing formal compensation audit logs, making it difficult for business owners to accurately calculate actual operational losses and net revenue across each outlet.

Dijemurin.id is an integrated multi-outlet web-based laundry ERP system designed to digitize the entire laundry business lifecycle end-to-end. The system provides dedicated operational panels for Cashier staff (order creation, interactive shopping cart, payment calculator) and Operator staff (washing and ironing process queues), an outlet service inventory management module, an unauthenticated public self-service order tracking system for customers, and an accident logging module along with financial compensation loss logs. All modules are integrated into an executive-level financial analytics dashboard to present real-time gross revenue, accident losses, and net profit summaries that can be directly exported to formal PDF documents.

# 2. Goals & Objectives

- Centralize all operational management, service pricing, and multi-outlet staff data into a single unified management platform.
- Reduce staff operational errors by enforcing strict order status transition controls and Role-Based Access Control (RBAC).
- Provide reliable real-time financial summaries (gross revenue, accident losses, net revenue) for business owners.
- Offer transparency regarding laundry status for customers via a unique order code public self-tracking feature without requiring authentication.
- Minimize financial losses and customer conflicts through standardized handling workflows for problematic garments, complete with compensation approval audit logs.

# 3. Users & Roles

- **Super Admin:** Holds global full access rights within the system. Authorized to manage outlet lists, manage all staff accounts (Admin, Cashier, Operator), monitor financial performance across all branches, and download executive reports.
- **Admin (Outlet Manager):** Manages operations for a specific assigned branch outlet. Responsible for managing service categories and item pricing within their outlet, monitoring local cashier/operator transaction histories, and reviewing, investigating, and resolving garment incident claim reports.
- **Cashier:** Frontline staff at the laundry outlet. Responsible for serving customer transactions, adding dirty laundry items to the system shopping cart, processing payments (Cash/QRIS), printing receipt receipts, and updating order status to picked up or canceled.
- **Operator:** Washing and ironing staff. Responsible for monitoring incoming laundry order queues, updating garment processing status to processing (`Process`), and marking orders as completed (`Done`) when garments are ready for pickup.
- **Ghost:** Default role for newly registered users or staff who have not yet been assigned to an outlet branch or granted operational privileges by a Super Admin or Admin (no access to the main operational panel).

# 4. Scope

## 4.1 Included (MVP)

- Staff security authentication module validating user active status, outlet assignment, and outlet active status upon login.
- Interactive laundry shopping cart (`Cart`) module featuring automatic estimated completion calculation based on the longest duration among selected service items.
- Sequential order status tracking (`Pending` -> `Process` -> `Done` -> `Picked Up` or `Canceled`) with activity audit logs.
- Problematic garment incident management (`Accident Logging`) module with phased statuses and financial compensation options.
- Unauthenticated public self-service order status checker page for customers using unique order codes.
- Visualization dashboard for staff operational statistics and daily/monthly financial analysis charts.
- Financial report export feature (Top, Middle, and First Level) to formal printable PDF format.

## 4.2 Out of Initial Scope / Future Phases

- Automated order status update notifications via WhatsApp Gateway or SMS API (refer to Section 11).
- Automated monthly staff commission bonus calculations based on successfully processed order volume (refer to Section 11).
- Third-party payment gateway integration for dynamic online QRIS payments (refer to Section 11).

# 5. Assumptions & Constraints

- **Technology Assumption:** The developer assumes SQLite is adequate for the MVP stage with a lightweight relational structure, with the capability to migrate to MySQL/PostgreSQL in the future.
- **Access Constraints:** Staff devices (tablets/cashier computers) are assumed to run modern web browsers connected to a stable internet network to access the system.
- **Third Party (Receipt Printing):** Cashiers are assumed to have thermal printer hardware manually configured in their local browser to support invoice printing.
- **Payment Automation:** QRIS payments are assumed to be verified manually by the cashier at the counter (no dynamic payment gateway API used in the MVP phase).
- **Visual Theme:** Dark/light mode settings use browser cookies to prevent visual flickers during server-side rendering (SSR).

# 6. Functional Requirements

## 6.1 AUTH — Authentication & Access Control

| **ID**     | **Functional Requirement**                                                                                     | **Priority**  |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| **AUTH-1** | The system must reject login attempts for users with `inactive` or `suspended` status.                         | **Mandatory** |
| **AUTH-2** | The system must reject login attempts for users with `ghost` role (unassigned role).                           | **Mandatory** |
| **AUTH-3** | The system must reject non-Super Admin staff login if their assigned outlet is set to `inactive`.             | **Mandatory** |
| **AUTH-4** | Super Admin and Admin can create new staff accounts and dispatch registration/password setup links.             | **Mandatory** |

## 6.2 OUT — Outlet Management

| **ID**    | **Functional Requirement**                                                                                      | **Priority**  |
| --------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| **OUT-1** | Super Admin can create new outlets by entering name, address, phone number, email, logo, and outlet photo.      | **Mandatory** |
| **OUT-2** | Super Admin can update outlet details and toggle status between `active` or `inactive`.                         | **Mandatory** |

## 6.3 LAY — Service & Category Management

| **ID**    | **Functional Requirement**                                                                                                                      | **Priority**  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **LAY-1** | Super Admin and Admin can manage service categories (Services) and specific service items (Service Items) for each outlet.                      | **Mandatory** |
| **LAY-2** | Admin can set pricing, unit measurement (kg, pcs, m²), and estimated completion duration (minutes, hours, days) for each service item.         | **Mandatory** |

## 6.4 TRX — Laundry Transactions & Orders

| **ID**    | **Functional Requirement**                                                                                                                                                           | **Priority**  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| **TRX-1** | Cashier can add multiple service items to a shopping cart (`Cart`) to create a single laundry transaction order.                                                                    | **Mandatory** |
| **TRX-2** | The system must automatically calculate estimated completion time (`estimated_completed_at`) based on the longest completion duration among selected service items.                 | **Mandatory** |
| **TRX-3** | The system must automatically generate a unique order code (`order_code`) using customer name initials, transaction date, and a random string pattern.                             | **Mandatory** |
| **TRX-4** | Cashier can select Cash payment (system calculates change automatically) or QRIS payment (manual verification).                                                                      | **Mandatory** |
| **TRX-5** | Cashier can print transaction receipts using browser print interface.                                                                                                                | **Mandatory** |
| **TRX-6** | Customers can check order progress on a public page by entering their order code without login authentication.                                                                        | **Mandatory** |
| **TRX-7** | The system must restrict order status transitions sequentially: `Pending` -> `Process` -> `Done` -> `Picked Up` or `Canceled`.                                                     | **Mandatory** |

## 6.5 INC — Garment Incident Management (Accident Logging)

| **ID**    | **Functional Requirement**                                                                                                                                             | **Priority**  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **INC-1** | Cashier or Operator can report an incident for specific garments in an order (faded, damaged, lost) with an initial status of `Pending`.                              | **Mandatory** |
| **INC-2** | Admin or Super Admin can change incident report status to `Investigating` or resolve the outcome to `Resolved` or `Rejected`.                                          | **Mandatory** |
| **INC-3** | Admin can define compensation options (Refund, Replacement, Free Service, Repair, None) and financial compensation amount if the incident is approved (`Resolved`).    | **Mandatory** |
| **INC-4** | The system must record every audit log change history (Accident Logs) to track the responsible verification party.                                                     | **Mandatory** |

## 6.6 REP — Financial Reports & Dashboard

| **ID**    | **Functional Requirement**                                                                                                                                                                    | **Priority**  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **REP-1** | The system displays daily operational statistics dashboard (queues, delays, turnover) customized based on user role.                                                                          | **Mandatory** |
| **REP-2** | The system must present Executive Reports (Top Level) for Super Admin containing total revenue, accident loss, net revenue, payment method distribution, and top services.                     | **Mandatory** |
| **REP-3** | The system must present Middle Level Reports for Admin consisting of daily recaps, order status recap, payment methods, and revenue breakdown per service type.                               | **Mandatory** |
| **REP-4** | The system must present First Level Reports detailing daily transaction items and customer payments.                                                                                          | **Mandatory** |
| **REP-5** | Users can download financial reports as formal PDF documents with automated layout formatting.                                                                                                | **Mandatory** |

# 7. Key User Flows

## 7.1 Main Transaction Flow (Happy Path)

1. Customer brings dirty laundry to the laundry outlet.
2. Cashier opens the sales page, enters customer name, and selects service items from the catalog into the shopping cart (`Cart`).
3. System automatically calculates estimated completion time based on the longest service item duration and displays total cost.
4. Cashier selects Cash or QRIS payment method, collects payment from customer, and marks transaction as completed.
5. System generates a unique order code (order status automatically becomes "Pending") and prints receipt.
6. Operator views order queue on panel, claims order for washing/ironing, and updates status to "Process".
7. Operator finishes garment processing and updates order status to "Done" (garments ready for pickup).
8. Customer arrives at outlet for pickup. Cashier verifies garments, hands them over, and updates status to "Picked Up".

## 7.2 Problematic Garment Incident Flow

1. Operator or Cashier detects damage, fading, or loss of customer garment during laundry process.
2. Cashier submits new incident report, selects affected garment item, chooses incident type (e.g., "Item Damaged"), records chronology of events, and submits (incident status defaults to "Pending Verification").
3. Outlet Admin reviews incident report and updates status to "Under Investigation".
4. Upon internal investigation completion, Admin approves compensation claim, changes incident status to "Resolved", selects compensation option "Refund", and enters compensation amount (e.g., Rp100,000).
5. System deducts compensation amount from net revenue calculation on daily/monthly financial reports for that outlet.

## 7.3 Public Self-Service Customer Status Check Flow

1. Customer accesses public Dijemurin.id website via browser.
2. Customer enters unique order code (e.g., `ORD-JD-20260720-XYZ`) on status check page.
3. System fetches order data from database and displays current order status (e.g., "Done" with estimated pickup time) along with list of processed laundry items.

# 8. Data Model (High-Level)

| **Entity**            | **Main Fields**                                                                                                               | **Description**                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **outlets**           | id, name, address, phone, email, picture, status, [rating]                                                                    | Stores laundry branch outlet information.                                 |
| **users**             | id, name, email, password, role, status, outlet_id                                                                            | Stores laundry staff data along with role permissions and assigned outlet.|
| **services**          | id, name, description, outlet_id                                                                                              | Service categories available at each outlet.                              |
| **service_items**     | id, name, description, price, unit, time_number, time_type, service_id                                                        | Specific service details, price, and estimated completion time.           |
| **orders**            | id, order_code, customer_name, status, total_price, completed_at, picked_up_at, estimated_completed_at, outlet_id, cashier_id | Stores customer laundry transaction data.                                 |
| **order_items**       | id, order_id, service_item_id, item_name, item_price, unit, quantity, subtotal                                                | Details of washed garments in a single order.                             |
| **payments**          | id, order_id, method, cash_payment_amount, cash_change_amount                                                                 | Stores transaction payment data (cash/QRIS).                              |
| **order_status_logs** | id, order_id, user_id, from_status, to_status                                                                                 | Audit log tracking laundry status change history.                         |
| **accidents**         | id, status, description, resolved_at, outlet_id, order_id, reporter_id, resolver_id                                           | Stores main summary of garment incident issues.                           |
| **accident_items**    | id, accident_id, order_item_id, type, item_details, description, compensation_type, compensation_amount                       | Stores compensation details and damage type per garment item.             |
| **accident_logs**     | id, accident_id, user_id, accident_item_id, field_name, old_value, new_value                                                  | Audit log tracking incident investigation status updates.                 |

**Note:** fields inside [square brackets] are proposed features / Future Phases (Section 11).

# 9. Non-Functional Requirements

- **Security & Access Control:** All operational API endpoints must be protected by session-based authentication and checked for role permissions using Laravel's `RoleMiddleware`.
- **Responsiveness & Interface:** Cashier and operator user interfaces must be responsive and adaptive to tablets and smartphones to facilitate field data entry.
- **Theme Consistency:** Theme settings (Dark/Light Mode) must be preserved via server-level `appearance` cookie to prevent visual flashing during page transitions.
- **Performance Reliability:** Query fetching for order lookup and customer status checks must be optimized to minimize SQLite database query load.
- **Document Export:** PDF generator module must output clean and consistent document print layouts across all modern operating systems and browsers.

# 10. Third-Party Integrations

| **Service**                | **Function**                                                                          | **Notes**                                            |
| -------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Font Bunny API**         | Provider for Google web font assets (Instrument Sans) locally/via CDN.                 | Prioritizes privacy and page load speed.             |
| **[WhatsApp Gateway API]** | Automated dispatch of receipts and completion status notifications to customer WhatsApp.| Future Phase                                         |

# 11. Proposed Features / Future Phases

- **Outlet Service Rating System.** Customers can leave star ratings (1-5) and written reviews after their order status becomes `Picked Up` to monitor service quality across branches.
- **Automated WhatsApp Notifications.** Integration with WhatsApp API Gateway to actively send confirmation messages upon order creation and when status changes to `Done` (ready for pickup).
- **Staff Performance Commission Incentives.** System calculates automatic bonus percentages for cashiers recording top transaction volumes and operators processing highest laundry volumes monthly.
- **Dynamic QRIS Payment Gateway.** Integration with digital payment providers (such as Midtrans or Xendit) for unique dynamic QRIS code generation per transaction with automated customer payment verification.

# 12. Open Questions / TBD

- Maximum timeframe policy for customers to file compensation claims for damaged garments after status becomes `Picked Up` (e.g., 24 hours or longer).
- Multi-Factor Authentication (MFA) implementation for Super Admin and Admin account security.
- Monthly WhatsApp Gateway API subscription cost sharing model as connected outlet count scales.

# 13. Glossary

- **ERP (Enterprise Resource Planning):** An integrated system used to manage daily operational business activities.
- **RBAC (Role-Based Access Control):** Method of restricting system access based on staff or user job roles.
- **SPA (Single Page Application):** Web application loading a single HTML page and dynamically updating content without full page reloads.
- **Overdue:** Status indicating laundry processing time has exceeded the promised estimated duration.
- **Accident Loss:** Total financial loss borne by the outlet due to compensation payouts or garment replacements for customer garment damage/loss incidents.

---

_This document is a temporary draft subject to change pending further discussions with the client._
