namespace Blazwind.Components.Shared;

/// <summary>
/// Main axis alignment (justify-content)
/// </summary>
public enum BwMainAxisAlignment
{
    Start, // flex-start
    Center, // center
    End, // flex-end
    SpaceBetween,
    SpaceAround,
    SpaceEvenly
}

/// <summary>
/// Cross axis alignment (align-items)
/// </summary>
public enum BwCrossAxisAlignment
{
    Start, // flex-start
    Center, // center
    End, // flex-end
    Stretch, // stretch
    Baseline // baseline
}

/// <summary>
/// Spacing between items
/// </summary>
public enum BwSpacing
{
    None, // gap-0
    Xs, // gap-1
    Sm, // gap-2
    Md, // gap-4
    Lg, // gap-6
    Xl, // gap-8
    Xxl // gap-12
}