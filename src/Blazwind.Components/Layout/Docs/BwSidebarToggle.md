# Sidebar Toggle

A responsive button used to open and close the sidebar on mobile devices.

## Usage

Place this inside your `BwHeader` or anywhere in the layout. It only appears on mobile screens (`lg:hidden`).

```razor
@using Blazwind.Components.Layout

<BwHeader>
    <LeftContent>
        <BwSidebarToggle />
        <span class="ml-2">My App</span>
    </LeftContent>
</BwHeader>
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Class` | `string?` | `null` | Custom CSS classes. |
