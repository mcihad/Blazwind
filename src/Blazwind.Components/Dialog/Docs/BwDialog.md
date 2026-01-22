# BwDialog

The `BwDialog` component and its associated `DialogService` provide a powerful way to display modal windows. It supports everything from simple alerts and confirmations to hosting complex Razor components with data exchange.

## Service Configuration

Register the service in your `Program.cs`:
```csharp
builder.Services.AddScoped<DialogService>();
```

Place the container in your `MainLayout.razor`:
```razor
<BwDialogContainer />
```

## Usage

### 1. Simple Utility Dialogs
Use the service to quickly show standard messages or gather input:

```csharp
@inject DialogService DialogService

// Simple Alert
await DialogService.ShowInfoAsync("Notification", "Data has been saved.");

// Confirmation
bool confirmed = await DialogService.ShowConfirmAsync("Confirm Delete", "Are you sure you want to delete this record?", BwColor.Danger);

// User Input
string? name = await DialogService.ShowInputAsync("Identify Yourself", "Please enter your name:");
```

### 2. Custom Razor Component Dialogs
You can open any Razor component as a modal:

```csharp
var parameters = new Dictionary<string, object> { { "UserId", 42 } };
var options = new DialogOptions { Width = "600px", Draggable = true };

var dialog = await DialogService.ShowAsync<UserEditForm>("Edit User", parameters, options);

if (!dialog.Canceled && dialog.Data != null)
{
    // Handle returned data
}
```

## API Reference

### DialogOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Width` | `string` | `"500px"` | CSS width of the dialog. |
| `Height` | `string` | `"auto"` | CSS height of the dialog. |
| `MaxWidth` | `string` | `"90vw"` | CSS max-width for responsiveness. |
| `FullScreen` | `bool` | `false` | When true, the dialog occupies the entire viewport. |
| `Draggable` | `bool` | `false` | Allows moving the dialog by dragging the header. |
| `Resizable` | `bool` | `false` | Allows resizing via the bottom-right corner. |
| `ShowClose` | `bool` | `true` | Displays the 'X' button in the header. |
| `TitleColor` | `BwColor`| `Primary` | Background color theme for the header. |
| `TitleSize` | `BwSize` | `Medium` | Font size and padding for the header. |

### DialogService Methods

#### Utility Dialogs
- `ShowAlertAsync(title, message, color)`: Show a simple alert.
- `ShowConfirmAsync(title, message, okText, cancelText, color)`: Ask for confirmation.
- `ShowInputAsync(title, message, placeholder, defaultValue)`: Prompt for text input.

#### Premium Feedback Dialogs
- `ShowLoadingAsync(message)`: Non-blocking loading modal. Returns a handle to close later.
- `ShowSquareLoadingAsync(message)`: Creative square-animation loading modal.
- `ShowPulseLoadingAsync(message, icon)`: Pulsing icon notification.
- `ShowProgressAsync(title, message)`: Modal with a progress bar. Use `UpdateAsync(int percent)` on the return object.
- `BusyAsync(Func<Task> work, message)`: Blocks the UI until the provided task is complete.
- `ShowCountdownAsync(title, message, seconds)`: Automatically closes after the time expires.

#### Specialized Visuals
- `ShowSuccessAnimationAsync(title, message)`: Play a checkmark animation.
- `ShowErrorAnimationAsync(title, message)`: Play a cross animation.
- `ShowImagePreviewAsync(url, title, description)`: High-fidelity image lightbox.

## Handling Dialog Results
Inside your custom component, receive the `DialogInstance` via a `CascadingParameter` to control the dialog:

```razor
@code {
    [CascadingParameter] DialogInstance Dialog { get; set; }
    [Inject] DialogService DialogService { get; set; }

    void Save() => DialogService.Close(Dialog, DialogResult.Ok(myData));
    void Cancel() => DialogService.Close(Dialog, DialogResult.Cancel());
}
```
