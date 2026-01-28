# BwIcon

A lightweight wrapper component for FontAwesome and other icon sets, providing standardized sizing and color themes
consistent with the Blazwind design system.

## Usage

### Standard Icon

```razor
<BwIcon Name="fa-solid fa-house" />
```

### Themed and Animated

```razor
<BwIcon Name="fa-solid fa-spinner" 
        Spin="true" 
        Size="BwSize.Large" 
        Color="BwColor.Primary" />
```

## API Reference

### Parameters

| Parameter | Type      | Default  | Description                                             |
|-----------|-----------|----------|---------------------------------------------------------|
| `Name`    | `string?` | `null`   | Full CSS class for the icon (e.g., `fa-solid fa-user`). |
| `Size`    | `BwSize`  | `Medium` | Scale of the icon (`ExtraSmall` to `ExtraLarge`).       |
| `Color`   | `BwColor` | `Dark`   | Color theme (Primary, Success, Danger, etc.).           |
| `Spin`    | `bool`    | `false`  | When true, applies the `fa-spin` CSS animation.         |
| `Class`   | `string?` | `null`   | Additional custom CSS classes.                          |

## Technical Note

This component inherits from `BwBase`, allowing it to accept standard `Style` and `AdditionalAttributes` (e.g., `title`,
`aria-label`).
