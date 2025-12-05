# Zcash Iconography Design Rules

This document outlines the design specifications for two distinct icon styles used within the Zcash ecosystem: **Minimalist** (Legacy/General Utility) and **ZcashMe** (Brand Specific).

## 1. Minimalist Style (`.../icons/minimalist/`)

**Purpose:**
A versatile, neutral utility set designed for broad application across different themes (light/dark mode) and contexts.

### Visual Guidelines

*   **Stroke Color (`stroke`)**:
    *   **Rule**: Must use `currentColor`.
    *   **Reasoning**: Allows the icon to inherit the text color of its parent container, enabling automatic adaptation to hover states and dark mode.
    *   **Code Snippet**: `<svg ... stroke="currentColor">`

*   **Stroke Width (`stroke-width`)**:
    *   **Rule**: **1.5px** (Fixed).
    *   **Reasoning**: Provides a fine, elegant look that balances visibility with a lightweight feel.

*   **Geometry & Shapes**:
    *   **Rule**: Use standard geometric primitives (circles, rects) mixed with custom paths.
    *   **Caps/Joins**: `round` / `round` are preferred but not strictly enforced if sharp edges are needed for specific metaphors (e.g., sharp book corners).
    *   **Complexity**: Moderate. Can include internal details (like lines representing text).

*   **Canvas**:
    *   **Grid**: 24x24 pixel grid.
    *   **Padding**: minimal internal padding (approx 2px).

---

## 2. ZcashMe Style (`.../icons/zcashme/`)

**Purpose:**
A bespoke, brand-aligned icon set designed specifically for the **Zcash.me** "Organic Minimalist" interface. These icons are crafted to sit harmoniously on the `bg-[#f6efe6]` (Cream) background.

### Visual Guidelines

*   **Stroke Color (`stroke`)**:
    *   **Rule**: **`#203a47`** (Zcash Dark Blue/Slate).
    *   **Reasoning**: Enforces brand consistency. This specific dark blue is softer than pure black, complementing the organic cream background of the site.
    *   **Restriction**: Do **not** use `currentColor`. These icons are "illustrated assets" rather than "text characters."

*   **Stroke Width (`stroke-width`)**:
    *   **Rule**: **1.5px** (Strict).
    *   **Reasoning**: Maintains the delicate, high-fidelity aesthetic of the Zcash.me UI. Thicker lines (2px+) look too "app-like" and heavy; thinner lines (<1px) disappear.

*   **Corner Radius (Roundness)**:
    *   **Rule**: **High Roundness**.
    *   **Implementation**:
        *   `stroke-linecap="round"`
        *   `stroke-linejoin="round"`
        *   Use `rx="2"` or higher for rectangles.
    *   **Reasoning**: Echoes the `rounded-xl` and `rounded-full` UI components found throughout the site. No sharp 90-degree exterior corners.

*   **Abstraction Level**:
    *   **Rule**: **Organic Simplification**.
    *   **Description**: Reduce objects to their simplest recognizable silhouette. Avoid unnecessary internal details.
    *   **Example**:
        *   *Minimalist*: A directory might show a book binding, cover, and page edges.
        *   *ZcashMe*: A directory is a simple rounded rectangle with three horizontal lines.

### Code Comparison

| Feature | Minimalist Style | ZcashMe Style |
| :--- | :--- | :--- |
| **Color** | `currentColor` | `#203a47` |
| **Stroke Width** | `1.5` | `1.5` |
| **Line Caps** | `round` | `round` |
| **Line Joins** | `round` | `round` |
| **Shapes** | Standard, utility-focused | Organic, highly rounded |
| **Intended Use**| General UI buttons, text-adjacent | Feature Grids, Hero sections |

### Implementation Checklist (ZcashMe)

1.  **Canvas**: Set ViewBox to `0 0 24 24`.
2.  **Clean SVG**: Remove all `<defs>`, `id`, and unused attributes.
3.  **Fill**: Always `fill="none"`.
4.  **Style Tag**: Ensure the root `<svg>` tag contains:
    ```xml
    fill="none"
    stroke="#203a47"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    ```

---

## 3. Colorful Style (`.../icons/colorful/`)

**Purpose:**
A variation of the ZcashMe style that integrates specific brand colors to distinguish different functional areas while maintaining the core organic minimalist structure.

### Visual Guidelines

*   **Base Structure**:
    *   Inherits all geometric rules from **ZcashMe Style** (Rounded corners, 1.5px `#203a47` base stroke).

*   **Color Palette (Brand Accents)**:
    *   **Base Stroke**: `#203a47` (Dark Blue) - Used for the primary shape.
    *   **Accent Colors**: Distinct brand colors are assigned to specific metaphors:
        *   **Green (`#10b981`)**: e.g., Directory (Bookmark line).
        *   **Gold (`#F4B728`)**: e.g., Forum (Middle dot).
        *   **Blue (`#3b82f6`)**: e.g., News (Corner fold), Forum (Right dot).
        *   **Orange (`#f97316`)**: e.g., Maps (Pin center).
        *   **Purple (`#a855f7`)**: e.g., Viewkey (Key hole).

*   **Accent Implementation**:
    *   **Option A (Stroke Emphasis)**: Increase stroke width (2.5px - 3px) for accent lines or dots.
    *   **Option B (Solid Fill)**: Use `fill="[color]" stroke="none"` for enclosed shapes (circles, small polygons).

*   **Special Case (Forum)**:
    *   The three conversation dots use a coordinated sequence: Green → Gold → Blue.
