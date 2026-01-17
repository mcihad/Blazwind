# BwButtonGroup

A container for grouping multiple buttons together horizontally or vertically. Ideal for segmented controls, toolbars, and pagination.

## Examples

### Horizontal Grouping (Default)
Buttons are aligned horizontally. By default, they are attached to each other.

```razor
<BwButtonGroup>
    <BwButton Text="Left" />
    <BwButton Text="Middle" />
    <BwButton Text="Right" />
</BwButtonGroup>
```

### Vertical Grouping
Align buttons vertically using the `Orientation` parameter.

```razor
<BwButtonGroup Orientation="BwOrientation.Vertical">
    <BwButton Text="Profile" Icon="fa-solid fa-user" />
    <BwButton Text="Settings" Icon="fa-solid fa-gear" />
    <BwButton Text="Logout" Icon="fa-solid fa-right-from-bracket" Color="BwColor.Danger" />
</BwButtonGroup>
```

### Attached vs Gap
Toggle between merged buttons or buttons with a small gap using `IsAttached`.

```razor
@* Attached (Default) *@
<BwButtonGroup IsAttached="true">
    <BwButton Text="A" />
    <BwButton Text="B" />
</BwButtonGroup>

@* With Gap *@
<BwButtonGroup IsAttached="false">
    <BwButton Text="A" />
    <BwButton Text="B" />
</BwButtonGroup>
```

### Full Width
Make the group span the entire width of its container.

```razor
<BwButtonGroup IsFullWidth="true">
    <BwButton Class="flex-1" Text="Back" />
    <BwButton Class="flex-1" Text="Save" Color="BwColor.Primary" />
</BwButtonGroup>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ChildContent` | `RenderFragment?` | `null` | The buttons to be grouped together. |
| `Orientation` | `BwOrientation` | `Horizontal` | Direction of the group (`Horizontal`, `Vertical`). |
| `IsAttached` | `bool` | `true` | If `true`, buttons touch each other with shared borders. |
| `IsFullWidth` | `bool` | `false` | If `true`, the container takes up the full width. |
| `Size` | `BwSize` | `Medium` | Default size for buttons in the group (if buttons don't override). |
| `Color` | `BwColor` | `Primary` | Default color for buttons in the group. |
| `Variant` | `BwVariant` | `Filled` | Default variant for buttons in the group. |
| `Class` | `string?` | `null` | Additional CSS classes for the container. |
| `Style` | `string?` | `null` | Inline CSS styles. |
