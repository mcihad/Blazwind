namespace Blazwind.Components.Shared;

/// <summary>
///     Overflow behavior for BwFlow when content exceeds container
/// </summary>
public enum BwOverflow
{
    Visible, // overflow-visible (default, content can overflow)
    Hidden, // overflow-hidden (clip content)  
    Scroll, // overflow-auto (scroll when needed)
    ScrollX, // overflow-x-auto (horizontal scroll only)
    ScrollY // overflow-y-auto (vertical scroll only)
}