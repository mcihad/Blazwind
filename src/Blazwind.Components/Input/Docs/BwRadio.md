# Radio & Radio Group

Components used to create a single-selection group. Supports a dynamic list via `Data` or manual `BwRadio` definitions.

## Features

* **Dynamic Data:** Generic list binding via the `Data` parameter.
* **Two-Way Binding:** Support for `Value` and `ValueChanged`.
* **Validation:** Automatic validation via the `For` parameter.
* **Layout:** `Orientation` (vertical/horizontal) and `Size` settings.

## Usage

### Manual Usage

```razor
<BwRadioGroup Name="options" @bind-Value="selectedOption">
    <BwRadio Value="@("opt1")" Label="Option 1" />
    <BwRadio Value="@("opt2")" Label="Option 2" />
</BwRadioGroup>
```

### Data API Usage

```razor
<BwRadioGroup Data="@cities" 
              @bind-Value="selectedCity"
              ItemValue="@(x => x.Id)"
              ItemText="@(x => x.Name)"
              Orientation="BwOrientation.Horizontal" />
```

### Automatic Validation

```razor
<BwRadioGroup @bind-Value="model.Gender" 
              For="@(() => model.Gender)"
              Data="@genders" />
```

## Parameters

### BwRadioGroup (Group-Based)

| Parameter      | Type                       | Default    | Description                               |
| :------------- | :------------------------- | :--------- | :---------------------------------------- |
| `Value`        | `TValue`                   | -          | Selected value (two-way binding).         |
| `Data`         | `IEnumerable<TItem>`       | `null`     | Dynamic data source.                      |
| `ItemText`     | `Func<TItem, string>`      | -          | Display text selector.                    |
| `ItemValue`    | `Func<TItem, TValue>`      | -          | Value selector.                           |
| `Name`         | `string`                   | `null`     | Group name (HTML `name` attribute).       |
| `Orientation`  | `BwOrientation`            | `Vertical` | Layout (`Vertical`, `Horizontal`).        |
| `Size`         | `BwSize`                   | `Medium`   | Size (`Small`, `Medium`, `Large`).        |
| `IsDisabled`   | `bool`                     | `false`    | Disables the entire group.                |
| `IsValid`      | `bool`                     | `true`     | Manual validation state.                  |
| `ErrorMessage` | `string`                   | `null`     | Manual error message.                     |
| `For`          | `Expression<Func<TValue>>` | `null`     | Field reference for automatic validation. |

### BwRadio (Single)

| Parameter    | Type     | Default | Description                            |
| :----------- | :------- | :------ | :------------------------------------- |
| `Value`      | `TValue` | -       | Value represented by the radio button. |
| `Label`      | `string` | `null`  | Display label.                         |
| `IsDisabled` | `bool`   | `false` | Disables the individual radio button.  |

## Events

| Event          | Payload  | Description                                             |
| :------------- | :------- | :------------------------------------------------------ |
| `ValueChanged` | `TValue` | Triggered when the selection changes (two-way binding). |
| `OnChange`     | `TValue` | Triggered after the selection changes.                  |
