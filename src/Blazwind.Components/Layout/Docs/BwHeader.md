# Header

A standardized top toolbar component for navigation, branding, and user actions.

## Usage

```razor
@using Blazwind.Components.Layout

<BwHeader>
    <LeftContent>
        <BwIcon Name="fa-bars" />
        <span class="font-bold">Dashboard</span>
    </LeftContent>
    <RightContent>
        <BwButton Icon="fa-bell" Variant="BwVariant.Ghost" />
        <BwUserProfile Name="Admin" />
    </RightContent>
</BwHeader>
```

## Parameters

| Parameter      | Type             | Default | Description                                                  |
|:---------------|:-----------------|:--------|:-------------------------------------------------------------|
| `LeftContent`  | `RenderFragment` | -       | Slot for left-aligned items (e.g., Logo, Toggles).           |
| `RightContent` | `RenderFragment` | -       | Slot for right-aligned items (e.g., Profile, Notifications). |
| `Class`        | `string?`        | `null`  | Custom CSS classes.                                          |
| `Style`        | `string?`        | `null`  | Custom inline CSS styles.                                    |
