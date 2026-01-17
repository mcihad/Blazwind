# Panel

A premium content container with support for titles, icons, interactive controls (collapse/fullscreen), and structured layouts (Header, Toolbox, Footer).

## Examples

### Basic Panel
```razor
<BwPanel Title="User Profile" Subtitle="Overview">
    <p>Main content goes here.</p>
</BwPanel>
```

### Interactive & Variants
```razor
<BwPanel Title="Sales Report" 
         Icon="fa-solid fa-chart-line" 
         Color="BwColor.Primary" 
         Collapsible="true" 
         IsFullscreenable="true">
    <Toolbox>
        <BwButton Icon="fa-solid fa-rotate" Size="BwSize.Small" Variant="BwVariant.Ghost" />
    </Toolbox>
    <ChildContent>
        <p>Dynamic chart content...</p>
    </ChildContent>
    <Footer>
        <BwButton Text="Export PDF" Size="BwSize.Small" />
    </Footer>
</BwPanel>
```

## API - BwPanel

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Title` | `string?` | `null` | Primary heading text. |
| `Subtitle`| `string?` | `null` | Secondary heading text. |
| `Icon` | `string?` | `null` | FontAwesome icon class. |
| `Color` | `BwColor` | `Secondary` | Theme color (`Primary`, `Success`, `Warning`, `Danger`, `Info`, `Dark`, `Secondary`). |
| `Collapsible`| `bool` | `false` | Enable the collapse/expand toggle button. |
| `IsCollapsed`| `bool` | `false` | Initial or bound collapsed state. |
| `IsFullscreenable`| `bool` | `false` | Enable the fullscreen toggle button. |
| `Class` | `string?` | `null` | Additional CSS class for the outermost container. |
| `HeaderClass`| `string?` | `null` | CSS class for the header area. |
| `BodyClass` | `string` | `p-3 md:p-5` | CSS class for the content body. |
| `FooterClass`| `string` | `justify-end...`| CSS class for the footer area. |

### Render Fragments (Slots)

| Slot | Description |
| :--- | :--- |
| `ChildContent`| The main content of the panel body. |
| `Header` | Custom content for the header title area (Overrides `Title/Icon`). |
| `Toolbox` | Action buttons or controls displayed on the right side of the header. |
| `Footer` | Content area at the bottom of the panel (e.g., action buttons). |

### Events

| Event | Argument Type | Description |
| :--- | :--- | :--- |
| `IsCollapsedChanged`| `bool` | Fired when the panel is collapsed or expanded. |

## Features

- ✅ **Color Variants**: Tailored color schemes for different contexts.
- ✅ **Fullscreen Mode**: Expand to fill the entire viewport.
- ✅ **Collapsible**: Save screen space when content is not needed.
- ✅ **Toolbox Support**: Dedicated area for action buttons in header.
- ✅ **Responsive Padding**: Optimized body spacing for mobile and desktop.
