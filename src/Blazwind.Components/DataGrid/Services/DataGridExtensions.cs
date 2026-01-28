using System.Linq.Expressions;
using System.Reflection;
using Blazwind.Components.DataGrid.Models;

namespace Blazwind.Components.DataGrid.Services;

/// <summary>
///     Extension methods for IQueryable to apply DataGrid state for server-side operations.
///     These extensions allow seamless integration with Entity Framework and other IQueryable providers.
/// </summary>
public static class DataGridExtensions
{
    /// <summary>
    ///     Applies the complete DataGrid state (filters, sorting, pagination) to an IQueryable.
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <param name="query">Source query</param>
    /// <param name="state">DataGrid state containing filters, sorts, and pagination info</param>
    /// <returns>Query with applied filters, sorting, and pagination</returns>
    public static IQueryable<T> ApplyDataGridState<T>(this IQueryable<T> query, DataGridState state)
    {
        if (state == null) return query;

        // Apply filters
        if (state.Filters?.Any() == true) query = query.ApplyFilters(state.Filters);

        // Apply search query
        if (!string.IsNullOrWhiteSpace(state.SearchQuery)) query = query.ApplySearch(state.SearchQuery);

        // Apply sorting
        if (state.Sorts?.Any() == true) query = query.ApplySorting(state.Sorts);

        // Apply pagination
        query = query.ApplyPagination(state.CurrentPage, state.PageSize);

        return query;
    }

    /// <summary>
    ///     Applies filters to an IQueryable based on FilterDescriptor list.
    /// </summary>
    public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, IEnumerable<FilterDescriptor> filters)
    {
        foreach (var filter in filters.Where(f => f.Value != null ||
                                                  f.Operator == FilterOperator.IsNull ||
                                                  f.Operator == FilterOperator.IsNotNull))
        {
            var parameter = Expression.Parameter(typeof(T), "x");
            var property = GetNestedProperty(parameter, filter.Field);

            if (property == null) continue;

            var filterExpression = BuildFilterExpression(property, filter);
            if (filterExpression == null) continue;

            var lambda = Expression.Lambda<Func<T, bool>>(filterExpression, parameter);
            query = query.Where(lambda);
        }

        return query;
    }

    /// <summary>
    ///     Applies text search across all string properties.
    /// </summary>
    public static IQueryable<T> ApplySearch<T>(this IQueryable<T> query, string searchQuery)
    {
        if (string.IsNullOrWhiteSpace(searchQuery)) return query;

        var parameter = Expression.Parameter(typeof(T), "x");
        var searchValue = searchQuery.ToLower();

        Expression? combinedExpression = null;
        var stringProperties = typeof(T).GetProperties()
            .Where(p => p.PropertyType == typeof(string) && p.CanRead);

        foreach (var prop in stringProperties)
        {
            var property = Expression.Property(parameter, prop);
            var notNull = Expression.NotEqual(property, Expression.Constant(null, typeof(string)));

            var toLower = Expression.Call(property, typeof(string).GetMethod("ToLower", Type.EmptyTypes)!);
            var contains = Expression.Call(toLower,
                typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                Expression.Constant(searchValue));

            var condition = Expression.AndAlso(notNull, contains);

            combinedExpression = combinedExpression == null
                ? condition
                : Expression.OrElse(combinedExpression, condition);
        }

        if (combinedExpression != null)
        {
            var lambda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
            query = query.Where(lambda);
        }

        return query;
    }

    /// <summary>
    ///     Applies sorting to an IQueryable based on SortDescriptor list.
    /// </summary>
    public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, IEnumerable<SortDescriptor> sorts)
    {
        var sortedSorts = sorts.OrderBy(s => s.Priority).ToList();
        IOrderedQueryable<T>? orderedQuery = null;

        foreach (var sort in sortedSorts)
        {
            var parameter = Expression.Parameter(typeof(T), "x");
            var property = GetNestedProperty(parameter, sort.Field);

            if (property == null) continue;

            var lambda = Expression.Lambda(property, parameter);

            if (orderedQuery == null)
                orderedQuery = sort.Direction == SortDirection.Ascending
                    ? Queryable.OrderBy(query, (dynamic)lambda)
                    : Queryable.OrderByDescending(query, (dynamic)lambda);
            else
                orderedQuery = sort.Direction == SortDirection.Ascending
                    ? Queryable.ThenBy(orderedQuery, (dynamic)lambda)
                    : Queryable.ThenByDescending(orderedQuery, (dynamic)lambda);
        }

        return orderedQuery ?? query;
    }

    /// <summary>
    ///     Applies pagination to an IQueryable.
    /// </summary>
    public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    /// <summary>
    ///     Gets the total count for the query (for pagination).
    ///     Call this BEFORE applying pagination.
    /// </summary>
    public static async Task<int> GetTotalCountAsync<T>(
        this IQueryable<T> query,
        DataGridState state,
        CancellationToken cancellationToken = default)
    {
        if (state == null) return await Task.FromResult(query.Count());

        // Apply filters only (not pagination)
        if (state.Filters?.Any() == true) query = query.ApplyFilters(state.Filters);

        if (!string.IsNullOrWhiteSpace(state.SearchQuery)) query = query.ApplySearch(state.SearchQuery);

        return query.Count();
    }

    /// <summary>
    ///     Gets the total count synchronously.
    /// </summary>
    public static int GetTotalCount<T>(this IQueryable<T> query, DataGridState state)
    {
        if (state == null) return query.Count();

        if (state.Filters?.Any() == true) query = query.ApplyFilters(state.Filters);

        if (!string.IsNullOrWhiteSpace(state.SearchQuery)) query = query.ApplySearch(state.SearchQuery);

        return query.Count();
    }

    #region Private Helpers

    private static Expression? GetNestedProperty(Expression parameter, string propertyPath)
    {
        if (string.IsNullOrEmpty(propertyPath)) return null;

        var property = parameter;
        foreach (var member in propertyPath.Split('.'))
        {
            var propertyInfo = property.Type.GetProperty(member,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (propertyInfo == null) return null;

            property = Expression.Property(property, propertyInfo);
        }

        return property;
    }

    private static Expression? BuildFilterExpression(Expression property, FilterDescriptor filter)
    {
        var propertyType = property.Type;
        var underlyingType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;

        // Handle null checks
        if (filter.Operator == FilterOperator.IsNull)
            return propertyType.IsValueType && Nullable.GetUnderlyingType(propertyType) == null
                ? Expression.Constant(false)
                : Expression.Equal(property, Expression.Constant(null, propertyType));

        if (filter.Operator == FilterOperator.IsNotNull)
            return propertyType.IsValueType && Nullable.GetUnderlyingType(propertyType) == null
                ? Expression.Constant(true)
                : Expression.NotEqual(property, Expression.Constant(null, propertyType));

        // Convert filter value to property type
        object? filterValue;
        try
        {
            filterValue = ConvertValue(filter.Value, underlyingType);
        }
        catch
        {
            return null;
        }

        var constant = Expression.Constant(filterValue, propertyType);

        // String operations
        if (underlyingType == typeof(string)) return BuildStringExpression(property, filter, filterValue?.ToString());

        // Comparison operations
        return filter.Operator switch
        {
            FilterOperator.Equals => Expression.Equal(property, constant),
            FilterOperator.NotEquals => Expression.NotEqual(property, constant),
            FilterOperator.GreaterThan => Expression.GreaterThan(property, constant),
            FilterOperator.GreaterThanOrEqual => Expression.GreaterThanOrEqual(property, constant),
            FilterOperator.LessThan => Expression.LessThan(property, constant),
            FilterOperator.LessThanOrEqual => Expression.LessThanOrEqual(property, constant),
            FilterOperator.Between => BuildBetweenExpression(property, filter, underlyingType),
            _ => null
        };
    }

    private static Expression? BuildStringExpression(Expression property, FilterDescriptor filter, string? value)
    {
        if (value == null) return null;

        var nullCheck = Expression.NotEqual(property, Expression.Constant(null, typeof(string)));

        Expression stringExpr = filter.Operator switch
        {
            FilterOperator.Contains => Expression.Call(property,
                typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                Expression.Constant(value)),
            FilterOperator.NotContains => Expression.Not(Expression.Call(property,
                typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                Expression.Constant(value))),
            FilterOperator.StartsWith => Expression.Call(property,
                typeof(string).GetMethod("StartsWith", new[] { typeof(string) })!,
                Expression.Constant(value)),
            FilterOperator.EndsWith => Expression.Call(property,
                typeof(string).GetMethod("EndsWith", new[] { typeof(string) })!,
                Expression.Constant(value)),
            FilterOperator.Equals => Expression.Equal(property, Expression.Constant(value)),
            FilterOperator.NotEquals => Expression.NotEqual(property, Expression.Constant(value)),
            _ => Expression.Constant(true)
        };

        return Expression.AndAlso(nullCheck, stringExpr);
    }

    private static Expression? BuildBetweenExpression(Expression property, FilterDescriptor filter, Type underlyingType)
    {
        if (filter.Value == null || filter.SecondValue == null) return null;

        try
        {
            var startValue = ConvertValue(filter.Value, underlyingType);
            var endValue = ConvertValue(filter.SecondValue, underlyingType);

            var startConstant = Expression.Constant(startValue, property.Type);
            var endConstant = Expression.Constant(endValue, property.Type);

            var greaterThanOrEqual = Expression.GreaterThanOrEqual(property, startConstant);
            var lessThanOrEqual = Expression.LessThanOrEqual(property, endConstant);

            return Expression.AndAlso(greaterThanOrEqual, lessThanOrEqual);
        }
        catch
        {
            return null;
        }
    }

    private static object? ConvertValue(object? value, Type targetType)
    {
        if (value == null) return null;

        if (targetType == typeof(Guid)) return Guid.Parse(value.ToString()!);

        if (targetType == typeof(DateOnly)) return DateOnly.Parse(value.ToString()!);

        if (targetType == typeof(TimeOnly)) return TimeOnly.Parse(value.ToString()!);

        if (targetType.IsEnum) return Enum.Parse(targetType, value.ToString()!);

        return Convert.ChangeType(value, targetType);
    }

    #endregion
}