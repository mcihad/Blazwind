# BwContextMenu

A customizable right-click (context) menu component that can be attached to any component or HTML element. It features smart positioning to prevent overflow beyond the viewport.

## Features

- ✅ **Smart Positioning**: Automatically calculates the best coordinates to avoid screen edges.
- ✅ **Deep Integration**: Attach to any area using the `ChildContent` slot.
- ✅ **Sub-menus**: Support for nested menu structures.
- ✅ **Dividers & Icons**: Organize items with visual separators and FontAwesome icons.
- ✅ **Programmatic Trigger**: Open the menu manually using coordinates (ideal for Map or Canvas integrations).

## Usage

### Attaching to an Area
```razor
<BwContextMenu>
    <ChildContent>
        <div class="p-8 border-2 border-dashed rounded text-center">
            Right-click here!
        </div>
    </ChildContent>
    <MenuContent>
        <BwContextMenuItem Text="Refresh" Icon="fa-solid fa-rotate" OnClick="OnRefresh" />
        <BwContextMenuItem Text="Save As..." Icon="fa-solid fa-floppy-disk" />
        <BwContextMenuItem IsDivider="true" />
        <BwContextMenuItem Text="Delete" Icon="fa-solid fa-trash" Class="text-red-500" />
    </MenuContent>
</BwContextMenu>
```

### Programmatic Usage
Useful for external triggers like clicking on a map marker or a custom canvas element.

```razor
<BwContextMenu @ref="_manualMenu">
    <MenuContent>
        <BwContextMenuItem Text="Action A" />
    </MenuContent>
</BwContextMenu>

@code {
    private BwContextMenu? _manualMenu;

    private async Task OpenAtPoint(double x, double y)
    {
        await _manualMenu?.ShowAsync(x, y)!;
    }
}
```

## API Reference

### BwContextMenu Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ChildContent` | `RenderFragment?` | `null` | The clickable area that triggers the menu. |
| `MenuContent` | `RenderFragment?` | `null` | The menu items (`BwContextMenuItem`). |
| `Class` | `string?` | `null` | CSS classes for the container. |
| `Style` | `string?` | `null` | Inline styles for the container. |

### BwContextMenuItem Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Text` | `string?` | `null` | The text label of the menu item. |
| `Icon` | `string?` | `null` | FontAwesome icon class. |
| `IsDivider` | `bool` | `false` | If true, renders a horizontal separator line. |
| `CloseOnClick` | `bool` | `true` | Whether the menu should close after clicking this item. |
| `OnClick` | `EventCallback` | `null` | The callback triggered when clicked. |
| `SubMenu` | `RenderFragment?` | `null` | Nested menu content. |

## Examples

### List Integration
You can wrap list items to provide unique actions for each entry.

```razor
@foreach (var file in _files)
{
    <BwContextMenu Class="block">
        <ChildContent>
            <div class="px-4 py-2 border-b">@file.Name</div>
        </ChildContent>
        <MenuContent>
            <BwContextMenuItem Text="Open" Icon="fa-solid fa-folder-open" />
            <BwContextMenuItem Text="Download" Icon="fa-solid fa-download" />
        </MenuContent>
    </BwContextMenu>
}
```
