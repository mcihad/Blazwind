using Blazwind.Components.Drawer;
using Microsoft.AspNetCore.Components;

namespace Blazwind.Components.Services;

/// <summary>
///     Service for managing drawer instances
/// </summary>
public class DrawerService
{
    private readonly List<DrawerInstance> _drawers = new();

    public IReadOnlyList<DrawerInstance> Drawers => _drawers.AsReadOnly();

    public event Action? OnChange;

    /// <summary>
    ///     Show a drawer with a dynamic Razor component
    /// </summary>
    public Task<DrawerResult> ShowAsync<TComponent>(
        string? title = null,
        Dictionary<string, object>? parameters = null,
        DrawerOptions? options = null) where TComponent : IComponent
    {
        return ShowAsync(title, typeof(TComponent), parameters, options);
    }

    /// <summary>
    ///     Show a drawer with a dynamic Razor component and return strongly-typed result
    /// </summary>
    public async Task<DrawerResult<TResult>> ShowAsync<TComponent, TResult>(
        string? title = null,
        Dictionary<string, object>? parameters = null,
        DrawerOptions? options = null) where TComponent : IComponent
    {
        var result = await ShowAsync<TComponent>(title, parameters, options);

        if (result.Canceled) return DrawerResult.Cancel<TResult>();

        // Try to cast data
        if (result.Data is TResult typedData) return DrawerResult.Ok(typedData);

        // Handle value types or nulls
        try
        {
            return DrawerResult.Ok((TResult)result.Data!);
        }
        catch
        {
            return DrawerResult.Ok<TResult>(default!);
        }
    }

    /// <summary>
    ///     Show a drawer with a component type
    /// </summary>
    public Task<DrawerResult> ShowAsync(
        string? title,
        Type componentType,
        Dictionary<string, object>? parameters = null,
        DrawerOptions? options = null)
    {
        options ??= DrawerOptions.Default;
        var tcs = new TaskCompletionSource<DrawerResult>();

        var instance = new DrawerInstance(
            title,
            componentType,
            parameters,
            options,
            tcs
        );

        _drawers.Add(instance);
        NotifyStateChanged();

        return tcs.Task;
    }

    /// <summary>
    ///     Close drawer with result
    /// </summary>
    public void Close(DrawerInstance instance, DrawerResult? result = null)
    {
        result ??= DrawerResult.Cancel();

        if (_drawers.Remove(instance))
        {
            instance.TaskCompletionSource.TrySetResult(result);
            NotifyStateChanged();
        }
    }

    /// <summary>
    ///     Close drawer with a strongly-typed result. Converts DrawerResult&lt;T&gt; to DrawerResult internally.
    /// </summary>
    public void Close<T>(DrawerInstance instance, DrawerResult<T> result)
    {
        var nonGenericResult = result.Canceled
            ? DrawerResult.Cancel()
            : DrawerResult.Ok((object?)result.Data);
        Close(instance, nonGenericResult);
    }

    /// <summary>
    ///     Close the topmost drawer with a result
    /// </summary>
    public void Close(object? data = null)
    {
        var topDrawer = _drawers.LastOrDefault();
        if (topDrawer != null) Close(topDrawer, data != null ? DrawerResult.Ok(data) : DrawerResult.Cancel());
    }

    /// <summary>
    ///     Close a drawer and return OK with data
    /// </summary>
    public void CloseWithResult(object? data)
    {
        var topDrawer = _drawers.LastOrDefault();
        if (topDrawer != null) Close(topDrawer, DrawerResult.Ok(data));
    }

    private void NotifyStateChanged()
    {
        OnChange?.Invoke();
    }
}

/// <summary>
///     Internal class representing a drawer instance
/// </summary>
public class DrawerInstance
{
    public DrawerInstance(
        string? title,
        Type componentType,
        Dictionary<string, object>? parameters,
        DrawerOptions options,
        TaskCompletionSource<DrawerResult> tcs)
    {
        Title = title;
        ComponentType = componentType;
        Parameters = parameters;
        Options = options;
        TaskCompletionSource = tcs;
    }

    public Guid Id { get; } = Guid.NewGuid();
    public string? Title { get; }
    public Type ComponentType { get; }
    public Dictionary<string, object>? Parameters { get; }
    public DrawerOptions Options { get; }
    internal TaskCompletionSource<DrawerResult> TaskCompletionSource { get; }
}