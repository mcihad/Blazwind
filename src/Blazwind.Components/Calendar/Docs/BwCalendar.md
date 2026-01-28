# BwCalendar

A fully mobile-responsive, feature-rich calendar and scheduler component supporting multiple view modes, drag-and-drop
interactions, and recurring events.

## Features

- ✅ **4 View Modes:** Agenda, Daily, Weekly, Monthly.
- ✅ **Interactivity:** Drag events to move, or resize to change duration.
- ✅ **Theming:** Full support for Light/Dark modes and custom brand colors.
- ✅ **Advanced Templates:** Custom render fragments for each view type.
- ✅ **Data Efficiency:** Built-in support for lazy loading via date range tracking.
- ✅ **Multi-Calendar:** Support for overlapping events from multiple sources with distinct colors.

## Basic Usage

```razor
<BwCalendar Events="@_events" 
            View="BwCalendarView.Weekly"
            OnEventClicked="@HandleEventClicked" />

@code {
    private List<CalendarEvent> _events = new() {
        new() { Title = "Meeting", StartTime = DateTime.Today.AddHours(10), EndTime = DateTime.Today.AddHours(11) }
    };

    private void HandleEventClicked(CalendarEvent evt) { /* ... */ }
}
```

## Advanced Customization

### View-Specific Templates (Slots)

Use specialized slots to define unique templates for different views. If no slot is defined, the global `EventTemplate`
is used.

```razor
<BwCalendar Events="@_events">
    <BwDayViewSlot>
        <EventTemplate Context="evt">
            <div class="p-1 font-bold">@evt.Title (Detailed)</div>
        </EventTemplate>
    </BwDayViewSlot>
    
    <BwMonthViewSlot>
        <EventTemplate Context="evt">
            <div class="text-xs truncate">• @evt.Title</div>
        </EventTemplate>
    </BwMonthViewSlot>
</BwCalendar>
```

### Centralized State Management

Inject and use `CalendarStateService` for complex scenarios involving multiple components interacting with the same
calendar data.

```razor
@inject CalendarStateService CalendarState

<BwCalendar />

@code {
    protected override void OnInitialized() {
        CalendarState.Initialize(myEvents, myCalendars);
    }
}
```

## API Reference

### Parameters

| Parameter         | Type                             | Default   | Description                                                 |
|-------------------|----------------------------------|-----------|-------------------------------------------------------------|
| `View`            | `BwCalendarView`                 | `Weekly`  | Current view mode (`Agenda`, `Daily`, `Weekly`, `Monthly`). |
| `SelectedDate`    | `DateTime`                       | `Today`   | The date currently focused in the calendar.                 |
| `Events`          | `IEnumerable<CalendarEvent>?`    | `null`    | The collection of events to display.                        |
| `Calendars`       | `IEnumerable<CalendarInfo>?`     | `null`    | Metadata for multiple calendars (names, colors).            |
| `SlotMinutes`     | `int`                            | `30`      | Time interval for each vertical slot (15, 30, or 60).       |
| `StartHour`       | `int`                            | `7`       | First visible hour in Day/Week views (0-23).                |
| `EndHour`         | `int`                            | `22`      | Last visible hour in Day/Week views (1-24).                 |
| `AllowDrag`       | `bool`                           | `true`    | Enables moving events via drag and drop.                    |
| `AllowResize`     | `bool`                           | `true`    | Enables changing event duration by dragging edges.          |
| `TodayColor`      | `BwColor`                        | `Primary` | Highlight color for the current day.                        |
| `AllowFullscreen` | `bool`                           | `true`    | Shows a toggle for fullscreen mode in the header.           |
| `EventTemplate`   | `RenderFragment<CalendarEvent>?` | `null`    | Global template for event rendering.                        |

### Event Callbacks

| Event                   | Payload                          | Description                                                             |
|-------------------------|----------------------------------|-------------------------------------------------------------------------|
| `OnEventClicked`        | `CalendarEvent`                  | Triggered when a user clicks an event card.                             |
| `OnSlotSelected`        | `(DateTime Start, DateTime End)` | Triggered when a user clicks an empty time slot.                        |
| `OnEventChanged`        | `CalendarEvent`                  | Triggered after an event is moved or resized.                           |
| `OnDateChanged`         | `DateTime`                       | Triggered when the user navigates to a different date.                  |
| `OnViewChanged`         | `BwCalendarView`                 | Triggered when the view mode is changed.                                |
| `OnVisibleRangeChanged` | `CalendarVisibleRange`           | Triggered when the visible date range changes (ideal for lazy loading). |

## Models

### CalendarEvent

```csharp
public class CalendarEvent {
    public string Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? CalendarId { get; set; }
    public string? Color { get; set; }
    public bool IsAllDay { get; set; }
    public string? Location { get; set; }
    public Dictionary<string, object>? ExtraData { get; set; }
}
```

### CalendarVisibleRange

```csharp
public record CalendarVisibleRange(DateTime Start, DateTime End, BwCalendarView View);
```
