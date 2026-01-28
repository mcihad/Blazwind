# BwBreadcrumb

A navigation component that indicates the current page's location within a site hierarchy, allowing users to navigate
back to parent pages easily.

## Examples

### Basic Usage

Standard breadcrumb navigation with links and icons.

```razor
<BwBreadcrumb>
    <BwBreadcrumbItem Text="Home" Href="/" Icon="fa-solid fa-home" />
    <BwBreadcrumbItem Text="Components" Href="/components" />
    <BwBreadcrumbItem Text="Breadcrumb" IsActive="true" />
</BwBreadcrumb>
```

### Custom Separator

Customize the divider between items using the `SeparatorTemplate`.

```razor
<BwBreadcrumb>
    <SeparatorTemplate>
        <BwIcon Name="fa-solid fa-chevron-right" Size="BwSize.ExtraSmall" Class="mx-1 text-gray-400" />
    </SeparatorTemplate>
    <ChildContent>
        <BwBreadcrumbItem Text="Step 1" Href="#" />
        <BwBreadcrumbItem Text="Step 2" Href="#" />
        <BwBreadcrumbItem Text="Step 3" IsActive="true" />
    </ChildContent>
</BwBreadcrumb>
```

## API - BwBreadcrumb

| Parameter           | Type              | Default | Description                                               |
|---------------------|-------------------|---------|-----------------------------------------------------------|
| `ChildContent`      | `RenderFragment?` | `null`  | Should contain one or more `BwBreadcrumbItem` components. |
| `SeparatorTemplate` | `RenderFragment?` | `null`  | Custom template for the item separator.                   |
| `Class`             | `string?`         | `null`  | Additional CSS classes.                                   |
| `Style`             | `string?`         | `null`  | Inline CSS styles.                                        |

## API - BwBreadcrumbItem

| Parameter      | Type              | Default | Description                                                  |
|----------------|-------------------|---------|--------------------------------------------------------------|
| `Text`         | `string?`         | `null`  | The text label for the item.                                 |
| `Href`         | `string?`         | `null`  | The navigation URL.                                          |
| `Icon`         | `string?`         | `null`  | CSS class for the icon (e.g., "fa-solid fa-home").           |
| `IsActive`     | `bool`            | `false` | If `true`, indicates the current page. The link is disabled. |
| `Target`       | `string?`         | `null`  | HTML `target` attribute for the link (e.g., "_blank").       |
| `ChildContent` | `RenderFragment?` | `null`  | Custom content inside the item.                              |
| `Class`        | `string?`         | `null`  | Additional CSS classes.                                      |
| `Style`        | `string?`         | `null`  | Inline CSS styles.                                           |
