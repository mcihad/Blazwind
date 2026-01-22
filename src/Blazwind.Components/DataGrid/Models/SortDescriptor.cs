namespace Blazwind.Components.DataGrid.Models;

/// <summary>
/// Describes a sort operation on a column
/// </summary>
public class SortDescriptor
{
    /// <summary>
    /// The field/property name to sort by
    /// </summary>
    public string Field { get; set; } = "";

    /// <summary>
    /// Sort direction (Ascending or Descending)
    /// </summary>
    public SortDirection Direction { get; set; } = SortDirection.Ascending;

    /// <summary>
    /// Sort priority for multi-column sorting (lower = higher priority)
    /// </summary>
    public int Priority { get; set; } = 0;
}