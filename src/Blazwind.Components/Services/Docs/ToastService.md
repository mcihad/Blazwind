# ToastService

`ToastService` is the .NET wrapper around the Blazwind toast module. It lets you show transient notifications with optional actions.

## Registration

`ToastService` is registered automatically when you call:

```csharp
builder.Services.AddBlazwind();
```

## Usage

Inject the service into your component:

```razor
@inject ToastService ToastService
```

Show a standard toast:

```csharp
await ToastService.SuccessAsync("Saved successfully", "Success");
```

## API

| Method | Description |
| --- | --- |
| `SuccessAsync(message, title, duration)` | Success notification. |
| `ErrorAsync(message, title, duration)` | Error notification. |
| `WarningAsync(message, title, duration)` | Warning notification. |
| `InfoAsync(message, title, duration)` | Info notification. |
| `ShowAsync(options)` | Fully customized toast. |
| `RemoveAsync(id)` | Removes a toast by id. |
| `ClearAsync()` | Removes all toasts. |

## ToastOptions

```csharp
await ToastService.ShowAsync(new ToastOptions
{
    Title = "Upload",
    Message = "Uploading file...",
    Color = BwColor.Info,
    Position = BwToastPosition.BottomRight,
    Duration = 4000,
    ShowProgress = true,
    ShowClose = true,
    Actions = new List<ToastAction>
    {
        new ToastAction
        {
            Text = "Cancel",
            Color = BwColor.Danger,
            OnClick = async () => await CancelUpload()
        }
    }
});
```

## Security Notes

- Title, message, and action text are HTML-escaped in the JavaScript layer to prevent script injection.
- The service holds references to action callbacks; call `ClearAsync()` to release them when no longer needed.
