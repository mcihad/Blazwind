# UserProfile

A compact component to display user identity, typically used in headers or sidebars.

## Usage

```razor
@using Blazwind.Components.Layout

<BwUserProfile Name="John Doe" 
               Role="System Administrator" 
               Src="avatar.png" 
               StatusColor="BwColor.Success" 
               OnClick="HandleProfileClick" />
```

## Parameters

| Parameter     | Type                            | Default   | Description                                 |
|:--------------|:--------------------------------|:----------|:--------------------------------------------|
| `Name`        | `string`                        | `"User"`  | The display name of the user.               |
| `Role`        | `string?`                       | `null`    | Optional subtext for the user's role/title. |
| `Src`         | `string?`                       | `null`    | URL for the profile picture.                |
| `StatusColor` | `BwColor?`                      | `Success` | Color of the online status indicator.       |
| `Size`        | `BwSize`                        | `Medium`  | Overall size of the avatar and text.        |
| `OnClick`     | `EventCallback<MouseEventArgs>` | -         | Fired when the profile area is clicked.     |
