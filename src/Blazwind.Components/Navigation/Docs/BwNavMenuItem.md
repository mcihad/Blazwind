# Navigation Items and Groups

Components for building the menu tree inside a `BwNavMenu`.

## Examples

### Hierarchy

Create nested navigation structures using groups and items.

```razor
<BwNavMenuGroup Title="System" Icon="fa-solid fa-server" DefaultExpanded="true">
    <BwNavMenuItem Label="Logs" Icon="fa-solid fa-list" Href="/system/logs" />
    <BwNavMenuItem Label="Status" Icon="fa-solid fa-wave-square" Href="/system/status" />
    
    <BwNavMenuGroup Title="Backup">
        <BwNavMenuItem Label="Settings" Href="/backup/settings" />
        <BwNavMenuItem Label="History" Href="/backup/history" />
    </BwNavMenuGroup>
</BwNavMenuGroup>
```

### Badges

Highlight specific items with status indicators.

```razor
<BwNavMenuItem Label="Inbox" Icon="fa-solid fa-inbox" Badge="12" Href="/inbox" />
<BwNavMenuItem Label="Notifications" Icon="fa-solid fa-bell" Badge="New" Href="/notif" />
```

## API - BwNavMenuItem

### Parameters

| Parameter      | Type                                    | Default  | Description                                         |
|:---------------|:----------------------------------------|:---------|:----------------------------------------------------|
| `Label`        | `string`                                | -        | Text to display for the link.                       |
| `Href`         | `string`                                | -        | Target URL.                                         |
| `Icon`         | `string?`                               | `null`   | FontAwesome icon class.                             |
| `Badge`        | `string?`                               | `null`   | Text to display in a badge on the right.            |
| `Match`        | `NavLinkMatch`                          | `Prefix` | Blazor `NavLinkMatch` behavior (`All` or `Prefix`). |
| `ItemTemplate` | `RenderFragment<BwNavMenuItemContext>?` | `null`   | Custom template for this specific item.             |

## API - BwNavMenuGroup

### Parameters

| Parameter         | Type                                     | Default | Description                                            |
|:------------------|:-----------------------------------------|:--------|:-------------------------------------------------------|
| `Title`           | `string`                                 | -       | Label for the group header.                            |
| `Icon`            | `string?`                                | `null`  | Icon for the group header.                             |
| `DefaultExpanded` | `bool`                                   | `false` | Whether the group is open by default.                  |
| `ChildContent`    | `RenderFragment?`                        | `null`  | Nested `BwNavMenuItem` or `BwNavMenuGroup` components. |
| `HeaderTemplate`  | `RenderFragment<BwNavMenuGroupContext>?` | `null`  | Custom template for this group's header.               |
