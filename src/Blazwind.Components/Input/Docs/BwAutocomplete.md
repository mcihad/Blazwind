# Autocomplete

An advanced list component that supports filtering, single selection, or multiple selection.

## Usage

### Single Selection

```razor
<BwAutocomplete Data="Cities" 
                Label="Search City" 
                Placeholder="Type a city..." 
                @bind-SelectedItem="selectedCity" />
```

### Multiple Selection

```razor
<BwAutocomplete Data="Skills" 
                Label="Skills" 
                Multiple="true" 
                MaxTags="5"
                @bind-SelectedItems="mySkills" />
```

### Asynchronous Search (Async Search)

For large data sets, server-side searching can be performed using `SearchFunc`.

```razor
<BwAutocomplete TItem="User" 
                Label="Search User" 
                SearchFunc="@SearchUsers" 
                ItemText="@(u => u.Name)" />

@code {
    private async Task<IEnumerable<User>> SearchUsers(string searchText)
    {
        // Example: API call
        return await Http.GetFromJsonAsync<List<User>>($"api/users?q={searchText}");
    }
}
```

### Creating New Items (AllowCreate)

Allows users to add items that are not present in the list.

```razor
<BwAutocomplete TItem="string" 
                Items="@tags" 
                AllowCreate="true" 
                OnCreateNew="@((val) => tags.Add(val))"
                Label="Tags" />
```

### Customization

You can define how data is displayed using the `ItemText` function.

```razor
<BwAutocomplete Items="Users" 
                ItemText="@(u => u.Name + " (" + u.Role + ")")" 
                Label="Select User" />
```

## Parameters

| Parameter       | Type                                     | Default       | Description                                   |
| :-------------- | :--------------------------------------- | :------------ | :-------------------------------------------- |
| `Value`         | `TItem`                                  | -             | Selected item (single selection).             |
| `SelectedItems` | `List<TItem>`                            | `null`        | Selected items (multiple selection).          |
| `Items`         | `IEnumerable<TItem>`                     | `null`        | Static data source.                           |
| `SearchFunc`    | `Func<string, Task<IEnumerable<TItem>>>` | `null`        | Asynchronous search function.                 |
| `ItemText`      | `Func<TItem, string>`                    | -             | Selector for the item’s display text.         |
| `Multiple`      | `bool`                                   | `false`       | Enables multiple selection.                   |
| `AllowCreate`   | `bool`                                   | `false`       | Allows creating new items.                    |
| `MaxTags`       | `int?`                                   | `null`        | Maximum number of tags in multiple selection. |
| `Placeholder`   | `string`                                 | `"Select..."` | Placeholder text.                             |
| `Label`         | `string`                                 | `null`        | Field label.                                  |
| `Size`          | `BwSize`                                 | `Medium`      | Size.                                         |
| `IsDisabled`    | `bool`                                   | `false`       | Disables the component.                       |
| `For`           | `Expression`                             | `null`        | Field reference for validation.               |

## Events

| Event                  | Payload       | Description                                              |
| :--------------------- | :------------ | :------------------------------------------------------- |
| `ValueChanged`         | `TItem`       | Triggered when the selection changes (single selection). |
| `SelectedItemsChanged` | `List<TItem>` | Triggered when selections change (multiple selection).   |
| `OnCreateNew`          | `string`      | Triggered when a new item is created.                    |
| `OnSearch`             | `string`      | Triggered when a search is performed.                    |
