namespace Blazwind.Components.Table;

/// <summary>
///     Represents the current state of a BwTable for server-side operations.
/// </summary>
public class BwTableState
{
    public int CurrentPage { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortColumn { get; set; }
    public bool SortDescending { get; set; }
}