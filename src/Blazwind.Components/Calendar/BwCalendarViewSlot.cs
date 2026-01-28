using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;

namespace Blazwind.Components.Calendar;

/// <summary>
///     Base class for calendar view slot configurations
/// </summary>
public abstract class BwCalendarViewSlotBase : ComponentBase
{
    /// <summary>Custom template for rendering events in this view</summary>
    [Parameter]
    public RenderFragment<CalendarEvent>? EventTemplate { get; set; }

    /// <summary>Parent calendar reference</summary>
    [CascadingParameter(Name = "ParentCalendar")]
    public BwCalendar? ParentCalendar { get; set; }

    protected override void OnInitialized()
    {
        ParentCalendar?.RegisterViewSlot(this);
    }
}

/// <summary>
///     Configuration slot for Week view
/// </summary>
public class BwWeekViewSlot : BwCalendarViewSlotBase
{
}

/// <summary>
///     Configuration slot for Month view
/// </summary>
public class BwMonthViewSlot : BwCalendarViewSlotBase
{
}

/// <summary>
///     Configuration slot for Day view
/// </summary>
public class BwDayViewSlot : BwCalendarViewSlotBase
{
}

/// <summary>
///     Configuration slot for Agenda view
/// </summary>
public class BwAgendaViewSlot : BwCalendarViewSlotBase
{
}