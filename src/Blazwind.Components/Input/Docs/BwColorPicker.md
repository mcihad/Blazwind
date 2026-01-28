# Color Picker

A component that provides a palette and HEX input for color selection.

## Usage

```razor
<BwColorPicker Label="Theme Color" @bind-Value="themeColor" />
<BwColorPicker Label="Palette Only" ShowInput="false" />
```

> [!NOTE]
> This component uses the browser’s native color picker (`input type="color"`). Some browsers may support the
`PresetColors` parameter differently (e.g., as a datalist).

## Parameters

| Parameter      | Type         | Default     | Description                                                           |
|:---------------|:-------------|:------------|:----------------------------------------------------------------------|
| `Value`        | `string`     | `"#3B82F6"` | Selected color (HEX format, two-way binding).                         |
| `Label`        | `string`     | `null`      | Field label.                                                          |
| `ShowInput`    | `bool`       | `false`     | Displays a text input showing the HEX value next to the color picker. |
| `PresetColors` | `string[]`   | `null`      | Predefined color list for quick selection (HEX).                      |
| `Size`         | `BwSize`     | `Medium`    | Size.                                                                 |
| `IsDisabled`   | `bool`       | `false`     | Disables the component.                                               |
| `IsValid`      | `bool`       | `true`      | Manual validation state.                                              |
| `ErrorMessage` | `string`     | `null`      | Manual error message.                                                 |
| `For`          | `Expression` | `null`      | Field reference for validation.                                       |

## Events

| Event          | Payload  | Description                                         |
|:---------------|:---------|:----------------------------------------------------|
| `ValueChanged` | `string` | Triggered when the color changes (two-way binding). |
| `OnChange`     | `string` | Triggered after the change.                         |
