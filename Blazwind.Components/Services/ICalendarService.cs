using Blazwind.Components.Shared;

namespace Blazwind.Components.Services;

/// <summary>
/// Calendar service interface - to be implemented by the application
/// </summary>
public interface ICalendarService
{
    /// <summary>Gets events within the specified date range</summary>
    Task<List<CalendarEvent>> GetEventsAsync(DateTime start, DateTime end);

    /// <summary>Gets all calendars</summary>
    Task<List<CalendarInfo>> GetCalendarsAsync();

    /// <summary>Adds a new event</summary>
    Task<CalendarEvent> AddEventAsync(CalendarEvent calendarEvent);

    /// <summary>Updates an event</summary>
    Task<CalendarEvent> UpdateEventAsync(CalendarEvent calendarEvent);

    /// <summary>Deletes an event</summary>
    Task DeleteEventAsync(string eventId);

    /// <summary>Moves an event to a new time</summary>
    Task<bool> MoveEventAsync(string eventId, DateTime newStart, DateTime newEnd);
}