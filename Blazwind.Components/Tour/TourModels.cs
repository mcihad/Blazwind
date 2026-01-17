namespace Blazwind.Components.Tour;

public class TourStep
{
    public string TargetSelector { get; set; } = "";
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";

    /// <summary>
    /// Placement of the tooltip: "top", "bottom", "left", "right"
    /// </summary>
    public string Placement { get; set; } = "bottom";
}

public class TourOptions
{
    public bool SmoothScroll { get; set; } = true;
    public string OverlayColor { get; set; } = "rgba(0,0,0,0.5)";
    public bool AllowInteraction { get; set; } = true;
}