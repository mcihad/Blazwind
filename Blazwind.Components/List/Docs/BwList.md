# List

A versatile and highly customizable list component supporting generic data binding, selection modes, and drag-and-drop sorting.

## Features

- **Generic Data Binding**: Bind to any `IEnumerable<TItem>` collection.
- **Rich Templating**: Fully customize item appearance with `ItemTemplate`.
- **Selection Modes**: Supports `None`, `Single`, and `Multiple` selection with limits.
- **Sorting**: Interactive drag-and-drop reordering using JS interop.
- **Empty States**: Configurable `EmptyText` or `EmptyTemplate` for empty collections.
- **Search & Filter**: Easily integrable with external search inputs (see examples).

## Usage

### Basic List

```razor
<BwList TItem="User"
        Items="@_users"
        ItemText="@(u => u.Name)"
        ItemDescription="@(u => u.Role)"
        ItemIcon="@(u => u.AvatarIcon)"
        OnItemClick="@(u => HandleUserClick(u))" />
```

### Custom Template (ItemTemplate)

For advanced layouts, use the `ItemTemplate` along with `BwListItem`.

```razor
<BwList Items="@_tasks">
    <ItemTemplate Context="task">
        <BwListItem Title="@task.Title" Description="@task.DueDate.ToShortDateString()">
            <LeadingContent>
                 <i class="fa-solid fa-circle text-@task.StatusColor-500"></i>
            </LeadingContent>
            <EndContent>
                <BwBadge Color="@task.PriorityColor">@task.Priority</BwBadge>
            </EndContent>
        </BwListItem>
    </ItemTemplate>
</BwList>
```

### Selection Example

```razor
<BwList TItem="Option"
        Items="@_options"
        SelectionMode="BwSelectionMode.Multiple"
        MaxSelectedItems="3"
        @bind-SelectedItems="_selectedOptions" />
```

## Parameters

### BwList

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Items` | `IEnumerable<TItem>` | `null` | The collection of data items to display. |
| `ItemTemplate` | `RenderFragment<TItem>` | `null` | Custom template for rendering each item. |
| `ItemText` | `Func<TItem, string>` | `null` | Simple selector for the item title text. |
| `ItemDescription` | `Func<TItem, string?>` | `null` | Simple selector for the item subtext. |
| `ItemIcon` | `Func<TItem, string?>` | `null` | Simple selector for the item's FontAwesome icon. |
| `SelectionMode` | `BwSelectionMode` | `None` | Selection behavior: `None`, `Single`, or `Multiple`. |
| `SelectedItems` | `List<TItem>` | `new()` | Two-way bindable list of selected data objects. |
| `EnableSorting` | `bool` | `false` | Enables drag-and-drop handles for reordering. |
| `EmptyText` | `string` | `"No items found"` | Text to display when the collection is empty. |

### BwListItem

`BwListItem` is the standard building block for list items, providing slots for icons, badges, and actions.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Title` | `string` | `null` | Principal item text. |
| `Description` | `string` | `null` | Secondary item text. |
| `Icon` | `string` | `null` | Icon class for the default leading area. |
| `LeadingContent` | `RenderFragment` | `null` | Custom content on the far left. |
| `EndContent` | `RenderFragment` | `null` | Custom content on the far right (e.g., badges). |
| `Actions` | `RenderFragment` | `null` | Action buttons shown on hover. |
| `ChildContent` | `RenderFragment` | `null` | Overrides the entire item body with custom content. |

## Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `OnItemClick` | `TItem` | Triggered when an item is clicked. |
| `OnOrderChange` | `(int oldIndex, int newIndex)` | Triggered after a successful drag-and-drop reorder. |
| `SelectedItemsChanged` | `List<TItem>` | Triggered when the selection changes. |
