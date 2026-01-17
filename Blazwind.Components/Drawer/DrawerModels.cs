using Blazwind.Components.Shared;

namespace Blazwind.Components.Drawer;

/// <summary>
/// Options for configuring a drawer instance
/// </summary>
public class DrawerOptions
{
    /// <summary>Position of the drawer (Left, Right, Top, Bottom)</summary>
    public BwDirection Position { get; set; } = BwDirection.Right;

    /// <summary>Preset size of the drawer</summary>
    public BwSize Size { get; set; } = BwSize.Medium;

    /// <summary>Custom width (overrides Size for Left/Right drawers)</summary>
    public string? Width { get; set; }

    /// <summary>Custom height (overrides Size for Top/Bottom drawers)</summary>
    public string? Height { get; set; }

    /// <summary>Minimum size when resizing</summary>
    public string? MinSize { get; set; }

    /// <summary>Maximum size when resizing</summary>
    public string? MaxSize { get; set; }

    /// <summary>Allow user to resize by dragging edge</summary>
    public bool Resizable { get; set; } = false;

    /// <summary>Show backdrop overlay</summary>
    public bool ShowOverlay { get; set; } = true;

    /// <summary>Close when overlay is clicked</summary>
    public bool CloseOnOverlayClick { get; set; } = true;

    /// <summary>Close when ESC key is pressed</summary>
    public bool CloseOnEscape { get; set; } = true;

    /// <summary>Show close button in header</summary>
    public bool ShowClose { get; set; } = true;

    /// <summary>Visual variant</summary>
    public BwColor Color { get; set; } = BwColor.Secondary;

    /// <summary>Additional CSS classes</summary>
    public string? Class { get; set; }

    /// <summary>Default options</summary>
    public static DrawerOptions Default => new()
    {
        Position = BwDirection.Right,
        Size = BwSize.Medium,
        ShowOverlay = true,
        CloseOnOverlayClick = true,
        CloseOnEscape = true,
        ShowClose = true
    };
}

/// <summary>
/// Result returned when a drawer is closed
/// </summary>
public class DrawerResult
{
    public bool Canceled { get; }
    public object? Data { get; }

    internal DrawerResult(bool canceled, object? data)
    {
        Canceled = canceled;
        Data = data;
    }

    public static DrawerResult Ok(object? data = null) => new(false, data);
    public static DrawerResult Cancel() => new(true, null);
}

/// <summary>
/// Generic result for typed data return
/// </summary>
public class DrawerResult<T>
{
    public bool Canceled { get; }
    public T? Data { get; }

    internal DrawerResult(bool canceled, T? data)
    {
        Canceled = canceled;
        Data = data;
    }

    public static DrawerResult<T> Ok(T data) => new(false, data);
    public static DrawerResult<T> Cancel() => new(true, default);
}