using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

public class NavMenuService
{
    private readonly IJSRuntime _js;

    public NavMenuService(IJSRuntime js)
    {
        _js = js;
    }

    public async Task ToggleGroupAsync(string groupId)
    {
        await _js.InvokeVoidAsync("Blazwind.Nav.toggleGroup", groupId);
    }

    public async Task ExpandGroupAsync(string groupId)
    {
        await _js.InvokeVoidAsync("Blazwind.Nav.expandGroup", groupId);
    }

    public async Task CollapseGroupAsync(string groupId)
    {
        await _js.InvokeVoidAsync("Blazwind.Nav.collapseGroup", groupId);
    }

    public async Task InitGroupAsync(string groupId, bool expanded)
    {
        await _js.InvokeVoidAsync("Blazwind.Nav.initGroup", groupId, expanded);
    }
}