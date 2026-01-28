# Select

Allows single or multiple selection from a dropdown list. Supports a generic data source via the `Data` parameter.

## Features

* **Data Source:** Generic list binding via the `Data` parameter.
* **Multiple Selection:** Select multiple items with `IsMultiple`.
* **Search:** Built-in search/filtering feature.
* **Validation:** Standard `For` validation support.

## Usage

### Usage with List (Data API)

```razor
<BwSelect Data="@users" 
          @bind-Value="selectedUserId" 
          ItemValue="@(u => u.Id)" 
          ItemText="@(u => u.Name)"
          Label="Select User" />
```

### Multiple Selection

```razor
<BwSelect Data="@roles"
          @bind-SelectedValues="selectedRoles"
          IsMultiple="true"
          Label="Roles" />
```

### Custom Options (Slot)

Instead of the `Items` parameter, manual `option` tags or custom content can also be used.

```razor
<BwSelect @bind-Value="selectedColor" Label="Color">
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
</BwSelect>
```

## Parameters

| Parameter        | Type                                | Default | Description                                                    |
| :--------------- | :---------------------------------- | :------ | :------------------------------------------------------------- |
| `Value`          | `TValue`                            | -       | Selected value (single selection, two-way binding).            |
| `SelectedValues` | `List<TValue>`                      | `null`  | List of selected values (multiple selection, two-way binding). |
| `Items`          | `IEnumerable<BwSelectItem<TValue>>` | `null`  | Data source.                                                   |
| `IsMultiple`     | `bool`                              | `false` | Enables multiple selection.                                    |
| `VisibleRows`    | `int`                               | `4`     | Number of visible rows in multiple selection mode.             |
| `Label`          | `string`                            | `null`  | Field label.                                                   |
| `Placeholder`    | `string`                            | `null`  | Placeholder (first empty option in single selection).          |
| `LabelPosition`  | `BwLabelPosition`                   | `Top`   | Label position (`Top`, `Left`, `Hidden`).                      |
| `IsDisabled`     | `bool`                              | `false` | Disables the component.                                        |
| `IsRequired`     | `bool`                              | `false` | Shows the required indicator.                                  |
| `IsValid`        | `bool`                              | `true`  | Manual validation state.                                       |
| `ErrorMessage`   | `string`                            | `null`  | Manual error message.                                          |
| `For`            | `Expression<Func<T>>`               | `null`  | Field reference for automatic validation.                      |

## Events

| Event                   | Payload                      | Description                                               |
| :---------------------- | :--------------------------- | :-------------------------------------------------------- |
| `ValueChanged`          | `TValue`                     | Triggered when the selection changes (single selection).  |
| `SelectedValuesChanged` | `List<TValue>`               | Triggered when selections change (multiple selection).    |
| `SelectedItemChanged`   | `BwSelectItem<TValue>`       | Triggered when the selected item object changes.          |
| `SelectedItemsChanged`  | `List<BwSelectItem<TValue>>` | Triggered when the list of selected item objects changes. |
