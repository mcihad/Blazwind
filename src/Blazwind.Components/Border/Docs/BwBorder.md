# BwBorder

An advanced border component used to group and highlight content, providing a fieldset-like appearance with customizable
titles, colors, and styles.

## Examples

### Basic Usage

Simple borders with default padding and styling.

```razor
<BwBorder>
    <BwTypography>Default light border with automatic padding.</BwTypography>
</BwBorder>

<BwBorder Color="BwColor.Primary" Width="BwSize.Medium">
    <BwTypography>Thick primary color border.</BwTypography>
</BwBorder>
```

### Titled Borders (Fieldset Style)

Add a title or custom label to the border, similar to an HTML `<fieldset>`.

```razor
<BwBorder Title="Personal Information" Color="BwColor.Primary">
    <BwTypography>Form fields for entering user data.</BwTypography>
</BwBorder>

<BwBorder Title="Security Settings" 
          Color="BwColor.Danger" 
          TitlePosition="BwDirection.Right" 
          IsDashed="true">
    <BwTypography>Sensitive settings area with a right-aligned title.</BwTypography>
</BwBorder>
```

### Style Options

Customize line styles, shadows, and corner radii.

```razor
<BwBorder IsDashed="true" Color="BwColor.Secondary">
    <BwTypography>Dashed border style.</BwTypography>
</BwBorder>

<BwBorder Radius="BwSize.Large" Color="BwColor.Info" HasShadow="true">
    <BwTypography>Rounded corners with a subtle shadow.</BwTypography>
</BwBorder>
```

## API

| Parameter       | Type              | Default  | Description                                                               |
|-----------------|-------------------|----------|---------------------------------------------------------------------------|
| `ChildContent`  | `RenderFragment?` | `null`   | The content to be wrapped inside the border.                              |
| `Title`         | `string?`         | `null`   | Text label displayed on the top border.                                   |
| `Label`         | `RenderFragment?` | `null`   | Custom content displayed as the border label.                             |
| `Color`         | `BwColor`         | `Light`  | The color of the border and title text.                                   |
| `Width`         | `BwSize`          | `Small`  | Border thickness (`Small`=1px, `Medium`=2px, `Large`=4px).                |
| `Radius`        | `BwSize`          | `Medium` | Corner rounding (`Small`, `Medium`, `Large`, `ExtraSmall`, `ExtraLarge`). |
| `Padding`       | `BwSize`          | `Medium` | Internal padding (`ExtraSmall` to `ExtraLarge`).                          |
| `IsDashed`      | `bool`            | `false`  | Enables a dashed border line.                                             |
| `IsDotted`      | `bool`            | `false`  | Enables a dotted border line.                                             |
| `HasShadow`     | `bool`            | `false`  | Applies a subtle shadow to the container.                                 |
| `TitlePosition` | `BwDirection`     | `Left`   | Horizontal alignment of the title (`Left`, `Right`).                      |
| `TitleClass`    | `string?`         | `null`   | Additional CSS classes for the title container.                           |
| `Class`         | `string?`         | `null`   | Additional CSS classes for the main container.                            |
| `Style`         | `string?`         | `null`   | Inline CSS styles.                                                        |
