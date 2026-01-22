namespace Blazwind.Components.DataGrid.Services;

/// <summary>
/// Interface for persisting and loading grid state.
/// Implement this interface to save grid state to different storage backends
/// (localStorage, database, cookies, etc.)
/// </summary>
public interface IGridStateStorage
{
    /// <summary>
    /// Saves the grid state asynchronously.
    /// </summary>
    /// <param name="key">Unique key identifying the grid</param>
    /// <param name="state">Grid state to save</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SaveStateAsync(string key, GridViewState state, CancellationToken cancellationToken = default);

    /// <summary>
    /// Loads the grid state asynchronously.
    /// </summary>
    /// <param name="key">Unique key identifying the grid</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Saved grid state or null if not found</returns>
    Task<GridViewState?> LoadStateAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes the saved grid state.
    /// </summary>
    /// <param name="key">Unique key identifying the grid</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteStateAsync(string key, CancellationToken cancellationToken = default);
}

/// <summary>
/// Represents the visual/layout state of a grid that can be persisted.
/// This is separate from DataGridState which is for server-side data operations.
/// </summary>
public class GridViewState
{
    /// <summary>
    /// Column states (widths, visibility, order)
    /// </summary>
    public List<ColumnViewState> Columns { get; set; } = new();

    /// <summary>
    /// Active sort configurations
    /// </summary>
    public List<SortConfiguration> Sorts { get; set; } = new();

    /// <summary>
    /// Current page number
    /// </summary>
    public int? CurrentPage { get; set; }

    /// <summary>
    /// Page size
    /// </summary>
    public int? PageSize { get; set; }

    /// <summary>
    /// Timestamp when state was saved
    /// </summary>
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Optional version for migration purposes
    /// </summary>
    public int Version { get; set; } = 1;
}

/// <summary>
/// Represents the state of a single column.
/// </summary>
public class ColumnViewState
{
    /// <summary>
    /// Column identifier (usually the field name)
    /// </summary>
    public string ColumnId { get; set; } = string.Empty;

    /// <summary>
    /// Column width in pixels (null = auto)
    /// </summary>
    public int? Width { get; set; }

    /// <summary>
    /// Whether the column is visible
    /// </summary>
    public bool Visible { get; set; } = true;

    /// <summary>
    /// Column order/position (0-based)
    /// </summary>
    public int Order { get; set; }
}

/// <summary>
/// Represents a sort configuration for state persistence.
/// </summary>
public class SortConfiguration
{
    /// <summary>
    /// Field/column being sorted
    /// </summary>
    public string Field { get; set; } = string.Empty;

    /// <summary>
    /// Sort direction (true = ascending, false = descending)
    /// </summary>
    public bool Ascending { get; set; } = true;

    /// <summary>
    /// Priority for multi-sort (lower = higher priority)
    /// </summary>
    public int Priority { get; set; }
}