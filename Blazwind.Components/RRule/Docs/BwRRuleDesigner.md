# RRuleDesigner

A complex form builder designed for creating and parsing recurrence rules (RRULE) compatible with the iCalendar RFC 5545 standard. Ideal for calendars, scheduling systems, and recurring event management.

## Examples

### Basic Designer
```razor
<BwRRuleDesigner @bind-Value="_rruleValue" />

@code {
    private string _rruleValue = "FREQ=WEEKLY;BYDAY=MO,WE,FR";
}
```

### Full Configuration
```razor
<BwRRuleDesigner @bind-Value="_rrule" 
                 StartDate="@DateTime.Today" 
                 ShowPreview="true" 
                 OnOptionsChanged="HandleChange" />
```

## API - BwRRuleDesigner

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Value` | `string?` | `null` | The RRULE string (Two-way binding). e.g., `FREQ=DAILY;INTERVAL=2`. |
| `StartDate` | `DateTime` | `Today` | The reference start date for generating human-readable text. |
| `ShowPreview`| `bool` | `true` | Show/Hide the live preview box at the bottom. |
| `Class` | `string?` | `null` | Additional CSS class for the container. |

### Events

| Event | Argument Type | Description |
| :--- | :--- | :--- |
| `ValueChanged`| `string?` | Fired when the RRULE string changes. |
| `OnOptionsChanged`| `RRuleOptions`| Fired when any recurring option is modified. |

## RRuleOptions Data Model

The designer manages its state using the `RRuleOptions` class:

| Property | Type | Description |
| :--- | :--- | :--- |
| `Frequency` | `RRuleFrequency` | `Daily`, `Weekly`, `Monthly`, `Yearly`. |
| `Interval` | `int` | Recurrence gap (Every X days/weeks/etc). |
| `ByDays` | `HashSet<DayOfWeek>`| Selected days for weekly recurrence. |
| `MonthlyType`| `RRuleMonthlyType`| `DayOfMonth` or `WeekdayOfMonth`. |
| `ByMonthDay` | `int` | Specific day of the month (1-31). |
| `BySetPos` | `int` | Instance index (1st, 2nd, -1 for Last). |
| `ByWeekDay` | `DayOfWeek` | Day of the week for `WeekdayOfMonth` mode. |
| `EndType` | `RRuleEndType` | `Never`, `AfterCount`, `UntilDate`. |
| `Count` | `int` | Number of occurrences (Ends after X times). |
| `Until` | `DateTime?` | End date (Ends on specific date). |

## Features

- ✅ **RFC 5545 Compliant**: Generates standard-compliant recurrence strings.
- ✅ **Human Readable**: Live translation of complex rules into plain English (or Turkish based on implementation).
- ✅ **Dynamic UI**: Adapts its input fields based on the selected frequency (Daily vs Monthly, etc.).
- ✅ **Two-Way Binding**: Synchronizes seamlessly with `Value` and internal state.
- ✅ **Modular**: Can be used as a standalone form or inside a dialog.
