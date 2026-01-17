using Blazwind.Examples.Components;
using Blazwind.Components;
using Blazwind.Components.Dialog;
using Blazwind.Components.Drawer;
using Blazwind.Components.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Blazwind Services
builder.Services.AddBlazwind();

// HttpClient for loading static assets (GeoJSON, etc.)
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5211/") });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();