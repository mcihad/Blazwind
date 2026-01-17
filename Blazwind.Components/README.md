# Blazwind Components

**Blazwind** is a modern, enterprise-grade Blazor component library built with Tailwind CSS. It focuses on aesthetics, performance, and developer experience.

## Features

- **Blazwind.Components**: Core UI components including:
  - Inputs (Text, Number, Date, Select, etc.)
  - Buttons & Icons
  - Cards & Panels
  - Layouts (Drawers, Modals)
  - DataGrid & Tables
  - Calendar & Charts Integration

## Installation

Install the package via NuGet:

```bash
dotnet add package Blazwind.Components
```

## Setup

### 2. Register Services

Add the following to your `Program.cs`:

```csharp
builder.Services.AddBlazwind();
```

### 3. Style & Script References

Add the following to your `App.razor` (or `index.html` for WASM) within the `<head>` tag:

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

> **Note**: Charts (ECharts) and Maps (MapLibre) components load their dependencies dynamically when used. Ensure you have an active internet connection for CDN resources.

### 4. Global Imports

Add the namespace to your `_Imports.razor`:

```razor
@using Blazwind.Components
@using Blazwind.Components.Layout
@using Blazwind.Components.Navigation
@using Blazwind.Components.Shared
@using Blazwind.Components.Button
```

### 4. Layout Configuration

Update your `MainLayout.razor` to include the necessary containers and the application shell. Blazwind is mobile-first and fully supports Dark Mode out of the box.

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
                <!-- Add header actions here -->
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

## Features

- **Mobile First**: Designed with responsiveness at its core.
- **Dark Mode**: Built-in support for light and dark themes.
- **Dynamic Loading**: Heavy resources like Charts and Maps are loaded only when needed.
- **Tailwind CSS**: Modern utility-first styling for maximum customization.

## Example Usage

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
