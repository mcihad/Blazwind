using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

/// <summary>
/// Service for dynamically loading JavaScript and CSS files on demand.
/// This enables lazy loading of heavy dependencies like MapLibre, ECharts, etc.
/// </summary>
public class ScriptLoaderService : IAsyncDisposable
{
    private readonly IJSRuntime _jsRuntime;
    private readonly HashSet<string> _loadedScripts = new();
    private readonly HashSet<string> _loadedStyles = new();
    private readonly SemaphoreSlim _lock = new(1, 1);
    private IJSObjectReference? _module;
    private const string ModulePath = "./_content/Blazwind.Components/blazwind.loader.js";

    public ScriptLoaderService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    /// <summary>
    /// Ensures the loader module is initialized
    /// </summary>
    private async Task<IJSObjectReference> GetModuleAsync()
    {
        if (_module is null)
        {
            _module = await _jsRuntime.InvokeAsync<IJSObjectReference>(
                "import",
                ModulePath);
        }

        return _module;
    }

    /// <summary>
    /// Loads a JavaScript file dynamically
    /// </summary>
    /// <param name="src">Script source URL</param>
    /// <returns>True if loaded successfully</returns>
    public async Task<bool> LoadScriptAsync(string src)
    {
        EnsureSafeResourcePath(src, nameof(src));
        await _lock.WaitAsync();
        try
        {
            if (_loadedScripts.Contains(src))
                return true;

            var module = await GetModuleAsync();
            var result = await module.InvokeAsync<bool>("loadScript", src);

            if (result)
                _loadedScripts.Add(src);

            return result;
        }
        finally
        {
            _lock.Release();
        }
    }

    /// <summary>
    /// Loads a CSS file dynamically
    /// </summary>
    /// <param name="href">Stylesheet URL</param>
    /// <returns>True if loaded successfully</returns>
    public async Task<bool> LoadStyleAsync(string href)
    {
        EnsureSafeResourcePath(href, nameof(href));
        await _lock.WaitAsync();
        try
        {
            if (_loadedStyles.Contains(href))
                return true;

            var module = await GetModuleAsync();
            var result = await module.InvokeAsync<bool>("loadStyle", href);

            if (result)
                _loadedStyles.Add(href);

            return result;
        }
        finally
        {
            _lock.Release();
        }
    }

    /// <summary>
    /// Loads both script and style files
    /// </summary>
    public async Task LoadScriptAndStyleAsync(string scriptSrc, string styleSrc)
    {
        EnsureSafeResourcePath(scriptSrc, nameof(scriptSrc));
        EnsureSafeResourcePath(styleSrc, nameof(styleSrc));
        await Task.WhenAll(
            LoadScriptAsync(scriptSrc),
            LoadStyleAsync(styleSrc)
        );
    }

    /// <summary>
    /// Checks if a script is already loaded
    /// </summary>
    public bool IsScriptLoaded(string src) => _loadedScripts.Contains(src);

    /// <summary>
    /// Checks if a style is already loaded
    /// </summary>
    public bool IsStyleLoaded(string href) => _loadedStyles.Contains(href);

    private static void EnsureSafeResourcePath(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Resource path cannot be empty.", paramName);
        }

        if (value.Contains('\0', StringComparison.Ordinal))
        {
            throw new ArgumentException("Resource path contains invalid characters.", paramName);
        }

        if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            if (!uri.Scheme.Equals(Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase) &&
                !uri.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("Only http/https resources are supported.", paramName);
            }
            return;
        }

        if (value.StartsWith("javascript:", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("data:", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("vbscript:", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Unsafe resource scheme is not allowed.", paramName);
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.DisposeAsync();
        }

        _lock.Dispose();
    }
}
