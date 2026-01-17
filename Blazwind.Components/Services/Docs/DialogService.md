# DialogService

`DialogService` provides a powerful mechanism to show modal dialogs, alerts, confirmations, and dynamic Razor components.

## Interface

The service exposes several methods to show common dialogs or custom components.

### Usage

Inject the service into your component:

```razor
@inject DialogService DialogService
```

## Methods

### Alerts & Confirmations

Methods for showing standard system-like dialogs.

| Method | Description |
| :--- | :--- |
| `ShowAlertAsync(string title, string message, ...)` | Shows an information or alert dialog. |
| `ShowConfirmAsync(string title, string message, ...)` | Shows a confirmation dialog (Yes/No). |
| `ShowInputAsync(string title, string message, ...)` | Shows an input dialog to get text from user. |

#### Examples

```csharp
// Alert
await DialogService.ShowAlertAsync("Success", "Operation completed successfully!", BwColor.Success);

// Confirm
var confirmed = await DialogService.ShowConfirmAsync("Delete Item", "Are you sure?");
if (confirmed) {
    // Delete...
}

// Input
var name = await DialogService.ShowInputAsync("Enter Name", "What is your name?");
```

### Loading & Progress

Methods for showing non-blocking or blocking loading indicators.

| Method | Description | Returns |
| :--- | :--- | :--- |
| `ShowLoadingAsync(string message)` | Shows a standard loading spinner. | `LoadingHandle` |
| `ShowBusyAsync(string message)` | Shows a full-screen blocking busy indicator. | `LoadingHandle` |
| `ShowProgressAsync(string title, string message)` | Shows a progress bar dialog. | `ProgressHandle` |

#### Examples

```csharp
// Loading
var handle = await DialogService.ShowLoadingAsync("Loading data...");
await Task.Delay(2000);
await handle.CloseAsync();

// Progress
var progress = await DialogService.ShowProgressAsync("Processing", "Starting...");
await progress.UpdateAsync(50, "Halfway there...");
await progress.CloseAsync();
```

### Custom Razor Components

You can open any Blazor component as a dialog using `ShowAsync<T>`.

```csharp
var result = await DialogService.ShowAsync<MyDialogComponent>("My Custom Dialog");
```

#### Passing Parameters

```csharp
var parameters = new Dictionary<string, object> { { "UserId", 123 } };
var result = await DialogService.ShowAsync<EditUserDialog>("Edit User", parameters);

if (!result.Canceled && result.Data is User updatedUser) {
   // Handle result
}
```

#### Options

You can customize the dialog appearance with `DialogOptions`.

```csharp
var options = new DialogOptions 
{ 
    Width = "600px", 
    Draggable = true,
    CloseOnOverlayClick = false 
};
```
