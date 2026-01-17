using Blazwind.Components.Shared;

namespace Blazwind.Components.Calendar;

/// <summary>
/// Centralized state management service for calendar events.
/// Maintains an in-memory cache and notifies subscribers on changes.
/// </summary>
public class CalendarStateService : IDisposable
{
    private readonly List<CalendarEvent> _events = new();
    private readonly List<CalendarInfo> _calendars = new();

    /// <summary>Fires when events or calendars change. Subscribe to trigger re-render.</summary>
    public event Action? OnStateChanged;

    /// <summary>Read-only access to cached events.</summary>
    public IReadOnlyList<CalendarEvent> Events => _events;

    /// <summary>Read-only access to cached calendars.</summary>
    public IReadOnlyList<CalendarInfo> Calendars => _calendars;

    /// <summary>
    /// Initialize the service with events and calendars.
    /// Call this once after loading data from your repository.
    /// </summary>
    public void Initialize(IEnumerable<CalendarEvent> events, IEnumerable<CalendarInfo>? calendars = null)
    {
        _events.Clear();
        _events.AddRange(events);

        _calendars.Clear();
        if (calendars != null)
        {
            _calendars.AddRange(calendars);
        }

        NotifyStateChanged();
    }

    /// <summary>Add a new event to the cache.</summary>
    public void AddEvent(CalendarEvent calendarEvent)
    {
        _events.Add(calendarEvent);
        NotifyStateChanged();
    }

    /// <summary>Update an existing event in the cache.</summary>
    public void UpdateEvent(CalendarEvent calendarEvent)
    {
        var index = _events.FindIndex(e => e.Id == calendarEvent.Id);
        if (index >= 0)
        {
            _events[index] = calendarEvent;
            NotifyStateChanged();
        }
    }

    /// <summary>Remove an event from the cache.</summary>
    public void DeleteEvent(string eventId)
    {
        var removed = _events.RemoveAll(e => e.Id == eventId);
        if (removed > 0)
        {
            NotifyStateChanged();
        }
    }

    /// <summary>
    /// Move an event (update start/end times). Optimistic update.
    /// </summary>
    public void MoveEvent(string eventId, TimeSpan timeDelta, int dayDelta = 0)
    {
        var evt = _events.FirstOrDefault(e => e.Id == eventId);
        if (evt != null)
        {
            evt.StartTime = evt.StartTime.Add(timeDelta).AddDays(dayDelta);
            evt.EndTime = evt.EndTime.Add(timeDelta).AddDays(dayDelta);
            NotifyStateChanged();
        }
    }

    /// <summary>
    /// Resize an event (update end time only). Optimistic update.
    /// </summary>
    public void ResizeEvent(string eventId, int newDurationMinutes)
    {
        var evt = _events.FirstOrDefault(e => e.Id == eventId);
        if (evt != null)
        {
            evt.EndTime = evt.StartTime.AddMinutes(newDurationMinutes);
            NotifyStateChanged();
        }
    }

    /// <summary>Get an event by ID.</summary>
    public CalendarEvent? GetEvent(string eventId) => _events.FirstOrDefault(e => e.Id == eventId);

    // FindEventByIdOrMaster helper removed as recurrence system is disabled

    /// <summary>Toggle calendar visibility.</summary>
    public void ToggleCalendarVisibility(string calendarId)
    {
        var calendar = _calendars.FirstOrDefault(c => c.Id == calendarId);
        if (calendar != null)
        {
            calendar.IsVisible = !calendar.IsVisible;
            NotifyStateChanged();
        }
    }

    private void NotifyStateChanged() => OnStateChanged?.Invoke();

    public void Dispose()
    {
        OnStateChanged = null;
    }
}