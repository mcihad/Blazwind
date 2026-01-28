namespace Blazwind.Components.Chat;

/// <summary>
///     Chat message type
/// </summary>
public enum ChatMessageType
{
    Text,
    System,
    File
}

/// <summary>
///     Chat attachment
/// </summary>
public class ChatAttachment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string? Url { get; set; }
    public string? Type { get; set; }
    public long? Size { get; set; }
}

/// <summary>
///     Represents a chat message
/// </summary>
public class ChatMessage
{
    /// <summary>
    ///     Unique identifier
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    ///     Sender ID
    /// </summary>
    public string SenderId { get; set; } = "";

    /// <summary>
    ///     Sender name
    /// </summary>
    public string SenderName { get; set; } = "";

    /// <summary>
    ///     Sender avatar URL
    /// </summary>
    public string? SenderAvatar { get; set; }

    /// <summary>
    ///     Message text content
    /// </summary>
    public string Content { get; set; } = "";

    /// <summary>
    ///     Message timestamp
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.Now;

    /// <summary>
    ///     Whether this message is from current user
    /// </summary>
    public bool IsOwn { get; set; }

    /// <summary>
    ///     Message type
    /// </summary>
    public ChatMessageType Type { get; set; } = ChatMessageType.Text;

    /// <summary>
    ///     File attachments
    /// </summary>
    public List<ChatAttachment> Attachments { get; set; } = new();

    /// <summary>
    ///     Is message read
    /// </summary>
    public bool IsRead { get; set; }
}

/// <summary>
///     Chat participant
/// </summary>
public class ChatParticipant
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
    public bool IsTyping { get; set; }
}