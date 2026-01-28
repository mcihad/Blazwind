### Advanced Features (Copy, Clear, Password)

The component natively supports commonly used helper functions.

```razor
<!-- Copy Button -->
<BwInputButton Label="Reference No" Value="REF-123456" ShowCopy="true" IsReadOnly="true" />

<!-- Clear Button -->
<BwInputButton Label="Search" @bind-Value="searchTerm" ShowClear="true" />

<!-- Show/Hide Password -->
<BwInputButton Label="Password" Type="password" ShowPasswordToggle="true" />
```

### Slots (Prepend / Append / Buttons)

```razor
<BwInputButton Label="Search">
    <PrependContent>
        <span class="px-3 text-gray-500">https://</span>
    </PrependContent>
    <Buttons>
        <BwButton Text="Go" Color="BwColor.Primary" />
    </Buttons>
    <AppendContent>
        <span class="px-3 text-gray-500">.com</span>
    </AppendContent>
</BwInputButton>
```

## Parameters

| Parameter            | Type             | Default  | Description                                            |
|:---------------------|:-----------------|:---------|:-------------------------------------------------------|
| `Value`              | `string`         | `null`   | Input value (two-way binding).                         |
| `Label`              | `string`         | `null`   | Field label.                                           |
| `Placeholder`        | `string`         | `null`   | Placeholder text.                                      |
| `Type`               | `string`         | `"text"` | Input type (`password`, `email`, etc.).                |
| `Size`               | `BwSize`         | `Medium` | Size (`Small`, `Medium`, `Large`).                     |
| `ShowClear`          | `bool`           | `false`  | Shows a clear (X) button when a value exists.          |
| `ShowCopy`           | `bool`           | `false`  | Shows a copy-to-clipboard button.                      |
| `ShowPasswordToggle` | `bool`           | `true`   | Show/hide button for password type (eye icon).         |
| `IsLoading`          | `bool`           | `false`  | Displays a loading icon.                               |
| `PrefixIcon`         | `string`         | `null`   | Icon class on the left side.                           |
| `SuffixIcon`         | `string`         | `null`   | Icon class on the right side.                          |
| `PrependContent`     | `RenderFragment` | `null`   | Content added to the far left (with gray background).  |
| `AppendContent`      | `RenderFragment` | `null`   | Content added to the far right (with gray background). |
| `Buttons`            | `RenderFragment` | `null`   | Buttons added to the right side.                       |
| `IsDisabled`         | `bool`           | `false`  | Disables the field.                                    |

## Events

| Event            | Payload  | Description                                 |
|:-----------------|:---------|:--------------------------------------------|
| `ValueChanged`   | `string` | Triggered when the value changes.           |
| `OnClick`        | `void`   | Triggered when the input field is clicked.  |
| `OnEnterPressed` | `void`   | Triggered when the Enter key is pressed.    |
| `OnClear`        | `void`   | Triggered when the clear button is clicked. |
