# Switch

A toggle component used to switch between On/Off states.

## Features

* **Appearance:** Modern toggle switch design.
* **Sizes:** Small, Medium, Large.
* **Color:** Color option for the active state.

## Usage

```razor
<BwSwitch Label="Enable Notifications" @bind-Value="notificationsEnabled" />
```

### Colored

```razor
<BwSwitch Label="Dark Mode" Color="BwColor.Dark" @bind-Value="isDarkMode" />
```

### Validation

```razor
<BwSwitch @bind-Value="model.IsActive" 
          For="@(() => model.IsActive)" 
          Label="Account Active" />
```

## Parameters

| Parameter      | Type                     | Default   | Description                                       |
| :------------- | :----------------------- | :-------- | :------------------------------------------------ |
| `Value`        | `bool`                   | `false`   | Switch state (two-way binding).                   |
| `Label`        | `string`                 | `null`    | Label text next to the switch.                    |
| `ChildContent` | `RenderFragment`         | `null`    | Custom content that can replace the label.        |
| `Color`        | `BwColor`                | `Primary` | Color in the active (On) state.                   |
| `Size`         | `BwSize`                 | `Medium`  | Size (`Small`, `Medium`, `Large`).                |
| `IsRequired`   | `bool`                   | `false`   | Shows required field indicator.                   |
| `IsDisabled`   | `bool`                   | `false`   | Disables the component.                           |
| `HelperText`   | `string`                 | `null`    | Helper text.                                      |
| `IsValid`      | `bool`                   | `true`    | Manual validation state.                          |
| `ErrorMessage` | `string`                 | `null`    | Manual error message.                             |
| `For`          | `Expression<Func<bool>>` | `null`    | Boolean field reference for automatic validation. |

## Events

| Event              | Payload | Description                                         |
| :----------------- | :------ | :-------------------------------------------------- |
| `ValueChanged`     | `bool`  | Triggered when the state changes (two-way binding). |
| `IsCheckedChanged` | `bool`  | Triggered at the same time as `ValueChanged`.       |
| `OnChange`         | `bool`  | Triggered after the change.                         |