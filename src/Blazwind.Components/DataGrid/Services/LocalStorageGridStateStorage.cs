using System.Text.Json;
using Microsoft.JSInterop;

namespace Blazwind.Components.DataGrid.Services;

/// <summary>
/// LocalStorage implementation of IGridStateStorage.
/// Uses browser's localStorage via JavaScript interop.
/// </summary>
public class LocalStorageGridStateStorage : IGridStateStorage
{
    private readonly IJSRuntime _jsRuntime;
    private const string StoragePrefix = "bw-datagrid-state:";

    public LocalStorageGridStateStorage(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    /// <inheritdoc />
    public async Task SaveStateAsync(string key, GridViewState state, CancellationToken cancellationToken = default)
    {
        var storageKey = GetStorageKey(key);
        var json = JsonSerializer.Serialize(state, GetJsonOptions());

        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", cancellationToken, storageKey, json);
    }

    /// <inheritdoc />
    public async Task<GridViewState?> LoadStateAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            var storageKey = GetStorageKey(key);
            var json = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", cancellationToken, storageKey);

            if (string.IsNullOrEmpty(json))
                return null;

            return JsonSerializer.Deserialize<GridViewState>(json, GetJsonOptions());
        }
        catch
        {
            // Return null on any error (invalid JSON, etc.)
            return null;
        }
    }

    /// <inheritdoc />
    public async Task DeleteStateAsync(string key, CancellationToken cancellationToken = default)
    {
        var storageKey = GetStorageKey(key);
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", cancellationToken, storageKey);
    }

    private static string GetStorageKey(string key) => $"{StoragePrefix}{key}";

    private static JsonSerializerOptions GetJsonOptions() => new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };
}