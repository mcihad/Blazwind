namespace Blazwind.Components.Navigation;

/// <summary>
/// Context for custom menu item templates
/// </summary>
public class BwNavMenuItemContext
{
    public string Label { get; set; } = "";
    public string Href { get; set; } = "";
    public string? Icon { get; set; }
    public string? Badge { get; set; }
    public bool IsActive { get; set; }
    public int Level { get; set; }
}

/// <summary>
/// Context for custom group header templates
/// </summary>
public class BwNavMenuGroupContext
{
    public string Title { get; set; } = "";
    public string? Icon { get; set; }
    public bool IsExpanded { get; set; }
    public int Level { get; set; }
    public string GroupId { get; set; } = "";
    public Action? Toggle { get; set; }
}