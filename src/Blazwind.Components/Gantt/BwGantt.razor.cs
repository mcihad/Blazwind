using Blazwind.Components.Shared;
using Blazwind.Components.Avatar;
using Blazwind.Components.Button;
using Blazwind.Components.Card;
using Blazwind.Components.ContextMenu;
using Blazwind.Components.Layout;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using System.Globalization;

namespace Blazwind.Components.Gantt;

public partial class BwGantt : BwBase, IAsyncDisposable
{
    [Parameter] public List<GanttTask> Tasks { get; set; } = new();
    [Parameter] public string Title { get; set; } = "Proje Planı";
    [Parameter] public string Height { get; set; } = "400px";
    [Parameter] public GanttViewMode ViewMode { get; set; } = GanttViewMode.Week;
    [Parameter] public EventCallback<GanttViewMode> ViewModeChanged { get; set; }
    [Parameter] public DateTime? StartDate { get; set; }
    [Parameter] public DateTime? EndDate { get; set; }

    [Parameter] public bool Editable { get; set; } = false;
    [Parameter] public EventCallback<GanttTask> OnTaskClick { get; set; }
    [Parameter] public EventCallback<GanttTaskResizeEventArgs> OnTaskResize { get; set; }
    [Parameter] public EventCallback<GanttTaskDragEventArgs> OnTaskDrag { get; set; }
    
    // Task List Panel Parameters
    /// <summary>Show/hide the task list panel on the left</summary>
    [Parameter] public bool ShowTaskList { get; set; } = true;
    
    /// <summary>Width of the task list panel in pixels</summary>
    [Parameter] public int TaskListWidth { get; set; } = 256;
    
    /// <summary>Allow resizing the task list panel</summary>
    [Parameter] public bool TaskListResizable { get; set; } = true;
    
    /// <summary>Custom template for task list items</summary>
    [Parameter] public RenderFragment<GanttTask>? TaskItemTemplate { get; set; }

    /// <summary>Custom context menu template for task bars</summary>
    [Parameter] public RenderFragment<GanttTask>? ContextMenuTemplate { get; set; }

    /// <summary>Show task titles on timeline bars</summary>
    [Parameter] public bool ShowBarLabels { get; set; } = false;
    
    /// <summary>Show the current date indicator</summary>
    [Parameter] public bool ShowTodayIndicator { get; set; } = true;
    
    // Task List Events
    /// <summary>Fired when task list visibility changes</summary>
    [Parameter] public EventCallback<bool> OnTaskListVisibilityChanged { get; set; }
    
    /// <summary>Fired when task list width changes after resize</summary>
    [Parameter] public EventCallback<int> OnTaskListWidthChanged { get; set; }
    
    // Internal state
    private bool _isTaskListVisible = true;
    private int _currentTaskListWidth = 256;
    private bool _isResizingTaskList = false;
    private double _resizeStartX;
    private int _resizeStartWidth;
    private bool _isFullScreen = false;

    private void ToggleFullScreen()
    {
        _isFullScreen = !_isFullScreen;
        StateHasChanged();
    }

    private List<GanttTask> FlatTasks => FlattenTasks(Tasks);
    private List<string> TimelinePeriods = new();
    private List<DateTime> PeriodBoundaries = new(); // Start dates of each period
    private DateTime _timelineStart;
    private DateTime _timelineEnd;
    private double TodayOffset => CalculateTodayOffset();
    private string? _hoveredTaskId;

    private bool _prevShowTaskList;
    private int _prevTaskListWidth;
    private int _currentColumnWidth; // Dynamic column width for zooming

    protected override void OnInitialized()
    {
        _isTaskListVisible = ShowTaskList;
        _prevShowTaskList = ShowTaskList;
        
        _currentTaskListWidth = TaskListWidth;
        _prevTaskListWidth = TaskListWidth;
        
        // Initialize column width
        _currentColumnWidth = GetDefaultColumnWidth(ViewMode);
    }
    
    private int GetDefaultColumnWidth(GanttViewMode mode)
    {
        return mode switch
        {
            GanttViewMode.Day => 40,
            GanttViewMode.Week => 60,
            GanttViewMode.Month => 80,
            _ => 40
        };
    }

    [JSInvokable]
    public async Task HandleZoomFromJs(int delta)
    {
        var newWidth = _currentColumnWidth - delta; // Delta is typically +/- 100 from wheel
        // Normalize delta
        var change = delta > 0 ? -5 : 5;
        
        _currentColumnWidth = Math.Clamp(_currentColumnWidth + change, 20, 200);
        await UpdateJsOptionsAsync();
        StateHasChanged();
    }
    
    private async Task ZoomIn()
    {
        _currentColumnWidth = Math.Min(_currentColumnWidth + 10, 200);
        await UpdateJsOptionsAsync();
    }

    private async Task ZoomOut()
    {
        _currentColumnWidth = Math.Max(_currentColumnWidth - 10, 20);
        await UpdateJsOptionsAsync();
    }

    protected override void OnParametersSet()
    {
        CalculateTimeline();
        
        // Only update internal state if parameters explicitly changed
        if (ShowTaskList != _prevShowTaskList)
        {
            _isTaskListVisible = ShowTaskList;
            _prevShowTaskList = ShowTaskList;
        }
        
        if (TaskListWidth != _prevTaskListWidth)
        {
            _currentTaskListWidth = TaskListWidth;
            _prevTaskListWidth = TaskListWidth;
        }
    }
    
    private async Task ToggleTaskList()
    {
        _isTaskListVisible = !_isTaskListVisible;
        await OnTaskListVisibilityChanged.InvokeAsync(_isTaskListVisible);
    }
    
    private void StartTaskListResize(MouseEventArgs e)
    {
        _isResizingTaskList = true;
        _resizeStartX = e.ClientX;
        _resizeStartWidth = _currentTaskListWidth;
    }
    
    private void OnResizeMouseMove(MouseEventArgs e)
    {
        if (!_isResizingTaskList) return;
        
        var delta = e.ClientX - _resizeStartX;
        var newWidth = _resizeStartWidth + (int)delta;
        _currentTaskListWidth = Math.Max(150, Math.Min(newWidth, 500));
    }
    
    private async Task OnResizeMouseUp(MouseEventArgs e)
    {
        if (_isResizingTaskList)
        {
            _isResizingTaskList = false;
            await OnTaskListWidthChanged.InvokeAsync(_currentTaskListWidth);
        }
    }
    
    [JSInvokable]
    public async Task HandleTaskListResize(int newWidth)
    {
        _currentTaskListWidth = Math.Max(150, Math.Min(newWidth, 500));
        await OnTaskListWidthChanged.InvokeAsync(_currentTaskListWidth);
        StateHasChanged();
    }
    
    private double CalculateTodayOffset()
    {
        var columnWidth = GetColumnWidth();
        
        if (ViewMode != GanttViewMode.Month || PeriodBoundaries.Count == 0)
        {
            var days = (DateTime.Today - _timelineStart).TotalDays;
            var daysPerColumn = GetDaysPerColumn();
            return days / daysPerColumn * columnWidth;
        }
        
        // Month view - calculate based on period boundaries
        double offset = 0;
        
        for (int i = 0; i < PeriodBoundaries.Count; i++)
        {
            var periodStart = PeriodBoundaries[i];
            var periodEnd = i < PeriodBoundaries.Count - 1 ? PeriodBoundaries[i + 1] : _timelineEnd.AddDays(1);
            var periodDays = (periodEnd - periodStart).TotalDays;
            
            if (DateTime.Today >= periodEnd)
            {
                offset += columnWidth;
            }
            else if (DateTime.Today >= periodStart && DateTime.Today < periodEnd)
            {
                var daysInto = (DateTime.Today - periodStart).TotalDays;
                offset += (daysInto / periodDays * columnWidth);
                break;
            }
            else
            {
                break;
            }
        }
        
        return offset;
    }

    private List<GanttTask> FlattenTasks(List<GanttTask> tasks, int level = 0)
    {
        var result = new List<GanttTask>();
        foreach (var task in tasks)
        {
            result.Add(task);
            if (task.Children.Count > 0)
            {
                result.AddRange(FlattenTasks(task.Children, level + 1));
            }
        }
        return result;
    }

    private void CalculateTimeline()
    {
        var allTasks = FlatTasks;
        if (allTasks.Count == 0)
        {
            _timelineStart = StartDate ?? DateTime.Today;
            _timelineEnd = EndDate ?? DateTime.Today.AddMonths(1);
        }
        else
        {
            var minDate = allTasks.Min(t => t.StartDate);
            var maxDate = allTasks.Max(t => t.EndDate);
            
            // Adjust timeline based on view mode for better alignment
            if (ViewMode == GanttViewMode.Month)
            {
                // Start from beginning of the month
                _timelineStart = StartDate ?? new DateTime(minDate.Year, minDate.Month, 1);
                // End at the end of the month
                var endMonth = maxDate.AddMonths(1);
                _timelineEnd = EndDate ?? new DateTime(endMonth.Year, endMonth.Month, 1).AddDays(-1);
            }
            else if (ViewMode == GanttViewMode.Week)
            {
                _timelineStart = StartDate ?? minDate.AddDays(-3);
                _timelineEnd = EndDate ?? maxDate.AddDays(7);
            }
            else
            {
                _timelineStart = StartDate ?? minDate.AddDays(-2);
                _timelineEnd = EndDate ?? maxDate.AddDays(5);
            }
        }

        TimelinePeriods = GeneratePeriods();
    }

    private List<string> GeneratePeriods()
    {
        var periods = new List<string>();
        PeriodBoundaries = new List<DateTime>();
        var current = _timelineStart;

        while (current <= _timelineEnd)
        {
            PeriodBoundaries.Add(current);
            
            switch (ViewMode)
            {
                case GanttViewMode.Day:
                    periods.Add(current.ToString("dd"));
                    current = current.AddDays(1);
                    break;
                case GanttViewMode.Week:
                    periods.Add($"H{GetWeekNumber(current)}");
                    current = current.AddDays(7);
                    break;
                case GanttViewMode.Month:
                    var turkishCulture = new CultureInfo("tr-TR");
                    periods.Add(current.ToString("MMM", turkishCulture));
                    current = current.AddMonths(1);
                    break;
            }
        }
        return periods;
    }

    private int GetWeekNumber(DateTime date)
    {
        var jan1 = new DateTime(date.Year, 1, 1);
        return (date.DayOfYear - 1) / 7 + 1;
    }

    private int GetColumnWidth()
    {
        return _currentColumnWidth;
    }

    private double GetDaysPerColumn()
    {
        return ViewMode switch
        {
            GanttViewMode.Day => 1,
            GanttViewMode.Week => 7,
            GanttViewMode.Month => 30, // Average for JS interop
            _ => 1
        };
    }

    private string GetTaskBarStyle(GanttTask task, int rowIndex)
    {
        var columnWidth = GetColumnWidth();
        var rowHeight = 32;
        double startOffset = 0;
        double width = 0;

        if (ViewMode == GanttViewMode.Month && PeriodBoundaries.Count > 0)
        {
            // For month view, calculate based on actual period boundaries
            double totalOffset = 0;
            for (int i = 0; i < PeriodBoundaries.Count; i++)
            {
                var periodStart = PeriodBoundaries[i];
                var periodEnd = i < PeriodBoundaries.Count - 1 ? PeriodBoundaries[i + 1] : _timelineEnd.AddDays(1);
                var periodDays = (periodEnd - periodStart).TotalDays;
                
                if (task.StartDate >= periodEnd)
                {
                    // Task starts after this period
                    totalOffset += columnWidth;
                }
                else if (task.StartDate >= periodStart && task.StartDate < periodEnd)
                {
                    // Task starts in this period
                    var daysInto = (task.StartDate - periodStart).TotalDays;
                    startOffset = totalOffset + (daysInto / periodDays * columnWidth);
                    break;
                }
                else if (task.StartDate < periodStart)
                {
                    // Task started before this period
                    startOffset = totalOffset;
                    break;
                }
            }
            
            // Calculate width based on actual days spanning across months
            double remainingDuration = task.DurationDays;
            var currentDate = task.StartDate;
            
            for (int i = 0; i < PeriodBoundaries.Count && remainingDuration > 0; i++)
            {
                var periodStart = PeriodBoundaries[i];
                var periodEnd = i < PeriodBoundaries.Count - 1 ? PeriodBoundaries[i + 1] : _timelineEnd.AddDays(1);
                var periodDays = (periodEnd - periodStart).TotalDays;
                
                if (currentDate >= periodEnd)
                {
                    continue;
                }
                
                var effectiveStart = currentDate > periodStart ? currentDate : periodStart;
                var taskEnd = task.EndDate.AddDays(1); // EndDate is inclusive
                var effectiveEnd = taskEnd < periodEnd ? taskEnd : periodEnd;
                
                if (effectiveStart < effectiveEnd)
                {
                    var daysInPeriod = (effectiveEnd - effectiveStart).TotalDays;
                    width += (daysInPeriod / periodDays * columnWidth);
                    remainingDuration -= daysInPeriod;
                    currentDate = effectiveEnd;
                }
            }
            
            width = task.IsMilestone ? 16 : Math.Max(16, width);
        }
        else
        {
            // Day and Week views - simple calculation
            var daysPerColumn = GetDaysPerColumn();
            startOffset = (task.StartDate - _timelineStart).TotalDays / daysPerColumn * columnWidth;
            width = task.IsMilestone ? 16 : Math.Max(16, task.DurationDays / daysPerColumn * columnWidth);
        }

        var top = rowIndex * rowHeight + 6;
        
        // Use InvariantCulture to ensure decimal point (not comma) for WASM compatibility
        return $"left: {startOffset.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)}px; width: {width.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)}px; top: {top}px; height: 20px;";
    }

    private IEnumerable<DependencyLine> CalculateDependencies()
    {
        var tasks = FlatTasks;
        var taskMap = tasks.ToDictionary(t => t.Id);
        var lines = new List<DependencyLine>();

        // Pre-calculate positions
        var positions = new Dictionary<string, (double Right, double Top, double Left)>();
        for (int i = 0; i < tasks.Count; i++)
        {
            var task = tasks[i];
            var (startOffset, width) = CalculateTaskPosition(task);
            var top = i * 32 + 16; // Middle of the row
            positions[task.Id] = (startOffset + width, top, startOffset);
        }

        foreach (var task in tasks)
        {
            foreach (var depId in task.Dependencies)
            {
                if (taskMap.ContainsKey(depId) && positions.TryGetValue(depId, out var fromPos) && positions.TryGetValue(task.Id, out var toPos))
                {
                    // Draw cubic bezier curve
                    var x1 = fromPos.Right;
                    var y1 = fromPos.Top;
                    var x2 = toPos.Left;
                    var y2 = toPos.Top;
                    
                    // Improved sigmoid-like curve for aesthetic flow
                    var path = $"M {x1.ToString(CultureInfo.InvariantCulture)} {y1.ToString(CultureInfo.InvariantCulture)} ";
                    // Control point 1: x1 + gap, y1
                    // Control point 2: x2 - gap, y2
                    var gap = 30; // Larger gap for smoother curve
                    
                    path += $"C {(x1 + gap).ToString(CultureInfo.InvariantCulture)} {y1.ToString(CultureInfo.InvariantCulture)}, ";
                    path += $"{(x2 - gap).ToString(CultureInfo.InvariantCulture)} {y2.ToString(CultureInfo.InvariantCulture)}, ";
                    path += $"{x2.ToString(CultureInfo.InvariantCulture)} {y2.ToString(CultureInfo.InvariantCulture)}";
                    
                    lines.Add(new DependencyLine 
                    { 
                        FromId = depId, 
                        ToId = task.Id, 
                        Path = path 
                    });
                }
            }
        }

        return lines;
    }

    private class DependencyLine
    {
        public string FromId { get; set; } = "";
        public string ToId { get; set; } = "";
        public string Path { get; set; } = "";
    }

    private (double Left, double Width) CalculateTaskPosition(GanttTask task)
    {
        var columnWidth = GetColumnWidth();
        double startOffset = 0;
        double width = 0;

        if (ViewMode == GanttViewMode.Month && PeriodBoundaries.Count > 0)
        {
             // For month view, calculate based on actual period boundaries
            double totalOffset = 0;
            for (int i = 0; i < PeriodBoundaries.Count; i++)
            {
                var periodStart = PeriodBoundaries[i];
                var periodEnd = i < PeriodBoundaries.Count - 1 ? PeriodBoundaries[i + 1] : _timelineEnd.AddDays(1);
                var periodDays = (periodEnd - periodStart).TotalDays;
                
                if (task.StartDate >= periodEnd)
                {
                    totalOffset += columnWidth;
                }
                else if (task.StartDate >= periodStart && task.StartDate < periodEnd)
                {
                    var daysInto = (task.StartDate - periodStart).TotalDays;
                    startOffset = totalOffset + (daysInto / periodDays * columnWidth);
                    break;
                }
                else if (task.StartDate < periodStart)
                {
                    startOffset = totalOffset;
                    break;
                }
            }
            
            // Calculate width based on actual days spanning across months
            double remainingDuration = task.DurationDays;
            var currentDate = task.StartDate;
            
            for (int i = 0; i < PeriodBoundaries.Count && remainingDuration > 0; i++)
            {
                var periodStart = PeriodBoundaries[i];
                var periodEnd = i < PeriodBoundaries.Count - 1 ? PeriodBoundaries[i + 1] : _timelineEnd.AddDays(1);
                var periodDays = (periodEnd - periodStart).TotalDays;
                
                if (currentDate >= periodEnd)
                {
                    continue;
                }
                
                var effectiveStart = currentDate > periodStart ? currentDate : periodStart;
                var taskEnd = task.EndDate.AddDays(1); // EndDate is inclusive
                var effectiveEnd = taskEnd < periodEnd ? taskEnd : periodEnd;
                
                if (effectiveStart < effectiveEnd)
                {
                    var daysInPeriod = (effectiveEnd - effectiveStart).TotalDays;
                    width += (daysInPeriod / periodDays * columnWidth);
                    remainingDuration -= daysInPeriod;
                    currentDate = effectiveEnd;
                }
            }
             width = task.IsMilestone ? 16 : Math.Max(16, width);
        }
        else
        {
            var daysPerColumn = GetDaysPerColumn();
            startOffset = (task.StartDate - _timelineStart).TotalDays / daysPerColumn * columnWidth;
            width = task.IsMilestone ? 16 : Math.Max(16, task.DurationDays / daysPerColumn * columnWidth);
        }
        
        return (startOffset, width);
    }

    private string GetTaskBgColor(GanttTask task)
    {
        if (!string.IsNullOrEmpty(task.Color))
        {
            // Lighter version of the color
            return task.Color + "40";
        }

        return task.Status switch
        {
            GanttTaskStatus.Completed => "#d1fae540",
            GanttTaskStatus.InProgress => "#dbeafe",
            GanttTaskStatus.Delayed => "#fee2e2",
            GanttTaskStatus.Cancelled => "#f3f4f6",
            _ => "#e5e7eb"
        };
    }

    private async Task SetViewMode(GanttViewMode mode)
    {
        if (ViewMode != mode)
        {
            ViewMode = mode;
            _currentColumnWidth = GetDefaultColumnWidth(mode); // Reset zoom on view change
            CalculateTimeline();
            await UpdateJsOptionsAsync();
            await ViewModeChanged.InvokeAsync(mode);
        }
    }

    // JS Interop for drag/resize
    private ElementReference _timelineContainer;
    private DotNetObjectReference<BwGantt>? _netRef;
    private string? _instanceId;
    private bool _isJsInitialized;
    private bool _previousEditableState;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (Editable && !_isJsInitialized)
        {
            await InitializeJsInteropAsync();
        }
        else if (!Editable && _isJsInitialized)
        {
            await DisposeJsAsync();
        }
        
        // Track editable state changes
        _previousEditableState = Editable;
    }

    private async Task InitializeJsInteropAsync()
    {
        if (_isJsInitialized) return;
        
        _netRef = DotNetObjectReference.Create(this);
        var columnWidth = GetColumnWidth();
        var daysPerColumn = GetDaysPerColumn();
        
        // Retry logic for WASM
        var retries = 0;
        while (!_isJsInitialized && retries < 3)
        {
            try
            {
                await Task.Delay(retries * 50); // Progressive delay
                _instanceId = await JS.InvokeAsync<string>(
                    "Blazwind.Gantt.init", 
                    _timelineContainer, 
                    _netRef,
                    daysPerColumn,
                    columnWidth,
                    32 // row height
                );
                _isJsInitialized = true;
            }
            catch
            {
                retries++;
                if (retries >= 3)
                {
                    // Give up after 3 retries
                    break;
                }
            }
        }
    }
    
    private async Task UpdateJsOptionsAsync()
    {
        if (!_isJsInitialized || string.IsNullOrEmpty(_instanceId)) return;
        
        try
        {
            await JS.InvokeVoidAsync(
                "Blazwind.Gantt.updateOptions",
                _instanceId,
                GetDaysPerColumn(),
                GetColumnWidth()
            );
        }
        catch
        {
            // JS not available
        }
    }
    
    private async Task DisposeJsAsync()
    {
        if (_instanceId != null)
        {
            try
            {
                await JS.InvokeVoidAsync("Blazwind.Gantt.dispose", _instanceId);
            }
            catch { }
        }
        _netRef?.Dispose();
        _netRef = null;
        _instanceId = null;
        _isJsInitialized = false;
    }

    [JSInvokable]
    public async Task HandleTaskDragFromJs(string taskId, int daysMoved)
    {
        var task = FlatTasks.FirstOrDefault(t => t.Id == taskId);
        if (task == null) return;

        var oldStart = task.StartDate;
        var oldEnd = task.EndDate;
        
        // Update task dates
        task.StartDate = task.StartDate.AddDays(daysMoved);
        task.EndDate = task.EndDate.AddDays(daysMoved);

        var args = new GanttTaskDragEventArgs
        {
            Task = task,
            OldStartDate = oldStart,
            OldEndDate = oldEnd,
            NewStartDate = task.StartDate,
            NewEndDate = task.EndDate,
            DaysMoved = daysMoved
        };
        
        await OnTaskDrag.InvokeAsync(args);
        StateHasChanged();
    }

    [JSInvokable]
    public async Task HandleTaskResizeFromJs(string taskId, int startDaysDelta, int endDaysDelta)
    {
        var task = FlatTasks.FirstOrDefault(t => t.Id == taskId);
        if (task == null) return;

        var oldStart = task.StartDate;
        var oldEnd = task.EndDate;
        
        // Update task dates
        if (startDaysDelta != 0)
        {
            task.StartDate = task.StartDate.AddDays(startDaysDelta);
        }
        if (endDaysDelta != 0)
        {
            task.EndDate = task.EndDate.AddDays(endDaysDelta);
        }

        var args = new GanttTaskResizeEventArgs
        {
            Task = task,
            OldStartDate = oldStart,
            OldEndDate = oldEnd,
            NewStartDate = task.StartDate,
            NewEndDate = task.EndDate
        };
        
        await OnTaskResize.InvokeAsync(args);
        StateHasChanged();
    }

    [JSInvokable]
    public async Task HandleTaskClickFromJs(string taskId)
    {
        var task = FlatTasks.FirstOrDefault(t => t.Id == taskId);
        if (task != null)
        {
            await OnTaskClick.InvokeAsync(task);
        }
    }


    private async Task HandleTaskClick(GanttTask task)
    {
        await OnTaskClick.InvokeAsync(task);
    }

    public async ValueTask DisposeAsync()
    {
        await DisposeJsAsync();
    }
    
    // Helper method for rendering the task bar - referenced in Razor file
    private RenderFragment RenderTaskBar(GanttTask task) => builder =>
    {
        if (task.IsMilestone)
        {
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "class", "w-3 h-3 transform rotate-45 shadow-sm hover:scale-110 transition-transform");
            builder.AddAttribute(2, "style", $"background-color: {task.Color ?? "#8b5cf6"};");
            builder.CloseElement();
        }
        else
        {
            builder.OpenElement(3, "div");
            builder.AddAttribute(4, "class", "h-5 rounded shadow-sm relative overflow-hidden group transition-all hover:shadow-md");
            builder.AddAttribute(5, "style", $"width: 100%; background-color: {GetTaskBgColor(task)};");

            if (Editable)
            {
                builder.OpenElement(6, "div");
                builder.AddAttribute(7, "class", "bw-gantt-resize-handle bw-gantt-resize-left absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 transition-colors z-10");
                builder.CloseElement();
            }

            if (task.Progress > 0)
            {
                builder.OpenElement(8, "div");
                builder.AddAttribute(9, "class", "absolute inset-y-0 left-0 rounded-l");
                builder.AddAttribute(10, "style", $"width: {task.Progress}%; background-color: {task.Color ?? "#3b82f6"};");
                builder.CloseElement();
            }

            builder.OpenElement(11, "div");
            builder.AddAttribute(12, "class", "absolute inset-0 flex items-center justify-center px-1");
            builder.OpenElement(13, "span");
            builder.AddAttribute(14, "class", "text-[9px] font-medium text-white truncate drop-shadow");
            if (ShowBarLabels)
            {
                builder.AddContent(15, task.Title);
                if (task.Progress > 0 && task.Progress < 100)
                {
                    builder.AddContent(16, $" ({task.Progress}%)");
                }
            }
            else if (task.Progress > 0 && task.Progress < 100)
            {
                builder.AddContent(17, $"{task.Progress}%");
            }
            builder.CloseElement();
            builder.CloseElement();

            if (Editable)
            {
                builder.OpenElement(18, "div");
                builder.AddAttribute(19, "class", "bw-gantt-resize-handle bw-gantt-resize-right absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 transition-colors z-10");
                builder.CloseElement();
            }

            // Tooltip
            builder.OpenElement(20, "div");
            builder.AddAttribute(21, "class", "absolute left-0 bottom-full mb-1 hidden group-hover:block z-30 pointer-events-none");
            builder.OpenElement(22, "div");
            builder.AddAttribute(23, "class", "bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-lg");
            builder.OpenElement(24, "span");
            builder.AddAttribute(25, "class", "font-medium");
            builder.AddContent(26, task.Title);
            builder.CloseElement();
            builder.AddContent(27, $" - {task.Progress}%");
            builder.OpenElement(28, "br");
            builder.CloseElement();
            builder.AddContent(29, $"{task.StartDate:dd.MM} - {task.EndDate:dd.MM}");
            if (Editable)
            {
                builder.OpenElement(30, "br");
                builder.CloseElement();
                builder.OpenElement(31, "span");
                builder.AddAttribute(32, "class", "text-gray-400 text-[9px]");
                builder.AddContent(33, "Sürükle: taşı | Kenarlar: boyutlandır");
                builder.CloseElement();
            }
            builder.CloseElement();
            builder.CloseElement(); // Tooltip wrapper

            builder.CloseElement(); // Task bar container
        }
    };
}
