# Transfer

An advanced data input component used to transfer multiple items between two lists. Commonly used for permission
assignment, staff selection, or category management.

## General Features

* **Bidirectional Transfer:** Move items from source to target list and back.
* **Search Support:** Real-time filtering within both lists.
* **Bulk Selection:** Select all / deselect all functionality.
* **Generic Structure:** Works with any model type (`TItem`).
* **Customizable:** Titles, height, and displayed text field can be configured.

## Usage Examples

### Basic Usage

Using a simple string list.

```razor
@code {
    List<string> AllItems = new() { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" };
    List<string> SelectedItems = new();
}

<BwTransfer DataSource="@AllItems" 
            @bind-TargetItems="@SelectedItems" />
```

### Usage with Complex Objects (Class)

Real-world scenario: user list.

```razor
@code {
    public class User { public int Id { get; set; } public string Name { get; set; } }
    
    List<User> Users = new() { ... };
    List<User> SelectedUsers = new();
}

<BwTransfer DataSource="@Users"
            @bind-TargetItems="@SelectedUsers"
            TextSelector="@(u => u.Name)"
            ValueSelector="@(u => u.Id)"
            Titles="@(new[] { "All Staff", "Selected" })"
            ShowSearch="true" />
```

## Parameters

| Parameter           | Type                             | Default                | Description                                         |
|:--------------------|:---------------------------------|:-----------------------|:----------------------------------------------------|
| `DataSource`        | `IEnumerable<TItem>`             | `null`                 | List of all items.                                  |
| `TargetItems`       | `IList<TItem>`                   | `new List<TItem>()`    | Selected (right-side) items list (two-way binding). |
| `TextSelector`      | `Func<TItem, string>`            | -                      | Selector for the item’s display text.               |
| `ValueSelector`     | `Func<TItem, object>`            | -                      | Selector for the item’s unique value.               |
| `Titles`            | `string[]`                       | `["Source", "Target"]` | List titles.                                        |
| `ShowSearch`        | `bool`                           | `false`                | Shows the search input.                             |
| `SearchPlaceholder` | `string`                         | `"Search..."`          | Search input placeholder.                           |
| `Height`            | `string`                         | `"300px"`              | List height.                                        |
| `IsDisabled`        | `bool`                           | `false`                | Disables the entire component.                      |
| `For`               | `Expression<Func<IList<TItem>>>` | `null`                 | Field reference for validation.                     |

## Events

| Event                | Payload                    | Description                                                       |
|:---------------------|:---------------------------|:------------------------------------------------------------------|
| `TargetItemsChanged` | `List<TItem>`              | Triggered when the selected items list changes (two-way binding). |
| `OnTransfer`         | `TransferEventArgs<TItem>` | Triggered when items are transferred between lists.               |