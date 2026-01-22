using Microsoft.JSInterop;

namespace Blazwind.Components.Tour;

public class TourService
{
    private readonly IJSRuntime _js;

    public TourService(IJSRuntime js)
    {
        _js = js;
    }

    public async Task StartTour(List<TourStep> steps, TourOptions? options = null)
    {
        options ??= new TourOptions();
        await _js.InvokeVoidAsync("Blazwind.Tour.start", steps, options);
    }

    public async Task Next()
    {
        await _js.InvokeVoidAsync("Blazwind.Tour.next");
    }

    public async Task Prev()
    {
        await _js.InvokeVoidAsync("Blazwind.Tour.prev");
    }

    public async Task End()
    {
        await _js.InvokeVoidAsync("Blazwind.Tour.end");
    }
}