namespace Blazwind.Components.Shared;

/// <summary>
///     Selection mode for lists, tables, etc.
/// </summary>
public enum BwSelectionMode
{
    /// <summary>No selection</summary>
    None,

    /// <summary>Single item selection</summary>
    Single,

    /// <summary>Multiple item selection</summary>
    Multiple,

    /// <summary>Single item selection without radio/checkbox column</summary>
    SingleRow
}