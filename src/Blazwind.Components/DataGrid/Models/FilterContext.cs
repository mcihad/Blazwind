namespace Blazwind.Components.DataGrid.Models;

/// <summary>
///     Context for custom filter templates
/// </summary>
public class FilterContext
{
    /// <summary>
    ///     Field name being filtered
    /// </summary>
    public string Field { get; set; } = "";

    /// <summary>
    ///     Current filter applied to this field
    /// </summary>
    public FilterDescriptor? CurrentFilter { get; set; }

    /// <summary>
    ///     Callback to notify filter changes
    /// </summary>
    public Action<FilterDescriptor?> OnFilterChanged { get; set; } = _ => { };
}