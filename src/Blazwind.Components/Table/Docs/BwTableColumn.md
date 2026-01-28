# TableColumn

Defines a column within a [Table](Table/Docs/BwTable.md) component.

## Examples

```razor
<BwTableColumn TItem="Product" Title="Product Name" Field="@(x => x.Name)" Sortable="true" />
```

## API - BwTableColumn

### Parameters

| Parameter          | Type                    | Default   | Description                                                       |
|:-------------------|:------------------------|:----------|:------------------------------------------------------------------|
| `Title`            | `string`                | `""`      | Column header title.                                              |
| `Field`            | `Func<TItem, object>`   | `null`    | Data accessing function for the cell content.                     |
| `Format`           | `string`                | `null`    | Format string for `IFormattable` types (e.g. "C2", "yyyy-MM-dd"). |
| `Width`            | `string`                | `null`    | Column width (e.g. "150px", "20%").                               |
| `Sortable`         | `bool`                  | `true`    | Whether the column can be sorted.                                 |
| `Visible`          | `bool`                  | `true`    | Visibility status of the column.                                  |
| `Ellipsis`         | `bool`                  | `false`   | Truncate long text with an ellipsis (...).                        |
| `EllipsisMaxWidth` | `string`                | `"200px"` | Maximum width when ellipsis is enabled.                           |
| `Template`         | `RenderFragment<TItem>` | `null`    | Custom template for the cell content.                             |
| `HeaderTemplate`   | `RenderFragment`        | `null`    | Custom template for the header cell.                              |
