# BwDataGrid

An enterprise-grade data grid component. Features advanced filtering, sorting, pagination, selection, export, column
management, and state persistence.

## Examples

### Basic Usage

```razor
<BwDataGrid TItem="Employee" 
            Items="@employees"
            EnablePagination="true"
            PageSize="10"
            Striped="true"
            Hoverable="true">
    <ChildContent>
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Id)" Title="ID" Width="80px" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.FullName)" Title="Full Name" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Department)" Title="Department" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Salary)" Title="Salary" Format="C0" Align="TextAlign.Right" />
    </ChildContent>
</BwDataGrid>
```

## API

### Data and Content

| Parameter            | Type                    | Default | Description                               |
|----------------------|-------------------------|---------|-------------------------------------------|
| `Items`              | `IEnumerable<TItem>`    | `[]`    | List of items to display in the grid.     |
| `ChildContent`       | `RenderFragment`        | -       | Column definitions.                       |
| `ToolbarContent`     | `RenderFragment`        | -       | Custom content for the toolbar area.      |
| `FooterContent`      | `RenderFragment`        | -       | Custom content for the footer area.       |
| `DetailRowTemplate`  | `RenderFragment<TItem>` | -       | Template for row expansion details.       |
| `EmptyContent`       | `RenderFragment`        | -       | Content to display when there is no data. |
| `LoadingContent`     | `RenderFragment`        | -       | Content to display while loading.         |
| `ContextMenuContent` | `RenderFragment<TItem>` | -       | Content for the right-click context menu. |
| `KeySelector`        | `Func<TItem, object>`   | -       | Selector for the row key.                 |

### Appearance

| Parameter          | Type                  | Default | Description                             |
|--------------------|-----------------------|---------|-----------------------------------------|
| `Class`            | `string?`             | -       | Custom CSS class.                       |
| `Height`           | `string?`             | -       | Grid height (e.g., "400px").            |
| `Striped`          | `bool`                | `true`  | Enables striped rows.                   |
| `Hoverable`        | `bool`                | `true`  | Enables row hover effect.               |
| `Bordered`         | `bool`                | `false` | Adds borders to the table.              |
| `Compact`          | `bool`                | `false` | Enables compact mode (reduced padding). |
| `RowClass`         | `Func<TItem, string>` | -       | Conditional CSS class for rows.         |
| `RowStyle`         | `Func<TItem, string>` | -       | Conditional inline style for rows.      |
| `SelectedRowClass` | `string?`             | -       | Custom CSS class for selected rows.     |

### Feature Toggles

| Parameter             | Type         | Default | Description                                      |
|-----------------------|--------------|---------|--------------------------------------------------|
| `EnableSorting`       | `bool`       | `true`  | Enables sorting on columns.                      |
| `EnableMultiSort`     | `bool`       | `false` | Enables multi-column sorting (Ctrl+Click).       |
| `EnableFiltering`     | `bool`       | `false` | Enables filtering.                               |
| `FilterMode`          | `FilterMode` | `Row`   | Filter interface mode (`Row`, `Menu`).           |
| `EnableSearch`        | `bool`       | `false` | Enables global search.                           |
| `EnablePagination`    | `bool`       | `true`  | Enables pagination.                              |
| `EnableColumnToggle`  | `bool`       | `false` | Shows the column visibility selector.            |
| `EnableColumnReorder` | `bool`       | `false` | Enables drag-and-drop column reordering.         |
| `EnableColumnResize`  | `bool`       | `false` | Enables column resizing.                         |
| `EnableExport`        | `bool`       | `false` | Enables export functionality (Excel, CSV, etc.). |
| `EnableContextMenu`   | `bool`       | `false` | Enables the context menu.                        |
| `EnableRowExpansion`  | `bool`       | `false` | Enables row expansion for details.               |
| `IsLoading`           | `bool`       | `false` | Toggles the loading state overlay.               |

### Selection

| Parameter              | Type                   | Default | Description                                    |
|------------------------|------------------------|---------|------------------------------------------------|
| `SelectionMode`        | `BwSelectionMode`      | `None`  | Selection mode (`None`, `Single`, `Multiple`). |
| `SelectedItems`        | `IEnumerable<TItem>`   | `[]`    | Collection of currently selected items.        |
| `SelectedItemsChanged` | `EventCallback`        | -       | Callback when selection changes.               |
| `OnRowClick`           | `EventCallback<TItem>` | -       | Callback when a row is clicked.                |
| `OnRowDoubleClick`     | `EventCallback<TItem>` | -       | Callback when a row is double-clicked.         |

### Pagination

| Parameter            | Type                 | Default          | Description                                  |
|----------------------|----------------------|------------------|----------------------------------------------|
| `CurrentPage`        | `int`                | `1`              | Current page number.                         |
| `CurrentPageChanged` | `EventCallback<int>` | -                | Callback when the page changes.              |
| `PageSize`           | `int`                | `10`             | Number of items per page.                    |
| `PageSizeChanged`    | `EventCallback<int>` | -                | Callback when the page size changes.         |
| `PageSizeOptions`    | `int[]`              | `[10,25,50,100]` | Available options for page size.             |
| `TotalItems`         | `int?`               | -                | Total item count (required for server-side). |

### Server-Side

| Parameter        | Type                           | Default | Description                                                      |
|------------------|--------------------------------|---------|------------------------------------------------------------------|
| `ServerSide`     | `bool`                         | `false` | Enables server-side mode.                                        |
| `OnStateChanged` | `EventCallback<DataGridState>` | -       | Callback triggered when grid state (page, sort, filter) changes. |

### State Persistence

| Parameter         | Type                           | Default | Description                                                    |
|-------------------|--------------------------------|---------|----------------------------------------------------------------|
| `StateStorageKey` | `string?`                      | -       | Unique key for storing grid state. If set, state is persisted. |
| `StateStorage`    | `IGridStateStorage?`           | -       | Custom storage implementation.                                 |
| `AutoSaveState`   | `bool`                         | `true`  | Automatically saves state on changes.                          |
| `OnStateSaved`    | `EventCallback<GridViewState>` | -       | Callback when state is saved.                                  |
| `OnStateLoaded`   | `EventCallback<GridViewState>` | -       | Callback when state is loaded.                                 |

## Feature Details

### State Persistence (Saving Column State)

Grid column widths, visibility, and sorting can be persistently saved.

#### LocalStorage Persistence

```razor
<BwDataGrid TItem="Employee" 
            Items="@employees"
            StateStorageKey="employees-grid"
            EnableColumnResize="true"
            EnableColumnToggle="true"
            EnableColumnReorder="true">
    ...
</BwDataGrid>
```

#### Custom Storage Implementation

```csharp
// 1. Implement IGridStateStorage
public class DatabaseGridStateStorage : IGridStateStorage
{
    private readonly IDbContext _db;
    private readonly ICurrentUser _currentUser;

    public DatabaseGridStateStorage(IDbContext db, ICurrentUser currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task SaveStateAsync(string key, GridViewState state, CancellationToken ct = default)
    {
        // Save to database...
    }

    public async Task<GridViewState?> LoadStateAsync(string key, CancellationToken ct = default)
    {
        // Load from database...
    }

    public async Task DeleteStateAsync(string key, CancellationToken ct = default)
    {
        // Delete from database...
    }
}

// 2. Register service
builder.Services.AddScoped<IGridStateStorage, DatabaseGridStateStorage>();

// 3. Use in Grid
<BwDataGrid StateStorage="@_stateStorage" ...>
```

## Public Methods

| Method                   | Returns         | Description                                                         |
|--------------------------|-----------------|---------------------------------------------------------------------|
| `Refresh()`              | `void`          | Refreshes the grid view.                                            |
| `ClearFilters()`         | `Task`          | Clears all active filters.                                          |
| `ClearSorting()`         | `Task`          | Clears all active sorting.                                          |
| `ClearSelection()`       | `Task`          | Clears current selection.                                           |
| `SelectAll()`            | `Task`          | Selects all items (on current page or all pages depending on mode). |
| `SaveStateAsync()`       | `Task`          | Manually triggers state save.                                       |
| `LoadStateAsync()`       | `Task`          | Manually triggers state load.                                       |
| `ClearSavedStateAsync()` | `Task`          | Deletes the saved state.                                            |
| `GetCurrentViewState()`  | `GridViewState` | Returns the current state object.                                   |
| `ExportByFormat(format)` | `Task`          | Triggers export with the specified format (e.g., "xlsx", "csv").    |

## Related Documentation

- [DataGrid Column](./BwDataGridColumn.md)
- [Entity Framework Integration](./DataGrid-EF-Integration.md)
