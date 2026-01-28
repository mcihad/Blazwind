# Input (Text Input)

This is the basic component used to receive text-based data from the user. It uses the `BwBaseInput` infrastructure and
supports all standard form features.

## Features

* **Sizing:** `Small`, `Medium`, `Large`.
* **Icons:** Support for adding icons to the left or right.
* **Validation:** `EditContext` integration and automatic error messages (`For` parameter).
* **Label Position:** `Top`, `Left`, `Floating` (floating label).
* **Helper Text:** `Inline` (below the field) or `Popup` (tooltip) modes.

## Usage

### Basic Usage

```razor
<BwInput Label="Your Name" Placeholder="Enter your name" @bind-Value="model.Name" />
```

### Usage with Icons

```razor
<BwInput Label="Search" IconLeft="fa-solid fa-search" Placeholder="Search..." />
<BwInput Label="Email" IconRight="fa-solid fa-envelope" Type="email" />
```

### Automatic Validation (For Parameter)

When the `For` parameter is provided, `IsValid` and `ErrorMessage` are managed automatically.

```razor
<BwInput @bind-Value="model.Email" 
         For="@(() => model.Email)" 
         Label="Email" />
```

### Label Positions

```razor
<BwInput Label="Floating Label" LabelPosition="BwLabelPosition.Floating" />
<BwInput Label="Left Label" LabelPosition="BwLabelPosition.Left" LabelWidth="120px" />
```

### Helper Texts

Helper texts can be displayed below the field (`Inline`) or with a question mark icon (`Popup`).

```razor
<!-- Inline (Default) -->
<BwInput Label="Password" 
         Type="password" 
         HelperText="Must be at least 8 characters." 
         HelpTextMode="BwHelpTextMode.Inline" />

<!-- Tooltip (Popup) -->
<BwInput Label="Username" 
         HelperText="Your unique name in the system." 
         HelpTextMode="BwHelpTextMode.Popup" />
```

### Event Callbacks

```razor
<BwInput Value="@_value" 
         ValueChanged="OnValueChanged"
         OnEnter="HandleEnter"
         OnInput="HandleInput"
         OnFocus="() => _isFocused = true"
         OnBlur="() => _isFocused = false" />
```

## BwInput Parameters

| Parameter       | Type                       | Default   | Description                                                    |
|:----------------|:---------------------------|:----------|:---------------------------------------------------------------|
| `Value`         | `string`                   | `null`    | Input value (supports two-way binding).                        |
| `Label`         | `string`                   | `null`    | Field label.                                                   |
| `Placeholder`   | `string`                   | `null`    | Placeholder text.                                              |
| `Type`          | `string`                   | `"text"`  | HTML input type (`text`, `password`, `email`, `number`, etc.). |
| `Size`          | `BwSize`                   | `Medium`  | Size (`Small`, `Medium`, `Large`).                             |
| `IconLeft`      | `string`                   | `null`    | Left icon CSS class (FontAwesome e.g. `fa-solid fa-user`).     |
| `IconRight`     | `string`                   | `null`    | Right icon CSS class.                                          |
| `LabelPosition` | `BwLabelPosition`          | `Top`     | Label position (`Top`, `Left`, `Floating`, `Hidden`).          |
| `LabelWidth`    | `string`                   | `"140px"` | Label width in `LabelPosition.Left` mode.                      |
| `HelperText`    | `string`                   | `null`    | Helper text content.                                           |
| `HelpTextMode`  | `BwHelpTextMode`           | `Inline`  | Helper text display mode (`Inline`, `Popup`).                  |
| `IsRequired`    | `bool`                     | `false`   | Shows the required field indicator (*).                        |
| `IsDisabled`    | `bool`                     | `false`   | Disables the field.                                            |
| `IsReadOnly`    | `bool`                     | `false`   | Makes the field read-only.                                     |
| `IsValid`       | `bool`                     | `true`    | Manual validation state.                                       |
| `ErrorMessage`  | `string`                   | `null`    | Manual error message.                                          |
| `For`           | `Expression<Func<string>>` | `null`    | Field reference for automatic validation.                      |
| `Density`       | `BwFormDensity`            | `Normal`  | Form density (`Compact`, `Normal`, `Relaxed`).                 |
| `Class`         | `string`                   | `null`    | Additional CSS classes.                                        |

## Events

| Event          | Payload           | Description                                                        |
|:---------------|:------------------|:-------------------------------------------------------------------|
| `ValueChanged` | `string`          | Triggered whenever the value changes (two-way binding).            |
| `OnChange`     | `string`          | Triggered when the value changes and the field loses focus (blur). |
| `OnInput`      | `ChangeEventArgs` | Triggered on every keystroke (native input event).                 |
| `OnEnter`      | `void`            | Triggered when the Enter key is pressed.                           |
| `OnFocus`      | `FocusEventArgs`  | Triggered when the field gains focus.                              |
| `OnBlur`       | `FocusEventArgs`  | Triggered when the field loses focus.                              |
