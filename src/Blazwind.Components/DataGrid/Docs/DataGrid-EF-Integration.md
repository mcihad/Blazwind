# BwDataGrid - Entity Framework Integration

This document explains how to use the BwDataGrid component with Entity Framework Core for server-side operations.

## Core Concepts

### Server-Side Mode

Server-side mode is optimized for large datasets. In this mode:
- **Filtering**, **sorting**, and **pagination** operations occur at the database level.
- Only the necessary records are fetched, rather than the entire dataset.
- Performance is significantly improved.

---

## Quick Start

### 1. DataGrid Parameters

```razor
<BwDataGrid TItem="Employee"
            Items="@_employees"
            ServerSide="true"
            TotalItems="@_totalCount"
            CurrentPage="@_currentPage"
            CurrentPageChanged="@OnPageChanged"
            PageSize="@_pageSize"
            PageSizeChanged="@OnPageSizeChanged"
            OnStateChanged="@LoadDataAsync">
    <ChildContent>
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Id)" Title="ID" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.FullName)" Title="Full Name" 
                          FilterType="FilterType.Text" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Department)" Title="Department" 
                          FilterType="FilterType.Select" FilterOptions="@_departments" />
        <BwDataGridColumn TItem="Employee" Field="@(e => e.Salary)" Title="Salary" 
                          FilterType="FilterType.Number" />
    </ChildContent>
</BwDataGrid>

@code {
    private List<Employee> _employees = new();
    private int _totalCount;
    private int _currentPage = 1;
    private int _pageSize = 10;
    
    protected override async Task OnInitializedAsync()
    {
        await LoadDataAsync(new DataGridState { CurrentPage = 1, PageSize = 10 });
    }
    
    private async Task LoadDataAsync(DataGridState state)
    {
        // Get IQueryable from DbContext
        var query = _dbContext.Employees.AsQueryable();
        
        // Get total count (before pagination)
        _totalCount = query.GetTotalCount(state);
        
        // Apply DataGrid state (filter, sort, page)
        _employees = await query
            .ApplyDataGridState(state)
            .ToListAsync();
        
        _currentPage = state.CurrentPage;
        _pageSize = state.PageSize;
        
        StateHasChanged();
    }
    
    private Task OnPageChanged(int page) => LoadDataAsync(new DataGridState 
    { 
        CurrentPage = page, 
        PageSize = _pageSize 
    });
    
    private Task OnPageSizeChanged(int size) => LoadDataAsync(new DataGridState 
    { 
        CurrentPage = 1, 
        PageSize = size 
    });
}
```

---

## Extension Methods

### ApplyDataGridState

Applies all state in a single call:

```csharp
var result = await dbContext.Employees
    .ApplyDataGridState(state)
    .ToListAsync();
```

### ApplyFilters

Applies only filters:

```csharp
var filters = new List<FilterDescriptor>
{
    new() { Field = "Department", Operator = FilterOperator.Equals, Value = "IT" },
    new() { Field = "Salary", Operator = FilterOperator.GreaterThan, Value = 10000 }
};

var result = await dbContext.Employees
    .ApplyFilters(filters)
    .ToListAsync();
```

### ApplySearch

Searches text across all string fields:

```csharp
var result = await dbContext.Employees
    .ApplySearch("john")
    .ToListAsync();
```

### ApplySorting

Applies sorting (supports multi-sort):

```csharp
var sorts = new List<SortDescriptor>
{
    new() { Field = "Department", Direction = SortDirection.Ascending, Priority = 0 },
    new() { Field = "Salary", Direction = SortDirection.Descending, Priority = 1 }
};

var result = await dbContext.Employees
    .ApplySorting(sorts)
    .ToListAsync();
```

### ApplyPagination

Applies pagination:

```csharp
var result = await dbContext.Employees
    .ApplyPagination(page: 2, pageSize: 25)
    .ToListAsync();
```

### GetTotalCount

Gets the total record count (applying filters):

```csharp
var totalCount = dbContext.Employees.GetTotalCount(state);
```

---

## Supported Filter Operators

| Operator | Description | Supported Types |
|----------|----------|-------------------|
| `Contains` | Contains substring | string |
| `NotContains` | Does not contain substring | string |
| `StartsWith` | Starts with | string |
| `EndsWith` | Ends with | string |
| `Equals` | Equals | All |
| `NotEquals` | Not equals | All |
| `GreaterThan` | Greater than | Numeric, Date |
| `GreaterThanOrEqual` | Greater than or equal | Numeric, Date |
| `LessThan` | Less than | Numeric, Date |
| `LessThanOrEqual` | Less than or equal | Numeric, Date |
| `Between` | Between two values | Numeric, Date |
| `IsNull` | Is null | Nullable types |
| `IsNotNull` | Is not null | Nullable types |

---

## Nested Property Support

Extension methods support nested properties via dot notation:

```csharp
var filters = new List<FilterDescriptor>
{
    new() { Field = "Department.Name", Operator = FilterOperator.Equals, Value = "IT" },
    new() { Field = "Manager.FullName", Operator = FilterOperator.Contains, Value = "John" }
};
```

---

## Performance Tips

1. **Indexes**: Add database indexes to frequently filtered and sorted fields.
2. **Projection**: Select only necessary fields instead of fetching complete entities.
3. **Include Optimization**: use `Include` for navigation properties only when needed.
4. **AsNoTracking**: Use `AsNoTracking()` for read-only operations.

```csharp
var result = await dbContext.Employees
    .AsNoTracking()
    .Include(e => e.Department)
    .ApplyDataGridState(state)
    .Select(e => new EmployeeDto
    {
        Id = e.Id,
        FullName = e.FullName,
        DepartmentName = e.Department.Name
    })
    .ToListAsync();
```

---

## FAQ

### How do I use Async methods?

```csharp
// Use GetTotalCountAsync
var totalCount = await query.GetTotalCountAsync(state, cancellationToken);
```

### How do I add custom filtering logic?

You can apply your own logic in the `OnStateChanged` callback:

```csharp
private async Task LoadDataAsync(DataGridState state)
{
    var query = DbContext.Employees.AsQueryable();
    
    // Custom logic
    if (state.CustomFilter is MyCustomFilter customFilter)
    {
        if (customFilter.OnlyActive)
        {
            query = query.Where(e => e.IsActive);
        }
    }
    
    // Apply remaining state
    query = query.ApplyFilters(state.Filters);
    query = query.ApplySorting(state.Sorts);
    
    _totalCount = query.Count();
    _employees = await query.ApplyPagination(state.CurrentPage, state.PageSize).ToListAsync();
}
```
