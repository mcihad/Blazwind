# Toast

A service-based component for displaying temporary notifications to the user.

## Usage

Inject `ToastService` to use it.

```csharp
@inject ToastService ToastService

<BwButton OnClick="ShowToast">Show Notification</BwButton>

@code {
    private async Task ShowToast()
    {
        await ToastService.SuccessAsync("Operation completed successfully.", "Success");
    }
}
```

## Methods

*   `SuccessAsync(message, title, duration)`: Shows a success notification.
*   `ErrorAsync(message, title, duration)`: Shows an error notification.
*   `WarningAsync(message, title, duration)`: Shows a warning notification.
*   `InfoAsync(message, title, duration)`: Shows an info notification.
*   `ShowAsync(options)`: Shows a notification with custom options.

## ToastOptions

For more customization, use the `ShowAsync` method:

```csharp
await ToastService.ShowAsync(new ToastOptions
{
    Message = "Uploading file...",
    Title = "Upload",
    Color = BwColor.Info,
    Position = BwToastPosition.BottomRight,
    ShowProgress = true,
    Duration = 5000
});
```

*   **Position:** Notification position (`TopRight`, `TopLeft`, `BottomRight`, `BottomLeft`, etc.).
*   **Duration:** Display duration in milliseconds.
*   **ShowProgress:** Show a progress bar.
*   **ShowClose:** Show a close button.

## Security Notes

Toast titles/messages/actions are HTML-escaped in the JavaScript layer. Treat input as plain text to avoid markup injection.
