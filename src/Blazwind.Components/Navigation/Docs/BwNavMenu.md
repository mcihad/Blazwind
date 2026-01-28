# Nav Menu

The primary container for navigation structures. It manages Header, Search, Navigation Items, and Footer slots.

## Usage

```razor
<BwNavMenu Width="w-64">
    <Header>
        <BwNavHeader Title="Blazwind Admin" Subtitle="v1.0.0" Icon="fa-solid fa-wind" />
    </Header>
    
    <Search>
        <BwNavSearch Placeholder="Search menu..." OnSearch="HandleSearch" />
    </Search>
    
    <ChildContent>
        <BwNavMenuItem Label="Dashboard" Icon="fa-solid fa-chart-line" Href="/" />
        <BwNavMenuGroup Title="Settings" Icon="fa-solid fa-gears">
            <BwNavMenuItem Label="Profile" Href="/profile" />
            <BwNavMenuItem Label="Security" Href="/security" />
        </BwNavMenuGroup>
    </ChildContent>
    
    <Footer>
        <BwNavFooter Title="Cihad" Subtitle="Administrator" Icon="fa-solid fa-user" />
    </Footer>
</BwNavMenu>
```

## API - BwNavMenu

### Parameters

| Parameter             | Type                                     | Default | Description                                                |
|:----------------------|:-----------------------------------------|:--------|:-----------------------------------------------------------|
| `Header`              | `RenderFragment?`                        | `null`  | Content for the top header slot.                           |
| `Search`              | `RenderFragment?`                        | `null`  | Content for the search slot.                               |
| `Footer`              | `RenderFragment?`                        | `null`  | Content for the bottom footer slot.                        |
| `ChildContent`        | `RenderFragment?`                        | `null`  | Main navigation items (`BwNavMenuItem`, `BwNavMenuGroup`). |
| `Width`               | `string`                                 | `w-64`  | Width of the menu (Tailwind class).                        |
| `ItemTemplate`        | `RenderFragment<BwNavMenuItemContext>?`  | `null`  | Custom template for all child items.                       |
| `GroupHeaderTemplate` | `RenderFragment<BwNavMenuGroupContext>?` | `null`  | Custom template for all group headers.                     |

## API - BwNavHeader

Display application brand or user info at the top.

| Parameter      | Type              | Default          | Description                         |
|:---------------|:------------------|:-----------------|:------------------------------------|
| `Title`        | `string`          | -                | Primary text.                       |
| `Subtitle`     | `string?`         | `null`           | Secondary text.                     |
| `Icon`         | `string?`         | `null`           | FontAwesome icon class.             |
| `IconBgClass`  | `string`          | `bg-gradient...` | Tailwind class for icon background. |
| `ChildContent` | `RenderFragment?` | `null`           | Content displayed on the far right. |

## API - BwNavFooter

Display profile info or settings at the bottom.

| Parameter      | Type              | Default | Description                    |
|:---------------|:------------------|:--------|:-------------------------------|
| `Title`        | `string?`         | `null`  | User name or system info.      |
| `Subtitle`     | `string?`         | `null`  | Role or version info.          |
| `Icon`         | `string?`         | `null`  | Default icon if no avatar.     |
| `AvatarUrl`    | `string?`         | `null`  | URL for the user avatar image. |
| `ChildContent` | `RenderFragment?` | `null`  | Action buttons on the right.   |

## API - BwNavSearch

Built-in filtering for navigation items.

| Parameter     | Type                    | Default  | Description                             |
|:--------------|:------------------------|:---------|:----------------------------------------|
| `Placeholder` | `string`                | `Ara...` | Search input placeholder.               |
| `SearchValue` | `string`                | -        | Current search string.                  |
| `Clearable`   | `bool`                  | `true`   | Show clear button when input has value. |
| `OnSearch`    | `EventCallback<string>` | -        | Fired when value changes.               |
