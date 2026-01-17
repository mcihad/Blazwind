# BwTypography

A flexible component used for headings, paragraphs, labels, and generic text formatting with support for various weights, colors, and truncation.

## Usage

```razor
<BwTypography Tag="BwTypographyTag.H1" Size="BwSize.ExtraLarge" Weight="BwFontWeight.Bold">
    Main Heading
</BwTypography>

<BwTypography Tag="BwTypographyTag.P" Color="BwColor.Secondary">
    This is a secondary description text.
</BwTypography>
```

## Features

### HTML Tags
Control the underlying HTML element using the `Tag` parameter. Supported: `H1`-`H6`, `P`, `Span`, `Label`, `Div`.

### Sizes
Set text size using the `Size` parameter, ranging from `ExtraSmall` (xs) to `ExtraLarge` (xl).

### Font Weights
Comprehensive support for font weights from `Thin` (100) to `Black` (900).

| Weight | Tailwind Class |
|--------|----------------|
| `Thin` | `font-thin` |
| `Light`| `font-light` |
| `Normal`| `font-normal` |
| `Medium`| `font-medium` |
| `Bold` | `font-bold` |
| `Black`| `font-black` |

### Text Truncation
- **IsTruncated:** Truncates text to a single line with an ellipsis (`...`).
- **LineClamp:** Truncates text after a specified number of lines (e.g., `LineClamp="3"`).

```razor
@* Single line truncation *@
<BwTypography IsTruncated="true">
    This very long text will be cut off on a single line.
</BwTypography>

@* Multi-line truncation *@
<BwTypography LineClamp="2">
    This text will be truncated after the second line, allowing for more compact multi-line descriptions.
</BwTypography>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Text` | `string?` | `null` | The text content (can be used instead of `ChildContent`). |
| `ChildContent` | `RenderFragment?` | `null` | Customizable content inside the component. |
| `Tag` | `BwTypographyTag`| `Span` | The HTML tag to render (`H1`-`H6`, `P`, `Span`, `Label`, `Div`). |
| `Size` | `BwSize` | `Medium` | Text size (`ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`). |
| `Weight` | `BwFontWeight` | `Normal` | Font weight (`Thin` to `Black`). |
| `Color` | `BwColor` | `Primary` | Text color variant. |
| `IsTruncated` | `bool` | `false` | Truncate text to a single line. |
| `LineClamp` | `int?` | `null` | Truncate text after N lines. |
| `OnClick` | `EventCallback<MouseEventArgs>`| - | Triggered when the component is clicked. |
| `Class` | `string?` | `null` | Additional CSS classes. |
| `Style` | `string?` | `null` | Inline CSS styles. |
