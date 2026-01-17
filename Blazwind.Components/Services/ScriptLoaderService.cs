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
            // We need to create the loader inline since this is a bootstrap module
            _module = await _jsRuntime.InvokeAsync<IJSObjectReference>(
                "eval",
                """
                (function() {
                    const loadedScripts = new Set();
                    const loadedStyles = new Set();
                    const loadingPromises = new Map();
                    
                    return {
                        loadScript: function(src) {
                            if (loadedScripts.has(src)) {
                                return Promise.resolve(true);
                            }
                            
                            if (loadingPromises.has(src)) {
                                return loadingPromises.get(src);
                            }
                            
                            const promise = new Promise((resolve, reject) => {
                                const script = document.createElement('script');
                                script.src = src;
                                script.async = true;
                                script.onload = () => {
                                    loadedScripts.add(src);
                                    loadingPromises.delete(src);
                                    resolve(true);
                                };
                                script.onerror = () => {
                                    loadingPromises.delete(src);
                                    reject(new Error('Failed to load script: ' + src));
                                };
                                document.head.appendChild(script);
                            });
                            
                            loadingPromises.set(src, promise);
                            return promise;
                        },
                        
                        loadStyle: function(href) {
                            if (loadedStyles.has(href)) {
                                return Promise.resolve(true);
                            }
                            
                            return new Promise((resolve, reject) => {
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = href;
                                link.onload = () => {
                                    loadedStyles.add(href);
                                    resolve(true);
                                };
                                link.onerror = () => {
                                    reject(new Error('Failed to load stylesheet: ' + href));
                                };
                                document.head.appendChild(link);
                            });
                        },
                        
                        isScriptLoaded: function(src) {
                            return loadedScripts.has(src);
                        },
                        
                        isStyleLoaded: function(href) {
                            return loadedStyles.has(href);
                        }
                    };
                })()
                """);
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

    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.DisposeAsync();
        }

        _lock.Dispose();
    }
}