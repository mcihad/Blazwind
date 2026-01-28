namespace Blazwind.Components.Shared;

/// <summary>
///     Calendar event model - extensible structure
/// </summary>
public class CalendarEvent
{
    /// <summary>Unique identifier</summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>Event title</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Event description</summary>
    public string? Description { get; set; }

    /// <summary>Start time</summary>
    public DateTime StartTime { get; set; }

    /// <summary>End time</summary>
    public DateTime EndTime { get; set; }

    /// <summary>Calendar ID this event belongs to</summary>
    public string? CalendarId { get; set; }

    /// <summary>Event color (hex or Tailwind color name)</summary>
    public string? Color { get; set; }

    /// <summary>Is this an all-day event?</summary>
    public bool IsAllDay { get; set; }

    /// <summary>Event location</summary>
    public string? Location { get; set; }

    /// <summary>Additional data for extensibility</summary>
    public Dictionary<string, object>? ExtraData { get; set; }

    /// <summary>Is this a recurring event?</summary>
    public bool IsRecurring { get; set; }

    /// <summary>RRULE format recurrence rule (e.g., FREQ=WEEKLY;BYDAY=MO,WE)</summary>
    public string? RecurrenceRule { get; set; }

    /// <summary>For generated instances: ID of the master recurring event</summary>
    public string? RecurrenceMasterId { get; set; }

    /// <summary>Event duration in minutes</summary>
    public int DurationMinutes => (int)(EndTime - StartTime).TotalMinutes;
}

/// <summary>
///     Calendar model - for multiple calendar support
/// </summary>
public class CalendarInfo
{
    /// <summary>Unique identifier</summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>Calendar name</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Calendar color (hex code)</summary>
    public string Color { get; set; } = "#3B82F6";

    /// <summary>Is calendar visible?</summary>
    public bool IsVisible { get; set; } = true;

    /// <summary>Calendar description</summary>
    public string? Description { get; set; }
}