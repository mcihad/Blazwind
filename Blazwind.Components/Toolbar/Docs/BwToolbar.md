# Toolbar

A flexible toolbar component for grouping buttons, dropdowns, and other actions.

## Examples

### Basic Usage

```razor
<BwToolbar>
    <BwToolButton Icon="fa-solid fa-save" Text="Save" OnClick="Save" />
    <BwToolButton Icon="fa-solid fa-edit" Text="Edit" />
    <BwToolSeparator />
    <BwToolButton Icon="fa-solid fa-trash" Text="Delete" Color="BwColor.Danger" />
</BwToolbar>
```

### With Dropdown

```razor
<BwToolbar>
    <BwToolButton Icon="fa-solid fa-bold" />
    <BwToolButton Icon="fa-solid fa-italic" />
    <BwToolDropdown Icon="fa-solid fa-font" Text="Font">
        <BwToolDropdownItem Text="Arial" />
        <BwToolDropdownItem Text="Times New Roman" />
    </BwToolDropdown>
</BwToolbar>
```

### Positioning (Floating Toolbar)
Use `Position` to stick the toolbar to a specific part of the screen.

```razor
<BwToolbar Position="ToolbarPosition.Bottom" Color="BwColor.Dark" Glass="true">
    <BwToolButton Icon="fa-solid fa-home" />
    <BwToolButton Icon="fa-solid fa-search" />
    <BwToolButton Icon="fa-solid fa-user" />
</BwToolbar>
```

### Vertical
Set `Orientation` to `Vertical` for a sidebar-like toolbar.

```razor
<BwToolbar Orientation="ToolbarOrientation.Vertical" Position="ToolbarPosition.Left">
    <!-- items -->
</BwToolbar>
```

## API

### BwToolbar Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Orientation` | `ToolbarOrientation` | `Horizontal` | Layout direction: `Horizontal`, `Vertical`. |
| `Position` | `ToolbarPosition` | `None` | Fixed position: `Top`, `Bottom`, `Left`, `Right`, etc. |
| `Size` | `BwSize` | `Medium` | Size of the toolbar items. |
| `Color` | `BwColor` | `Secondary` | Theme color. |
| `Rounded` | `bool` | `true` | Whether the toolbar has rounded corners. |
| `Shadow` | `bool` | `true` | Whether to show a shadow. |
| `Glass` | `bool` | `true` | Enables glassmorphism effect (backdrop blur). |
| `Offset` | `int` | `16` | Distance in pixels from the edge (when positioned). |
| `Wrap` | `bool` | `false` | Allow items to wrap on multiple lines (mobile-friendly). |
| `MaxWidth` | `string?` | `null` | Max width constraint (e.g., `"100%"`, `"400px"`). |

### Mobile Responsiveness

For toolbars with many items, use `Wrap` and `MaxWidth` to prevent overflow:

```razor
<BwToolbar Wrap="true" MaxWidth="100%">
    <!-- Many items here -->
</BwToolbar>
```

### Smart Dropdown Positioning

Dropdown menus automatically detect viewport position and adjust direction:
- Opens **upward** if near bottom of screen
- Aligns **right** if near right edge

### Helper Components
- **BwToolButton**: A button within the toolbar.
- **BwToolDropdown**: A dropdown menu within the toolbar.
- **BwToolSeparator**: A visual separator line.
