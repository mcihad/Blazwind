# BwCollapse

A versatile collapsible panel component for toggling the visibility of content. Unlike an Accordion, each `BwCollapse` instance operates independently.

## Features

- ✅ **Smooth Animations**: Fluid expansion and collapse transitions.
- ✅ **Independent State**: Multiple panels can be open at the same time.
- ✅ **Custom Header**: Support for icons, titles, or fully custom templates.
- ✅ **Extra Actions**: Dedicated slot for buttons or badges on the right side of the header.
- ✅ **Theming**: Comprehensive support for different sizes, colors, and border styles.

## Usage

### Simple Toggle
```razor
<BwCollapse Title="Click to reveal details">
    This content is hidden by default and becomes visible when the header is clicked.
</BwCollapse>
```

### Custom Header & Extra Content
```razor
<BwCollapse Title="Advanced Settings" Icon="fa-solid fa-gear">
    <Extra>
        <BwButton Size="BwSize.Small" Variant="BwVariant.Ghost" Icon="fa-solid fa-rotate" />
    </Extra>
    <ChildContent>
        <p>Configuration options go here...</p>
    </ChildContent>
</BwCollapse>
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Title` | `string?` | `null` | The text shown in the header. |
| `Icon` | `string?` | `null` | FontAwesome icon class shown to the left of the title. |
| `IsExpanded` | `bool` | `false` | Whether the panel is currently open. Supports `@bind-IsExpanded`. |
| `IsDisabled` | `bool` | `false` | If true, the panel cannot be toggled and appears faded. |
| `Bordered` | `bool` | `true` | Whether to show an outer border and rounded corners. |
| `Size` | `BwSize` | `Medium` | Controls the padding and font size of the header and content. |
| `Color` | `BwColor` | `Primary` | The color of the icon when the panel is expanded. |
| `HeaderTemplate` | `RenderFragment?` | `null` | Completely override the title area with custom content. |
| `Extra` | `RenderFragment?` | `null` | Content (like buttons) to display on the right side of the header. |
| `ChildContent` | `RenderFragment?` | `null` | The content that will be revealed/hidden. |

### Event Callbacks

| Event | Payload | Description |
|-------|---------|-------------|
| `IsExpandedChanged` | `bool` | Triggered when the expansion state changes (for two-way binding). |
| `OnExpandedChange` | `bool` | Dedicated event for handling state changes. |

## Examples

### Different Sizes
```razor
<BwCollapse Title="Small" Size="BwSize.Small">...</BwCollapse>
<BwCollapse Title="Large" Size="BwSize.Large">...</BwCollapse>
```

### Borderless Style
```razor
<BwCollapse Title="Clean Look" Bordered="false">
    Ideal for nesting inside cards or existing layouts.
</BwCollapse>
```
