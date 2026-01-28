# Blazwind Component Refactoring & Standardization Guide

This document defines the strict architectural standards for the Blazwind refactoring process. The goal is to achieve **absolute consistency** across the library, enabling a predictable developer experience and seamless AI integration.

## 1. Architectural Separation: Non-Visual vs. Visual

We rigidly classify every component into one of two categories. This separation ensures that logic (behavior) and presentation (style) are decoupled where possible, and standardizes the API surface for UI elements.

### 1.1 Non-Visual Components (Functional Managers)
These components handle logic, data management, or state, but render little to no own markup (or render only a wrapper).
*   **Examples:** `BwForm`, `BwTimer`, `BwDataFetcher`, `BwKeyInterceptor`.
*   **Responsibility:**
    *   Manage state (DI, EventCallback).
    *   Expose public APIs for children.
    *   Do **NOT** implement `IVisualComponent` or accept styling parameters like `Color` or `Variant`.

### 1.2 Visual Components (UI Primitives)
These are the building blocks of the UI. They **MUST** inherit from `BwVisualComponentBase` (or implement `IVisualComponent`) and enforce the standardized styling contract.
*   **Examples:** `BwButton`, `BwCard`, `BwInput`, `BwBadge`, `BwModal`.
*   **Use Case:** Any element that has a physical appearance on the screen.

---

## 2. The Visual Component Contract

All **Visual Components** must expose a standard set of parameters. This guarantees that if a developer knows how to style a Button, they automatically know how to style a Card, a Badge, or an Alert.

### 2.1 Standard Properties (The "Big 8")

Every visual component must implement these properties where applicable. They define the component's appearance via CSS variables.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **Color** | `BwColor` | `Default` | The semantic color theme (Primary, Secondary, Success, Danger, etc.). |
| **Size** | `BwSize` | `Md` | Controls *all* dimensional aspects: padding, font-size, line-height, icon size. |
| **Variant** | `BwVariant` | `Filled` | The visual style: `Filled` (Solid), `Outline` (Bordered), `Ghost` (Text-only), `Soft` (Low opacity bg). |
| **Shape** | `BwShape` | `Rounded` | The geometric profile: `Rectangle` (0px), `Rounded` (Theme default), `Pill` (Full height radius), `Circle`, `Square`. |
| **Border** | `BwBorder` | `None` | Controls border thickness independent of Variant: `None`, `Thin` (1px), `Thick` (2px). |
| **Shadow** | `BwShadow` | `None` | Elevation depth: `None`, `Sm`, `Md`, `Lg`, `Xl`. Maps to Z-Index and Box-Shadow. |
| **Transition** | `BwTransition` | `Normal` | Animation speed profile: `None`, `Fast` (150ms), `Normal` (300ms), `Slow` (500ms). |
| **Ripple** | `bool` | `true` | (Interactive only) Whether the component creates a ripple effect on click. |

### 2.2 Property Definitions & CSS Mapping

The "Magic" of Blazwind lies in mapping these Enums directly to CSS Variables (`--bw-*`).

#### 🎨 `BwColor`
Defines the semantic palette.
*   **Values:** `Primary`, `Secondary`, `Tertiary`, `Success`, `Warning`, `Danger`, `Info`, `Neutral`.
*   **CSS Mapping:** `BwColor.Primary` â†’ `--bw-color-primary`, `--bw-color-primary-contrast`.
*   **Behavior:** Changing `Color` must automatically update `background-color`, `border-color`, `text-color`, and `ring-color` based on the active `Variant`.

#### 📐 `BwSize`
Controls the scale.
*   **Values:** `Xs` (Tiny), `Sm` (Compact), `Md` (Standard), `Lg` (Prominent), `Xl` (Hero).
*   **Implementation Rule:** `Size` is not just width/height.
    *   **Button:** Padding X/Y, Font Size, Icon Size.
    *   **Input:** Line Height, Padding, Font Size.
    *   **Card:** Padding inside the content area.

#### 🎭 `BwVariant`
Controls the "ink" application logic.
*   **Values:**
    *   `Filled`: Full background color, contrast text.
    *   `Outline`: Transparent bg, colored border, colored text.
    *   `Ghost`: Transparent bg, colored text on hover.
    *   `Soft`: Low opacity background (tint), full color text.

#### 🔲 `BwShape`
Controls the corner radius logic.
*   **Values:**
    *   `Rectangle` (0 radius).
    *   `Rounded` (Standard theme radius, e.g. 0.5rem).
    *   `Pill` (Maximum radius, e.g. 9999px).
    *   `Circle` (Aspect ratio 1:1 + 50% radius).
    *   `Square` (Aspect ratio 1:1 + customized radius).

---

## 3. Interaction & States

Visual components typically have states. These must be standardized, not ad-hoc.

*   **HoverColor**: Optional override. If null, the component calculates its own hover shade (usually `Color` + 10% darkness).
*   **FocusColor**: Primarily handles the `Ring` color on focus. Defaults to `Color`.
*   **Disabled State**:
    *   **Must** apply `opacity: 0.6` (or theme variable).
    *   **Must** apply `cursor: not-allowed`.
    *   **Must** strip interactive events (Ripple, OnClick).
*   **Loading State** (where applicable):
    *   Must show a spinner/skeleton.
    *   Must effectively `Disable` the component.

## 4. Implementation Strategy

### 4.1 Base Class: `BwVisualComponent`
Create a base component that all visible items inherit from.

```csharp
public abstract class BwVisualComponent : BwComponentBase
{
    [Parameter] public BwColor Color { get; set; } = BwColor.Default;
    [Parameter] public BwSize Size { get; set; } = BwSize.Md;
    [Parameter] public BwVariant Variant { get; set; } = BwVariant.Filled;
    [Parameter] public BwShape Shape { get; set; } = BwShape.Rounded;
    [Parameter] public BwShadow Shadow { get; set; } = BwShadow.None;

    // Generates the standard classes: "bw-btn bw-btn-primary bw-btn-lg ..."
    protected override IEnumerable<string> GetClasses()
    {
        yield return $"bw-{ComponentPrefix}";
        yield return $"bw-color-{Color.ToCssSuffix()}";
        yield return $"bw-size-{Size.ToCssSuffix()}";
        yield return $"bw-variant-{Variant.ToCssSuffix()}";
        yield return $"bw-shape-{Shape.ToCssSuffix()}";
        if (Shadow != BwShadow.None) yield return $"bw-shadow-{Shadow.ToCssSuffix()}";
    }
}
```

### 4.2 CSS Variable Architecture
Do not hardcode hex values in components. Use the `--bw-` system.

```css
/* Example Global Theme */
:root {
    --bw-color-primary: #3b82f6;
    --bw-radius-md: 0.375rem;
}

/* Example Component Construction */
.bw-size-md {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}

.bw-shape-pill {
    border-radius: 9999px;
}
```

## 5. Refactoring Checklist per Component

For each component refactored:

1.  [ ] **Inheritance**: Does it inherit `BwVisualComponent`?
2.  [ ] **Cleanup**: Remove legacy params (`ButtonColor`, `BtnSize`, `IsOutline`).
3.  [ ] **Mapping**: Map `Color` and `Size` to the root element's CSS classes.
4.  [ ] **States**: Verify `Disabled` and `Loading` visualization.
5.  [ ] **Prefix**: Ensure CSS classes start with `bw-{component}-`.
