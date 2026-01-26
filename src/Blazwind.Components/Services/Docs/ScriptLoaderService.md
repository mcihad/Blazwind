# ScriptLoaderService

A service for dynamically loading (lazy loading) JavaScript and CSS files.

## Purpose

Useful for loading large JavaScript libraries (like MapLibre, ECharts, PDF.js, etc.) only when they are needed by a specific component, rather than loading them globally on every page load.

## Registration

`ScriptLoaderService` is registered automatically when you call:

```csharp
builder.Services.AddBlazwind();
```

## Examples

### Basic Usage

```csharp
@inject ScriptLoaderService ScriptLoader

protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (firstRender)
    {
        // Load JS file
        await ScriptLoader.LoadScriptAsync("_content/MyLib/myscript.js");
        
        // Load CSS file
        await ScriptLoader.LoadStyleAsync("_content/MyLib/mystyle.css");
    }
}
```

### Loading JS and CSS Together

```csharp
// Load both JS and CSS in parallel
await ScriptLoader.LoadScriptAndStyleAsync(
    "_content/Blazwind.Components/blazwind.maplibre.js",
    "_content/Blazwind.Components/blazwind.maplibre.css"
);
```

### Checking Load Status

```csharp
// Check if script is already loaded
if (!ScriptLoader.IsScriptLoaded("myscript.js"))
{
    await ScriptLoader.LoadScriptAsync("myscript.js");
}
```

## Real World Example: BwMapLibre

The MapLibre component uses this service to lazy-load its ~1MB library:

```csharp
public partial class BwMapLibre : IAsyncDisposable
{
    private const string MapLibreScriptPath = "_content/Blazwind.Components/blazwind.maplibre.js";
    private const string MapLibreStylePath = "_content/Blazwind.Components/blazwind.maplibre.css";
    
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Inject] private ScriptLoaderService ScriptLoader { get; set; } = default!;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Lazy load MapLibre JS and CSS
            await ScriptLoader.LoadScriptAndStyleAsync(MapLibreScriptPath, MapLibreStylePath);
            
            // MapLibre is now ready to use
            _mapId = await JS.InvokeAsync<string>("BwMapLibre.initMap", ...);
        }
    }
}
```

## API

| Method | Signature | Description |
|---|---|---|
| `LoadScriptAsync` | `Task<bool> LoadScriptAsync(string src)` | Loads a JavaScript file. |
| `LoadStyleAsync` | `Task<bool> LoadStyleAsync(string href)` | Loads a CSS file. |
| `LoadScriptAndStyleAsync` | `Task LoadScriptAndStyleAsync(string scriptSrc, string styleSrc)` | Loads both in parallel. |
| `IsScriptLoaded` | `bool IsScriptLoaded(string src)` | Checks if the script is loaded. |
| `IsStyleLoaded` | `bool IsStyleLoaded(string href)` | Checks if the style is loaded. |

## Features

- **Caching Mechanism:** Prevents loading the same file multiple times.
- **Thread-Safe:** Uses SemaphoreSlim for concurrency safety.
- **Parallel Loading:** `LoadScriptAndStyleAsync` loads resources simultaneously.
- **Error Handling:** Throws exceptions on loading failures.
- **URL Guardrails:** Blocks unsafe schemes (javascript/data/vbscript) for script/style paths.

## When to Use?

✅ **Use When:**
- Using large external libraries (100KB+).
- Components are not used on every page.
- Using heavy components like Maps, Charts, PDF Viewers.

❌ **Do Not Use When:**
- Loading core Blazwind styles and scripts (loaded by default).
- Small helper functions.
- Critical/Core components required immediately.

## Registration

The service is automatically registered with `AddBlazwind()`:

```csharp
services.AddBlazwind(); // Includes ScriptLoaderService
```
