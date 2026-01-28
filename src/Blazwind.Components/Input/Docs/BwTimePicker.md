# Time Picker

A component used for selecting time.

## Features

* **Format:** Hour and minute selection (24-hour format).
* **Validation:** Standard validation support.

## Usage

```razor
<BwTimePicker Label="Start Time" @bind-Value="startTime" />
```

### Validation

```razor
<BwTimePicker @bind-Value="model.Time" 
              For="@(() => model.Time)" 
              Label="Appointment Time" />
```

> **Note**
> This component uses the browser’s native time picker (`input type="time"`). The appearance depends on the user’s
> browser settings, but `Value` is always provided as `TimeSpan?`.

## Parameters

| Parameter       | Type              | Default  | Description                                           |
|:----------------|:------------------|:---------|:------------------------------------------------------|
| `Value`         | `TimeSpan?`       | `null`   | Selected time (two-way binding).                      |
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
|:---------------|:-----------------|:---------------------------------------------------|
| `ValueChanged` | `TimeSpan?`      | Triggered when the time changes (two-way binding). |
| `OnChange`     | `TimeSpan?`      | Triggered after the change.                        |
| `OnFocus`      | `FocusEventArgs` | Triggered when the field gains focus.              |
| `OnBlur`       | `FocusEventArgs` | Triggered when the field loses focus.              |