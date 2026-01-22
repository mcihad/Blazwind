namespace Blazwind.Components.Shared;

/// <summary>
/// Flex container direction (flex-direction)
/// </summary>
public enum BwFlexDirection
{
    Row, // flex-row
    RowReverse, // flex-row-reverse
    Column, // flex-col
    ColumnReverse // flex-col-reverse
}

/// <summary>
/// Flex wrap behavior (flex-wrap)
/// </summary>
public enum BwFlexWrap
{
    NoWrap, // flex-nowrap
    Wrap, // flex-wrap
    WrapReverse // flex-wrap-reverse
}

/// <summary>
/// Align content for multi-line flex containers (align-content)
/// </summary>
public enum BwAlignContent
{
    Normal, // content-normal
    Start, // content-start
    Center, // content-center
    End, // content-end
    SpaceBetween, // content-between
    SpaceAround, // content-around
    SpaceEvenly, // content-evenly
    Stretch // content-stretch
}

/// <summary>
/// Self alignment for flex items (align-self)
/// </summary>
public enum BwAlignSelf
{
    Auto, // self-auto
    Start, // self-start
    Center, // self-center
    End, // self-end
    Stretch, // self-stretch
    Baseline // self-baseline
}