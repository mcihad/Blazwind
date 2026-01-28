using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Blazwind.Components.DataGrid.Models;
using ClosedXML.Excel;

namespace Blazwind.Components.DataGrid.Services;

/// <summary>
///     CSV format exporter
/// </summary>
public class CsvExporter : IDataGridExporter
{
    public string FileExtension => "csv";
    public string ContentType => "text/csv";
    public string DisplayName => "CSV";
    public string IconClass => "fa-solid fa-file-csv";

    public Task<byte[]> ExportAsync<TItem>(
        IEnumerable<TItem> items,
        IEnumerable<ColumnDefinition> columns,
        ExportOptions options,
        Func<TItem, ColumnDefinition, object?> getValue)
    {
        var sb = new StringBuilder();
        var columnList = columns.ToList();
        var delimiter = options.CsvDelimiter;

        // Headers
        if (options.IncludeHeaders)
            sb.AppendLine(string.Join(delimiter, columnList.Select(c => EscapeCsvField(c.Title, delimiter))));

        // Data rows
        foreach (var item in items)
        {
            var values = columnList.Select(col =>
            {
                var value = getValue(item, col);
                return EscapeCsvField(value?.ToString() ?? "", delimiter);
            });
            sb.AppendLine(string.Join(delimiter, values));
        }

        return Task.FromResult(Encoding.UTF8.GetBytes(sb.ToString()));
    }

    private static string EscapeCsvField(string field, char delimiter)
    {
        if (field.Contains(delimiter) || field.Contains('"') || field.Contains('\n') || field.Contains('\r'))
            return $"\"{field.Replace("\"", "\"\"")}\"";

        return field;
    }
}

/// <summary>
///     TSV (Tab-Separated Values) format exporter
/// </summary>
public class TsvExporter : IDataGridExporter
{
    public string FileExtension => "tsv";
    public string ContentType => "text/tab-separated-values";
    public string DisplayName => "TSV";
    public string IconClass => "fa-solid fa-file-lines";

    public Task<byte[]> ExportAsync<TItem>(
        IEnumerable<TItem> items,
        IEnumerable<ColumnDefinition> columns,
        ExportOptions options,
        Func<TItem, ColumnDefinition, object?> getValue)
    {
        var sb = new StringBuilder();
        var columnList = columns.ToList();

        // Headers
        if (options.IncludeHeaders) sb.AppendLine(string.Join('\t', columnList.Select(c => EscapeTsvField(c.Title))));

        // Data rows
        foreach (var item in items)
        {
            var values = columnList.Select(col =>
            {
                var value = getValue(item, col);
                return EscapeTsvField(value?.ToString() ?? "");
            });
            sb.AppendLine(string.Join('\t', values));
        }

        return Task.FromResult(Encoding.UTF8.GetBytes(sb.ToString()));
    }

    private static string EscapeTsvField(string field)
    {
        // Replace tabs with spaces
        return field.Replace('\t', ' ').Replace('\n', ' ').Replace('\r', ' ');
    }
}

/// <summary>
///     JSON format exporter
/// </summary>
public class JsonExporter : IDataGridExporter
{
    public string FileExtension => "json";
    public string ContentType => "application/json";
    public string DisplayName => "JSON";
    public string IconClass => "fa-solid fa-file-code";

    public Task<byte[]> ExportAsync<TItem>(
        IEnumerable<TItem> items,
        IEnumerable<ColumnDefinition> columns,
        ExportOptions options,
        Func<TItem, ColumnDefinition, object?> getValue)
    {
        var columnList = columns.ToList();
        var data = items.Select(item =>
        {
            var row = new Dictionary<string, object?>();
            foreach (var col in columnList) row[col.Field ?? col.Title] = getValue(item, col);

            return row;
        }).ToList();

        var jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = options.JsonIndented,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        var json = JsonSerializer.Serialize(data, jsonOptions);
        return Task.FromResult(Encoding.UTF8.GetBytes(json));
    }
}

/// <summary>
///     Excel (.xlsx) format exporter using ClosedXML
/// </summary>
public class ExcelExporter : IDataGridExporter
{
    public string FileExtension => "xlsx";
    public string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public string DisplayName => "Excel";
    public string IconClass => "fa-solid fa-file-excel";

    public Task<byte[]> ExportAsync<TItem>(
        IEnumerable<TItem> items,
        IEnumerable<ColumnDefinition> columns,
        ExportOptions options,
        Func<TItem, ColumnDefinition, object?> getValue)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add(options.ExcelSheetName ?? "Data");
        var columnList = columns.ToList();

        var row = 1;

        // Headers
        if (options.IncludeHeaders)
        {
            for (var col = 0; col < columnList.Count; col++)
            {
                var cell = worksheet.Cell(row, col + 1);
                cell.Value = columnList[col].Title;
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.LightGray;
                cell.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            }

            row++;
        }

        // Data rows
        foreach (var item in items)
        {
            for (var col = 0; col < columnList.Count; col++)
            {
                var value = getValue(item, columnList[col]);
                var cell = worksheet.Cell(row, col + 1);

                if (value != null)
                    switch (value)
                    {
                        case DateTime dt:
                            cell.Value = dt;
                            cell.Style.NumberFormat.Format = "dd.MM.yyyy";
                            break;
                        case decimal dec:
                            cell.Value = dec;
                            cell.Style.NumberFormat.Format = "#,##0.00";
                            break;
                        case double d:
                            cell.Value = d;
                            break;
                        case int i:
                            cell.Value = i;
                            break;
                        case long l:
                            cell.Value = l;
                            break;
                        case bool b:
                            cell.Value = b ? "Evet" : "Hayır";
                            break;
                        default:
                            cell.Value = value.ToString();
                            break;
                    }
            }

            row++;
        }

        // Auto-fit columns
        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return Task.FromResult(stream.ToArray());
    }
}