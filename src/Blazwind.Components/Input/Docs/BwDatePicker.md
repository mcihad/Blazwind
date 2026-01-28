# Date Picker

A component used for date selection. By default, it uses the Turkish (tr-TR) culture.

## Features

* **Format:** Automatic date formatting.
* **Range:** `Min` and `Max` date constraints.
* **Modes:** Date-only selection (for now).

## Usage

```razor
<BwDatePicker Label="Birth Date" @bind-Value="birthDate" />
```

### Range Constraint

```razor
<BwDatePicker Label="Appointment Date" 
              Min="@DateTime.Now" 
              Max="@DateTime.Now.AddDays(30)" />
```

### Validation

```razor
<BwDatePicker @bind-Value="model.Date" 
              For="@(() => model.Date)" 
              Label="Transaction Date" />
```

> [!NOTE]
> This component uses the browser’s native date picker (`input type="date"`). The appearance (calendar language, date format) depends on the user’s browser settings, but `Value` is always provided as a standard `DateTime`.

## Parameters

| Parameter       | Type              | Default  | Description                                           |
| :-------------- | :---------------- | :------- | :---------------------------------------------------- |
| `Value`         | `DateTime?`       | `null`   | Selected date (two-way binding).                      |
| `Min`           | `DateTime?`       | `null`   | Earliest selectable date.                             |
| `Max`           | `DateTime?`       | `null`   | Latest selectable date.                               |
| `Label`         | `string`          | `null`   | Field label.                                          |
| `LabelPosition` | `BwLabelPosition` | `Top`    | Label position (`Top`, `Left`, `Floating`, `Hidden`). |
| `Size`          | `BwSize`          | `Medium` | Size.                                                 |
| `IsDisabled`    | `bool`            | `false`  | Disables the component.                               |
| `IsReadOnly`    | `bool`            | `false`  | Makes the field read-only.                            |
| `IsValid`       | `bool`            | `true`   | Manual validation state.                              |
| `ErrorMessage`  | `string`          | `null`   | Manual error message.                                 |
| `For`           | `Expression`      | `null`   | Field reference for validation.                       |

## Events

| Event          | Payload          | Description                                        |
| :------------- | :--------------- | :------------------------------------------------- |
| `ValueChanged` | `DateTime?`      | Triggered when the date changes (two-way binding). |
| `OnChange`     | `DateTime?`      | Triggered after the change.                        |
| `OnFocus`      | `FocusEventArgs` | Triggered when the field gains focus.              |
| `OnBlur`       | `FocusEventArgs` | Triggered when the field loses focus.              |
