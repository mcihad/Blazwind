using System.Text.Json;
using System.Text.Json.Nodes;

namespace Blazwind.Components.Tree;

/// <summary>
/// Field mapping configuration for JSON to Tree conversion
/// </summary>
public class TreeJsonFieldMapping
{
    /// <summary>Id field name in JSON (default: "id")</summary>
    public string IdField { get; set; } = "id";

    /// <summary>Title/display text field name in JSON (default: "title")</summary>
    public string TitleField { get; set; } = "title";

    /// <summary>Parent ID field name in JSON for flat data (default: "parentId")</summary>
    public string ParentIdField { get; set; } = "parentId";

    /// <summary>Icon field name in JSON (default: "icon")</summary>
    public string IconField { get; set; } = "icon";

    /// <summary>Children array field name in JSON for nested data (default: "children")</summary>
    public string ChildrenField { get; set; } = "children";

    /// <summary>Field indicating if node has children for lazy loading (default: "hasChildren")</summary>
    public string HasChildrenField { get; set; } = "hasChildren";
}

/// <summary>
/// Helper class for JSON to Tree conversion and vice versa
/// </summary>
public static class TreeJsonHelper
{
    private static readonly JsonSerializerOptions DefaultOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    /// <summary>
    /// Create a tree from flat JSON array with parent-child relationships via ParentId
    /// </summary>
    /// <typeparam name="T">Data type for tree nodes</typeparam>
    /// <param name="json">JSON array string</param>
    /// <param name="mapping">Field mapping configuration</param>
    /// <returns>List of root tree nodes</returns>
    public static List<TreeNode<T>> FromFlatJson<T>(string json, TreeJsonFieldMapping? mapping = null) where T : class
    {
        mapping ??= new TreeJsonFieldMapping();

        var jsonArray = JsonNode.Parse(json)?.AsArray();
        if (jsonArray == null) return new List<TreeNode<T>>();

        var allNodes = new Dictionary<string, TreeNode<T>>();
        var childrenMap = new Dictionary<string, List<string>>();

        // First pass: create all nodes
        foreach (var item in jsonArray)
        {
            if (item == null) continue;

            var id = item[mapping.IdField]?.GetValue<string>() ?? Guid.NewGuid().ToString();
            var title = item[mapping.TitleField]?.GetValue<string>() ?? "";
            var parentId = item[mapping.ParentIdField]?.GetValue<string>();
            var icon = item[mapping.IconField]?.GetValue<string>();
            var hasChildren = item[mapping.HasChildrenField]?.GetValue<bool>() ?? false;

            var node = new TreeNode<T>
            {
                Id = id,
                Title = title,
                Icon = icon,
                HasChildren = hasChildren,
                Data = item.Deserialize<T>(DefaultOptions)
            };

            allNodes[id] = node;

            if (!string.IsNullOrEmpty(parentId))
            {
                if (!childrenMap.ContainsKey(parentId))
                    childrenMap[parentId] = new List<string>();
                childrenMap[parentId].Add(id);
            }
        }

        // Second pass: build tree structure
        foreach (var kvp in childrenMap)
        {
            if (allNodes.TryGetValue(kvp.Key, out var parent))
            {
                foreach (var childId in kvp.Value)
                {
                    if (allNodes.TryGetValue(childId, out var child))
                    {
                        parent.Children.Add(child);
                    }
                }
            }
        }

        // Return root nodes (nodes without parent)
        var childIds = childrenMap.Values.SelectMany(x => x).ToHashSet();
        return allNodes.Values.Where(n => !childIds.Contains(n.Id)).ToList();
    }

    /// <summary>
    /// Create a tree from nested JSON with children arrays
    /// </summary>
    /// <typeparam name="T">Data type for tree nodes</typeparam>
    /// <param name="json">JSON array string with nested children</param>
    /// <param name="mapping">Field mapping configuration</param>
    /// <returns>List of root tree nodes</returns>
    public static List<TreeNode<T>> FromNestedJson<T>(string json, TreeJsonFieldMapping? mapping = null) where T : class
    {
        mapping ??= new TreeJsonFieldMapping();

        var jsonArray = JsonNode.Parse(json)?.AsArray();
        if (jsonArray == null) return new List<TreeNode<T>>();

        return ParseNestedNodes<T>(jsonArray, mapping);
    }

    private static List<TreeNode<T>> ParseNestedNodes<T>(JsonArray jsonArray, TreeJsonFieldMapping mapping)
        where T : class
    {
        var nodes = new List<TreeNode<T>>();

        foreach (var item in jsonArray)
        {
            if (item == null) continue;

            var id = item[mapping.IdField]?.GetValue<string>() ?? Guid.NewGuid().ToString();
            var title = item[mapping.TitleField]?.GetValue<string>() ?? "";
            var icon = item[mapping.IconField]?.GetValue<string>();
            var hasChildren = item[mapping.HasChildrenField]?.GetValue<bool>() ?? false;
            var childrenJson = item[mapping.ChildrenField]?.AsArray();

            var node = new TreeNode<T>
            {
                Id = id,
                Title = title,
                Icon = icon,
                HasChildren = hasChildren || (childrenJson?.Count > 0),
                Data = item.Deserialize<T>(DefaultOptions)
            };

            if (childrenJson != null && childrenJson.Count > 0)
            {
                node.Children = ParseNestedNodes<T>(childrenJson, mapping);
            }

            nodes.Add(node);
        }

        return nodes;
    }

    /// <summary>
    /// Export tree to JSON string
    /// </summary>
    /// <typeparam name="T">Data type for tree nodes</typeparam>
    /// <param name="nodes">Tree nodes to export</param>
    /// <param name="includeCollapsed">Include collapsed nodes (default: true)</param>
    /// <param name="mapping">Field mapping configuration for output</param>
    /// <returns>JSON string representation of the tree</returns>
    public static string ToJson<T>(List<TreeNode<T>> nodes, bool includeCollapsed = true,
        TreeJsonFieldMapping? mapping = null)
    {
        mapping ??= new TreeJsonFieldMapping();

        var jsonArray = new JsonArray();

        foreach (var node in nodes)
        {
            if (!includeCollapsed && !node.IsExpanded && node.Children.Any())
                continue;

            var jsonNode = new JsonObject
            {
                [mapping.IdField] = node.Id,
                [mapping.TitleField] = node.Title
            };

            if (!string.IsNullOrEmpty(node.Icon))
                jsonNode[mapping.IconField] = node.Icon;

            if (node.HasChildren)
                jsonNode[mapping.HasChildrenField] = true;

            if (node.Children.Any())
            {
                var childJson = ToJson(node.Children, includeCollapsed, mapping);
                jsonNode[mapping.ChildrenField] = JsonNode.Parse(childJson);
            }

            jsonArray.Add(jsonNode);
        }

        return jsonArray.ToJsonString(DefaultOptions);
    }
}