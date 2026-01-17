using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

using Blazwind.Components.Shared;

/// <summary>
/// Toast notification service using JSInterop
/// </summary>
public class ToastService
{
    private readonly IJSRuntime _js;

    public ToastService(IJSRuntime js)
    {
        _js = js;
    }

    /// <summary>Show a success toast</summary>
    public async Task<string> SuccessAsync(string message, string? title = null, int? duration = null)
    {
        return await _js.InvokeAsync<string>("Blazwind.Toast.success", message, title, duration);
    }

    /// <summary>Show an error toast</summary>
    public async Task<string> ErrorAsync(string message, string? title = null, int? duration = null)
    {
        return await _js.InvokeAsync<string>("Blazwind.Toast.error", message, title, duration);
    }

    /// <summary>Show a warning toast</summary>
    public async Task<string> WarningAsync(string message, string? title = null, int? duration = null)
    {
        return await _js.InvokeAsync<string>("Blazwind.Toast.warning", message, title, duration);
    }

    /// <summary>Show an info toast</summary>
    public async Task<string> InfoAsync(string message, string? title = null, int? duration = null)
    {
        return await _js.InvokeAsync<string>("Blazwind.Toast.info", message, title, duration);
    }

    private readonly Dictionary<string, Func<Task>> _actionCallbacks = new();

    /// <summary>Show a toast with custom options</summary>
    public async Task<string> ShowAsync(ToastOptions options)
    {
        var positionString = options.Position switch
        {
            BwToastPosition.TopRight => "top-right",
            BwToastPosition.TopLeft => "top-left",
            BwToastPosition.TopCenter => "top-center",
            BwToastPosition.BottomRight => "bottom-right",
            BwToastPosition.BottomLeft => "bottom-left",
            BwToastPosition.BottomCenter => "bottom-center",
            _ => "top-right"
        };

        var actions = options.Actions?.Select(a =>
        {
            var actionId = Guid.NewGuid().ToString("N");
            if (a.OnClick != null)
            {
                _actionCallbacks[actionId] = a.OnClick;
            }

            return new
            {
                Text = a.Text,
                Variant = a.Color.ToString().ToLower(),
                ActionId = actionId
            };
        }).ToList();

        var jsOptions = new
        {
            options.Id,
            options.Title,
            options.Message,
            Variant = options.Color.ToString().ToLower(),
            options.Duration,
            options.ShowProgress,
            options.ShowClose,
            Position = positionString,
            Actions = actions
        };

        // Pass DotNetObjectReference to handle callbacks
        var dotnetRef = DotNetObjectReference.Create(this);

        return await _js.InvokeAsync<string>("Blazwind.Toast.showToast", jsOptions, dotnetRef);
    }

    [JSInvokable]
    public async Task HandleToastAction(string actionId)
    {
        if (_actionCallbacks.TryGetValue(actionId, out var callback))
        {
            await callback.Invoke();
            _actionCallbacks.Remove(actionId); // One-time use? usually actions dismiss toast
        }
    }

    /// <summary>Remove a toast by ID</summary>
    public async Task RemoveAsync(string id)
    {
        await _js.InvokeVoidAsync("Blazwind.Toast.removeToast", id);
    }

    /// <summary>Clear all toasts</summary>
    public async Task ClearAsync()
    {
        _actionCallbacks.Clear();
        await _js.InvokeVoidAsync("Blazwind.Toast.clearToasts");
    }
}

/// <summary>
/// Toast options for custom toast display
/// </summary>
public class ToastOptions
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public required string Message { get; set; }
    public BwColor Color { get; set; } = BwColor.Info;
    public int? Duration { get; set; }
    public bool? ShowProgress { get; set; }
    public bool? ShowClose { get; set; }
    public BwToastPosition Position { get; set; } = BwToastPosition.TopRight;
    public List<ToastAction>? Actions { get; set; }
}

public class ToastAction
{
    public required string Text { get; set; }
    public BwColor Color { get; set; } = BwColor.Primary;
    public Func<Task>? OnClick { get; set; }
}