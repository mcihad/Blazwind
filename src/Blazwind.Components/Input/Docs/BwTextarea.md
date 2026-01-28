# Textarea

A component used for long text input. Inherits `BwBaseInput` features and supports automatic validation.

## Features

* **Auto Resize:** Height increases as content is entered using `AutoResize`.
* **Counter:** Displays a character counter when `MaxLength` is set.
* **Row Control:** Manage row count using `Rows`, `MinRows`, and `MaxRows`.

## Usage

### Basic Usage

```razor
<BwTextarea Label="Description" Placeholder="Write details here..." Rows="4" />
```

### Auto Resize

```razor
<BwTextarea Label="Comment" AutoResize="true" MinRows="2" MaxRows="5" />
```

### Character Limit

```razor
<BwTextarea Label="Short Bio" MaxLength="200" ShowCounter="true" />
```

### Automatic Validation

```razor
<BwTextarea @bind-Value="form.Description" For="@(() => form.Description)" Label="Description" />
```

## Parameters

| Parameter       | Type                       | Default  | Description                                        |
| :-------------- | :------------------------- | :------- | :------------------------------------------------- |
| `Value`         | `string`                   | `null`   | Text value (two-way binding).                      |
| `Label`         | `string`                   | `null`   | Field label.                                       |
| `Placeholder`   | `string`                   | `null`   | Placeholder text.                                  |
| `Rows`          | `int`                      | `3`      | Number of visible rows.                            |
| `AutoResize`    | `bool`                     | `false`  | Automatically adjusts height based on content.     |
| `MinRows`       | `int`                      | `2`      | Minimum rows for AutoResize.                       |
| `MaxRows`       | `int`                      | `10`     | Maximum rows for AutoResize.                       |
| `MaxLength`     | `int?`                     | `null`   | Maximum character count.                           |
| `ShowCounter`   | `bool`                     | `true`   | Shows character counter (when `MaxLength` is set). |
| `LabelPosition` | `BwLabelPosition`          | `Top`    | Label position (`Top`, `Left`, `Hidden`).          |
| `HelpTextMode`  | `BwHelpTextMode`           | `Inline` | Helper text mode (`Inline`, `Popup`).              |
| `IsDisabled`    | `bool`                     | `false`  | Disables the component.                            |
| `IsReadOnly`    | `bool`                     | `false`  | Makes the field read-only.                         |
| `IsRequired`    | `bool`                     | `false`  | Shows required indicator (*).                      |
| `IsValid`       | `bool`                     | `true`   | Manual validation state.                           |
| `ErrorMessage`  | `string`                   | `null`   | Manual error message.                              |
| `For`           | `Expression<Func<string>>` | `null`   | Field reference for automatic validation.          |

## Events

| Event          | Payload           | Description                                                |
| :------------- | :---------------- | :--------------------------------------------------------- |
| `ValueChanged` | `string`          | Triggered whenever the value changes.                      |
| `OnChange`     | `string`          | Triggered when the value changes or the field loses focus. |
| `OnInput`      | `ChangeEventArgs` | Triggered on every keystroke.                              |