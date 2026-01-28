namespace Blazwind.Components.Shared;

/// <summary>
///     Label position relative to form input
/// </summary>
public enum BwLabelPosition
{
    /// <summary>Label above the input (default)</summary>
    Top,

    /// <summary>Label to the left of the input (horizontal layout)</summary>
    Left,

    /// <summary>Floating label inside input, moves up on focus/value</summary>
    Floating,

    /// <summary>Label hidden visually but available for accessibility</summary>
    Hidden
}