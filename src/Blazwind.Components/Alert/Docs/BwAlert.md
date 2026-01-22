# BwAlert
A static alert component used for providing contextual feedback messages, warnings, and error notifications to users.

## Examples

### Soft (Default)
The most common alert style with a subtle background and colored text.

```razor
<BwAlert Color="BwColor.Info" 
         Title="Information" 
         Message="This is an information message." />

<BwAlert Color="BwColor.Success" 
         Title="Success" 
         Message="The process has been completed successfully." />
```

### Outline
Transparent background with a colored border.

```razor
<BwAlert Color="BwColor.Warning" 
         Variant="BwVariant.Outline"
         Title="Warning" 
         Message="Please proceed with caution." />
```

### Filled
Solid background with white text.

```razor
<BwAlert Color="BwColor.Danger" 
         Variant="BwVariant.Filled"
         Title="Error" 
         Message="Something went wrong." />
```

### Dismissible
Alerts that can be closed by the user.

```razor
<BwAlert Color="BwColor.Info" 
         Message="This message can be dismissed." 
         Dismissible="true" />
```

### Actions
Alerts containing buttons or other interactive elements.

```razor
<BwAlert Color="BwColor.Warning" 
         Title="Session Timeout">
    <Actions>
        <BwButton Text="Extend" Size="BwSize.Small" Color="BwColor.Warning" />
    </Actions>
</BwAlert>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Title` | `string?` | `null` | The title of the alert. |
| `Message` | `string?` | `null` | The main message content of the alert. |
| `Color` | `BwColor` | `BwColor.Info` | The color theme of the alert (Success, Danger, Warning, etc.). |
| `Variant` | `BwVariant` | `BwVariant.Soft` | The visual style (Soft, Outline, Filled, Ghost). |
| `Icon` | `string?` | `null` | Custom icon class (e.g., "fa-solid fa-star"). If null, a default icon based on `Color` is used. |
| `ShowIcon` | `bool` | `true` | Whether to display the icon. |
| `Dismissible` | `bool` | `false` | If `true`, displays a close button in the top-right corner. |
| `ChildContent` | `RenderFragment?` | `null` | Custom content area. |
| `Actions` | `RenderFragment?` | `null` | Area for action buttons at the bottom. |
| `Class` | `string?` | `null` | Additional CSS classes for the container. |
