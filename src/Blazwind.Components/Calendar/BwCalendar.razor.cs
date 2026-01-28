using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazwind.Components.Calendar;

public partial class BwCalendar : IAsyncDisposable, IDisposable
{
    private BwAgendaViewSlot? _agendaViewSlot;
    private BwDayViewSlot? _dayViewSlot;

    private DotNetObjectReference<BwCalendar>? _dotNetRef;
    private BwMonthViewSlot? _monthViewSlot;

    // View slot registrations
    private BwWeekViewSlot? _weekViewSlot;

    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    /// <summary>Optional state service for centralized event management</summary>
    [Inject]
    public CalendarStateService? StateService { get; set; }


    /// <summary>View mode</summary>
    [Parameter]
    public BwCalendarView View { get; set; } = BwCalendarView.Weekly;

    /// <summary>Selected date</summary>
    [Parameter]
    public DateTime SelectedDate { get; set; } = DateTime.Today;

    /// <summary>Events list</summary>
    [Parameter]
    public IEnumerable<CalendarEvent>? Events { get; set; }

    /// <summary>Calendars list (multiple calendar support)</summary>
    [Parameter]
    public IEnumerable<CalendarInfo>? Calendars { get; set; }

    /// <summary>Slot interval in minutes - 15, 30, 60</summary>
    [Parameter]
    public int SlotMinutes { get; set; } = 30;

    /// <summary>Visible start hour (0-23)</summary>
    [Parameter]
    public int StartHour { get; set; } = 7;

    /// <summary>Visible end hour (1-24)</summary>
    [Parameter]
    public int EndHour { get; set; } = 22;

    /// <summary>Hide empty slots</summary>
    [Parameter]
    public bool HideEmptySlots { get; set; }

    /// <summary>Allow event dragging</summary>
    [Parameter]
    public bool AllowDrag { get; set; } = true;

    /// <summary>Allow event resizing</summary>
    [Parameter]
    public bool AllowResize { get; set; } = true;

    /// <summary>Color for Today highlight</summary>
    [Parameter]
    public BwColor TodayColor { get; set; } = BwColor.Primary;

    /// <summary>Allow fullscreen mode</summary>
    [Parameter]
    public bool AllowFullscreen { get; set; } = true;


    // EventCallbacks
    [Parameter]
    public EventCallback<CalendarEvent> OnEventClicked { get; set; }

    [Parameter]
    public EventCallback<(DateTime Start, DateTime End)> OnSlotSelected { get; set; }

    [Parameter]
    public EventCallback<CalendarEvent> OnEventChanged { get; set; }

    [Parameter]
    public EventCallback<DateTime> OnDateChanged { get; set; }

    [Parameter]
    public EventCallback<BwCalendarView> OnViewChanged { get; set; }

    /// <summary>Fired when the visible date range changes (for lazy loading)</summary>
    [Parameter]
    public EventCallback<CalendarVisibleRange> OnVisibleRangeChanged { get; set; }

    /// <summary>Custom template for rendering events (fallback for all views)</summary>
    [Parameter]
    public RenderFragment<CalendarEvent>? EventTemplate { get; set; }

    /// <summary>Child content for view-specific configuration slots</summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private IEnumerable<CalendarEvent> FilteredEvents =>
        EffectiveEvents.Where(e =>
            EffectiveCalendars == null ||
            !EffectiveCalendars.Any() ||
            EffectiveCalendars.Any(c => c.IsVisible && (e.CalendarId == null || e.CalendarId == c.Id))
        );

    /// <summary>Expanded events - RRule expansion disabled, returns filtered events directly</summary>
    private IEnumerable<CalendarEvent> ExpandedEvents => FilteredEvents;

    /* RRule expansion disabled - model fields retained for future use
    private IEnumerable<CalendarEvent> ExpandedEvents
    {
        get
        {
            var range = CalculateVisibleRange();
            return RRuleExpander.ExpandAll(FilteredEvents, range.Start, range.End);
        }
    }
    */

    /// <summary>Use StateService events if available, otherwise parameter</summary>
    private IEnumerable<CalendarEvent> EffectiveEvents =>
        StateService?.Events ?? Events ?? Enumerable.Empty<CalendarEvent>();

    /// <summary>Use StateService calendars if available, otherwise parameter</summary>
    private IEnumerable<CalendarInfo> EffectiveCalendars =>
        StateService?.Calendars ?? Calendars ?? Enumerable.Empty<CalendarInfo>();

    public async ValueTask DisposeAsync()
    {
        Dispose();
        try
        {
            await JS.InvokeVoidAsync("Blazwind.Calendar.dispose");
        }
        catch
        {
            /* Ignore disposal errors */
        }

        _dotNetRef?.Dispose();
    }

    public void Dispose()
    {
        if (StateService != null) StateService.OnStateChanged -= HandleStateChanged;
    }

    /// <summary>Register a view slot configuration</summary>
    public void RegisterViewSlot(BwCalendarViewSlotBase slot)
    {
        switch (slot)
        {
            case BwWeekViewSlot weekSlot: _weekViewSlot = weekSlot; break;
            case BwMonthViewSlot monthSlot: _monthViewSlot = monthSlot; break;
            case BwDayViewSlot daySlot: _dayViewSlot = daySlot; break;
            case BwAgendaViewSlot agendaSlot: _agendaViewSlot = agendaSlot; break;
        }

        StateHasChanged();
    }

    /// <summary>Get the event template for the current view</summary>
    private RenderFragment<CalendarEvent>? GetEventTemplateForView(BwCalendarView view)
    {
        return view switch
        {
            BwCalendarView.Weekly => _weekViewSlot?.EventTemplate ?? EventTemplate,
            BwCalendarView.Monthly => _monthViewSlot?.EventTemplate ?? EventTemplate,
            BwCalendarView.Daily => _dayViewSlot?.EventTemplate ?? EventTemplate,
            BwCalendarView.Agenda => _agendaViewSlot?.EventTemplate ?? EventTemplate,
            _ => EventTemplate
        };
    }

    private async Task HandleFullscreenToggle()
    {
        await JS.InvokeVoidAsync("Blazwind.Calendar.toggleFullscreen", Id);
    }

    protected override void OnInitialized()
    {
        if (string.IsNullOrEmpty(Id)) Id = $"bw-calendar-{Guid.NewGuid():N}";

        if (StateService != null) StateService.OnStateChanged += HandleStateChanged;
    }

    private void HandleStateChanged()
    {
        InvokeAsync(StateHasChanged);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        // CRITICAL: Always update the JS reference to THIS instance.
        // This fixes "Split Brain" where JS was calling a stale/ghost component.
        _dotNetRef?.Dispose();
        _dotNetRef = DotNetObjectReference.Create(this);
        await JS.InvokeVoidAsync("Blazwind.Calendar.initialize", _dotNetRef);
    }

    private async Task HandleDateChanged(DateTime newDate)
    {
        SelectedDate = newDate;
        await OnDateChanged.InvokeAsync(newDate);
        await FireVisibleRangeChanged();
    }

    private async Task HandleViewChanged(BwCalendarView newView)
    {
        View = newView;
        await OnViewChanged.InvokeAsync(newView);
        await FireVisibleRangeChanged();
    }

    private async Task HandleToday()
    {
        SelectedDate = DateTime.Today;
        await OnDateChanged.InvokeAsync(DateTime.Today);
        await FireVisibleRangeChanged();
    }

    private async Task HandleDateSelected(DateTime date)
    {
        SelectedDate = date;
        View = BwCalendarView.Daily;
        await OnDateChanged.InvokeAsync(date);
        await OnViewChanged.InvokeAsync(BwCalendarView.Daily);
    }

    [JSInvokable]
    public async Task OnEventDragged(string eventId, int minutesDelta, int dayDelta = 0)
    {
        // Use StateService if available, otherwise direct mutation
        if (StateService != null)
        {
            StateService.MoveEvent(eventId, TimeSpan.FromMinutes(minutesDelta), dayDelta);
            var calendarEvent = StateService.GetEvent(eventId);
            if (calendarEvent != null) await OnEventChanged.InvokeAsync(calendarEvent);
        }
        else
        {
            var calendarEvent = EffectiveEvents.FirstOrDefault(e => e.Id == eventId);
            if (calendarEvent != null)
            {
                calendarEvent.StartTime = calendarEvent.StartTime.AddMinutes(minutesDelta).AddDays(dayDelta);
                calendarEvent.EndTime = calendarEvent.EndTime.AddMinutes(minutesDelta).AddDays(dayDelta);
                await OnEventChanged.InvokeAsync(calendarEvent);
                await InvokeAsync(StateHasChanged);
            }
        }
    }

    [JSInvokable]
    public async Task OnEventResized(string eventId, int newDurationMinutes)
    {
        if (StateService != null)
        {
            StateService.ResizeEvent(eventId, newDurationMinutes);
            var calendarEvent = StateService.GetEvent(eventId);
            if (calendarEvent != null) await OnEventChanged.InvokeAsync(calendarEvent);
        }
        else
        {
            var calendarEvent = EffectiveEvents.FirstOrDefault(e => e.Id == eventId);
            if (calendarEvent != null)
            {
                calendarEvent.EndTime = calendarEvent.StartTime.AddMinutes(newDurationMinutes);
                await OnEventChanged.InvokeAsync(calendarEvent);
                await InvokeAsync(StateHasChanged);
            }
        }
    }

    // Helper to get static classes for TodayColor
    public string GetTodayHeaderClass()
    {
        return TodayColor switch
        {
            BwColor.Primary => "bg-blue-600 text-white",
            BwColor.Secondary => "bg-indigo-600 text-white",
            BwColor.Success => "bg-emerald-600 text-white",
            BwColor.Danger => "bg-red-600 text-white",
            BwColor.Warning => "bg-amber-500 text-white",
            BwColor.Info => "bg-sky-500 text-white",
            BwColor.Gray => "bg-gray-600 text-white",
            BwColor.Dark => "bg-gray-900 text-white",
            _ => "bg-blue-600 text-white"
        };
    }

    public string GetTodayBackgroundClass()
    {
        return TodayColor switch
        {
            BwColor.Primary => "bg-blue-50 dark:bg-blue-900/10",
            BwColor.Secondary => "bg-indigo-50 dark:bg-indigo-900/10",
            BwColor.Success => "bg-emerald-50 dark:bg-emerald-900/10",
            BwColor.Danger => "bg-red-50 dark:bg-red-900/10",
            BwColor.Warning => "bg-amber-50 dark:bg-amber-900/10",
            BwColor.Info => "bg-sky-50 dark:bg-sky-900/10",
            BwColor.Gray => "bg-gray-50 dark:bg-gray-800/50",
            BwColor.Dark => "bg-gray-100 dark:bg-gray-800",
            _ => "bg-blue-50 dark:bg-blue-900/10"
        };
    }

    public string GetTodayTextClass()
    {
        return TodayColor switch
        {
            BwColor.Primary => "text-blue-600 dark:text-blue-400",
            BwColor.Secondary => "text-indigo-600 dark:text-indigo-400",
            BwColor.Success => "text-emerald-600 dark:text-emerald-400",
            BwColor.Danger => "text-red-600 dark:text-red-400",
            BwColor.Warning => "text-amber-600 dark:text-amber-400",
            BwColor.Info => "text-sky-600 dark:text-sky-400",
            BwColor.Gray => "text-gray-600 dark:text-gray-400",
            BwColor.Dark => "text-gray-800 dark:text-gray-200",
            _ => "text-blue-600 dark:text-blue-400"
        };
    }

    private async Task FireVisibleRangeChanged()
    {
        var range = CalculateVisibleRange();
        await OnVisibleRangeChanged.InvokeAsync(range);
    }

    /// <summary>
    ///     Calculate the visible date range based on current view and selected date
    /// </summary>
    public CalendarVisibleRange CalculateVisibleRange()
    {
        return View switch
        {
            BwCalendarView.Daily => new CalendarVisibleRange(
                SelectedDate.Date,
                SelectedDate.Date.AddDays(1).AddTicks(-1),
                View),
            BwCalendarView.Weekly => new CalendarVisibleRange(
                SelectedDate.Date.AddDays(-(int)SelectedDate.DayOfWeek),
                SelectedDate.Date.AddDays(6 - (int)SelectedDate.DayOfWeek).AddDays(1).AddTicks(-1),
                View),
            BwCalendarView.Monthly => new CalendarVisibleRange(
                new DateTime(SelectedDate.Year, SelectedDate.Month, 1),
                new DateTime(SelectedDate.Year, SelectedDate.Month, 1).AddMonths(1).AddTicks(-1),
                View),
            BwCalendarView.Agenda => new CalendarVisibleRange(
                SelectedDate.Date,
                SelectedDate.Date.AddDays(30),
                View),
            _ => new CalendarVisibleRange(SelectedDate.Date, SelectedDate.Date.AddDays(7), View)
        };
    }
}

/// <summary>
///     Represents the visible date range in the calendar
/// </summary>
public record CalendarVisibleRange(DateTime Start, DateTime End, BwCalendarView View);