# Blazwind

> **Note**: This is an **early alpha version (v0.0.4-alpha)**. APIs are subject to change.

**Blazwind** is a modern, enterprise-grade Blazor component library built with Tailwind CSS. It focuses on aesthetics, performance, and developer experience.

## 🚀 Live Demo

Explore working examples of all components at **[https://mcihad.github.io/Blazwind/](https://mcihad.github.io/Blazwind/)**

## ✨ Features

- **80+ Components**: Comprehensive UI components including Inputs, Buttons, Cards, Layouts, DataGrid, Calendar, Charts, Maps, and more
- **Mobile First**: Designed with responsiveness at its core
- **Dark Mode**: Built-in support for light and dark themes
- **Tailwind CSS**: Modern utility-first styling for maximum customization
- **Dynamic Loading**: Heavy resources like Charts and Maps are loaded only when needed
- **TypeScript Support**: Type-safe frontend interactions

> 📚 **[Full Component List](src/Blazwind.Components/COMPONENTS.md)** - Detailed documentation on all available components

## 📦 Installation

### NuGet Package

```bash
dotnet add package Blazwind.Components
```

### GitHub Source

Clone the repository to access the full source code:

```bash
git clone https://github.com/cihad/Blazwind.git
```

## 🔧 Setup

### 1. Register Services

Add the following to your `Program.cs`:

```csharp
builder.Services.AddBlazwind();
```

### 2. Style & Script References

Add to your `App.razor` (or `index.html` for WASM) within the `<head>` tag:

```html
<!-- Google Fonts (Inter) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Blazwind Styles -->
<link rel="stylesheet" href="_content/Blazwind.Components/blazwind.css"/>
```

Add the script reference just before the closing `</body>` tag:

```html
<!-- Blazwind Scripts -->
<script src="_content/Blazwind.Components/blazwind.js"></script>
```

> **Note**: Charts (ECharts) and Maps (MapLibre) components load their dependencies dynamically when used.

### 3. Global Imports

Add the namespace to your `_Imports.razor`:

```razor
@using Blazwind.Components
@using Blazwind.Components.Layout
@using Blazwind.Components.Navigation
@using Blazwind.Components.Shared
@using Blazwind.Components.Button
```

### 4. Layout Configuration

Update your `MainLayout.razor` to include the necessary containers and the application shell:

```razor
@inherits LayoutComponentBase

<!-- Required for Dialogs and Drawers -->
<BwDialogContainer />
<BwDrawerContainer />

<BwAppLayout>
    <Sidebar>
        <NavMenu />
    </Sidebar>
    
    <Header>
        <BwHeader>
            <LeftContent>
                <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">My App</h1>
            </LeftContent>
            <RightContent>
                <BwButton Icon="fa-regular fa-bell" Variant="BwVariant.Ghost" />
            </RightContent>
        </BwHeader>
    </Header>
    
    <ChildContent>
        @Body
    </ChildContent>
</BwAppLayout>
```

### 5. Navigation Menu

Create a `NavMenu.razor` component using the flexible `BwNavMenu`:

```razor
<BwNavMenu>
    <Header>
        <BwNavHeader Title="Blazwind" Subtitle="App" Icon="fa-solid fa-wind" />
    </Header>

    <Search>
        <BwNavSearch Placeholder="Search..." />
    </Search>

    <ChildContent>
        <BwNavMenuGroup Title="General" Icon="fa-solid fa-house" DefaultExpanded="true">
            <BwNavMenuItem Label="Home" Href="" Icon="fa-solid fa-home" Match="NavLinkMatch.All" />
            <BwNavMenuItem Label="Dashboard" Href="dashboard" Icon="fa-solid fa-chart-pie" />
        </BwNavMenuGroup>
        
        <BwNavMenuGroup Title="Settings" Icon="fa-solid fa-gear">
            <BwNavMenuItem Label="Profile" Href="profile" Icon="fa-regular fa-user" />
        </BwNavMenuGroup>
    </ChildContent>
</BwNavMenu>
```

## 📖 Example Usage

Here is a simple example of a page using Blazwind components:

```razor
@page "/example"
@inject DialogService DialogService

<BwCard Title="Welcome" Icon="fa-solid fa-star">
    <BwButton Text="Say Hello" OnClick="ShowHello" Color="BwColor.Primary" />
</BwCard>

@code {
    private async Task ShowHello()
    {
        await DialogService.ShowAlertAsync("Hello", "Welcome to Blazwind!");
    }
}
```

## 🔒 Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting and security practices.

## 🛠️ Development

This project uses a `Makefile` for easy build and run commands.

### Common Commands

| Command | Description |
| :--- | :--- |
| `make run` | Builds the frontend (Tailwind/TypeScript) and runs the Examples project |
| `make build` | Builds the frontend and the .NET solution |

### Manual Build & Run

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

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📚 Documentation Index

- [Architecture](ARCHITECTURE.md)
- [Roadmap](ROADMAP.md)
- [Security Policy](SECURITY.md)
- [Component List](src/Blazwind.Components/COMPONENTS.md)
