namespace Blazwind.Components.ApprovalChain;

/// <summary>
/// Approval step status
/// </summary>
public enum ApprovalStatus
{
    Pending,
    Approved,
    Rejected,
    Skipped
}

/// <summary>
/// Approval chain direction
/// </summary>
public enum ApprovalDirection
{
    Horizontal,
    Vertical
}

/// <summary>
/// Approval priority level
/// </summary>
public enum ApprovalPriority
{
    Normal,
    High,
    Urgent
}

/// <summary>
/// Represents an approval step
/// </summary>
public class ApprovalStep
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    public string Id { get; set; } = "";

    /// <summary>
    /// Step title/label
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// Description/details for the step
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Approver name
    /// </summary>
    public string? ApproverName { get; set; }

    /// <summary>
    /// Approver role/title
    /// </summary>
    public string? ApproverRole { get; set; }

    /// <summary>
    /// Approver avatar URL
    /// </summary>
    public string? ApproverAvatar { get; set; }

    /// <summary>
    /// Step status
    /// </summary>
    public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;

    /// <summary>
    /// Approval/rejection date
    /// </summary>
    public DateTime? Date { get; set; }

    /// <summary>
    /// Comment/note
    /// </summary>
    public string? Comment { get; set; }

    /// <summary>
    /// Icon class (FontAwesome)
    /// </summary>
    public string? Icon { get; set; }

    /// <summary>
    /// Priority level
    /// </summary>
    public ApprovalPriority Priority { get; set; } = ApprovalPriority.Normal;

    /// <summary>
    /// Due date for this step
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Whether this step requires digital signature
    /// </summary>
    public bool RequiresSignature { get; set; }

    /// <summary>
    /// Attached document count
    /// </summary>
    public int AttachmentCount { get; set; }
}