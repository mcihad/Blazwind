namespace Blazwind.Components.Services;

/// <summary>
/// Service interface for managing themes in Blazwind components.
/// </summary>
public interface IThemeService
{
    /// <summary>
    /// Gets the currently active theme name.
    /// </summary>
    string CurrentTheme { get; }

    /// <summary>
    /// Gets the list of available theme names.
    /// </summary>
    IReadOnlyList<string> AvailableThemes { get; }

    /// <summary>
    /// Gets whether dark mode is currently active.
    /// </summary>
    bool IsDarkMode { get; }

    /// <summary>
    /// Sets the active theme.
    /// </summary>
    /// <param name="themeName">Theme name (e.g., "blazwind", "ocean", "forest")</param>
    Task SetThemeAsync(string themeName);

    /// <summary>
    /// Toggles dark mode on/off.
    /// </summary>
    Task ToggleDarkModeAsync();

    /// <summary>
    /// Sets dark mode explicitly.
    /// </summary>
    /// <param name="isDark">True to enable dark mode, false to disable.</param>
    Task SetDarkModeAsync(bool isDark);

    /// <summary>
    /// Event fired when theme changes.
    /// </summary>
    event Action? OnThemeChanged;

    /// <summary>
    /// Gets a theme preset by name.
    /// </summary>
    /// <param name="name">Theme name</param>
    /// <returns>ThemePreset if found, null otherwise</returns>
    ThemePreset? GetThemePreset(string name);

    /// <summary>
    /// Registers a custom theme.
    /// </summary>
    /// <param name="preset">Theme preset to register</param>
    void RegisterTheme(ThemePreset preset);

    /// <summary>
    /// Initializes the theme service from stored preferences.
    /// Should be called in OnAfterRenderAsync(firstRender: true).
    /// </summary>
    Task InitializeAsync();
}

/// <summary>
/// Represents a theme preset configuration.
/// </summary>
public class ThemePreset
{
    /// <summary>
    /// Internal theme name (used in CSS class).
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Display name for UI.
    /// </summary>
    public required string DisplayName { get; init; }

    /// <summary>
    /// Theme description.
    /// </summary>
    public string? Description { get; init; }

    /// <summary>
    /// Primary color hex value for preview.
    /// </summary>
    public required string PrimaryColor { get; init; }

    /// <summary>
    /// Secondary color hex value for preview.
    /// </summary>
    public string? SecondaryColor { get; init; }

    /// <summary>
    /// Success color hex value.
    /// </summary>
    public string? SuccessColor { get; init; }

    /// <summary>
    /// Danger color hex value.
    /// </summary>
    public string? DangerColor { get; init; }
}
