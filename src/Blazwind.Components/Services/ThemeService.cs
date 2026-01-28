using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

/// <summary>
///     Default implementation of IThemeService for managing Blazwind themes.
/// </summary>
public class ThemeService : IThemeService
{
    private readonly IJSRuntime _js;
    private readonly Dictionary<string, ThemePreset> _themes = new();
    private bool _initialized;

    public ThemeService(IJSRuntime js)
    {
        _js = js;
        RegisterBuiltInThemes();
    }

    public string CurrentTheme { get; private set; } = "blazwind";
    public bool IsDarkMode { get; private set; }
    public IReadOnlyList<string> AvailableThemes => _themes.Keys.ToList();
    public event Action? OnThemeChanged;

    public async Task SetThemeAsync(string themeName)
    {
        if (!_themes.ContainsKey(themeName))
            throw new ArgumentException(
                $"Theme '{themeName}' not found. Available themes: {string.Join(", ", _themes.Keys)}");

        await EnsureInitializedAsync();
        CurrentTheme = themeName;

        try
        {
            await _js.InvokeVoidAsync("Blazwind.Theme.setTheme", themeName);
        }
        catch
        {
            // JS not available
        }

        OnThemeChanged?.Invoke();
    }

    public async Task ToggleDarkModeAsync()
    {
        await SetDarkModeAsync(!IsDarkMode);
    }

    public async Task SetDarkModeAsync(bool isDark)
    {
        await EnsureInitializedAsync();
        IsDarkMode = isDark;

        try
        {
            await _js.InvokeVoidAsync("Blazwind.Theme.setDarkMode", isDark);
        }
        catch
        {
            // JS not available
        }

        OnThemeChanged?.Invoke();
    }

    public ThemePreset? GetThemePreset(string name)
    {
        return _themes.GetValueOrDefault(name);
    }

    public void RegisterTheme(ThemePreset preset)
    {
        _themes[preset.Name] = preset;
    }

    public async Task InitializeAsync()
    {
        await EnsureInitializedAsync();
        OnThemeChanged?.Invoke();
    }

    private void RegisterBuiltInThemes()
    {
        RegisterTheme(ThemePresets.Blazwind);
        RegisterTheme(ThemePresets.Ocean);
        RegisterTheme(ThemePresets.Forest);
    }

    private async Task EnsureInitializedAsync()
    {
        if (_initialized) return;

        try
        {
            // Get stored preferences from JS
            var storedTheme = await _js.InvokeAsync<string>("Blazwind.Theme.getStoredTheme");
            if (!string.IsNullOrEmpty(storedTheme) && _themes.ContainsKey(storedTheme)) CurrentTheme = storedTheme;

            IsDarkMode = await _js.InvokeAsync<bool>("Blazwind.Theme.getStoredDarkMode");
            _initialized = true;
        }
        catch
        {
            // JS not available (SSR), use defaults
            _initialized = true;
        }
    }
}

/// <summary>
///     Built-in theme presets.
/// </summary>
public static class ThemePresets
{
    public static ThemePreset Blazwind => new()
    {
        Name = "blazwind",
        DisplayName = "Blazwind",
        Description = "Default blue-based professional theme",
        PrimaryColor = "#2563eb",
        SecondaryColor = "#64748b",
        SuccessColor = "#10b981",
        DangerColor = "#ef4444"
    };

    public static ThemePreset Ocean => new()
    {
        Name = "ocean",
        DisplayName = "Ocean",
        Description = "Fresh cyan and teal theme",
        PrimaryColor = "#0891b2",
        SecondaryColor = "#64748b",
        SuccessColor = "#0d9488",
        DangerColor = "#e11d48"
    };

    public static ThemePreset Forest => new()
    {
        Name = "forest",
        DisplayName = "Forest",
        Description = "Natural green and earth tones",
        PrimaryColor = "#16a34a",
        SecondaryColor = "#78716c",
        SuccessColor = "#65a30d",
        DangerColor = "#dc2626"
    };
}