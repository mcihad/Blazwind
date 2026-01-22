# SplitPanel

An IDE-style split panel component with a draggable divider and resizable panes.

## Features

- **Draggable Divider**: Smoothly resize panels with the mouse.
- **Orientation**: Supports both `Horizontal` and `Vertical` splitting.
- **Size Constraints**: Fine-tune with `MinSize` and `MaxSize`.
- **Event Callback**: Receive the new size via `OnResize`.

## Usage

### Horizontal Split
```razor
@using Blazwind.Components.Layout

<BwSplitPanel DefaultSize="300" MinSize="100" MaxSize="500">
    <FirstPanel>
        <div class="p-4">Navigation Tree</div>
    </FirstPanel>
    <SecondPanel>
        <div class="p-4">Editor Area</div>
    </SecondPanel>
</BwSplitPanel>
```

### Vertical Split
```razor
<BwSplitPanel Orientation="BwOrientation.Vertical" DefaultSize="200">
    <FirstPanel>Upper Content</FirstPanel>
    <SecondPanel>Lower Content</SecondPanel>
</BwSplitPanel>
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `FirstPanel` | `RenderFragment` | - | Content for the left (horizontal) or top (vertical) pane. |
| `SecondPanel` | `RenderFragment` | - | Content for the right (horizontal) or bottom (vertical) pane. |
| `Orientation` | `BwOrientation` | `Horizontal` | Split direction (`Horizontal`, `Vertical`). |
| `DefaultSize` | `int` | `250` | Initial size of the first panel in pixels. |
| `MinSize` | `int` | `100` | Minimum allowed width/height for the first panel. |
| `MaxSize` | `int` | `600` | Maximum allowed width/height for the first panel. |
| `OnResize` | `EventCallback<int>` | - | Fired after the resize operation is complete. |
| `Class` | `string?` | `null` | Custom CSS classes. |
| `Style` | `string?` | `null` | Custom inline CSS styles. |
