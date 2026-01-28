namespace Blazwind.Components.DataGrid.Models;

/// <summary>
///     Describes a filter operation on a column
/// </summary>
public class FilterDescriptor
{
    /// <summary>
    ///     The field/property name to filter
    /// </summary>
    public string Field { get; set; } = "";

    /// <summary>
    ///     The filter operator (Contains, Equals, GreaterThan, etc.)
    /// </summary>
    public FilterOperator Operator { get; set; } = FilterOperator.Contains;

    /// <summary>
    ///     The filter value
    /// </summary>
    public object? Value { get; set; }

    /// <summary>
    ///     Second value for Between operator
    /// </summary>
    public object? SecondValue { get; set; }

    /// <summary>
    ///     Logical operator for combining with other filters
    /// </summary>
    public FilterLogic Logic { get; set; } = FilterLogic.And;

    /// <summary>
    ///     Case sensitivity for string comparisons
    /// </summary>
    public bool CaseSensitive { get; set; } = false;
}