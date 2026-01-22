namespace Blazwind.Components.Services;

public enum NotificationType
{
    Info,
    Success,
    Warning,
    Error
}

public class NotificationItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Message { get; set; } = "";
    public string? Title { get; set; }
    public NotificationType Type { get; set; } = NotificationType.Info;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public bool IsRead { get; set; } = false;
    public string? Link { get; set; }
}

public class NotificationService
{
    private readonly List<NotificationItem> _notifications = new();

    public event Action? OnNotificationsChanged;

    public IReadOnlyList<NotificationItem> Notifications => _notifications.AsReadOnly();
    public int UnreadCount => _notifications.Count(n => !n.IsRead);

    public void Add(string message, NotificationType type = NotificationType.Info, string? title = null)
    {
        _notifications.Add(new NotificationItem
        {
            Message = message,
            Type = type,
            Title = title
        });
        OnNotificationsChanged?.Invoke();
    }

    public void AddInfo(string message) => Add(message, NotificationType.Info);
    public void AddSuccess(string message) => Add(message, NotificationType.Success);
    public void AddWarning(string message) => Add(message, NotificationType.Warning);
    public void AddError(string message) => Add(message, NotificationType.Error);

    public void MarkAsRead(string id)
    {
        var notification = _notifications.FirstOrDefault(n => n.Id == id);
        if (notification != null)
        {
            notification.IsRead = true;
            OnNotificationsChanged?.Invoke();
        }
    }

    public void MarkAllAsRead()
    {
        foreach (var notification in _notifications)
        {
            notification.IsRead = true;
        }

        OnNotificationsChanged?.Invoke();
    }

    public void Remove(string id)
    {
        var notification = _notifications.FirstOrDefault(n => n.Id == id);
        if (notification != null)
        {
            _notifications.Remove(notification);
            OnNotificationsChanged?.Invoke();
        }
    }

    public void ClearAll()
    {
        _notifications.Clear();
        OnNotificationsChanged?.Invoke();
    }
}