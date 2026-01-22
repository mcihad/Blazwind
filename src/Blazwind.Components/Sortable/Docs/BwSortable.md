# Sortable

A lightweight drag-and-drop list component that allows simple reordering of items via drag handles or the item itself.

## Examples

### Basic List
```razor
<BwSortable Items="@_tasks" OnReorder="HandleReorder">
    <ItemTemplate Context="task">
        <div class="p-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700">
            @task
        </div>
    </ItemTemplate>
</BwSortable>

@code {
    private List<string> _tasks = new() { "Task 1", "Task 2", "Task 3" };

    private void HandleReorder(List<string> orderedItems)
    {
        _tasks = orderedItems;
        // Check console or process new order
    }
}
```

### With Custom Handle
```razor
<BwSortable Items="@_items" HandleIcon="fa-solid fa-arrows-up-down" Class="space-y-2">
    <ItemTemplate Context="item">
        <div class="flex items-center p-2 bg-gray-50 rounded">
            <span>@item.Name</span>
        </div>
    </ItemTemplate>
</BwSortable>
```

## API - BwSortable

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Items` | `List<TItem>` | - | **Required**. The list of items to sort. |
| `ItemTemplate` | `RenderFragment<TItem>` | - | **Required**. Template for rendering each item. |
| `ShowHandle` | `bool` | `true` | Whether to show a specific drag handle icon. |
| `HandleIcon` | `string` | `"fa-solid fa-grip-vertical"` | Icon class for the drag handle. |
| `Class` | `string?` | `null` | CSS class for the container. |
| `Style` | `string?` | `null` | CSS styles for the container. |
| `OnReorder` | `EventCallback<List<TItem>>` | - | Fired when the list order changes. |

## Features

- ✅ **Drag and Drop**: Native HTML5 drag and drop API.
- ✅ **Smooth Transitions**: Visual feedback during dragging.
- ✅ **Generic Support**: Works with any type of object.
- ✅ **Touch Friendly**: Optimized drag handles.
