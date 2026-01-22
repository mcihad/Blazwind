# Floating Action Button (FAB)

A floating button displayed at a fixed position on the screen, typically used for the primary action. Supports labels (extended mode) and Speed Dial sub-menus.

## Examples

### Basic FAB
A simple circular button.

```razor
<BwFloatingActionButton Icon="fa-solid fa-plus" OnClick="HandleAdd" />
```

### Extended FAB
A button with both an icon and a text label.

```razor
<BwFloatingActionButton 
    Icon="fa-solid fa-pencil" 
    Label="Create Post" 
    Extended="true" 
    Color="BwColor.Success" />
```

### Speed Dial
A FAB that reveals a sub-menu of actions when clicked or hovered.

```razor
<BwFloatingActionButton Icon="fa-solid fa-share-nodes">
    <SpeedDialItems>
        <BwFabItem Icon="fa-brands fa-twitter" Label="Twitter" Color="BwColor.Info" />
        <BwFabItem Icon="fa-brands fa-whatsapp" Label="WhatsApp" Color="BwColor.Success" />
        <BwFabItem Icon="fa-solid fa-envelope" Label="Email" Color="BwColor.Secondary" />
    </SpeedDialItems>
</BwFloatingActionButton>
```

## API - BwFloatingActionButton

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Icon` | `string` | `fa-solid fa-plus` | FontAwesome icon class. |
| `Label` | `string?` | `null` | Text to display when `Extended="true"`. |
| `Size` | `BwSize` | `Medium` | Button size (`Small`, `Medium`, `Large`). |
| `Color` | `BwColor` | `Primary` | Button color. |
| `Position` | `BwPosition`| `BottomRight` | Screen position (`TopLeft`, `TopRight`, `BottomLeft`, `BottomRight`). |
| `Extended` | `bool` | `false` | If true, renders as an oval with label. |
| `Mini` | `bool` | `false` | If true, renders a smaller circular button. |
| `IsDisabled` | `bool` | `false` | If true, interaction is disabled. |
| `SpeedDialItems`| `RenderFragment?` | `null` | Content (list of `BwFabItem`) for the speed dial menu. |
| `OnClick` | `EventCallback` | - | Fired when the main button is clicked. |

## API - BwFabItem

Sub-item for the Speed Dial menu.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Icon` | `string` | `fa-solid fa-star` | Item icon. |
| `Label` | `string?` | `null` | Label displayed next to the item. |
| `Color` | `BwColor` | `Secondary` | Item button color. |
| `OnClick` | `EventCallback` | - | Fired when the sub-item is clicked. |
