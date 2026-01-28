# Copy Button

A utility button component used to copy text or code blocks to the clipboard with visual feedback.

## Features

- ✅ Clipboard API support for modern browsers.
- ✅ Visual feedback with spinners and checkmarks.
- ✅ Customizable icons, text, and tooltips.
- ✅ `OnCopied` callback for extended logic.
- ✅ Dark mode support.

## Basic Usage

```razor
@* Simple copy button *@
<BwCopyButton Content="Text to copy" />

@* Customized copy button *@
<BwCopyButton 
    Content="npm install blazwind" 
    Text="Copy Command" 
    Icon="fa-solid fa-terminal"
    OnCopied="@HandleCopied" />

@* Icon only *@
<BwCopyButton Content="Kopyalandı!" ShowText="false" />
```

## Parameters

| Parameter        | Type            | Default                | Description                                              |
|------------------|-----------------|------------------------|----------------------------------------------------------|
| `Content`        | `string`        | (Required)             | The text content to be copied to the clipboard.          |
| `Text`           | `string`        | `"Copy"`               | The button label.                                        |
| `CopiedText`     | `string`        | `"Kopyalandı"`         | The label shown after a successful copy.                 |
| `Icon`           | `string`        | `"fa-regular fa-copy"` | The icon displayed inside the button.                    |
| `Tooltip`        | `string`        | `"Panoya kopyala"`     | Tooltip text shown on hover.                             |
| `CopiedTooltip`  | `string`        | `"Kopyalandı!"`        | Tooltip text shown after successful copy.                |
| `ShowText`       | `bool`          | `true`                 | If `true`, the text label is displayed next to the icon. |
| `CopiedDuration` | `int`           | `2000`                 | Duration (ms) to show the "Copied" state.                |
| `OnCopied`       | `EventCallback` | -                      | Triggered after the content is successfully copied.      |
| `Class`          | `string?`       | `null`                 | Additional CSS classes for the button.                   |
| `Style`          | `string?`       | `null`                 | Inline CSS styles.                                       |

## Examples

### Code Block with Copy Button

A common pattern for documentation or code snippets.

```razor
<div class="relative bg-gray-900 rounded p-4 font-mono text-sm text-gray-100">
    <div class="absolute top-2 right-2">
        <BwCopyButton Content="@codeContent" ShowText="false" />
    </div>
    <pre>@codeContent</pre>
</div>

@code {
    private string codeContent = "var x = 10;";
}
```
