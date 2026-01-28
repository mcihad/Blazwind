namespace Blazwind.Components.DataGrid.Models;

/// <summary>
///     Comprehensive state object for the data grid.
///     Used for server-side operations and state persistence.
/// </summary>
/// <typeparam name="TFilter">Optional custom filter type</typeparam>
public class DataGridState<TFilter> where TFilter : class
{
    /// <summary>
    ///     Current page number (1-based)
    /// </summary>
    public int CurrentPage { get; set; } = 1;

    /// <summary>
    ///     Number of items per page
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    ///     Total number of items (for server-side pagination)
    /// </summary>
    public int TotalItems { get; set; }

    /// <summary>
    ///     List of active sort operations
    /// </summary>
    public List<SortDescriptor> Sorts { get; set; } = new();

    /// <summary>
    ///     List of active filter operations
    /// </summary>
    public List<FilterDescriptor> Filters { get; set; } = new();

    /// <summary>
    ///     Optional custom filter object for complex filtering scenarios
    /// </summary>
    public TFilter? CustomFilter { get; set; }

    /// <summary>
    ///     Keys of selected items
    /// </summary>
    public HashSet<string> SelectedKeys { get; set; } = new();

    /// <summary>
    ///     Column order (ColumnId -> Order index)
    /// </summary>
    public Dictionary<string, int> ColumnOrder { get; set; } = new();

    /// <summary>
    ///     Column widths (ColumnId -> Width in pixels)
    /// </summary>
    public Dictionary<string, int> ColumnWidths { get; set; } = new();

    /// <summary>
    ///     Hidden column IDs
    /// </summary>
    public HashSet<string> HiddenColumns { get; set; } = new();

    /// <summary>
    ///     Global search query
    /// </summary>
    public string? SearchQuery { get; set; }

    /// <summary>
    ///     Current loading state
    /// </summary>
    public LoadingState LoadingState { get; set; } = LoadingState.Idle;

    /// <summary>
    ///     Error message if LoadingState is Error
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    ///     Total pages based on TotalItems and PageSize
    /// </summary>
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalItems / PageSize) : 0;

    /// <summary>
    ///     Skip count for pagination
    /// </summary>
    public int Skip => (CurrentPage - 1) * PageSize;

    /// <summary>
    ///     Creates a copy of the state
    /// </summary>
    public DataGridState<TFilter> Clone()
    {
        return new DataGridState<TFilter>
        {
            CurrentPage = CurrentPage,
            PageSize = PageSize,
            TotalItems = TotalItems,
            Sorts = Sorts.Select(s => new SortDescriptor
            {
                Field = s.Field,
                Direction = s.Direction,
                Priority = s.Priority
            }).ToList(),
            Filters = Filters.Select(f => new FilterDescriptor
            {
                Field = f.Field,
                Operator = f.Operator,
                Value = f.Value,
                SecondValue = f.SecondValue,
                Logic = f.Logic,
                CaseSensitive = f.CaseSensitive
            }).ToList(),
            CustomFilter = CustomFilter,
            SelectedKeys = new HashSet<string>(SelectedKeys),
            ColumnOrder = new Dictionary<string, int>(ColumnOrder),
            ColumnWidths = new Dictionary<string, int>(ColumnWidths),
            HiddenColumns = new HashSet<string>(HiddenColumns),
            SearchQuery = SearchQuery,
            LoadingState = LoadingState,
            ErrorMessage = ErrorMessage
        };
    }
}

/// <summary>
///     Non-generic version of DataGridState for simple scenarios
/// </summary>
public class DataGridState : DataGridState<object>
{
}