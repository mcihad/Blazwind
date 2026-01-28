namespace Blazwind.Components.DataGrid.Models;

/// <summary>
///     Options for exporting data grid content
/// </summary>
public class ExportOptions
{
    /// <summary>
    ///     Export format (CSV, Excel, JSON, Custom)
    /// </summary>
    public ExportFormat Format { get; set; } = ExportFormat.Csv;

    /// <summary>
    ///     File name without extension
    /// </summary>
    public string FileName { get; set; } = "export";

    /// <summary>
    ///     Include column headers in export
    /// </summary>
    public bool IncludeHeaders { get; set; } = true;

    /// <summary>
    ///     Export only selected items (if false, exports all/filtered items)
    /// </summary>
    public bool SelectedOnly { get; set; } = false;

    /// <summary>
    ///     Export only visible columns
    /// </summary>
    public bool VisibleColumnsOnly { get; set; } = true;

    /// <summary>
    ///     Apply current filters to export
    /// </summary>
    public bool ApplyFilters { get; set; } = true;

    /// <summary>
    ///     Apply current sorting to export
    /// </summary>
    public bool ApplySorting { get; set; } = true;

    /// <summary>
    ///     CSV delimiter character
    /// </summary>
    public char CsvDelimiter { get; set; } = ',';

    /// <summary>
    ///     Sheet name for Excel export
    /// </summary>
    public string ExcelSheetName { get; set; } = "Data";

    /// <summary>
    ///     Include formatting in Excel export
    /// </summary>
    public bool ExcelIncludeFormatting { get; set; } = true;

    /// <summary>
    ///     JSON indentation for readable output
    /// </summary>
    public bool JsonIndented { get; set; } = true;

    /// <summary>
    ///     Columns to include in export (null = all visible columns)
    /// </summary>
    public List<string>? ColumnIds { get; set; }
}