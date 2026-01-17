# BwComment

A comprehensive commenting system for documents, records, or social threads. It supports nested replies, user mentions, likes, and editing capabilities.

## Features

- ✅ **Threaded Replies**: Multi-level nested comments for organized discussions.
- ✅ **Avatars & Roles**: Display author identities with roles/badges.
- ✅ **Relative Timestamps**: Human-readable time displays (e.g., "5 mins ago").
- ✅ **Like System**: Built-in support for upvoting/liking comments.
- ✅ **CRUD Operations**: Support for editing and deleting existing comments.
- ✅ **Mentions**: Integration with `@mentions` for tagging users.
- ✅ **Empty State**: Visual placeholder when no comments exist.

## Usage

### Basic Thread
```razor
<BwComment Comments="_comments" 
           Title="Engagement"
           CurrentUserName="Admin"
           OnAdd="HandleAdd"
           OnLike="HandleLike" />

@code {
    private List<CommentItem> _comments = new() {
        new() {
            AuthorName = "Alice",
            Content = "This is a great feature!",
            CreatedAt = DateTime.Now.AddHours(-1),
            LikeCount = 2
        }
    };
}
```

### Advanced Usage with Mentions
```razor
<BwComment Comments="_comments" 
           Mentions="_userMentions"
           AllowReply="true"
           OnReply="HandleReply" />
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Comments` | `List<CommentItem>` | `[]` | The list of comment objects to display. |
| `Title` | `string` | `"Comments"` | Heading text for the comment section. |
| `Placeholder` | `string` | `"Write a comment..."` | Input placeholder text. |
| `AllowAdd` | `bool` | `true` | Whether users can post new comments. |
| `AllowReply` | `bool` | `true` | Whether users can reply to existing comments. |
| `AllowLike` | `bool` | `true` | Whether the like button is visible. |
| `CurrentUserName` | `string?` | `null` | Name of the logged-in user (for new comments). |
| `CurrentUserAvatar`| `string?` | `null` | Avatar URL of the logged-in user. |
| `Mentions` | `List<BwMentionItem>` | `[]` | List of items for `@mention` auto-complete. |

### Event Callbacks

| Event | Payload | Description |
|-------|---------|-------------|
| `OnAdd` | `string` | Triggered when a new top-level comment is posted. |
| `OnReply` | `(string CommentId, string Text)` | Triggered when a reply is posted. |
| `OnEdit` | `CommentItem` | Triggered when the edit button is clicked. |
| `OnDelete` | `CommentItem` | Triggered when the delete button is clicked. |
| `OnLike` | `CommentItem` | Triggered when the like button is toggled. |

## Models

### CommentItem
| Property | Type | Description |
|----------|------|-------------|
| `Id` | `string` | Unique identifier. |
| `AuthorName` | `string` | Display name of the author. |
| `AuthorAvatar` | `string?` | URL to the author's avatar. |
| `AuthorRole` | `string?` | Optional role or title (e.g., "Moderator"). |
| `Content` | `string` | The text content of the comment. |
| `CreatedAt` | `DateTime` | Creation date and time. |
| `EditedAt` | `DateTime?` | Date of the last edit, if any. |
| `ParentId` | `string?` | ID of the parent comment (for replies). |
| `Replies` | `List<CommentItem>`| List of child comments. |
| `LikeCount` | `int` | Total number of likes. |
| `IsLiked` | `bool` | Whether the current user has liked this comment. |
| `CanEdit` | `bool` | Whether the current user is allowed to edit this. |
| `CanDelete` | `bool` | Whether the current user is allowed to delete this. |
