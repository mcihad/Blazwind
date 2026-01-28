# Slider

A component used to select numeric values by sliding.

## Features

* **Range:** `Min`, `Max`, and `Step` settings.
* **Value Display:** Real-time value display with `ShowValue`.
* **Format:** Number formatting with `ValueFormat` (e.g., C2, N0).
* **Orientation:** Can be used horizontally or vertically (`IsVertical`).

## Usage

```razor
<BwSlider Label="Volume" @bind-Value="volume" Min="0" Max="100" />
```

### Stepped with Value Display

```razor
<BwSlider Label="Price" 
          Min="0" Max="1000" Step="50" 
          ShowValue="true" 
          ValueFormat="C0" 
          @bind-Value="price" />
```

### Vertical Slider

```razor
<BwSlider Label="Volume" 
          IsVertical="true" 
          VerticalHeight="300px"
          @bind-Value="volume" />
```

### Validation

```razor
<BwSlider @bind-Value="model.Age" 
          For="@(() => model.Age)" 
          Label="Age" 
          Min="18" Max="99" />
```

## Parameters

| Parameter        | Type         | Default   | Description                                |
|:-----------------|:-------------|:----------|:-------------------------------------------|
| `Value`          | `double`     | `0`       | Current value (two-way binding).           |
| `Min`            | `double`     | `0`       | Minimum value.                             |
| `Max`            | `double`     | `100`     | Maximum value.                             |
| `Step`           | `double`     | `1`       | Increment step.                            |
| `ShowValue`      | `bool`       | `true`    | Shows the current value next to the label. |
| `ValueFormat`    | `string`     | `"0"`     | Value display format (C# format string).   |
| `ShowMarks`      | `bool`       | `false`   | Shows value markers under the track.       |
| `Marks`          | `double[]`   | `null`    | Custom list of value markers to display.   |
| `Color`          | `BwColor`    | `Primary` | Fill color.                                |
| `Size`           | `BwSize`     | `Medium`  | Slider and thumb size.                     |
| `IsVertical`     | `bool`       | `false`   | Displays in vertical orientation.          |
| `VerticalHeight` | `string`     | `"200px"` | Height of the vertical slider.             |
| `Label`          | `string`     | `null`    | Field label.                               |
| `IsDisabled`     | `bool`       | `false`   | Disables the component.                    |
| `For`            | `Expression` | `null`    | Field reference for validation.            |

## Events

| Event          | Payload  | Description                                             |
|:---------------|:---------|:--------------------------------------------------------|
| `ValueChanged` | `double` | Triggered whenever the value changes (two-way binding). |
| `OnChange`     | `double` | Triggered when the change is completed.                 |