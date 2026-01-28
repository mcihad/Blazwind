using Blazwind.Components.Dialog;
using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

/// <summary>
///     Dialog service for managing both JS-based and Razor component-based dialogs.
/// </summary>
public class DialogService
{
    private readonly IJSRuntime _js;

    public DialogService(IJSRuntime js)
    {
        _js = js;
    }

    #region JS Interop Dialogs

    /// <summary>Show an alert dialog</summary>
    public async Task ShowAlertAsync(string title, string message, BwColor color = BwColor.Info)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Title", title },
            { "Message", message },
            { "Color", color },
            { "ConfirmText", "OK" }
        };

        var options = new DialogOptions { Width = "420px", CloseOnOverlayClick = true, IsRaw = true };
        await ShowAsync<MessageDialog>(title, parameters, options);
    }

    /// <summary>Show an alert dialog (String color overload)</summary>
    public async Task ShowAlertAsync(string title, string message, string color)
    {
        Enum.TryParse<BwColor>(color, true, out var c);
        await ShowAlertAsync(title, message, c);
    }

    /// <summary>Show a confirm dialog</summary>
    public async Task<bool> ShowConfirmAsync(string title, string message, BwColor color = BwColor.Warning)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Title", title },
            { "Message", message },
            { "Color", color },
            { "ConfirmText", "Confirm" },
            { "CancelText", "Cancel" }
        };

        var options = new DialogOptions { Width = "440px", CloseOnOverlayClick = false, IsRaw = true };
        var result = await ShowAsync<MessageDialog, bool>(title, parameters, options);
        return result.Data;
    }

    /// <summary>Show a confirm dialog (String color overload)</summary>
    public async Task<bool> ShowConfirmAsync(string title, string message, string color)
    {
        Enum.TryParse<BwColor>(color, true, out var c);
        return await ShowConfirmAsync(title, message, c);
    }

    /// <summary>Show a confirm dialog with custom buttons</summary>
    public async Task<bool> ShowConfirmAsync(string title, string message, string okText = "Confirm",
        string cancelText = "Cancel", BwColor color = BwColor.Warning)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Title", title },
            { "Message", message },
            { "Color", color },
            { "ConfirmText", okText },
            { "CancelText", cancelText }
        };

        var options = new DialogOptions { Width = "440px", CloseOnOverlayClick = false, IsRaw = true };
        var result = await ShowAsync<MessageDialog, bool>(title, parameters, options);
        return result.Data;
    }

    /// <summary>Show an input dialog</summary>
    public async Task<string?> ShowInputAsync(string title, string message, string? placeholder = null,
        string? defaultValue = null, BwColor color = BwColor.Primary)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Title", title },
            { "Message", message },
            { "Placeholder", placeholder ?? "Value" },
            { "DefaultValue", defaultValue ?? "" },
            { "Color", color }
        };

        var options = new DialogOptions { Width = "450px", IsRaw = true };
        var result = await ShowAsync<InputDialog, string>(title, parameters, options);
        return result.Canceled ? null : result.Data;
    }

    /// <summary>Show a loading dialog</summary>
    public async Task<LoadingHandle> ShowLoadingAsync(string? message = null)
    {
        var closeFunc =
            await _js.InvokeAsync<IJSObjectReference>("Blazwind.Dialog.showLoading", new { Message = message });
        return new LoadingHandle(closeFunc);
    }

    /// <summary>Show a SQUARE loading dialog (Compact)</summary>
    public async Task<LoadingHandle> ShowSquareLoadingAsync(string? message = null)
    {
        var closeFunc =
            await _js.InvokeAsync<IJSObjectReference>("Blazwind.Dialog.showSquareLoading", new { Message = message });
        return new LoadingHandle(closeFunc);
    }

    /// <summary>Show a busy dialog (Blocking full screen)</summary>
    public async Task<LoadingHandle> ShowBusyAsync(string? message = null)
    {
        var closeFunc =
            await _js.InvokeAsync<IJSObjectReference>("Blazwind.Dialog.showBusy", new { Message = message });
        return new LoadingHandle(closeFunc);
    }

    /// <summary>Execute a task while showing busy indicator. Automatically closes when task finishes.</summary>
    public async Task BusyAsync(Func<Task> work, string? message = null)
    {
        var handle = await ShowBusyAsync(message);
        try
        {
            await work();
        }
        finally
        {
            await handle.CloseAsync();
        }
    }

    /// <summary>Show a progress dialog</summary>
    public async Task<ProgressHandle> ShowProgressAsync(string title, string? message = null)
    {
        var handle = await _js.InvokeAsync<IJSObjectReference>("Blazwind.Dialog.showProgress",
            new { Title = title, Message = message });
        return new ProgressHandle(handle);
    }

    /// <summary>Show a countdown dialog</summary>
    public async Task ShowCountdownAsync(string title, string? message, int seconds)
    {
        await _js.InvokeVoidAsync("Blazwind.Dialog.showCountdown",
            new { Seconds = seconds, Title = title, Message = message });
    }

    /// <summary>Show a success animation dialog with animated checkmark</summary>
    public async Task ShowSuccessAnimationAsync(string title, string? message = null, bool autoClose = true,
        int duration = 2000)
    {
        await _js.InvokeVoidAsync("Blazwind.Dialog.showSuccess",
            new { Title = title, Message = message, AutoClose = autoClose, Duration = duration });
    }

    /// <summary>Show an error animation dialog with animated X</summary>
    public async Task ShowErrorAnimationAsync(string title, string? message = null, bool autoClose = true,
        int duration = 2500)
    {
        await _js.InvokeVoidAsync("Blazwind.Dialog.showError",
            new { Title = title, Message = message, AutoClose = autoClose, Duration = duration });
    }

    /// <summary>Show an image preview dialog</summary>
    public async Task ShowImagePreviewAsync(string src, string? alt = null, string? caption = null)
    {
        await _js.InvokeVoidAsync("Blazwind.Dialog.showImagePreview", new { Src = src, Alt = alt, Caption = caption });
    }

    /// <summary>Show a pulse loading dialog</summary>
    public async Task<LoadingHandle> ShowPulseLoadingAsync(string? message = null, string? icon = null)
    {
        var closeFunc = await _js.InvokeAsync<IJSObjectReference>("Blazwind.Dialog.showPulseLoading",
            new { Message = message, Icon = icon });
        return new LoadingHandle(closeFunc);
    }

    #endregion

    #region Razor Dialog Implementation

    public event Action? OnChange;

    internal List<DialogInstance> Dialogs { get; } = new();

    public async Task<DialogResult> ShowAsync<T>(string title, Dictionary<string, object>? parameters = null,
        DialogOptions? options = null) where T : ComponentBase
    {
        var tcs = new TaskCompletionSource<DialogResult>();
        var instance = new DialogInstance(title, typeof(T), parameters, options ?? DialogOptions.Default, tcs);

        Dialogs.Add(instance);
        OnChange?.Invoke();

        return await tcs.Task;
    }

    public async Task<DialogResult<TResult>> ShowAsync<TComponent, TResult>(string title,
        Dictionary<string, object>? parameters = null, DialogOptions? options = null) where TComponent : ComponentBase
    {
        var result = await ShowAsync<TComponent>(title, parameters, options);

        if (result.Canceled) return DialogResult.Cancel<TResult>();

        // Try to cast data
        if (result.Data is TResult typedData) return DialogResult.Ok(typedData);

        // Handle value types or nulls
        try
        {
            return DialogResult.Ok((TResult)result.Data!);
        }
        catch
        {
            return DialogResult.Ok<TResult>(default!);
        }
    }

    public void Close(DialogInstance instance)
    {
        Close(instance, DialogResult.Cancel());
    }

    public void Close(Guid dialogId)
    {
        var instance = Dialogs.FirstOrDefault(x => x.Id == dialogId);
        if (instance != null) Close(instance);
    }

    public void Close(DialogInstance instance, DialogResult result)
    {
        if (Dialogs.Contains(instance))
        {
            Dialogs.Remove(instance);
            instance.TaskCompletionSource.TrySetResult(result);
            OnChange?.Invoke();
        }
    }

    /// <summary>Close dialog with a strongly-typed result. Converts DialogResult&lt;T&gt; to DialogResult internally.</summary>
    public void Close<T>(DialogInstance instance, DialogResult<T> result)
    {
        var nonGenericResult = result.Canceled
            ? DialogResult.Cancel()
            : DialogResult.Ok((object?)result.Data);
        Close(instance, nonGenericResult);
    }

    /// <summary>Show an info dialog</summary>
    /// <summary>Show an info dialog</summary>
    public async Task ShowInfoAsync(string title, string message)
    {
        await ShowAlertAsync(title, message);
    }

    /// <summary>Show a success dialog</summary>
    public async Task ShowSuccessAsync(string title, string message)
    {
        await ShowAlertAsync(title, message, BwColor.Success);
    }

    /// <summary>Show an error dialog</summary>
    public async Task ShowErrorAsync(string title, string message)
    {
        await ShowAlertAsync(title, message, BwColor.Danger);
    }

    /// <summary>Show a warning dialog</summary>
    public async Task ShowWarningAsync(string title, string message)
    {
        await ShowAlertAsync(title, message, BwColor.Warning);
    }

    /// <summary>Show a normal (primary) dialog</summary>
    public async Task ShowNormalAsync(string title, string message)
    {
        await ShowAlertAsync(title, message, BwColor.Primary);
    }

    #endregion
}

public class DialogInstance
{
    public DialogInstance(string title, Type componentType, Dictionary<string, object>? parameters,
        DialogOptions options, TaskCompletionSource<DialogResult> tcs)
    {
        Title = title;
        ComponentType = componentType;
        Parameters = parameters;
        Options = options;
        TaskCompletionSource = tcs;
    }

    public Guid Id { get; } = Guid.NewGuid();
    public string Title { get; }
    public Type ComponentType { get; }
    public Dictionary<string, object>? Parameters { get; }
    public DialogOptions Options { get; }
    internal TaskCompletionSource<DialogResult> TaskCompletionSource { get; }
}

#region Handle Classes

/// <summary>Handle for closing a loading dialog</summary>
public class LoadingHandle : IAsyncDisposable
{
    private readonly IJSObjectReference _closeFunc;
    private bool _disposed;

    public LoadingHandle(IJSObjectReference closeFunc)
    {
        _closeFunc = closeFunc;
    }

    public async ValueTask DisposeAsync()
    {
        await CloseAsync();
        await _closeFunc.DisposeAsync();
    }

    public async Task CloseAsync()
    {
        if (!_disposed)
        {
            await _closeFunc.InvokeVoidAsync("call");
            _disposed = true;
        }
    }
}

/// <summary>Handle for updating and closing a progress dialog</summary>
public class ProgressHandle : IAsyncDisposable
{
    private readonly IJSObjectReference _handle;
    private bool _disposed;

    public ProgressHandle(IJSObjectReference handle)
    {
        _handle = handle;
    }

    public async ValueTask DisposeAsync()
    {
        await CloseAsync();
        await _handle.DisposeAsync();
    }

    public async Task UpdateAsync(int progress, string? message = null)
    {
        if (!_disposed) await _handle.InvokeVoidAsync("update", progress, message);
    }

    public async Task CloseAsync()
    {
        if (!_disposed)
        {
            await _handle.InvokeVoidAsync("close");
            _disposed = true;
        }
    }
}

#endregion