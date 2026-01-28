namespace Blazwind.Components.Comment;

/// <summary>
///     Represents a comment/note
/// </summary>
public class CommentItem
{
    /// <summary>
    ///     Unique identifier
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    ///     Author name
    /// </summary>
    public string AuthorName { get; set; } = "";

    /// <summary>
    ///     Author avatar URL
    /// </summary>
    public string? AuthorAvatar { get; set; }

    /// <summary>
    ///     Author role/title
    /// </summary>
    public string? AuthorRole { get; set; }

    /// <summary>
    ///     Comment text content
    /// </summary>
    public string Content { get; set; } = "";

    /// <summary>
    ///     Creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    /// <summary>
    ///     Last edit timestamp
    /// </summary>
    public DateTime? EditedAt { get; set; }

    /// <summary>
    ///     Parent comment ID for replies
    /// </summary>
    public string? ParentId { get; set; }

    /// <summary>
    ///     Child replies
    /// </summary>
    public List<CommentItem> Replies { get; set; } = new();

    /// <summary>
    ///     Like count
    /// </summary>
    public int LikeCount { get; set; }

    /// <summary>
    ///     Whether current user liked this comment
    /// </summary>
    public bool IsLiked { get; set; }

    /// <summary>
    ///     Whether current user can edit this comment
    /// </summary>
    public bool CanEdit { get; set; }

    /// <summary>
    ///     Whether current user can delete this comment
    /// </summary>
    public bool CanDelete { get; set; }
}