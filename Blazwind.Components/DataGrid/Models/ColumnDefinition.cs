namespace Blazwind.Components.DataGrid.Models;

/// <summary>
/// Describes a column definition for use in export and other operations
/// </summary>
public class ColumnDefinition
{
    /// <summary>
    /// Unique identifier for the column
    /// </summary>
    public string Id { get; set; } = "";

    /// <summary>
    /// Column header title
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// Field/property name in the data source
    /// </summary>
    public string? Field { get; set; }

    /// <summary>
    /// Column width in pixels or CSS value
    /// </summary>
    public string? Width { get; set; }

    /// <summary>
    /// Minimum width in pixels
    /// </summary>
    public int MinWidth { get; set; } = 50;

    /// <summary>
    /// Maximum width in pixels (0 = unlimited)
    /// </summary>
    public int MaxWidth { get; set; } = 0;

    /// <summary>
    /// Is column visible
    /// </summary>
    public bool Visible { get; set; } = true;

    /// <summary>
    /// Is column sortable
    /// </summary>
    public bool Sortable { get; set; } = true;

    /// <summary>
    /// Is column filterable
    /// </summary>
    public bool Filterable { get; set; } = true;

    /// <summary>
    /// Filter type for this column
    /// </summary>
    public FilterType FilterType { get; set; } = FilterType.Text;

    /// <summary>
    /// Is column resizable
    /// </summary>
    public bool Resizable { get; set; } = true;

    /// <summary>
    /// Is column reorderable (can be dragged)
    /// </summary>
    public bool Reorderable { get; set; } = true;

    /// <summary>
    /// Frozen position (None, Left, Right)
    /// </summary>
    public FrozenPosition Frozen { get; set; } = FrozenPosition.None;

    /// <summary>
    /// Text alignment
    /// </summary>
    public TextAlign Align { get; set; } = TextAlign.Left;

    /// <summary>
    /// Display format string (e.g., "C2" for currency, "dd.MM.yyyy" for dates)
    /// </summary>
    public string? Format { get; set; }

    /// <summary>
    /// Column order index
    /// </summary>
    public int Order { get; set; } = 0;

    /// <summary>
    /// Filter options for Select filter type
    /// </summary>
    public IEnumerable<FilterOption>? FilterOptions { get; set; }

    /// <summary>
    /// CSS class for header cell
    /// </summary>
    public string? HeaderClass { get; set; }

    /// <summary>
    /// CSS class for body cells
    /// </summary>
    public string? CellClass { get; set; }

    /// <summary>
    /// Include in export
    /// </summary>
    public bool Exportable { get; set; } = true;
}

/// <summary>
/// Option for select-type filters
/// </summary>
public class FilterOption
{
    public string Text { get; set; } = "";
    public object? Value { get; set; }
}