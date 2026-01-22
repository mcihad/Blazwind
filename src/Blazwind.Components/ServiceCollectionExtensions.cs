using Microsoft.Extensions.DependencyInjection;
using Blazwind.Components.Services;
using Blazwind.Components.Calendar;
using Blazwind.Components.Tour;

namespace Blazwind.Components;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlazwind(this IServiceCollection services)
    {
        services.AddScoped<DialogService>();
        services.AddScoped<ToastService>();
        services.AddScoped<DrawerService>();
        services.AddScoped<NavMenuService>();
        services.AddSingleton<NotificationService>();
        services.AddScoped<CommandPaletteService>();
        services.AddScoped<CalendarStateService>();
        services.AddScoped<ScriptLoaderService>();
        services.AddScoped<TourService>();

        return services;
    }
}