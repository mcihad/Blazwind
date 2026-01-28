using Blazwind.Components.DataGrid.Models;

namespace Blazwind.Components.DataGrid.Services;

/// <summary>
///     Interface for data grid export functionality.
///     Implement this interface to create custom exporters.
/// </summary>
public interface IDataGridExporter
{
    /// <summary>
    ///     File extension for the export format (e.g., "csv", "xlsx", "json")
    /// </summary>
    string FileExtension { get; }

    /// <summary>
    ///     MIME content type for the export format
    /// </summary>
    string ContentType { get; }

    /// <summary>
    ///     Display name for the export format
    /// </summary>
    string DisplayName { get; }

    /// <summary>
    ///     Icon class for the export button (FontAwesome)
    /// </summary>
    string IconClass { get; }

    /// <summary>
    ///     Export data to byte array
    /// </summary>
    /// <typeparam name="TItem">Type of data items</typeparam>
    /// <param name="items">Items to export</param>
    /// <param name="columns">Column definitions</param>
    /// <param name="options">Export options</param>
    /// <param name="getValue">Function to get cell value from item and column</param>
    /// <returns>Byte array of the exported file</returns>
    Task<byte[]> ExportAsync<TItem>(
        IEnumerable<TItem> items,
        IEnumerable<ColumnDefinition> columns,
        ExportOptions options,
        Func<TItem, ColumnDefinition, object?> getValue);
}