namespace Blazwind.Components.Tree;

/// <summary>
///     Data model for tree nodes.
/// </summary>
public class TreeNode<TItem>
{
    /// <summary>Unique identifier</summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>Display text</summary>
    public string Title { get; set; } = "";

    /// <summary>Optional icon class (Font Awesome)</summary>
    public string? Icon { get; set; }

    /// <summary>Child nodes</summary>
    public List<TreeNode<TItem>> Children { get; set; } = new();

    /// <summary>Associated data item</summary>
    public TItem? Data { get; set; }

    /// <summary>Is this node expanded?</summary>
    public bool IsExpanded { get; set; } = false;

    /// <summary>Is this node selected?</summary>
    public bool IsSelected { get; set; } = false;

    /// <summary>Is this node disabled?</summary>
    public bool IsDisabled { get; set; } = false;

    /// <summary>Does this node have children (for lazy loading)?</summary>
    public bool HasChildren { get; set; } = false;

    /// <summary>Is this node currently loading children?</summary>
    public bool IsLoading { get; set; } = false;

    /// <summary>Helper: Has actual children or indicates it has</summary>
    public bool CanExpand => Children.Count > 0 || HasChildren;
}