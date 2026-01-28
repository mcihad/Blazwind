# Tag Input

A component that allows users to enter free-text tags.

## Features

* **Keyboard Control:** Add tags using Enter, Tab, or Comma.
* **Deletion:** Remove tags using Backspace or the close icon.
* **Limit:** Set a maximum number of tags (`MaxTags`).
* **Uniqueness:** Prevent duplicate tags (`AllowDuplicates`).
* **Tooling:** `BwHelpTooltip` integration.

## Usage

```razor
<BwTagInput Label="Keywords" @bind-Tags="keywords" />
```

### With Validation

```razor
<BwTagInput Tags="keywords" 
            ErrorMessage="@errorMessage" 
            IsValid="@isValid" 
            HelpTextMode="BwHelpTextMode.Popup"
            HelperText="Please enter at least 3 tags" />
```

### Limited and Unique

Maximum of 5 tags and no duplicates allowed.

```razor
<BwTagInput MaxTags="5" AllowDuplicates="false" />
```

### Custom Trigger Keys

By default, `Enter`, `Tab`, and `,` add a new tag. You can customize this using `TriggerKeys`.

```razor
<BwTagInput @bind-Tags="myTags" 
            TriggerKeys="@(new[] { "Enter", " " })" 
            Placeholder="Add tag with space" />
```

## Parameters

| Parameter         | Type              | Default                 | Description                               |
|:------------------|:------------------|:------------------------|:------------------------------------------|
| `Tags`            | `List<string>`    | `new()`                 | Tag list (two-way binding).               |
| `MaxTags`         | `int?`            | `null`                  | Maximum number of tags that can be added. |
| `AllowDuplicates` | `bool`            | `false`                 | Allows adding duplicate tags.             |
| `TriggerKeys`     | `string[]`        | `["Enter", "Tab", ","]` | Keys that trigger tag creation.           |
| `Label`           | `string`          | `null`                  | Field label.                              |
| `Placeholder`     | `string`          | `"Add tag..."`          | Placeholder text.                         |
| `Size`            | `BwSize`          | `Medium`                | Size.                                     |
| `Color`           | `BwColor`         | `Primary`               | Tag color.                                |
| `IsDisabled`      | `bool`            | `false`                 | Disables the component.                   |
| `For`             | `Expression`      | `null`                  | Field reference for validation.           |
| `ErrorMessage`    | `string`          | `null`                  | Error message.                            |
| `IsValid`         | `bool`            | `true`                  | Validation state.                         |
| `HelperText`      | `string`          | `null`                  | Helper text.                              |
| `HelpTextMode`    | `BwHelpTextMode`  | `Inline`                | Helper text mode.                         |
| `LabelPosition`   | `BwLabelPosition` | `Top`                   | Label position.                           |

## Events

| Event          | Payload        | Description                                            |
|:---------------|:---------------|:-------------------------------------------------------|
| `TagsChanged`  | `List<string>` | Triggered when the tag list changes (two-way binding). |
| `OnTagAdded`   | `string`       | Triggered when a new tag is added.                     |
| `OnTagRemoved` | `string`       | Triggered when a tag is removed.                       |