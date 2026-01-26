# Blazwind Architecture

This document provides a high-level overview of the Blazwind component library structure.

## Core Projects

- **Blazwind.Components**: Core UI component library and shared services.
- **Blazwind.Docs**: Documentation and demo site.
- **Blazwind.Components/frontend**: TypeScript + Vite assets bundled into `wwwroot`.
- **Blazwind.UnitTests**: bUnit test project for component and service tests.

## Component Layout

Components are grouped by domain (Input, Layout, Data Display, Navigation, Feedback, Map).

Each component folder typically contains:

- `Bw*.razor` component implementation
- `Docs/` markdown documentation
- Optional `.razor.cs` for code-behind

## JS Interop

Blazwind ships a single JavaScript bundle (`blazwind.js`) and optional bundles:

- `blazwind.chart.js` for charts
- `blazwind.maplibre.js` for maps

`ScriptLoaderService` provides lazy-loading for large bundles. UI services like `DialogService` and `ToastService` wrap JS interop modules and handle lifecycle.

## Services

Services are registered via `ServiceCollectionExtensions.AddBlazwind()`:

- UI Services: Dialog, Toast, Drawer, NavMenu, CommandPalette, Tour
- Utilities: ScriptLoaderService, NotificationService

## Testing

Unit tests live under `tests/Blazwind.UnitTests` and use bUnit + xUnit. Keep tests focused on component rendering and service behavior.
