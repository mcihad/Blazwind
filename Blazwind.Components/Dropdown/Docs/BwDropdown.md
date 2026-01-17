# BwDropdown

A flexible dropdown menu component that displays a list of options or custom content when triggered by a button, icon, or any other element.

## Features

- ✅ **Flexible Trigger:** Use buttons, icons, or any custom Blazor component.
- ✅ **Alignment:** Supports `Left` and `Right` (default) horizontal alignment.
- ✅ **Auto-flip:** Automatically detects viewport boundaries to open upwards if there is no space below.
- ✅ **Sub-components:** Use `BwDropdownItem` for standard list items or provide custom `ChildContent`.
- ✅ **Animated:** Includes smooth fade and zoom animations.

## Usage

### Basic Usage with Standard Items
```razor
<BwDropdown>
    <TriggerContent>
        <BwButton Text="Options" Icon="fa-solid fa-chevron-down" />
    </TriggerContent>
    <ChildContent>
        <BwDropdownItem Text="Edit" Icon="fa-solid fa-pen" />
        <BwDropdownItem Text="Delete" Icon="fa-solid fa-trash" Class="text-red-600" />
    </ChildContent>
</BwDropdown>
```

### Left Alignment
The menu expands from the left edge of the trigger.
```razor
<BwDropdown Alignment="BwDirection.Left">
    <TriggerContent>
        <BwButton Icon="fa-solid fa-bars" />
    </TriggerContent>
    <ChildContent>
        <BwDropdownItem Text="Profile" />
        <BwDropdownItem Text="Settings" />
    </ChildContent>
</BwDropdown>
```

## API Reference

### BwDropdown Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `TriggerContent` | `RenderFragment` | `null` | The element that opens the menu via click. |
| `ChildContent` | `RenderFragment` | `null` | The content of the dropdown menu. |
| `Alignment` | `BwDirection` | `Right` | `Right` or `Left` horizontal alignment. |
| `VPosition` | `BwDirection` | `Auto` | `Bottom` (default), `Top`, or `Auto` (smart flipping). |
| `EstimatedMenuHeight`| `int` | `200` | Height in px used for `Auto` position calculation. |

### BwDropdownItem Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Text` | `string` | `null` | Item label. |
| `Icon` | `string` | `null` | FontAwesome icon class. |
| `IsDivider` | `bool` | `false` | Renders a horizontal separator line instead of an item. |
| `OnClick` | `EventCallback` | `null` | Triggered when the item is clicked. |
| `Class` | `string` | `null` | Additional CSS classes for styling (e.g., text colors). |

## Advanced Positioning
When `VPosition` is set to `Auto` (default), the component uses JS interop to measure the trigger's distance from the bottom of the viewport. If the remaining space is less than `EstimatedMenuHeight`, the menu will automatically open upwards.
