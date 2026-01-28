# BwDataGridColumn

Defines a column within the `BwDataGrid` component.

## Parameters

| Parameter          | Type                               | Default   | Description                                                           |
|--------------------|------------------------------------|-----------|-----------------------------------------------------------------------|
| `Field`            | `Expression<Func<TItem, object?>>` | -         | Expression to access the data field (e.g. `x => x.Name`).             |
| `Title`            | `string`                           | -         | Column header title.                                                  |
| `Width`            | `string?`                          | -         | Column width (e.g: "150px", "20%").                                   |
| `MinWidth`         | `int`                              | `50`      | Minimum width in pixels.                                              |
| `MaxWidth`         | `int`                              | `0`       | Maximum width in pixels (0 = unlimited).                              |
| `Format`           | `string?`                          | -         | Display format string (e.g: "C0", "dd.MM.yyyy").                      |
| `Align`            | `TextAlign`                        | `Left`    | Text alignment (`Left`, `Center`, `Right`).                           |
| `Visible`          | `bool`                             | `true`    | Whether the column is initially visible.                              |
| `Sortable`         | `bool`                             | `true`    | Whether the column can be sorted.                                     |
| `Filterable`       | `bool`                             | `true`    | Whether the column can be filtered.                                   |
| `Resizable`        | `bool`                             | `true`    | Whether the column can be resized.                                    |
| `Reorderable`      | `bool`                             | `true`    | Whether the column can be reordered (drag & drop).                    |
| `Frozen`           | `FrozenPosition`                   | `None`    | Pinned position (`None`, `Left`, `Right`).                            |
| `FilterType`       | `FilterType`                       | `Text`    | Type of filter input (`Text`, `Number`, `Date`, `Boolean`, `Select`). |
| `FilterOptions`    | `IEnumerable<FilterOption>`        | -         | Options for `Select` filter type.                                     |
| `HeaderClass`      | `string?`                          | -         | Custom CSS class for the header cell.                                 |
| `CellClass`        | `string?`                          | -         | Custom CSS class for body cells.                                      |
| `Ellipsis`         | `bool`                             | `false`   | Truncate text with ellipsis if it exceeds width.                      |
| `EllipsisMaxWidth` | `string?`                          | `"200px"` | Max width for ellipsis truncation.                                    |
| `Template`         | `RenderFragment<TItem>`            | -         | Custom template for cell content.                                     |
| `HeaderTemplate`   | `RenderFragment`                   | -         | Custom template for header content.                                   |
| `FilterTemplate`   | `RenderFragment<FilterContext>`    | -         | Custom template for filter input.                                     |
| `Exportable`       | `bool`                             | `true`    | Whether to include this column in exports.                            |

## Examples

### Basic Column

```razor
<BwDataGridColumn TItem="Employee" Field="@(e => e.Name)" Title="Name" />
```

### Formatted Column

```razor
<BwDataGridColumn TItem="Employee" Field="@(e => e.Salary)" Title="Salary" Format="C2" Align="TextAlign.Right" />
```

### Custom Template

```razor
<BwDataGridColumn TItem="Employee" Title="Status">
    <Template Context="employee">
        <span class="badge @(employee.IsActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")">
            @(employee.IsActive ? "Active" : "Inactive")
        </span>
    </Template>
</BwDataGridColumn>
```

### Select Filter

```razor
<BwDataGridColumn TItem="Employee" Field="@(e => e.Department)" 
                  Title="Department" 
                  FilterType="FilterType.Select" 
                  FilterOptions="@departmentOptions" />
```
