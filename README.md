# Blazwind

> **Note**: This is an **early alpha version (v0.0.2-alpha)**. APIs are subject to change.

Blazwind is a modern, enterprise-grade Blazor component library built with Tailwind CSS. It focuses on aesthetics, performance, and developer experience.

## Features

- **Blazwind.Components**: Core UI components (Inputs, Buttons, Cards, Layouts,Calendar,Charts,Map etc.)

> 📚 **Check out the [Full Component List](Blazwind.Components/COMPONENTS.md)** for detailed documentation on all available components.

## Quick Start

1.  **Install** the package.
2.  **Register** services in `Program.cs`.
3.  **Add** styles/scripts to `App.razor`.
4.  **Configure** `MainLayout.razor` with `BwDialogContainer`.

See [Blazwind.Components/README.md](Blazwind.Components/README.md) for a complete setup guide.

## Installation

### Option 1: NuGet (Core Components Only)

Install the core package via NuGet:

```bash
dotnet add package Blazwind.Components
```

### 2. Register Services

Add the following to your `Program.cs`:

```csharp
builder.Services.AddBlazwind();
```

### Option 2: GitHub (Full Source & Reporting)

Clone the repository to access all components.

```bash
git clone https://github.com/cihad/Blazwind.git
```

## Running the Project

This project uses a `Makefile` for easy build and run commands. You can access the **Blazwind Examples** project to see all components in action.

### Common Commands

| Command | Description |
| :--- | :--- |
| `make run` | Builds the frontend (Tailwind/TS) and runs the Examples project. |
| `make build` | Builds the frontend and the .NET solution. |

### Manual Run

If you don't have `make` installed:

1.  **Build Frontend**:
    ```bash
    cd Blazwind.Components/frontend
    npm install && npm run build
    ```
2.  **Run Examples**:
    ```bash
    cd ../../
    dotnet run --project Blazwind.Examples
    ```

## License

This project is licensed under the [MIT License](LICENSE).
