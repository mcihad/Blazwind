# BwBackToTop

A floating button component used to quickly scroll back to the top of the page.

## Features

- ✅ Automatic visibility based on scroll position.
- ✅ Smooth scrolling animation (configurable).
- ✅ Customizable visibility threshold.
- ✅ Multiple shape options (Circle, Square, Rounded).
- ✅ Color, size, and position configuration.

## Usage

```razor
<BwBackToTop />
```

## Parameters

| Parameter             | Type              | Default                  | Description                                                             |
|-----------------------|-------------------|--------------------------|-------------------------------------------------------------------------|
| `VisibilityThreshold` | `int`             | `300`                    | The scroll amount (px) required for the button to become visible.       |
| `Position`            | `BwPosition`      | `BottomRight`            | The position of the button on the screen (`BottomRight`, `BottomLeft`). |
| `Icon`                | `string`          | `"fa-solid fa-arrow-up"` | The icon displayed inside the button.                                   |
| `Shape`               | `string`          | `"circle"`               | Component shape (`circle`, `square`, `rounded`).                        |
| `Color`               | `BwColor`         | `BwColor.Primary`        | The button's color theme.                                               |
| `Size`                | `BwSize`          | `BwSize.Medium`          | The button's size (`Small`, `Medium`, `Large`).                         |
| `Smooth`              | `bool`            | `true`                   | If `true`, uses smooth scrolling; otherwise scrolls instantly.          |
| `Tooltip`             | `string`          | `"Yukarı çık"`           | Title attribute/tooltip for the button.                                 |
| `ChildContent`        | `RenderFragment?` | `null`                   | Custom content to display inside the button (overrides `Icon`).         |

## Examples

### Default Usage

```razor
<BwBackToTop />
```

### Position and Threshold

Adjust where the button appears and when it triggers.

```razor
<BwBackToTop Position="BwPosition.BottomLeft" VisibilityThreshold="150" />
```

### Different Shapes and Colors

```razor
<BwBackToTop Shape="square" 
             Color="BwColor.Secondary" 
             Icon="fa-solid fa-chevron-up" />
```

### Large Size with Custom Content

```razor
<BwBackToTop Size="BwSize.Large" Color="BwColor.Success">
    <span class="text-xs font-bold">TOP</span>
</BwBackToTop>
```
