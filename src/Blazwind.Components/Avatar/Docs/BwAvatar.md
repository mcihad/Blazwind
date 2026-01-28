# BwAvatar

A component used to display user profile pictures or initials.

## Examples

### Basic Usage

```razor
@* Initials automatic generation *@
<BwAvatar Name="John Doe" />

@* With image source *@
<BwAvatar Name="Cihad" Src="/images/avatar.jpg" />
```

### Sizes

Control the size using the `Size` parameter.

```razor
<BwAvatar Name="SM" Size="BwSize.Small" />
<BwAvatar Name="MD" Size="BwSize.Medium" />
<BwAvatar Name="LG" Size="BwSize.Large" />
```

### Status Indicators

Display user availability or status using the `StatusColor` parameter.

```razor
<BwAvatar Name="Online" StatusColor="BwColor.Success" />
<BwAvatar Name="Busy" StatusColor="BwColor.Danger" />
<BwAvatar Name="Away" StatusColor="BwColor.Warning" />
<BwAvatar Name="Offline" StatusColor="BwColor.Secondary" />
```

### Avatar Group

Use `BwAvatarGroup` to stack multiple avatars together.

```razor
@code {
    List<AvatarItem> avatars = new() 
    {
        new() { Name = "Alice" },
        new() { Name = "Bob", Src = "https://example.com/bob.jpg" },
        new() { Name = "Charlie" },
        new() { Name = "David" }
    };
}

@* Display maximum 3 avatars, others will be shown as +N *@
<BwAvatarGroup Avatars="@avatars" MaxDisplay="3" />
```

## API - BwAvatar

| Parameter     | Type       | Default         | Description                                                          |
|---------------|------------|-----------------|----------------------------------------------------------------------|
| `Src`         | `string?`  | `null`          | The image URL. If empty, initials will be displayed based on `Name`. |
| `Name`        | `string?`  | `null`          | The user's name (used for generating initials and alt text).         |
| `Size`        | `BwSize`   | `BwSize.Medium` | The size of the avatar (`Small`, `Medium`, `Large`).                 |
| `StatusColor` | `BwColor?` | `null`          | Status dot color. If null, no status indicator is shown.             |
| `Class`       | `string?`  | `null`          | Additional CSS classes for the container.                            |
| `Style`       | `string?`  | `null`          | Inline CSS styles.                                                   |

## API - BwAvatarGroup

| Parameter    | Type               | Default         | Description                                                                              |
|--------------|--------------------|-----------------|------------------------------------------------------------------------------------------|
| `Avatars`    | `List<AvatarItem>` | `new()`         | The list of avatar items to be displayed in the group.                                   |
| `MaxDisplay` | `int?`             | `null`          | Maximum number of avatars to display explicitly. Remaining ones are shown as a +N count. |
| `Size`       | `BwSize`           | `BwSize.Medium` | The size of all avatars in the group.                                                    |
| `Class`      | `string?`          | `null`          | Additional CSS classes for the group container.                                          |

### AvatarItem Model

| Property | Type      | Description                                |
|----------|-----------|--------------------------------------------|
| `Src`    | `string?` | Image URL for the individual avatar.       |
| `Name`   | `string?` | Name for initials generation and alt text. |
