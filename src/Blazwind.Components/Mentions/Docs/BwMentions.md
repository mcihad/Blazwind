# Mentions

A textarea component with interactive @-mention functionality for tagging users, groups, or entities.

## Features

- **Triggered Suggestions**: Automatically opens a suggestion menu when the `Prefix` (default `@`) is typed.
- **Rich Items**: Supports icons/avatars and descriptions for suggestion items.
- **Keyboard Navigation**: Use arrow keys and Enter/Tab to select suggestions seamlessly.
- **Custom Triggers**: Configure any character (like `#` for hashtags) as the trigger.
- **Event Callbacks**: Fired when a mention is selected or content changes.

## Usage

```razor
@using Blazwind.Components.Mentions

<BwMentions @bind-Value="_text" 
            Mentions="_users"
            OnMention="HandleMention"
            Placeholder="Tell us what you think... @member" />

@code {
    private string _text = "";
    
    private List<BwMentionItem> _users = new()
    {
        new() { Label = "John Doe", Value = "johndoe", Avatar = "avatar1.png" },
        new() { Label = "Jane Smith", Value = "janesmith", Description = "Lead Designer" }
    };
    
    private void HandleMention(BwMentionItem item)
    {
        // Logic when a user is tagged
    }
}
```

### Custom Trigger (Prefix)
You can change the default `@` character to something else, for example `#` for hashtags.

```razor
<BwMentions @bind-Value="_comment"
            Mentions="_tags"
            Prefix="#"
            Placeholder="Use # for tags" />
```

## Parameters

### BwMentions

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `""` | The current text content (Supports two-way binding). |
| `Mentions` | `List<BwMentionItem>` | `new()` | List of available items for suggestions. |
| `Prefix` | `string` | `"@"` | The trigger character that opens the menu. |
| `Placeholder` | `string` | `null` | Hint text displayed when empty. |
| `Rows` | `int` | `3` | Number of visible text lines. |
| `Size` | `BwSize` | `Medium` | Overall size of the input. |
| `Color` | `BwColor` | `Primary` | Theme color used for focus states. |
| `Variant` | `BwVariant` | `Outline` | Visual style (`Outline`, `Filled`, `Ghost`). |
| `IsDisabled` | `bool` | `false` | Disables the component. |

### BwMentionItem

| Property | Type | Description |
| :--- | :--- | :--- |
| `Label` | `string` | Display name in the suggestion list. |
| `Value` | `string` | The technical value added to the text (falls back to Label if null). |
| `Avatar` | `string` | Image URL for the suggestion item. |
| `Description` | `string` | Subtext shown below the label. |

## Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Fired when the text content changes. |
| `OnMention` | `BwMentionItem` | Fired when a suggestion is selected. |
| `OnKeyDown` | `KeyboardEventArgs` | Bubbles up standard keydown events from the textarea. |
