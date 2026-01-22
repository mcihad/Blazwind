# Mega Menu

A multi-column dropdown navigation menu, ideal for e-commerce, corporate sites, and complex navigation structures.

## Examples

### E-Commerce Navigation
A feature-rich mega menu with icons, labels, and descriptions across multiple columns.

```razor
<BwMegaMenu Text="Electronics" Icon="fa-solid fa-laptop" Columns="3" Width="MegaMenuWidth.Large">
    <BwMegaMenuColumn Title="Computers" Icon="fa-solid fa-computer">
        <BwMegaMenuItem Label="Laptops" Description="MacBook, ThinkPad" Icon="fa-solid fa-laptop" Href="/laptops" />
        <BwMegaMenuItem Label="Desktops" Description="Gaming, Workstation" Icon="fa-solid fa-desktop" Href="/desktops" />
        <BwMegaMenuItem Label="Gaming PC" Icon="fa-solid fa-gamepad" IsNew="true" Href="/gaming" />
    </BwMegaMenuColumn>
    <BwMegaMenuColumn Title="Mobile" Icon="fa-solid fa-mobile">
        <BwMegaMenuItem Label="Phones" Icon="fa-solid fa-mobile-screen" Href="/phones" />
        <BwMegaMenuItem Label="Tablets" Icon="fa-solid fa-tablet" Href="/tablets" />
    </BwMegaMenuColumn>
    <BwMegaMenuColumn Title="Accessories" Icon="fa-solid fa-headphones">
        <BwMegaMenuItem Label="Headphones" Badge="Hot" BadgeColor="BwColor.Danger" Href="/audio" />
        <BwMegaMenuItem Label="Cables" Href="/cables" />
    </BwMegaMenuColumn>
</BwMegaMenu>
```

### Trigger Modes
The menu can be opened by hovering or clicking.

```razor
@* Hover (Default) *@
<BwMegaMenu Text="Hover Me" Trigger="MegaMenuTrigger.Hover">
    @* Content *@
</BwMegaMenu>

@* Click *@
<BwMegaMenu Text="Click Me" Trigger="MegaMenuTrigger.Click" Color="BwColor.Success">
    @* Content *@
</BwMegaMenu>
```

### Custom Sizing
Control the width of the dropdown and individual columns.

```razor
<BwMegaMenu Text="Wide Menu" Columns="4" Width="MegaMenuWidth.Full" ColumnWidth="200px">
    <BwMegaMenuColumn Title="Section 1">
        <BwMegaMenuItem Label="Item 1" Description="Detailed description here" />
    </BwMegaMenuColumn>
    @* ... *@
</BwMegaMenu>
```

## API - BwMegaMenu

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `TriggerContent` | `RenderFragment?`| `null` | Custom render fragment for the trigger element. |
| `Text` | `string?` | `null` | Text to display on the default trigger button. |
| `Icon` | `string?` | `null` | Icon to display on the default trigger button. |
| `Color` | `BwColor` | `Primary` | Color of the trigger button. |
| `Variant` | `BwVariant` | `Ghost` | Styling variant of the trigger button. |
| `Columns` | `int` | `3` | Number of columns in the dropdown (1-6). |
| `ColumnWidth` | `string?` | `null` | CSS width for each column (e.g., `200px`). |
| `Width` | `MegaMenuWidth` | `Auto` | Overall width preset (`Small`, `Medium`, `Large`, `XLarge`, `Full`). |
| `Alignment` | `MegaMenuAlignment`| `Start` | Horizontal alignment relative to trigger (`Start`, `Center`, `End`). |
| `Trigger` | `MegaMenuTrigger` | `Hover` | Interaction that opens the menu (`Hover`, `Click`). |
| `OpenUpward` | `bool` | `false` | If true, the menu opens above the trigger. |
| `ShowDelay` | `int` | `50` | Milliseconds delay before opening (Hover only). |
| `HideDelay` | `int` | `150` | Milliseconds delay before closing (Hover only). |

### Events

| Event | Argument Type | Description |
| :--- | :--- | :--- |
| `OnOpenChanged`| `EventCallback<bool>` | Fired when the menu opens or closes. |

## API - BwMegaMenuColumn

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Title` | `string?` | `null` | Column header text. |
| `Icon` | `string?` | `null` | Column header icon. |
| `ChildContent`| `RenderFragment?` | `null` | List of `BwMegaMenuItem` components. |

## API - BwMegaMenuItem

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Label` | `string?` | `null` | Item text. |
| `Description`| `string?` | `null` | Sub-text displayed below the label. |
| `Icon` | `string?` | `null` | Item icon. |
| `Href` | `string?` | `null` | Navigation URL. |
| `Badge` | `string?` | `null` | Text for the item badge. |
| `BadgeColor` | `BwColor` | `Primary` | Color of the badge. |
| `IsNew` | `bool` | `false` | If true, displays a "New" (Yeni) tag. |
| `Disabled` | `bool` | `false` | If true, the item is not interactive. |
| `OnClick` | `EventCallback` | - | Fired when the item is clicked. |
