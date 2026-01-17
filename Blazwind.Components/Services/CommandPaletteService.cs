namespace Blazwind.Components.Services;

/// <summary>
/// Command item for the command palette
/// </summary>
public class CommandItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Label { get; set; } = "";
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Category { get; set; }
    public string? Shortcut { get; set; }
    public Func<Task>? Action { get; set; }
    public bool IsDisabled { get; set; } = false;
}

/// <summary>
/// Service for managing the command palette
/// </summary>
public class CommandPaletteService
{
    private readonly List<CommandItem> _commands = new();
    private bool _isVisible = false;

    public event Action? OnVisibilityChanged;
    public event Action? OnCommandsChanged;

    public bool IsVisible => _isVisible;
    public IReadOnlyList<CommandItem> Commands => _commands.AsReadOnly();

    /// <summary>
    /// Show the command palette
    /// </summary>
    public void Show()
    {
        _isVisible = true;
        OnVisibilityChanged?.Invoke();
    }

    /// <summary>
    /// Hide the command palette
    /// </summary>
    public void Hide()
    {
        _isVisible = false;
        OnVisibilityChanged?.Invoke();
    }

    /// <summary>
    /// Toggle visibility
    /// </summary>
    public void Toggle()
    {
        _isVisible = !_isVisible;
        OnVisibilityChanged?.Invoke();
    }

    /// <summary>
    /// Register a new command
    /// </summary>
    public void RegisterCommand(CommandItem command)
    {
        if (!_commands.Any(c => c.Id == command.Id))
        {
            _commands.Add(command);
            OnCommandsChanged?.Invoke();
        }
    }

    /// <summary>
    /// Register multiple commands at once
    /// </summary>
    public void RegisterCommands(IEnumerable<CommandItem> commands)
    {
        foreach (var command in commands)
        {
            if (!_commands.Any(c => c.Id == command.Id))
            {
                _commands.Add(command);
            }
        }

        OnCommandsChanged?.Invoke();
    }

    /// <summary>
    /// Unregister a command by ID
    /// </summary>
    public void UnregisterCommand(string commandId)
    {
        var command = _commands.FirstOrDefault(c => c.Id == commandId);
        if (command != null)
        {
            _commands.Remove(command);
            OnCommandsChanged?.Invoke();
        }
    }

    /// <summary>
    /// Execute a command and hide the palette
    /// </summary>
    public async Task ExecuteCommand(CommandItem command)
    {
        if (command.Action != null && !command.IsDisabled)
        {
            Hide();
            await command.Action();
        }
    }

    /// <summary>
    /// Search commands by query
    /// </summary>
    public IEnumerable<CommandItem> Search(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return _commands.Where(c => !c.IsDisabled);
        }

        var lowerQuery = query.ToLower();
        return _commands
            .Where(c => !c.IsDisabled &&
                        (c.Label.ToLower().Contains(lowerQuery) ||
                         (c.Description?.ToLower().Contains(lowerQuery) ?? false) ||
                         (c.Category?.ToLower().Contains(lowerQuery) ?? false)))
            .OrderByDescending(c => c.Label.ToLower().StartsWith(lowerQuery))
            .ThenBy(c => c.Label);
    }

    /// <summary>
    /// Get commands grouped by category
    /// </summary>
    public Dictionary<string, List<CommandItem>> GetGroupedCommands(string query = "")
    {
        var filtered = Search(query).ToList();
        return filtered
            .GroupBy(c => c.Category ?? "Genel")
            .ToDictionary(g => g.Key, g => g.ToList());
    }
}