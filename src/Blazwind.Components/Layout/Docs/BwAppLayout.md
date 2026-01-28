# AppLayout

The root layout shell component that orchestrates the sidebar, header, footer, and main content area of your
application.

## Usage

Typically used in `MainLayout.razor` to define the overall structure of the app.

```razor
@using Blazwind.Components.Layout

<BwAppLayout SidebarPosition="BwDirection.Left">
    <Sidebar>
        <BwSidebar Color="BwColor.Dark">
            @* Navigation Menu goes here *@
        </BwSidebar>
    </Sidebar>
    
    <Header>
        <BwHeader>
            <LeftContent>
                <BwBrand Name="Blazwind" Logo="wind.png" />
            </LeftContent>
            <RightContent>
                <BwUserProfile Name="John Doe" Role="Admin" />
            </RightContent>
        </BwHeader>
    </Header>
    
    <ChildContent>
        @Body 
    </ChildContent>
    
    <Footer>
        <div class="text-center text-sm text-gray-500">
            © 2024 Blazwind Enterprise
        </div>
    </Footer>
</BwAppLayout>
```

## Parameters

| Parameter         | Type             | Default | Description                                                 |
|:------------------|:-----------------|:--------|:------------------------------------------------------------|
| `Sidebar`         | `RenderFragment` | -       | Content area for the navigation drawer.                     |
| `Header`          | `RenderFragment` | -       | Content area for the top toolbar.                           |
| `ChildContent`    | `RenderFragment` | -       | The main Body area of the page.                             |
| `Footer`          | `RenderFragment` | -       | Content area for the bottom bar.                            |
| `SidebarPosition` | `BwDirection`    | `Left`  | Anchors the sidebar to the `Left` or `Right` of the screen. |
| `Class`           | `string?`        | `null`  | Custom CSS classes for the main wrapper.                    |

## Features

- **Responsive Design**: The sidebar automatically collapses on mobile devices (under 1024px) and becomes accessible via
  a toggle button.
- **Fixed Shell**: The sidebar and header remain fixed to the viewport while the main content scrolls naturally.
- **Cascading Themes**: Pass colors or styles to the sidebar fragments easily.
