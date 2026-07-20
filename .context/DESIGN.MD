# Brand & Design Guidelines: Dijemurin.id

## 1. Branding Identity & Theme

**Dijemurin.id** represents trust, operational transparency, and modern efficiency in the laundry business. The visual character is intentionally sterile, clean, and highly structured to evoke a sense of professional enterprise software (ERP) rather than a playful consumer app.

- **Mood:** Professional, Premium, Minimalist, Trustworthy.
- **Design Concept:** Image-forward, high-contrast monochrome, and structured data presentation using Bento-box layouts.

## 2. Color Palette

The color system strictly relies on an achromatic foundation to reduce cognitive overload for staff and customers, ensuring that colorful laundry items or status indicators (like error/success) stand out effectively.

- **Primary Base (Pure White):** `#FFFFFF` - Used for main app backgrounds and card surfaces.
- **Secondary Surface (Off-White/Light Gray):** `#F3F4F6` - Used for secondary bento-box cards and input field backgrounds.
- **Primary Accent & Text (Charcoal Black):** `#111827` - Used for primary headlines, main call-to-action buttons, and active states.
- **Subdued Text (Slate Gray):** `#6B7280` - Used for secondary text, placeholder text, and inactive tab links.
- **Semantic/State Colors (Used Sparingly):**
    - _Success (Done/Picked Up):_ `#10B981` (Emerald Green)
    - _Warning (Pending/Process):_ `#F59E0B` (Amber)
    - _Critical/Error (Accident Log/Canceled):_ `#EF4444` (Red)

## 3. Typography System

To maintain maximum legibility across mobile devices and POS tablets, we utilize **Instrument Sans** as the universal typeface.

- **Font Family:** `Instrument Sans`, sans-serif.
- **Display Headlines (H1):** 48px - 64px, Weight: Bold (700), Tracking: Tight (-2%).
- **Section Titles (H2):** 32px - 40px, Weight: SemiBold (600), Tracking: Tight (-1%).
- **Body Text:** 16px, Weight: Regular (400), Line-Height: 1.6 (160%) for optimal readability.
- **Small Labels & Overlines:** 12px - 14px, Weight: Medium (500), Text-Transform: Uppercase, Tracking: Wide (4%).

## 4. Spacing & Grid System

Built on a strict 8-point baseline grid to ensure perfect rhythm and scalability across the mobile-first responsive layout.

- **Base Unit:** 8px.
- **Fluid Container:** Max-width of `1280px` for desktop, with a minimum horizontal padding of `16px` on mobile screens.
- **Whitespace (Negative Space):**
    - Macro spacing (between major sections): `96px` to `128px`.
    - Micro spacing (between headline and paragraph): `16px` to `24px`.
- **Border Radius:**
    - Outer containers and images: `24px` or `32px` for a friendly, modern feel.
    - Buttons and interactive inputs: Fully rounded (pill-shaped) `9999px`.

## 5. Animations & Motion

Motion should feel snappy, purposeful, and never decorative.

- **Micro-interactions:** Buttons and cards should subtly lift on hover (`transform: translateY(-2px)`) with an expanding soft drop-shadow.
- **Transitions:** Standard duration of `200ms` with an `ease-in-out` timing function for color changes and hover states.
- **Page Load:** Content should fade in and slide up slightly (`15px`) to create a smooth entry.

## 6. Accessibility (a11y)

- **Contrast Ratio:** All text must pass WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio against its background). The pure black on pure white palette inherently satisfies this.
- **Touch Targets:** Following mobile-first principles, all clickable elements (buttons, links, form inputs) must have a minimum touch area of `48x48px`.
- **Focus States:** Every interactive element must possess a visible focus ring (e.g., a `2px` solid black offset outline) for keyboard navigation.
