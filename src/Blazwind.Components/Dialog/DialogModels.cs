using Blazwind.Components.Shared;

namespace Blazwind.Components.Dialog;

public class DialogOptions
{
    public string? Width { get; set; }
    public string? Height { get; set; }
    public string? MaxWidth { get; set; }
    public bool Draggable { get; set; } = false;
    public bool Resizable { get; set; } = false;
    public bool CloseOnOverlayClick { get; set; } = true;
    public bool FullScreen { get; set; } = false;
    public bool ShowClose { get; set; } = true;
    public string? Class { get; set; }

    /// <summary>
    ///     Header title color. Default is Primary.
    /// </summary>
    public BwColor? TitleColor { get; set; }

    /// <summary>
    ///     Header title size. Default is Medium.
    /// </summary>
    public BwSize? TitleSize { get; set; }

    /// <summary>
    ///     If true, renders without the standard dialog frame (header, white bg, shadow).
    ///     Used for completely custom dialog components.
    /// </summary>
    public bool IsRaw { get; set; } = false;

    // Default values
    public static DialogOptions Default => new()
    {
        Width = "500px",
        MaxWidth = "90vw",
        CloseOnOverlayClick = true,
        TitleColor = BwColor.Primary,
        TitleSize = BwSize.Medium
    };
}

public class DialogResult
{
    internal DialogResult(bool canceled, object? data)
    {
        Canceled = canceled;
        Data = data;
    }

    public bool Canceled { get; }
    public object? Data { get; }

    public static DialogResult Ok(object? data)
    {
        return new DialogResult(false, data);
    }

    public static DialogResult Cancel()
    {
        return new DialogResult(true, null);
    }

    // Generic Helper
    public static DialogResult<T> Ok<T>(T data)
    {
        return new DialogResult<T>(false, data);
    }

    public static DialogResult<T> Cancel<T>()
    {
        return new DialogResult<T>(true, default);
    }
}

public class DialogResult<T>
{
    internal DialogResult(bool canceled, T? data)
    {
        Canceled = canceled;
        Data = data;
    }

    public bool Canceled { get; }
    public T? Data { get; }
}