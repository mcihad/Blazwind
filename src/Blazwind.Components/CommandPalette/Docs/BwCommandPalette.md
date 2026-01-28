# BwCommandPalette

A Spotlight-style command palette component that provides a centralized interface for executing actions, navigating your
application, and performing fuzzy searches.

## Setup

### 1. Register the Service

Add the `CommandPaletteService` to your `Program.cs` file:

```csharp
builder.Services.AddScoped<CommandPaletteService>();
```

### 2. Place the Component

Add the `<BwCommandPalette />` component to your main layout (usually `MainLayout.razor`):

```razor
@using Blazwind.Components.CommandPalette

<BwCommandPalette />
```

## Usage

### Registering Commands

Inject the `CommandPaletteService` into your component and register your application's commands:

```razor
@inject CommandPaletteService CommandService

@code {
    protected override void OnInitialized()
    {
        CommandService.RegisterCommand(new CommandItem
        {
            Label = "Home",
            Icon = "fa-solid fa-home",
            Category = "Navigation",
            Shortcut = "G H",
            Action = () => 
            {
                NavigationManager.NavigateTo("/");
                return Task.CompletedTask;
            }
        });
    }
}
```

### Programmatic Control

You can open or close the palette programmatically from anywhere in your code:

```csharp
CommandService.Show();   // Open the palette
CommandService.Hide();   // Close the palette
CommandService.Toggle(); // Toggle visibility
```

## API Reference

### BwCommandPalette Parameters

| Parameter     | Type     | Default                | Description                               |
|---------------|----------|------------------------|-------------------------------------------|
| `Placeholder` | `string` | `"Search commands..."` | The text shown in the empty search input. |

### CommandItem Properties

| Property      | Type          | Description                                                  |
|---------------|---------------|--------------------------------------------------------------|
| `Id`          | `string`      | Unique identifier (automatically generated if not provided). |
| `Label`       | `string`      | The display name of the command.                             |
| `Description` | `string?`     | Optional sub-text providing more context.                    |
| `Icon`        | `string?`     | FontAwesome icon class (e.g., `fa-solid fa-user`).           |
| `Category`    | `string?`     | Used to group commands in the palette UI.                    |
| `Shortcut`    | `string?`     | Textual representation of the keyboard shortcut.             |
| `Action`      | `Func<Task>?` | The asynchronous method to execute when selected.            |
| `IsDisabled`  | `bool`        | Whether the command is visible but unclickable.              |

### CommandPaletteService Methods

| Method                                       | Description                                |
|----------------------------------------------|--------------------------------------------|
| `Show()`                                     | Opens the command palette.                 |
| `Hide()`                                     | Closes the command palette.                |
| `Toggle()`                                   | Toggles the palette visibility.            |
| `RegisterCommand(CommandItem)`               | Adds a single command to the palette.      |
| `RegisterCommands(IEnumerable<CommandItem>)` | Adds multiple commands at once.            |
| `UnregisterCommand(string id)`               | Removes a command by its ID.               |
| `ExecuteCommand(CommandItem)`                | Manually triggers the action of a command. |

## Keyboard Shortcuts

| Shortcut                   | Action                                         |
|----------------------------|------------------------------------------------|
| **Ctrl + K** / **Cmd + K** | Open/Close the Command Palette                 |
| **↑ / ↓**                  | Navigate through the filtered list of commands |
| **Enter**                  | Execute the currently selected command         |
| **Escape**                 | Close the Command Palette                      |
