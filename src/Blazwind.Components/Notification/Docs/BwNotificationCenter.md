# Notification Center

A centralized notification management component featuring a bell icon with an unread badge and a detailed dropdown
panel.

## Setup

1. Register the notification service in your `Program.cs`:

```csharp
builder.Services.AddSingleton<NotificationService>();
```

2. Place the component in your layout (e.g., in a Header or Toolbar):

```razor
@using Blazwind.Components.Notification

<BwNotificationCenter />
```

## Usage

### Adding Notifications

Inject the `NotificationService` anywhere in your application to push new notifications.

```csharp
@inject NotificationService NotificationService

void AddSampleNotifications()
{
    NotificationService.AddInfo("You have a new message");
    NotificationService.AddSuccess("Process completed successfully");
    NotificationService.AddWarning("Warning: Low disk space");
    NotificationService.AddError("Connection timeout occurred");
}
```

### Generic Notification

You can also use the base `Add` method for more control over titles and custom types.

```csharp
NotificationService.Add("Message content", NotificationType.Info, "Title");
```

## NotificationService Methods

| Method                      | Description                                  |
|:----------------------------|:---------------------------------------------|
| `Add(message, type, title)` | Adds a generic notification to the center.   |
| `AddInfo(message)`          | Shortcut to add an Info type notification.   |
| `AddSuccess(message)`       | Shortcut to add a Success type notification. |
| `AddWarning(message)`       | Shortcut to add a Warning type notification. |
| `AddError(message)`         | Shortcut to add an Error type notification.  |
| `MarkAsRead(id)`            | Marks a specific notification as viewed.     |
| `MarkAllAsRead()`           | Marks all existing notifications as read.    |
| `Remove(id)`                | Permanently deletes a notification.          |
| `ClearAll()`                | Flushes all notifications from the center.   |

## Service Properties

| Property                 | Description                                                     |
|:-------------------------|:----------------------------------------------------------------|
| `Notifications`          | Returns a read-only list of all current notifications.          |
| `UnreadCount`            | Total number of notifications that haven't been marked as read. |
| `OnNotificationsChanged` | An action that fires whenever the notification list updates.    |

## NotificationItem Model

| Property    | Type               | Description                                       |
|:------------|:-------------------|:--------------------------------------------------|
| `Id`        | `string`           | Unique identifier.                                |
| `Message`   | `string`           | The main notification body text.                  |
| `Title`     | `string?`          | Optional header for the notification.             |
| `Type`      | `NotificationType` | Category: `Info`, `Success`, `Warning`, `Error`.  |
| `CreatedAt` | `DateTime`         | Timestamp of when it was triggered.               |
| `IsRead`    | `bool`             | Current view state.                               |
| `Link`      | `string?`          | Optional redirect URL for the notification click. |

## Key Features

- **Badge Counter**: Real-time display of unread message count.
- **Type-based Styling**: Color-coded icons and backgrounds for different message types.
- **Relative Timestamps**: Human-readable time display (e.g., "5 mins ago").
- **State Management**: Clear interactions for marking items as read or dismissing them.
- **Responsive Design**: Adapts for mobile viewing with full-width drawer style.
