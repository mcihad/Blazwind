using System.Linq.Expressions;
using Blazwind.Components.DataGrid.Models;
using Blazwind.Components.DataGrid.Services;
using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazwind.Components.DataGrid;

public partial class BwDataGrid<TItem> : BwBase, IAsyncDisposable where TItem : notnull
{
    [Inject] private IJSRuntime JS { get; set; } = default!;

    #region Parameters

    /// <summary>
    /// Data items to display
    /// </summary>
    [Parameter]
    public IEnumerable<TItem> Items { get; set; } = Enumerable.Empty<TItem>();

    /// <summary>
    /// Column definitions (as child content)
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Columns container (alternative to ChildContent)
    /// </summary>
    [Parameter]
    public RenderFragment? Columns { get; set; }

    /// <summary>
    /// Toolbar content
    /// </summary>
    [Parameter]
    public RenderFragment? ToolbarContent { get; set; }

    /// <summary>
    /// Footer content
    /// </summary>
    [Parameter]
    public RenderFragment? FooterContent { get; set; }

    /// <summary>
    /// Context menu content
    /// </summary>
    [Parameter]
    public RenderFragment<TItem>? ContextMenuContent { get; set; }

    /// <summary>
    /// Detail row template (expandable rows)
    /// </summary>
    [Parameter]
    public RenderFragment<TItem>? DetailRowTemplate { get; set; }

    /// <summary>
    /// Empty state content
    /// </summary>
    [Parameter]
    public RenderFragment? EmptyContent { get; set; }

    /// <summary>
    /// Loading state content
    /// </summary>
    [Parameter]
    public RenderFragment? LoadingContent { get; set; }

    /// <summary>
    /// Key selector for items (used for selection, expansion tracking)
    /// </summary>
    [Parameter]
    public Func<TItem, object>? KeySelector { get; set; }

    #endregion

    #region Appearance Parameters



    /// <summary>
    /// Grid height (e.g., "400px", "100%")
    /// </summary>
    [Parameter]
    public string? Height { get; set; }

    /// <summary>
    /// Enable striped rows
    /// </summary>
    [Parameter]
    public bool Striped { get; set; } = true;

    /// <summary>
    /// Enable hover effect on rows
    /// </summary>
    [Parameter]
    public bool Hoverable { get; set; } = true;

    /// <summary>
    /// Enable borders
    /// </summary>
    [Parameter]
    public bool Bordered { get; set; } = false;

    /// <summary>
    /// Compact mode (smaller padding)
    /// </summary>
    [Parameter]
    public bool Compact { get; set; } = false;

    /// <summary>
    /// Custom row class function
    /// </summary>
    [Parameter]
    public Func<TItem, string>? RowClass { get; set; }

    /// <summary>
    /// Custom row style function
    /// </summary>
    [Parameter]
    public Func<TItem, string>? RowStyle { get; set; }

    /// <summary>
    /// Custom CSS class for selected rows (overrides default blue background)
    /// </summary>
    [Parameter]
    public string? SelectedRowClass { get; set; }

    /// <summary>
    /// Sets a minimum width for the grid table to enable horizontal scrolling (e.g., "1200px")
    /// </summary>
    [Parameter]
    public string? TableMinWidth { get; set; }

    /// <summary>
    /// If true, sets the table min-width to "max-content", causing it to expand based on content
    /// </summary>
    [Parameter]
    public bool AutoFit { get; set; }

    /// <summary>
    /// Enable compact pagination mode (useful for mobile or small areas)
    /// </summary>
    [Parameter]
    public bool CompactPagination { get; set; } = false;

    #endregion

    #region Feature Toggles

    /// <summary>
    /// Enable sorting
    /// </summary>
    [Parameter]
    public bool EnableSorting { get; set; } = true;

    /// <summary>
    /// Enable multi-column sorting (Ctrl+Click)
    /// </summary>
    [Parameter]
    public bool EnableMultiSort { get; set; } = false;

    /// <summary>
    /// Enable filtering
    /// </summary>
    [Parameter]
    public bool EnableFiltering { get; set; } = false;

    /// <summary>
    /// Enable global search
    /// </summary>
    [Parameter]
    public bool EnableSearch { get; set; } = false;

    /// <summary>
    /// Enable pagination
    /// </summary>
    [Parameter]
    public bool EnablePagination { get; set; } = true;

    /// <summary>
    /// Enable column visibility toggle
    /// </summary>
    [Parameter]
    public bool EnableColumnToggle { get; set; } = false;

    /// <summary>
    /// Enable column reordering (drag & drop)
    /// </summary>
    [Parameter]
    public bool EnableColumnReorder { get; set; } = false;

    /// <summary>
    /// Filter mode (Row or Menu)
    /// </summary>
    [Parameter]
    public FilterMode FilterMode { get; set; } = FilterMode.Row;

    /// <summary>
    /// Enable column resizing
    /// </summary>
    [Parameter]
    public bool EnableColumnResize { get; set; } = false;

    /// <summary>
    /// Enable export functionality
    /// </summary>
    [Parameter]
    public bool EnableExport { get; set; } = false;

    /// <summary>
    /// Enable context menu
    /// </summary>
    [Parameter]
    public bool EnableContextMenu { get; set; } = false;

    /// <summary>
    /// Enable row expansion
    /// </summary>
    [Parameter]
    public bool EnableRowExpansion { get; set; } = false;

    /// <summary>
    /// Enable virtualization for large datasets
    /// </summary>
    [Parameter]
    public bool EnableVirtualization { get; set; } = false;

    #endregion

    #region Selection Parameters

    /// <summary>
    /// Selection mode (None, Single, Multiple)
    /// </summary>
    [Parameter]
    public BwSelectionMode SelectionMode { get; set; } = BwSelectionMode.None;

    /// <summary>
    /// Selected items
    /// </summary>
    [Parameter]
    public IEnumerable<TItem> SelectedItems { get; set; } = Enumerable.Empty<TItem>();

    /// <summary>
    /// Selected items changed callback
    /// </summary>
    [Parameter]
    public EventCallback<IEnumerable<TItem>> SelectedItemsChanged { get; set; }

    /// <summary>
    /// Row click callback
    /// </summary>
    [Parameter]
    public EventCallback<TItem> OnRowClick { get; set; }

    /// <summary>
    /// Row double-click callback
    /// </summary>
    [Parameter]
    public EventCallback<TItem> OnRowDoubleClick { get; set; }

    #endregion

    #region Pagination Parameters

    /// <summary>
    /// Current page (1-based)
    /// </summary>
    [Parameter]
    public int CurrentPage { get; set; } = 1;

    /// <summary>
    /// Current page changed callback
    /// </summary>
    [Parameter]
    public EventCallback<int> CurrentPageChanged { get; set; }

    /// <summary>
    /// Page size
    /// </summary>
    [Parameter]
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Page size changed callback
    /// </summary>
    [Parameter]
    public EventCallback<int> PageSizeChanged { get; set; }

    /// <summary>
    /// Available page sizes
    /// </summary>
    [Parameter]
    public int[] PageSizeOptions { get; set; } = { 10, 25, 50, 100 };

    /// <summary>
    /// Total items (for server-side pagination)
    /// </summary>
    [Parameter]
    public int? TotalItems { get; set; }

    #endregion

    #region Server-Side Parameters

    /// <summary>
    /// Enable server-side operations
    /// </summary>
    [Parameter]
    public bool ServerSide { get; set; } = false;

    /// <summary>
    /// State changed callback (for server-side operations)
    /// </summary>
    [Parameter]
    public EventCallback<DataGridState> OnStateChanged { get; set; }

    /// <summary>
    /// Loading state
    /// </summary>
    [Parameter]
    public bool IsLoading { get; set; } = false;

    #endregion

    #region Export Parameters

    /// <summary>
    /// Available exporters
    /// </summary>
    [Parameter]
    public IEnumerable<IDataGridExporter>? Exporters { get; set; }

    /// <summary>
    /// Export requested callback
    /// </summary>
    [Parameter]
    public EventCallback<ExportOptions> OnExportRequested { get; set; }

    #endregion

    #region State Persistence Parameters

    /// <summary>
    /// Unique key for state storage. When set, grid state will be persisted.
    /// </summary>
    [Parameter]
    public string? StateStorageKey { get; set; }

    /// <summary>
    /// State storage implementation. If null, uses LocalStorage if StateStorageKey is set.
    /// </summary>
    [Parameter]
    public IGridStateStorage? StateStorage { get; set; }

    /// <summary>
    /// Whether to auto-save state on column changes (resize, visibility, order)
    /// </summary>
    [Parameter]
    public bool AutoSaveState { get; set; } = true;

    /// <summary>
    /// Callback when state is saved
    /// </summary>
    [Parameter]
    public EventCallback<GridViewState> OnStateSaved { get; set; }

    /// <summary>
    /// Callback when state is loaded
    /// </summary>
    [Parameter]
    public EventCallback<GridViewState> OnStateLoaded { get; set; }

    #endregion

    #region Private Fields

    private List<BwDataGridColumn<TItem>> _columns = new();
    private HashSet<TItem> _selectedItems = new();
    private HashSet<string> _expandedKeys = new();
    private List<SortDescriptor> _sorts = new();
    private List<FilterDescriptor> _filters = new();
    private string _searchQuery = "";
    private string _columnSearchQuery = "";
    private bool _showColumnSelector = false;
    private DotNetObjectReference<BwDataGrid<TItem>>? _dotNetRef;

    // Context menu state
    private bool _showContextMenu = false;
    private double _contextMenuX = 0;
    private double _contextMenuY = 0;
    private TItem? _contextMenuItem;

    // Export menu state
    private bool _showExportMenu = false;

    // Internal pagination state (to prevent parameter override on re-render)
    private int _currentPageSize;
    private int _currentPage;
    private bool _paginationInitialized = false;

    #endregion

    #region Lifecycle

    protected override void OnInitialized()
    {
        if (string.IsNullOrEmpty(Id))
        {
            Id = $"bw-datagrid-{Guid.NewGuid():N}";
        }
        
        _selectedItems = new HashSet<TItem>(SelectedItems);
        _dotNetRef = DotNetObjectReference.Create(this);
    }

    protected override void OnParametersSet()
    {
        // Initialize internal pagination state from parameters only once
        if (!_paginationInitialized)
        {
            _currentPageSize = PageSize;
            _currentPage = CurrentPage;
            _paginationInitialized = true;
        }
        // Only sync if two-way binding callback is provided and parent explicitly changed the value
        // This allows external binding to override internal state while preventing fixed values from doing so
        else if (PageSizeChanged.HasDelegate && PageSize != _currentPageSize)
        {
            _currentPageSize = PageSize;
        }
        else if (CurrentPageChanged.HasDelegate && CurrentPage != _currentPage)
        {
            _currentPage = CurrentPage;
        }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            try
            {
                if (EnableColumnReorder || EnableColumnResize || EnableContextMenu)
                {
                    await InitializeJsFeatures();
                }

                // Initialize state storage and load saved state
                await InitializeStateStorage();
            }
            catch (JSException)
            {
                // JS may not be fully ready; safe to ignore
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        _dotNetRef?.Dispose();
    }

    #endregion

    #region Column Registration

    internal void RegisterColumn(BwDataGridColumn<TItem> column)
    {
        if (!_columns.Contains(column))
        {
            column.Order = _columns.Count;
            _columns.Add(column);
            StateHasChanged();
        }
    }

    internal void UnregisterColumn(BwDataGridColumn<TItem> column)
    {
        _columns.Remove(column);
    }

    #endregion

    #region Data Processing

    private IEnumerable<TItem> GetProcessedItems()
    {
        var items = Items ?? Enumerable.Empty<TItem>();

        if (ServerSide)
        {
            return items;
        }

        // Apply search
        if (!string.IsNullOrWhiteSpace(_searchQuery))
        {
            items = ApplySearch(items, _searchQuery);
        }

        // Apply filters
        if (_filters.Any())
        {
            items = ApplyFilters(items);
        }

        // Apply sorting
        if (_sorts.Any())
        {
            items = ApplySorting(items);
        }

        // Apply pagination
        if (EnablePagination)
        {
            items = items.Skip((_currentPage - 1) * _currentPageSize).Take(_currentPageSize);
        }

        return items;
    }

    private int GetTotalItemCount()
    {
        if (TotalItems.HasValue)
        {
            return TotalItems.Value;
        }

        var items = Items ?? Enumerable.Empty<TItem>();

        if (!string.IsNullOrWhiteSpace(_searchQuery))
        {
            items = ApplySearch(items, _searchQuery);
        }

        if (_filters.Any())
        {
            items = ApplyFilters(items);
        }

        return items.Count();
    }

    private IEnumerable<TItem> ApplySearch(IEnumerable<TItem> items, string query)
    {
        var lowerQuery = query.ToLower();

        return items.Where(item =>
        {
            foreach (var column in _columns.Where(c => c.Visible && c.Field != null))
            {
                var value = column.GetRawValue(item);
                if (value?.ToString()?.ToLower().Contains(lowerQuery) == true)
                {
                    return true;
                }
            }

            return false;
        });
    }

    private IEnumerable<TItem> ApplyFilters(IEnumerable<TItem> items)
    {
        foreach (var filter in _filters)
        {
            var column = _columns.FirstOrDefault(c => c.GetFieldName() == filter.Field);
            if (column?.Field == null) continue;

            items = items.Where(item => EvaluateFilter(item, column, filter));
        }

        return items;
    }

    private bool EvaluateFilter(TItem item, BwDataGridColumn<TItem> column, FilterDescriptor filter)
    {
        var value = column.GetRawValue(item);
        var filterValue = filter.Value;

        // Normalize for Date filter (ignore time)
        if (column.FilterType == FilterType.Date)
        {
            if (value is DateTime dtVal) value = dtVal.Date;
            if (filterValue is DateTime dtFilter) filterValue = dtFilter.Date;
        }

        if (value == null && filter.Operator != FilterOperator.IsNull && filter.Operator != FilterOperator.IsNotNull)
        {
            return false;
        }

        return filter.Operator switch
        {
            FilterOperator.Contains => value?.ToString()?.Contains(filterValue?.ToString() ?? "",
                filter.CaseSensitive ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase) == true,
            FilterOperator.NotContains => value?.ToString()?.Contains(filterValue?.ToString() ?? "",
                filter.CaseSensitive ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase) == false,
            FilterOperator.Equals => Compare(value, filterValue) == 0,
            FilterOperator.NotEquals => Compare(value, filterValue) != 0,
            FilterOperator.StartsWith => value?.ToString()?.StartsWith(filterValue?.ToString() ?? "",
                filter.CaseSensitive ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase) == true,
            FilterOperator.EndsWith => value?.ToString()?.EndsWith(filterValue?.ToString() ?? "",
                filter.CaseSensitive ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase) == true,
            FilterOperator.GreaterThan => Compare(value, filterValue) > 0,
            FilterOperator.GreaterThanOrEqual => Compare(value, filterValue) >= 0,
            FilterOperator.LessThan => Compare(value, filterValue) < 0,
            FilterOperator.LessThanOrEqual => Compare(value, filterValue) <= 0,
            FilterOperator.IsNull => value == null,
            FilterOperator.IsNotNull => value != null,
            FilterOperator.Between => Compare(value, filterValue) >= 0 && Compare(value, filter.SecondValue) <= 0,
            _ => true
        };
    }

    private static int Compare(object? a, object? b)
    {
        if (a == null && b == null) return 0;
        if (a == null) return -1;
        if (b == null) return 1;

        var typeA = a.GetType();
        var typeB = b.GetType();

        // Handle DateOnly vs DateTime
        if (a is DateOnly dateA && b is DateTime dateB)
        {
            return dateA.CompareTo(DateOnly.FromDateTime(dateB));
        }

        if (a is DateTime dtA && b is DateOnly dateOnlyB)
        {
            return DateOnly.FromDateTime(dtA).CompareTo(dateOnlyB);
        }

        // Handle Numerics (convert to decimal for safety)
        if (IsNumeric(typeA) && IsNumeric(typeB))
        {
            try
            {
                var decA = Convert.ToDecimal(a);
                var decB = Convert.ToDecimal(b);
                return decA.CompareTo(decB);
            }
            catch
            {
                // Fallback
            }
        }

        if (a is IComparable comparableA && b is IComparable)
        {
            try
            {
                // Try converting B to A's type
                var convertedB = Convert.ChangeType(b, typeA);
                return comparableA.CompareTo(convertedB);
            }
            catch
            {
                // If failed, try converting A to B's type
                try
                {
                    if (b is IComparable comparableB)
                    {
                        var convertedA = Convert.ChangeType(a, typeB);
                        return -comparableB.CompareTo(convertedA);
                    }
                }
                catch
                {
                    // Fallback to string comparison
                }
            }
        }

        return string.Compare(a.ToString(), b.ToString(), StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsNumeric(Type type)
    {
        type = Nullable.GetUnderlyingType(type) ?? type;
        return type == typeof(byte) || type == typeof(sbyte) ||
               type == typeof(short) || type == typeof(ushort) ||
               type == typeof(int) || type == typeof(uint) ||
               type == typeof(long) || type == typeof(ulong) ||
               type == typeof(float) || type == typeof(double) ||
               type == typeof(decimal);
    }

    private IEnumerable<TItem> ApplySorting(IEnumerable<TItem> items)
    {
        IOrderedEnumerable<TItem>? orderedItems = null;

        foreach (var sort in _sorts.OrderBy(s => s.Priority))
        {
            var column = _columns.FirstOrDefault(c => c.GetFieldName() == sort.Field);
            if (column?.Field == null) continue;

            if (orderedItems == null)
            {
                orderedItems = sort.Direction == SortDirection.Ascending
                    ? items.OrderBy(column.GetRawValue)
                    : items.OrderByDescending(column.GetRawValue);
            }
            else
            {
                orderedItems = sort.Direction == SortDirection.Ascending
                    ? orderedItems.ThenBy(column.GetRawValue)
                    : orderedItems.ThenByDescending(column.GetRawValue);
            }
        }

        return orderedItems ?? items;
    }

    #endregion

    #region Sorting

    private async Task HandleSort(BwDataGridColumn<TItem> column, bool isCtrlPressed = false)
    {
        if (!EnableSorting || !column.Sortable) return;

        var fieldName = column.GetFieldName();
        var existingSort = _sorts.FirstOrDefault(s => s.Field == fieldName);

        if (EnableMultiSort && isCtrlPressed)
        {
            // Multi-sort mode
            if (existingSort != null)
            {
                if (existingSort.Direction == SortDirection.Ascending)
                {
                    existingSort.Direction = SortDirection.Descending;
                }
                else
                {
                    _sorts.Remove(existingSort);
                }
            }
            else
            {
                _sorts.Add(new SortDescriptor
                {
                    Field = fieldName,
                    Direction = SortDirection.Ascending,
                    Priority = _sorts.Count
                });
            }
        }
        else
        {
            // Single-sort mode
            if (existingSort != null && _sorts.Count == 1)
            {
                if (existingSort.Direction == SortDirection.Ascending)
                {
                    existingSort.Direction = SortDirection.Descending;
                }
                else
                {
                    _sorts.Clear();
                }
            }
            else
            {
                _sorts.Clear();
                _sorts.Add(new SortDescriptor
                {
                    Field = fieldName,
                    Direction = SortDirection.Ascending,
                    Priority = 0
                });
            }
        }

        CurrentPage = 1;
        await NotifyStateChanged();
    }

    private SortDescriptor? GetSortForColumn(BwDataGridColumn<TItem> column)
    {
        return _sorts.FirstOrDefault(s => s.Field == column.GetFieldName());
    }

    #endregion

    #region Filtering

    private async Task HandleFilterChanged(string field, FilterDescriptor? filter)
    {
        _filters.RemoveAll(f => f.Field == field);

        if (filter != null && filter.Value != null)
        {
            filter.Field = field;
            _filters.Add(filter);
        }

        CurrentPage = 1;
        await NotifyStateChanged();
    }

    private async Task HandleSearchChanged(string query)
    {
        _searchQuery = query;
        CurrentPage = 1;
        await NotifyStateChanged();
    }

    private FilterDescriptor? GetFilterForColumn(BwDataGridColumn<TItem> column)
    {
        return _filters.FirstOrDefault(f => f.Field == column.GetFieldName());
    }

    #endregion

    #region Selection

    private async Task HandleRowClick(TItem item)
    {
        await OnRowClick.InvokeAsync(item);

        if (SelectionMode == BwSelectionMode.Single || SelectionMode == BwSelectionMode.SingleRow)
        {
            _selectedItems.Clear();
            _selectedItems.Add(item);
            await SelectedItemsChanged.InvokeAsync(_selectedItems);
            await NotifyStateChanged(); // Explicitly trigger UI update
        }
    }

    private async Task HandleRowDoubleClick(TItem item)
    {
        await OnRowDoubleClick.InvokeAsync(item);
    }

    private async Task ToggleSelection(TItem item)
    {
        if (SelectionMode == BwSelectionMode.None) return;

        if (SelectionMode == BwSelectionMode.Single || SelectionMode == BwSelectionMode.SingleRow)
        {
            _selectedItems.Clear();
            _selectedItems.Add(item);
        }
        else
        {
            if (_selectedItems.Contains(item))
            {
                _selectedItems.Remove(item);
            }
            else
            {
                _selectedItems.Add(item);
            }
        }

        await SelectedItemsChanged.InvokeAsync(_selectedItems);
        await NotifyStateChanged();
    }

    private async Task ToggleSelectAll(bool selectAll)
    {
        if (SelectionMode != BwSelectionMode.Multiple) return;

        // Get items for the current page only
        var currentViewItems = GetProcessedItems().ToList();

        if (selectAll)
        {
            foreach (var item in currentViewItems)
            {
                _selectedItems.Add(item);
            }
        }
        else
        {
            // Only remove items that are in the current page
            foreach (var item in currentViewItems)
            {
                _selectedItems.Remove(item);
            }
        }

        await SelectedItemsChanged.InvokeAsync(_selectedItems);
    }

    private bool IsItemSelected(TItem item) => _selectedItems.Contains(item);

    private bool IsAllSelected()
    {
        var processedItems = GetProcessedItems().ToList();
        return processedItems.Any() && processedItems.All(i => _selectedItems.Contains(i));
    }

    private bool IsAnySelected() => _selectedItems.Any();

    #endregion

    #region Pagination

    private async Task HandlePageChanged(int page)
    {
        _currentPage = page;
        CurrentPage = page;
        await CurrentPageChanged.InvokeAsync(page);
        await NotifyStateChanged();
    }

    private async Task HandlePageSizeChanged(int size)
    {
        _currentPageSize = size;
        _currentPage = 1;
        PageSize = size;
        CurrentPage = 1;
        await PageSizeChanged.InvokeAsync(size);
        await NotifyStateChanged();
    }

    #endregion

    #region Row Expansion

    private string GetItemKey(TItem item)
    {
        if (KeySelector != null)
        {
            return KeySelector(item)?.ToString() ?? item.GetHashCode().ToString();
        }

        return item.GetHashCode().ToString();
    }

    private bool IsRowExpanded(TItem item) => _expandedKeys.Contains(GetItemKey(item));

    private void ToggleRowExpansion(TItem item)
    {
        var key = GetItemKey(item);
        if (_expandedKeys.Contains(key))
        {
            _expandedKeys.Remove(key);
        }
        else
        {
            _expandedKeys.Add(key);
        }
    }

    #endregion

    #region Column Management

    private void ToggleColumnSelector()
    {
        _showColumnSelector = !_showColumnSelector;
    }

    private async Task ToggleColumnVisibility(BwDataGridColumn<TItem> column)
    {
#pragma warning disable BL0005
        column.Visible = !column.Visible;
#pragma warning restore BL0005
        StateHasChanged();
        await TrySaveStateAsync();
    }

    private IEnumerable<BwDataGridColumn<TItem>> GetVisibleColumns()
    {
        return _columns
            .Where(c => c.Visible)
            .OrderBy(c => c.Frozen == FrozenPosition.Left ? 0 : c.Frozen == FrozenPosition.Right ? 2 : 1)
            .ThenBy(c => c.Order);
    }

    private IEnumerable<BwDataGridColumn<TItem>> GetFrozenLeftColumns()
    {
        return _columns.Where(c => c.Visible && c.Frozen == FrozenPosition.Left).OrderBy(c => c.Order);
    }

    private IEnumerable<BwDataGridColumn<TItem>> GetFrozenRightColumns()
    {
        return _columns.Where(c => c.Visible && c.Frozen == FrozenPosition.Right).OrderBy(c => c.Order);
    }

    private IEnumerable<BwDataGridColumn<TItem>> GetScrollableColumns()
    {
        return _columns.Where(c => c.Visible && c.Frozen == FrozenPosition.None).OrderBy(c => c.Order);
    }

    #endregion

    #region Context Menu

    private void ShowContextMenu(TItem item, double x, double y)
    {
        if (!EnableContextMenu || ContextMenuContent == null) return;

        _contextMenuItem = item;
        _contextMenuX = x;
        _contextMenuY = y;
        _showContextMenu = true;
    }

    private void HideContextMenu()
    {
        _showContextMenu = false;
        _contextMenuItem = default;
    }

    #endregion

    #region Export

    // Built-in exporters
    private static readonly IDataGridExporter[] _builtInExporters = new IDataGridExporter[]
    {
        new ExcelExporter(),
        new CsvExporter(),
        new TsvExporter(),
        new JsonExporter()
    };

    /// <summary>
    /// Get all available exporters (built-in + custom)
    /// </summary>
    private IEnumerable<IDataGridExporter> GetAllExporters()
    {
        // Return built-in exporters first, then any custom exporters
        foreach (var exporter in _builtInExporters)
        {
            yield return exporter;
        }

        if (Exporters != null)
        {
            foreach (var exporter in Exporters)
            {
                yield return exporter;
            }
        }
    }

    /// <summary>
    /// Export data using the specified exporter
    /// </summary>
    private async Task ExportData(IDataGridExporter exporter)
    {
        try
        {
            // Get items to export
            var items = Items ?? Enumerable.Empty<TItem>();

            // Apply filters if enabled
            if (!string.IsNullOrWhiteSpace(_searchQuery))
            {
                items = ApplySearch(items, _searchQuery);
            }

            if (_filters.Any())
            {
                items = ApplyFilters(items);
            }

            // Apply sorting
            if (_sorts.Any())
            {
                items = ApplySorting(items);
            }

            // Get exportable columns
            var columnDefs = _columns
                .Where(c => c.Visible && c.Exportable)
                .OrderBy(c => c.Order)
                .Select(c => c.ToDefinition())
                .ToList();

            // Create export options
            var options = new ExportOptions
            {
                Format = exporter.FileExtension switch
                {
                    "csv" => ExportFormat.Csv,
                    "json" => ExportFormat.Json,
                    _ => ExportFormat.Custom
                },
                FileName = $"export_{DateTime.Now:yyyyMMdd_HHmmss}",
                IncludeHeaders = true
            };

            // Export data
            var bytes = await exporter.ExportAsync(
                items,
                columnDefs,
                options,
                (item, col) =>
                {
                    var column = _columns.FirstOrDefault(c => c.GetId() == col.Id);
                    return column?.GetRawValue(item);
                });

            // Trigger file download via JS
            var fileName = $"{options.FileName}.{exporter.FileExtension}";
            await DownloadFileAsync(bytes, fileName, exporter.ContentType);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Export error: {ex.Message}");
        }
    }

    private async Task DownloadFileAsync(byte[] content, string fileName, string contentType)
    {
        try
        {
            var base64 = Convert.ToBase64String(content);
            // Simple download approach with proper file name
            var script = $@"
                (function() {{
                    var byteString = atob('{base64}');
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {{
                        ia[i] = byteString.charCodeAt(i);
                    }}
                    var blob = new Blob([ab], {{ type: '{contentType}' }});
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = '{fileName}';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }})();
            ";
            await JS.InvokeVoidAsync("eval", script);
        }
        catch (JSException ex)
        {
            Console.WriteLine($"Download error: {ex.Message}");
        }
    }

    private async Task HandleExport(ExportOptions options)
    {
        await OnExportRequested.InvokeAsync(options);
    }

    private void ToggleExportMenu()
    {
        _showExportMenu = !_showExportMenu;
    }

    private void HideExportMenu()
    {
        _showExportMenu = false;
    }

    private async Task ExportDataAndCloseMenu(IDataGridExporter exporter)
    {
        _showExportMenu = false;
        await ExportData(exporter);
    }

    /// <summary>
    /// Export data by file format extension (xlsx, csv, tsv, json)
    /// </summary>
    private async Task ExportByFormat(string format)
    {
        var exporter = GetAllExporters().FirstOrDefault(e => e.FileExtension == format);
        if (exporter != null)
        {
            await ExportData(exporter);
        }
    }

    #endregion

    #region State Management

    private DataGridState GetState()
    {
        return new DataGridState
        {
            CurrentPage = CurrentPage,
            PageSize = PageSize,
            TotalItems = GetTotalItemCount(),
            Sorts = _sorts.Select(s => new SortDescriptor
            {
                Field = s.Field,
                Direction = s.Direction,
                Priority = s.Priority
            }).ToList(),
            Filters = _filters.Select(f => new FilterDescriptor
            {
                Field = f.Field,
                Operator = f.Operator,
                Value = f.Value,
                SecondValue = f.SecondValue,
                Logic = f.Logic,
                CaseSensitive = f.CaseSensitive
            }).ToList(),
            SearchQuery = _searchQuery,
            SelectedKeys = _selectedItems.Select(GetItemKey).ToHashSet(),
            HiddenColumns = _columns.Where(c => !c.Visible).Select(c => c.GetId()).ToHashSet()
        };
    }

    private async Task NotifyStateChanged()
    {
        if (ServerSide && OnStateChanged.HasDelegate)
        {
            await OnStateChanged.InvokeAsync(GetState());
        }
    }

    /// <summary>
    /// Refresh the grid data (call after server-side data is loaded)
    /// </summary>
    public void Refresh()
    {
        StateHasChanged();
    }

    /// <summary>
    /// Clear all filters
    /// </summary>
    public async Task ClearFilters()
    {
        _filters.Clear();
        _searchQuery = "";
        CurrentPage = 1;
        await NotifyStateChanged();
        StateHasChanged();
    }

    /// <summary>
    /// Clear all sorting
    /// </summary>
    public async Task ClearSorting()
    {
        _sorts.Clear();
        await NotifyStateChanged();
        StateHasChanged();
    }

    /// <summary>
    /// Clear selection
    /// </summary>
    public async Task ClearSelection()
    {
        _selectedItems.Clear();
        await SelectedItemsChanged.InvokeAsync(_selectedItems);
    }

    #endregion

    #region JS Interop

    private async Task InitializeJsFeatures()
    {
        if (_dotNetRef == null) return;

        try
        {
            // Wait for global Blazwind object to be available (IIFE loads async)
            var maxRetries = 10;
            var retryDelay = 100;
            var blazwindAvailable = false;

            for (int i = 0; i < maxRetries; i++)
            {
                blazwindAvailable = await JS.InvokeAsync<bool>("eval", "typeof window.Blazwind !== 'undefined'");
                if (blazwindAvailable) break;
                await Task.Delay(retryDelay);
            }

            if (!blazwindAvailable)
            {
                await JS.InvokeVoidAsync("console.warn", "BwDataGrid: Blazwind global not available after retries");
                return;
            }

            // Initialize column resize if enabled
            if (EnableColumnResize)
            {
                await JS.InvokeVoidAsync("Blazwind.ColumnResize.initColumnResize", _dotNetRef, new
                {
                    containerId = Id,
                    minWidth = 50,
                    maxWidth = 500,
                    autoFit = AutoFit
                });
            }

            // Initialize column drag/reorder if enabled
            if (EnableColumnReorder)
            {
                await JS.InvokeVoidAsync("Blazwind.ColumnDrag.initColumnDrag", _dotNetRef, new
                {
                    containerId = Id
                });
            }
        }
        catch (JSException ex)
        {
            await JS.InvokeVoidAsync("console.error", $"BwDataGrid: JSException in InitializeJsFeatures: {ex.Message}");
        }
    }

    [JSInvokable]
    public void OnColumnReordered(string columnId, int newIndex)
    {
        var column = _columns.FirstOrDefault(c => c.GetId() == columnId);
        if (column == null) return;

        var oldIndex = column.Order;

        foreach (var col in _columns)
        {
            if (col == column)
            {
                col.Order = newIndex;
            }
            else if (oldIndex < newIndex && col.Order > oldIndex && col.Order <= newIndex)
            {
                col.Order--;
            }
            else if (oldIndex > newIndex && col.Order >= newIndex && col.Order < oldIndex)
            {
                col.Order++;
            }
        }

        StateHasChanged();
        _ = TrySaveStateAsync();
    }

    [JSInvokable]
    public void OnColumnResized(string columnId, int width)
    {
        var column = _columns.FirstOrDefault(c => c.GetId() == columnId);
        if (column == null) return;

        column.CurrentWidth = Math.Max(column.MinWidth,
            Math.Min(width, column.MaxWidth > 0 ? column.MaxWidth : int.MaxValue));
        StateHasChanged();
        _ = TrySaveStateAsync();
    }

    [JSInvokable]
    public void OnContextMenuRequested(double x, double y, string itemKey)
    {
        var item = GetProcessedItems().FirstOrDefault(i => GetItemKey(i) == itemKey);
        if (item != null)
        {
            ShowContextMenu(item, x, y);
            StateHasChanged();
        }
    }

    #endregion

    #region State Persistence

    private IGridStateStorage? _effectiveStateStorage;

    private async Task InitializeStateStorage()
    {
        if (string.IsNullOrEmpty(StateStorageKey)) return;

        _effectiveStateStorage = StateStorage ?? new LocalStorageGridStateStorage(JS);
        await LoadStateAsync();
    }

    /// <summary>
    /// Loads grid state from storage.
    /// </summary>
    public async Task LoadStateAsync()
    {
        if (_effectiveStateStorage == null || string.IsNullOrEmpty(StateStorageKey)) return;

        try
        {
            var state = await _effectiveStateStorage.LoadStateAsync(StateStorageKey);
            if (state == null) return;

            // Apply column states
            foreach (var columnState in state.Columns)
            {
                var column = _columns.FirstOrDefault(c => c.GetId() == columnState.ColumnId);
                if (column != null)
                {
                    if (columnState.Width.HasValue)
                        column.CurrentWidth = columnState.Width.Value;

#pragma warning disable BL0005
                    column.Visible = columnState.Visible;
                    column.Order = columnState.Order;
#pragma warning restore BL0005
                }
            }

            // Apply sort states
            if (state.Sorts.Any())
            {
                _sorts.Clear();
                foreach (var sortConfig in state.Sorts)
                {
                    _sorts.Add(new SortDescriptor
                    {
                        Field = sortConfig.Field,
                        Direction = sortConfig.Ascending ? SortDirection.Ascending : SortDirection.Descending,
                        Priority = sortConfig.Priority
                    });
                }
            }

            // Apply pagination
            if (state.PageSize.HasValue)
                PageSize = state.PageSize.Value;

            if (state.CurrentPage.HasValue)
                CurrentPage = state.CurrentPage.Value;

            await OnStateLoaded.InvokeAsync(state);
            StateHasChanged();
        }
        catch
        {
            // Ignore state load errors
        }
    }

    /// <summary>
    /// Saves current grid state to storage.
    /// </summary>
    public async Task SaveStateAsync()
    {
        if (_effectiveStateStorage == null || string.IsNullOrEmpty(StateStorageKey)) return;

        try
        {
            var state = GetCurrentViewState();
            await _effectiveStateStorage.SaveStateAsync(StateStorageKey, state);
            await OnStateSaved.InvokeAsync(state);
        }
        catch
        {
            // Ignore state save errors
        }
    }

    /// <summary>
    /// Gets the current grid view state.
    /// </summary>
    public GridViewState GetCurrentViewState()
    {
        return new GridViewState
        {
            Columns = _columns.Select(c => new ColumnViewState
            {
                ColumnId = c.GetId(),
                Width = c.CurrentWidth,
                Visible = c.Visible,
                Order = c.Order
            }).ToList(),
            Sorts = _sorts.Select(s => new SortConfiguration
            {
                Field = s.Field,
                Ascending = s.Direction == SortDirection.Ascending,
                Priority = s.Priority
            }).ToList(),
            CurrentPage = CurrentPage,
            PageSize = PageSize,
            SavedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Clears saved state from storage.
    /// </summary>
    public async Task ClearSavedStateAsync()
    {
        if (_effectiveStateStorage == null || string.IsNullOrEmpty(StateStorageKey)) return;
        await _effectiveStateStorage.DeleteStateAsync(StateStorageKey);
    }

    private async Task TrySaveStateAsync()
    {
        if (AutoSaveState && !string.IsNullOrEmpty(StateStorageKey))
        {
            await SaveStateAsync();
        }
    }

    #endregion
}