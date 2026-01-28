# Kanban

A professional, drag-and-drop enabled Kanban board component for managing tasks, workflows, and project pipelines.

## Features

- **Drag and Drop**: Smooth interactive moving of cards between columns.
- **Customizable Columns**: Configure titles, icons, and colors for each phase.
- **Rich Templates**: Use `ItemTemplate` for fully custom card designs.
- **Action Buttons**: Built-in "Add Card" button with event callback.
- **Event Handling**: Track item clicks, movement between columns, and addition requests.

## Usage

```razor
@using Blazwind.Components.Kanban
@using static Blazwind.Components.Kanban.BwKanban

<BwKanban Columns="_columns"
          OnItemMoved="HandleItemMoved"
          OnItemClick="HandleItemClick"
          OnAddClick="HandleAddClick" />

@code {
    private List<KanbanColumn> _columns = new()
    {
        new() 
        { 
            Id = "todo", 
            Title = "To Do",
            Icon = "fa-solid fa-list",
            Color = BwColor.Primary,
            Items = new()
            {
                new() { Id = "1", Title = "Initial Research", Description = "Market analysis for Q3" },
                new() { Id = "2", Title = "Competitor Audit", Tags = new() { "Marketing" } }
            }
        },
        new() 
        { 
            Id = "done", 
            Title = "Completed",
            Color = BwColor.Success,
            Items = new()
        }
    };

    private void HandleItemMoved(KanbanMoveEvent e) { /* Handle move logic */ }
    private void HandleItemClick(KanbanItem item) { /* Show detail modal */ }
    private void HandleAddClick(KanbanColumn column) { /* Show add form */ }
}
```

## Parameters

### BwKanban

| Parameter       | Type                         | Default | Description                                                     |
|:----------------|:-----------------------------|:--------|:----------------------------------------------------------------|
| `Columns`       | `List<KanbanColumn>`         | `new()` | The list of columns and their respective items.                 |
| `ItemTemplate`  | `RenderFragment<KanbanItem>` | `null`  | Custom template for rendering individual cards.                 |
| `ShowAddButton` | `bool`                       | `true`  | Whether to show the "Add card" button at the bottom of columns. |

### Event Callbacks

| Event         | Payload           | Description                                                                   |
|:--------------|:------------------|:------------------------------------------------------------------------------|
| `OnItemMoved` | `KanbanMoveEvent` | Triggered when a card is dropped into a target column (including reordering). |
| `OnItemClick` | `KanbanItem`      | Triggered when a card is clicked.                                             |
| `OnAddClick`  | `KanbanColumn`    | Triggered when the "Add Card" button is clicked.                              |

### Data Models

#### KanbanColumn

| Property      | Type                | Description                                                             |
|:--------------|:--------------------|:------------------------------------------------------------------------|
| `Id`          | `string`            | Unique identifier for the column.                                       |
| `Title`       | `string?`           | Header title of the column.                                             |
| `Icon`        | `string?`           | FontAwesome icon class for the header.                                  |
| `Color`       | `BwColor?`          | Theme color for the header border.                                      |
| `Items`       | `List<KanbanItem>?` | Cards contained in this column.                                         |
| `MaxItems`    | `int?`              | **[New]** Visual limit for WIP. Header turns red if count exceeds this. |
| `IsCollapsed` | `bool`              | **[New]** Whether the column is collapsed to a narrow strip.            |
| `HeaderExtra` | `RenderFragment?`   | Custom content to show on the right side of the header.                 |

#### KanbanItem

| Property      | Type              | Description                                  |
|:--------------|:------------------|:---------------------------------------------|
| `Id`          | `string`          | Unique identifier for the card.              |
| `Title`       | `string?`         | Principal text of the card.                  |
| `Description` | `string?`         | Subtext or details of the card.              |
| `Tags`        | `List<string>?`   | Small badges displayed on the card.          |
| `Assignee`    | `KanbanAssignee?` | User assigned to the task (shows avatar).    |
| `DueDate`     | `DateTime?`       | Deadline for the task (shows calendar icon). |
| `Data`        | `object?`         | Custom user data attached to the item.       |

#### KanbanMoveEvent

| Property       | Type            | Description                            |
|:---------------|:----------------|:---------------------------------------|
| `Item`         | `KanbanItem?`   | The card that was moved.               |
| `SourceColumn` | `KanbanColumn?` | The column where the card originated.  |
| `TargetColumn` | `KanbanColumn?` | The column where the card was dropped. |

## Examples

### Reordering & WIP Limits

Items can now be reordered within or between columns. Set `MaxItems` on a column to show a warning when the limit is
exceeded.

```razor
@code {
    private List<KanbanColumn> _columns = new()
    {
        new() 
        { 
            Title = "In Progress", 
            Color = BwColor.Warning,
            MaxItems = 3, // Shows red border if > 3 items
            Items = ... 
        }
    };
}
```

### Collapsible Columns

Columns can be collapsed by clicking the compress icon in the header. The state is tracked in `IsCollapsed`.

### Using ItemTemplate

You can override the default card look by using a custom template.

```razor
<BwKanban Columns="_columns">
    <ItemTemplate Context="item">
        <div class="p-2 border rounded border-blue-200 bg-blue-50">
            <strong>@item.Title</strong>
            <div class="text-xs">ID: @item.Id</div>
        </div>
    </ItemTemplate>
</BwKanban>
```

