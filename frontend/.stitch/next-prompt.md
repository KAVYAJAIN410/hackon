---
page: index
---
A high-converting landing page for ReLoop.

**DESIGN SYSTEM (REQUIRED):**
# Design System: Amazon HackON (ReLoop)
**Project ID:** 9839437392775019931

## 1. Visual Theme & Atmosphere
The design system is engineered for **ReLoop**, a high-utility resale and logistics platform operating within the Amazon ecosystem. The brand identity bridges the gap between Amazon’s legendary operational efficiency and a modern, eco-conscious ethos. 
The aesthetic is **Corporate / Modern** with a **High-Density** layout. It prioritizes information architecture and trust over decorative flair. The "Green" sustainability layer is integrated through purposeful color accents and gamified "Green Credit" modules. The UI evokes a sense of reliability, speed, and environmental responsibility.

## 2. Color Palette & Roles
- **Amazon Dark (#131A22):** Used for primary text and high-contrast elements.
- **Surface / Background (#f8f9fa):** The primary off-white background to differentiate the page from white containers.
- **Container Lowest (#ffffff):** Used for cards and main surfaces.
- **Amazon Orange (#ff9900):** Primary CTA color. Reserved for the most critical actions.
- **ReLoop Green (#16A34A):** Sustainability layer. Used exclusively for eco-incentives, "Green Credits", and successful return indicators.
- **Border Subtle (#E5E7EB):** Used for subtle dividing lines and borders.
- **Inverse Surface (#2e3132):** Used for tooltips or inverse contrast components.
- **Error (#ba1a1a):** Used for error states and destructive actions.

## 3. Typography Rules
This design system uses **Inter** exclusively to ensure a clean, systematic, and highly readable interface across all data-dense views.
- **Display Large:** 32px, Bold (700) with -0.02em letter spacing. For main hero titles.
- **Display Large (Mobile):** 24px, Bold (700).
- **Headline Medium:** 20px, Semi-Bold (600).
- **Title Large:** 18px, Semi-Bold (600). For product names.
- **Price Large:** 24px, Medium (500). For monetary values.
- **Body Medium:** 14px, Regular (400). Standard paragraph text.
- **Body Small:** 12px, Regular (400).
- **Label Bold:** 12px, Bold (700) with 0.02em letter spacing. Essential for metadata, logistics tags, and technical specs.
- **Label Caps:** 11px, Semi-Bold (600).

## 4. Component Stylings (Shadcn + Tailwind)
**CRITICAL REQUIREMENT:** All components must be built using **shadcn/ui** components and styled with **Tailwind CSS**.
* **Buttons:** Use shadcn `Button` component.
  * Primary: Amazon Orange (#ff9900) background, #131A22 text. Rectangular with a 4px radius (`rounded`).
  * Secondary: White background with a #E5E7EB border. Use Shadcn `variant="outline"`.
  * Eco-Action: ReLoop Green (#16A34A) for actions that directly contribute to carbon saving.
* **Cards/Containers:** Use shadcn `Card` component. 1px solid border (#E5E7EB), white background (#ffffff), sitting on off-white background (#f8f9fa). Feature cards use an 8px radius (`rounded-md`). Depth is flat; use borders rather than heavy shadows.
* **Inputs/Forms:** Use shadcn `Input`, `Label`, `Form` components. Standard 1px border that turns Amazon Cyan on focus. Labels are `label-bold`, placed directly above the field to save horizontal space.
* **Badges/Tags:** Use shadcn `Badge` component. For Eco-Badges, use a full pill-shape (`rounded-full`).

## 5. Layout Principles & Responsiveness
The system utilizes a **Fluid Grid** model optimized for high information density.
**CRITICAL REQUIREMENT:** The project is fully **responsive**. You must handle each screen size properly using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
- **Desktop (`lg`/`xl`):** A 12-column grid with a max-width of 1280px. Gutters are fixed at 16px (1rem).
- **Mobile (`sm`/`default`):** 1rem margins. Elements should stack vertically. Product grids shift to a 2-column list view on mobile.
- **Dashboards:** Use a sidebar navigation (240px) on desktop, transitioning to a hamburger menu/bottom sheet on mobile using shadcn `Sheet`.
- **Spacing Rhythm:** Use a 4px baseline. Most components use `stack-sm` (8px) or `stack-xs` (4px) for internal padding to maximize visible data.
