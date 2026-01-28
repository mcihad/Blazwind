# Checkbox

A component used for binary (boolean) state selection.

## Features

* **Sizes:** Small, Medium, Large.
* **Color:** Supports colors such as Primary, Success, Danger, etc.
* **Validation:** Boolean validation using `For` (e.g., accepting terms of use).

## Usage

```razor
<BwCheckbox Label="Remember me" @bind-Value="rememberMe" />
```

### Colored and Sized

```razor
<BwCheckbox Label="I approve" 
            Color="BwColor.Success" 
            Size="BwSize.Large" 
            @bind-Value="isApproved" />
```

### Validation

```razor
<BwCheckbox Label="I accept the terms" 
            @bind-Value="model.AcceptTerms" 
            For="@(() => model.AcceptTerms)" />
```

## Parameters

| Parameter      | Type                     | Default   | Description                                                                 |
| :------------- | :----------------------- | :-------- | :-------------------------------------------------------------------------- |
| `Value`        | `bool`                   | `false`   | Selection state (two-way binding).                                          |
| `Label`        | `string`                 | `null`    | Label text displayed next to the checkbox.                                  |
| `ChildContent` | `RenderFragment`         | `null`    | Custom content that can replace the label.                                  |
| `Color`        | `BwColor`                | `Primary` | Color in the active state.                                                  |
| `Size`         | `BwSize`                 | `Medium`  | Size (`Small`, `Medium`, `Large`).                                          |
| `IsRequired`   | `bool`                   | `false`   | Displays the required field indicator.                                      |
| `IsDisabled`   | `bool`                   | `false`   | Disables the component.                                                     |
| `HelperText`   | `string`                 | `null`    | Helper text.                                                                |
| `IsValid`      | `bool`                   | `true`    | Manual validation state.                                                    |
| `ErrorMessage` | `string`                 | `null`    | Manual error message.                                                       |
| `For`          | `Expression<Func<bool>>` | `null`    | Boolean field reference for automatic validation (e.g., contract approval). |

## Events

| Event              | Payload | Description                                         |
| :----------------- | :------ | :-------------------------------------------------- |
| `ValueChanged`     | `bool`  | Triggered when the value changes (two-way binding). |
| `IsCheckedChanged` | `bool`  | Triggered at the same time as `ValueChanged`.       |
| `OnChange`         | `bool`  | Triggered after the change.                         |
