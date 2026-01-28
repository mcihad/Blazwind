namespace Blazwind.Components.DataGrid.Models;

/// <summary>
///     Filter operators for data grid filtering
/// </summary>
public enum FilterOperator
{
    Contains,
    NotContains,
    Equals,
    NotEquals,
    StartsWith,
    EndsWith,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    IsNull,
    IsNotNull,
    Between
}

/// <summary>
///     Logical operator for combining filters
/// </summary>
public enum FilterLogic
{
    And,
    Or
}

/// <summary>
///     Sort direction
/// </summary>
public enum SortDirection
{
    Ascending,
    Descending
}

/// <summary>
///     Filter input type for column filters
/// </summary>
public enum FilterType
{
    Text,
    Number,
    Date,
    DateTime,
    Select,
    Boolean,
    Custom
}

/// <summary>
///     Position for frozen columns
/// </summary>
public enum FrozenPosition
{
    None,
    Left,
    Right
}

/// <summary>
///     Text alignment for cells
/// </summary>
public enum TextAlign
{
    Left,
    Center,
    Right
}

/// <summary>
///     Export format types
/// </summary>
public enum ExportFormat
{
    Csv,
    Excel,
    Json,
    Custom
}

/// <summary>
///     Loading state for the grid
/// </summary>
public enum LoadingState
{
    Idle,
    Loading,
    Error
}

/// <summary>
///     Filter UI mode
/// </summary>
public enum FilterMode
{
    /// <summary>
    ///     Show filters in a separate row below headers (default)
    /// </summary>
    Row,

    /// <summary>
    ///     Show filters in a popup menu triggered by a header icon
    /// </summary>
    Menu
}