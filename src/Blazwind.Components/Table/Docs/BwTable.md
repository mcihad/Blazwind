# Table

A comprehensive data grid component for listing, sorting, filtering, and paging data.

## Examples

### Basic Usage

```razor
<BwTable TItem="Product" Items="@products">
    <BwTableColumn TItem="Product" Title="ID" Field="@(x => x.Id)" />
    <BwTableColumn TItem="Product" Title="Name" Field="@(x => x.Name)" />
    <BwTableColumn TItem="Product" Title="Price" Field="@(x => x.Price)">
        <Template>
            @context.Price.ToString("C")
        </Template>
    </BwTableColumn>
</BwTable>
```

### Pagination

Enable client-side pagination using `EnablePagination="true"`.

```razor
<BwTable Items="@data" EnablePagination="true" PageSize="10">
    <!-- Columns -->
</BwTable>
```

### Selection

Use `SelectionMode` to enable row selection (`Single` or `Multiple`).
Access selected items via `SelectedItems` (Two-way binding).

```razor
<BwTable Items="@data" 
         SelectionMode="BwSelectionMode.Multiple" 
         @bind-SelectedItems="selectedProducts">
    <!-- Columns -->
</BwTable>
```

### Column Selector

Enable the `ShowColumnSelector="true"` parameter to let users toggle column visibility at runtime.

### Styling

* **Compact**: Reduces cell padding (`true`/`false`).
* **Bordered**: Adds borders to the table and cells (`true`/`false`).
* **Hoverable**: Highlights rows on mouse hover (`true`/`false`).
* **Striped**: Adds zebra striping to rows (`true`/`false`).
* **IsLoading**: Shows a loading overlay (`true`/`false`).
* **LoadingContent**: Custom content for the loading overlay (`RenderFragment`).

### Columns

For column details, see [TableColumn](Table/Docs/BwTableColumn.md).
