# Blazwind Theming System
## Complete AI Agent Implementation Guide

> **This document is the authoritative reference for implementing, extending, and maintaining the Blazwind theming system.**
> AI agents must follow these instructions precisely when working with themes.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [CSS Token System](#2-css-token-system)
3. [Theme File Structure](#3-theme-file-structure)
4. [BwTheme Component](#4-bwtheme-component)
5. [ThemeService API](#5-themeservice-api)
6. [Creating New Themes](#6-creating-new-themes)
7. [Component Theming Patterns](#7-component-theming-patterns)
8. [TypeScript Theming](#8-typescript-theming)
9. [Theme Presets](#9-theme-presets)
10. [Migration Checklist](#10-migration-checklist)

---

## 1. Architecture Overview

### System Design

```
┌────────────────────────────────────────────────────────────────────┐
│                         Application                                 │
├────────────────────────────────────────────────────────────────────┤
│  <BwTheme Name="blazwind">                                         │
│      <Router>                                                       │
│          <Layout>                                                   │
│              <BwButton Color="Primary" />  ← Uses theme tokens     │
│          </Layout>                                                  │
│      </Router>                                                      │
│  </BwTheme>                                                         │
├────────────────────────────────────────────────────────────────────┤
│                      ThemeService                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • CurrentTheme: "blazwind"                                  │   │
│  │ • AvailableThemes: ["blazwind", "ocean", "forest"]          │   │
│  │ • SetTheme(name) → Injects CSS variables                    │   │
│  │ • OnThemeChanged event                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│                    Theme CSS Variables                              │
│  :root, .bw-theme-blazwind {                                       │
│      --bw-primary-500: #3b82f6;                                    │
│      --bw-color-primary: var(--bw-primary-500);                    │
│  }                                                                  │
├────────────────────────────────────────────────────────────────────┤
│                    Component CSS Classes                            │
│  .bw-btn-filled-primary {                                          │
│      background-color: var(--bw-btn-primary-bg);                   │
│  }                                                                  │
└────────────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **CSS Variables First**: All colors and themeable properties use CSS custom properties
2. **Semantic Tokens**: Components reference semantic tokens, not raw colors
3. **Zero JavaScript Runtime**: Theme switching only changes CSS, no component re-renders
4. **Dark Mode Built-in**: Each theme includes both light and dark mode values
5. **Scoped Themes**: Themes can be applied to entire app or specific sections

---

## 2. CSS Token System

### Token Hierarchy

```
Level 1: Base Palette (Raw Colors)
    └── --bw-{color}-{shade}
        Examples: --bw-blue-500, --bw-emerald-600

Level 2: Semantic Tokens (Intent-Based)
    └── --bw-color-{semantic}
        Examples: --bw-color-primary, --bw-color-success

Level 3: Component Tokens (Specific Use)
    └── --bw-{component}-{element}-{variant}
        Examples: --bw-btn-primary-bg, --bw-input-error-border
```

### Complete Token Reference

#### Base Palette Tokens

Each theme MUST define these base palette tokens:

```css
/* Primary Color Scale */
--bw-primary-50:  /* Lightest */
--bw-primary-100:
--bw-primary-200:
--bw-primary-300:
--bw-primary-400:
--bw-primary-500: /* Base */
--bw-primary-600:
--bw-primary-700:
--bw-primary-800:
--bw-primary-900: /* Darkest */

/* Repeat for: secondary, success, danger, warning, info, gray */
```

#### Semantic Tokens

These tokens MUST be defined and reference base palette:

```css
/* Color Semantics */
--bw-color-primary:           var(--bw-primary-600);
--bw-color-primary-hover:     var(--bw-primary-700);
--bw-color-primary-active:    var(--bw-primary-800);
--bw-color-primary-soft-bg:   var(--bw-primary-100);
--bw-color-primary-soft-text: var(--bw-primary-700);

/* Surface & Background */
--bw-color-background:        var(--bw-gray-50);
--bw-color-surface:           #ffffff;
--bw-color-surface-elevated:  #ffffff;

/* Text */
--bw-color-text:              var(--bw-gray-900);
--bw-color-text-secondary:    var(--bw-gray-600);
--bw-color-text-muted:        var(--bw-gray-400);
--bw-color-text-inverse:      #ffffff;

/* Borders */
--bw-color-border:            var(--bw-gray-200);
--bw-color-border-strong:     var(--bw-gray-300);
--bw-color-divider:           var(--bw-gray-100);

/* Focus */
--bw-color-focus-ring:        var(--bw-primary-500);
```

#### Component Tokens

Each component type has specific tokens:

```css
/* Button Tokens */
--bw-btn-primary-bg:           var(--bw-color-primary);
--bw-btn-primary-text:         var(--bw-color-text-inverse);
--bw-btn-primary-hover-bg:     var(--bw-color-primary-hover);
--bw-btn-primary-active-bg:    var(--bw-color-primary-active);
--bw-btn-primary-focus-ring:   var(--bw-color-primary);

/* Input Tokens */
--bw-input-bg:                 var(--bw-color-surface);
--bw-input-border:             var(--bw-color-border);
--bw-input-focus-border:       var(--bw-color-primary);
--bw-input-error-border:       var(--bw-color-danger);

/* Alert Tokens */
--bw-alert-success-bg:         var(--bw-color-success-soft-bg);
--bw-alert-success-border:     var(--bw-success-200);
--bw-alert-success-text:       var(--bw-color-success-soft-text);

/* Toast Tokens */
--bw-toast-bg:                 var(--bw-color-surface);
--bw-toast-success-border:     var(--bw-color-success);
--bw-toast-success-icon:       var(--bw-color-success);

/* Card Tokens */
--bw-card-bg:                  var(--bw-color-surface);
--bw-card-border:              var(--bw-color-border);
--bw-card-header-bg:           transparent;

/* Dialog Tokens */
--bw-dialog-bg:                var(--bw-color-surface);
--bw-dialog-overlay:           rgba(0, 0, 0, 0.5);
```

---

## 3. Theme File Structure

### Directory Layout

```
src/Blazwind.Components/
├── frontend/
│   └── src/
│       ├── themes/
│       │   ├── _base.css           # Shared token structure (no values)
│       │   ├── blazwind.css        # Default theme
│       │   ├── ocean.css           # Ocean theme
│       │   ├── forest.css          # Forest theme
│       │   └── index.css           # Theme exports
│       ├── components/
│       │   ├── button.css          # Button component classes
│       │   ├── input.css           # Input component classes
│       │   ├── alert.css           # Alert component classes
│       │   └── ...
│       └── style.css               # Main entry point
├── Services/
│   ├── ThemeService.cs             # Theme switching service
│   └── IThemeService.cs            # Interface
├── Theme/
│   ├── BwTheme.razor               # Theme provider component
│   ├── BwTheme.razor.cs            # Component code-behind
│   └── ThemePresets.cs             # Theme preset definitions
└── Shared/
    └── BwBase.razor                # Base component (unchanged)
```

### Theme File Template

Every theme file MUST follow this structure:

```css
/* ============================================
   Theme: [THEME_NAME]
   Description: [Brief description]
   ============================================ */

/* Theme Scope Class */
.bw-theme-[THEME_NAME],
:root:has(.bw-theme-[THEME_NAME]) {

  /* ========================================
     SECTION 1: Base Palette
     ======================================== */

  /* Primary */
  --bw-primary-50: [value];
  --bw-primary-100: [value];
  --bw-primary-200: [value];
  --bw-primary-300: [value];
  --bw-primary-400: [value];
  --bw-primary-500: [value];
  --bw-primary-600: [value];
  --bw-primary-700: [value];
  --bw-primary-800: [value];
  --bw-primary-900: [value];

  /* Secondary */
  --bw-secondary-50: [value];
  /* ... all shades ... */

  /* Success */
  --bw-success-50: [value];
  /* ... all shades ... */

  /* Danger */
  --bw-danger-50: [value];
  /* ... all shades ... */

  /* Warning */
  --bw-warning-50: [value];
  /* ... all shades ... */

  /* Info */
  --bw-info-50: [value];
  /* ... all shades ... */

  /* Gray */
  --bw-gray-50: [value];
  /* ... all shades ... */

  /* ========================================
     SECTION 2: Semantic Tokens
     ======================================== */

  --bw-color-primary: var(--bw-primary-600);
  --bw-color-primary-hover: var(--bw-primary-700);
  /* ... all semantic tokens ... */

  /* ========================================
     SECTION 3: Component Tokens
     ======================================== */

  /* Button */
  --bw-btn-primary-bg: var(--bw-color-primary);
  /* ... all component tokens ... */
}

/* ========================================
   DARK MODE OVERRIDES
   ======================================== */

.dark .bw-theme-[THEME_NAME],
.bw-theme-[THEME_NAME].dark,
:root.dark:has(.bw-theme-[THEME_NAME]) {

  /* Semantic overrides for dark mode */
  --bw-color-primary: var(--bw-primary-500);
  --bw-color-primary-hover: var(--bw-primary-600);

  /* Surface overrides */
  --bw-color-background: var(--bw-gray-900);
  --bw-color-surface: var(--bw-gray-800);

  /* Text overrides */
  --bw-color-text: var(--bw-gray-100);
  --bw-color-text-secondary: var(--bw-gray-400);

  /* ... all dark mode overrides ... */
}
```

---

## 4. BwTheme Component

### Component Definition

**File: `Theme/BwTheme.razor`**

```razor
@namespace Blazwind.Components.Theme
@inject IThemeService ThemeService
@implements IDisposable

<div class="bw-theme-@Name @(IsDark ? "dark" : "")" @attributes="AdditionalAttributes">
    <CascadingValue Value="this" Name="BwTheme">
        @ChildContent
    </CascadingValue>
</div>

@code {
    /// <summary>
    /// Theme name: "blazwind", "ocean", "forest", or custom
    /// </summary>
    [Parameter]
    public string Name { get; set; } = "blazwind";

    /// <summary>
    /// Force dark mode regardless of system preference
    /// </summary>
    [Parameter]
    public bool IsDark { get; set; }

    /// <summary>
    /// Content to render within theme scope
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Additional HTML attributes
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    protected override void OnInitialized()
    {
        ThemeService.OnThemeChanged += HandleThemeChanged;
    }

    protected override void OnParametersSet()
    {
        ThemeService.SetTheme(Name);
    }

    private void HandleThemeChanged()
    {
        InvokeAsync(StateHasChanged);
    }

    public void Dispose()
    {
        ThemeService.OnThemeChanged -= HandleThemeChanged;
    }
}
```

### Usage Examples

**Basic Usage (App.razor or Layout):**

```razor
<BwTheme Name="blazwind">
    <Router AppAssembly="@typeof(App).Assembly">
        <Found Context="routeData">
            <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
        </Found>
    </Router>
</BwTheme>
```

**With Dark Mode:**

```razor
<BwTheme Name="ocean" IsDark="true">
    @Body
</BwTheme>
```

**Nested Theme Sections:**

```razor
<BwTheme Name="blazwind">
    <MainContent />

    <!-- Different theme for sidebar -->
    <BwTheme Name="forest">
        <Sidebar />
    </BwTheme>
</BwTheme>
```

---

## 5. ThemeService API

### Interface Definition

**File: `Services/IThemeService.cs`**

```csharp
namespace Blazwind.Components.Services;

public interface IThemeService
{
    /// <summary>
    /// Currently active theme name
    /// </summary>
    string CurrentTheme { get; }

    /// <summary>
    /// List of available theme names
    /// </summary>
    IReadOnlyList<string> AvailableThemes { get; }

    /// <summary>
    /// Whether dark mode is currently active
    /// </summary>
    bool IsDarkMode { get; }

    /// <summary>
    /// Set the active theme
    /// </summary>
    /// <param name="themeName">Theme name (e.g., "blazwind", "ocean")</param>
    Task SetThemeAsync(string themeName);

    /// <summary>
    /// Toggle dark mode on/off
    /// </summary>
    Task ToggleDarkModeAsync();

    /// <summary>
    /// Set dark mode explicitly
    /// </summary>
    Task SetDarkModeAsync(bool isDark);

    /// <summary>
    /// Event fired when theme changes
    /// </summary>
    event Action? OnThemeChanged;

    /// <summary>
    /// Get theme preset by name
    /// </summary>
    ThemePreset? GetThemePreset(string name);

    /// <summary>
    /// Register a custom theme
    /// </summary>
    void RegisterTheme(ThemePreset preset);
}
```

### Service Implementation

**File: `Services/ThemeService.cs`**

```csharp
using Microsoft.JSInterop;

namespace Blazwind.Components.Services;

public class ThemeService : IThemeService
{
    private readonly IJSRuntime _js;
    private readonly Dictionary<string, ThemePreset> _themes = new();

    public string CurrentTheme { get; private set; } = "blazwind";
    public bool IsDarkMode { get; private set; }
    public IReadOnlyList<string> AvailableThemes => _themes.Keys.ToList();
    public event Action? OnThemeChanged;

    public ThemeService(IJSRuntime js)
    {
        _js = js;
        RegisterBuiltInThemes();
    }

    private void RegisterBuiltInThemes()
    {
        RegisterTheme(ThemePresets.Blazwind);
        RegisterTheme(ThemePresets.Ocean);
        RegisterTheme(ThemePresets.Forest);
    }

    public async Task SetThemeAsync(string themeName)
    {
        if (!_themes.ContainsKey(themeName))
            throw new ArgumentException($"Theme '{themeName}' not found");

        CurrentTheme = themeName;
        await ApplyThemeAsync();
        OnThemeChanged?.Invoke();
    }

    public async Task ToggleDarkModeAsync()
    {
        IsDarkMode = !IsDarkMode;
        await ApplyDarkModeAsync();
        OnThemeChanged?.Invoke();
    }

    public async Task SetDarkModeAsync(bool isDark)
    {
        IsDarkMode = isDark;
        await ApplyDarkModeAsync();
        OnThemeChanged?.Invoke();
    }

    public ThemePreset? GetThemePreset(string name)
    {
        return _themes.GetValueOrDefault(name);
    }

    public void RegisterTheme(ThemePreset preset)
    {
        _themes[preset.Name] = preset;
    }

    private async Task ApplyThemeAsync()
    {
        await _js.InvokeVoidAsync("Blazwind.Theme.setTheme", CurrentTheme);
    }

    private async Task ApplyDarkModeAsync()
    {
        await _js.InvokeVoidAsync("Blazwind.Theme.setDarkMode", IsDarkMode);
    }
}
```

### JavaScript Interop

**File: `frontend/src/theme.ts`**

```typescript
export function setTheme(themeName: string): void {
    // Remove all theme classes
    document.documentElement.classList.forEach(cls => {
        if (cls.startsWith('bw-theme-')) {
            document.documentElement.classList.remove(cls);
        }
    });

    // Add new theme class
    document.documentElement.classList.add(`bw-theme-${themeName}`);

    // Store preference
    localStorage.setItem('bw-theme', themeName);
}

export function setDarkMode(isDark: boolean): void {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('bw-dark-mode', String(isDark));
}

export function getStoredTheme(): string {
    return localStorage.getItem('bw-theme') || 'blazwind';
}

export function getStoredDarkMode(): boolean {
    const stored = localStorage.getItem('bw-dark-mode');
    if (stored !== null) {
        return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
});

// Export globally
if (typeof window !== 'undefined') {
    (window as any).Blazwind = (window as any).Blazwind || {};
    (window as any).Blazwind.Theme = {
        setTheme,
        setDarkMode,
        getStoredTheme,
        getStoredDarkMode
    };
}
```

### Usage in Components

```razor
@inject IThemeService ThemeService

<div>
    <p>Current Theme: @ThemeService.CurrentTheme</p>

    <button @onclick="@(() => ThemeService.SetThemeAsync("ocean"))">
        Switch to Ocean
    </button>

    <button @onclick="@(() => ThemeService.ToggleDarkModeAsync())">
        Toggle Dark Mode
    </button>
</div>
```

---

## 6. Creating New Themes

### Step-by-Step Guide

#### Step 1: Create Theme CSS File

Create `frontend/src/themes/[themename].css`:

```css
/* Theme: mytheme */

.bw-theme-mytheme,
:root:has(.bw-theme-mytheme) {

  /* Define your primary color scale */
  --bw-primary-50: #fdf4ff;
  --bw-primary-100: #fae8ff;
  --bw-primary-200: #f5d0fe;
  --bw-primary-300: #f0abfc;
  --bw-primary-400: #e879f9;
  --bw-primary-500: #d946ef;
  --bw-primary-600: #c026d3;
  --bw-primary-700: #a21caf;
  --bw-primary-800: #86198f;
  --bw-primary-900: #701a75;

  /* ... define all other palette colors ... */

  /* Semantic tokens reference palette */
  --bw-color-primary: var(--bw-primary-600);
  --bw-color-primary-hover: var(--bw-primary-700);
  /* ... */
}

/* Dark mode */
.dark .bw-theme-mytheme {
  --bw-color-primary: var(--bw-primary-500);
  /* ... */
}
```

#### Step 2: Register Theme Preset

Add to `Theme/ThemePresets.cs`:

```csharp
public static class ThemePresets
{
    public static ThemePreset MyTheme => new()
    {
        Name = "mytheme",
        DisplayName = "My Custom Theme",
        Description = "A vibrant purple theme",
        PrimaryColor = "#c026d3",
        CssFile = "themes/mytheme.css"
    };
}
```

#### Step 3: Import in style.css

```css
@import "./themes/mytheme.css";
```

#### Step 4: Register in ThemeService

```csharp
private void RegisterBuiltInThemes()
{
    RegisterTheme(ThemePresets.Blazwind);
    RegisterTheme(ThemePresets.Ocean);
    RegisterTheme(ThemePresets.Forest);
    RegisterTheme(ThemePresets.MyTheme); // Add this
}
```

### Color Palette Generation

Use these tools to generate consistent color palettes:

1. **Tailwind CSS Color Generator**: https://uicolors.app/create
2. **Realtime Colors**: https://realtimecolors.com
3. **Huemint**: https://huemint.com

Given a base color, generate the full 50-900 scale.

---

## 7. Component Theming Patterns

### Pattern A: Replace Switch Expression with CSS Class

**BEFORE (Hardcoded Tailwind):**

```razor
var variantClasses = (Color, Variant) switch {
    (BwColor.Primary, BwVariant.Filled) =>
        "bg-blue-600 text-white hover:bg-blue-700",
    (BwColor.Success, BwVariant.Filled) =>
        "bg-emerald-600 text-white hover:bg-emerald-700",
    // ... 30+ more cases
};

<button class="base-classes @variantClasses">
```

**AFTER (Themeable):**

```razor
@{
    var colorName = Color.ToString().ToLower();
    var variantName = Variant.ToString().ToLower();
    var themeClass = $"bw-btn-{variantName}-{colorName}";
}

<button class="@CombineClasses($"bw-btn bw-btn-{Size.ToString().ToLower()} {themeClass}")">
```

**Required CSS (`frontend/src/components/button.css`):**

```css
.bw-btn {
  @apply inline-flex items-center justify-center gap-2
         font-medium rounded transition-all
         focus:outline-none focus:ring-2 focus:ring-offset-1;
}

.bw-btn-filled-primary {
  background-color: var(--bw-btn-primary-bg);
  color: var(--bw-btn-primary-text);
}

.bw-btn-filled-primary:hover {
  background-color: var(--bw-btn-primary-hover-bg);
}

/* Generate for all color/variant combinations */
```

### Pattern B: Replace Color Property Mapping

**BEFORE:**

```razor
private string IconClass => Color switch {
    BwColor.Primary => "text-blue-600 dark:text-blue-400",
    BwColor.Success => "text-emerald-600 dark:text-emerald-400",
    _ => "text-gray-600"
};
```

**AFTER:**

```razor
private string IconClass => $"bw-icon-{Color.ToString().ToLower()}";
```

**Required CSS:**

```css
.bw-icon-primary { color: var(--bw-color-primary); }
.bw-icon-success { color: var(--bw-color-success); }
.bw-icon-danger { color: var(--bw-color-danger); }
/* ... */
```

### Pattern C: State Classes

**BEFORE:**

```razor
var stateClass = HasError
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20";
```

**AFTER:**

```razor
var stateClass = HasError ? "bw-input-error" : "bw-input-default";
```

**Required CSS:**

```css
.bw-input-default {
  border-color: var(--bw-input-border);
}

.bw-input-default:focus {
  border-color: var(--bw-input-focus-border);
  box-shadow: 0 0 0 3px var(--bw-input-focus-ring);
}

.bw-input-error {
  border-color: var(--bw-input-error-border);
}

.bw-input-error:focus {
  border-color: var(--bw-input-error-border);
  box-shadow: 0 0 0 3px var(--bw-input-error-ring);
}
```

---

## 8. TypeScript Theming

### Pattern: variantConfig Objects

**BEFORE (`toast.ts`):**

```typescript
const variantConfig = {
    success: {
        icon: 'fa-solid fa-circle-check',
        borderColor: 'border-l-emerald-500',
        iconClass: 'text-emerald-500',
        progressClass: 'bg-emerald-500',
    },
    danger: {
        icon: 'fa-solid fa-circle-xmark',
        borderColor: 'border-l-red-500',
        iconClass: 'text-red-500',
        progressClass: 'bg-red-500',
    }
};
```

**AFTER:**

```typescript
const variantConfig = {
    success: {
        icon: 'fa-solid fa-circle-check',
        borderColor: 'bw-toast-border-success',
        iconClass: 'bw-toast-icon-success',
        progressClass: 'bw-toast-progress-success',
    },
    danger: {
        icon: 'fa-solid fa-circle-xmark',
        borderColor: 'bw-toast-border-danger',
        iconClass: 'bw-toast-icon-danger',
        progressClass: 'bw-toast-progress-danger',
    }
};
```

**Required CSS (`frontend/src/components/toast.css`):**

```css
.bw-toast-border-success {
  border-left-color: var(--bw-toast-success-border);
}

.bw-toast-icon-success {
  color: var(--bw-toast-success-icon);
}

.bw-toast-progress-success {
  background-color: var(--bw-toast-success-progress);
}

/* Repeat for all variants */
```

### Pattern: Inline Template Classes

**BEFORE:**

```typescript
toast.className = `
    bg-white dark:bg-gray-800 shadow-lg
    border-l-4 ${config.borderColor}
    rounded-sm relative overflow-hidden
`;
```

**AFTER:**

```typescript
toast.className = `
    bw-toast
    ${config.borderColor}
`;
```

---

## 9. Theme Presets

### blazwind (Default Theme)

```css
/* Primary: Blue */
--bw-primary-500: #3b82f6;
--bw-primary-600: #2563eb;

/* Secondary: Slate */
--bw-secondary-500: #64748b;

/* Accent colors */
--bw-success-500: #10b981;
--bw-danger-500: #ef4444;
--bw-warning-500: #f59e0b;
--bw-info-500: #0ea5e9;
```

### ocean (Blue-Teal Theme)

```css
/* Primary: Teal-Blue */
--bw-primary-500: #0891b2;
--bw-primary-600: #0e7490;

/* Secondary: Cool Gray */
--bw-secondary-500: #64748b;

/* Accent: Ocean colors */
--bw-success-500: #059669;
--bw-danger-500: #dc2626;
--bw-warning-500: #d97706;
--bw-info-500: #0284c7;
```

### forest (Green-Earth Theme)

```css
/* Primary: Forest Green */
--bw-primary-500: #16a34a;
--bw-primary-600: #15803d;

/* Secondary: Warm Gray */
--bw-secondary-500: #78716c;

/* Accent: Earth tones */
--bw-success-500: #22c55e;
--bw-danger-500: #dc2626;
--bw-warning-500: #ca8a04;
--bw-info-500: #0369a1;
```

---

## 10. AI Agent Guide: Component Theming Conversion

> **CRITICAL FOR AI AGENTS**: Follow these steps EXACTLY when converting a component to use theme support.

### Directory Structure

```
src/Blazwind.Components/
├── frontend/
│   ├── src/
│   │   ├── themes/                    # Theme CSS files (CSS variables)
│   │   │   ├── blazwind.css           # Default theme (REQUIRED)
│   │   │   ├── ocean.css              # Ocean theme
│   │   │   └── forest.css             # Forest theme
│   │   ├── styles/                    # Component CSS files (theme-aware classes)
│   │   │   ├── button.css             # .bw-btn-* classes
│   │   │   ├── alert.css              # .bw-alert-* classes
│   │   │   ├── card.css               # .bw-card-* classes
│   │   │   ├── toast.css              # .bw-toast-* classes
│   │   │   ├── input.css              # .bw-input-* classes
│   │   │   └── ...
│   │   ├── components/                # TypeScript components
│   │   │   └── toast.ts               # Toast notification module
│   │   ├── style.css                  # Main CSS entry point
│   │   ├── theme.ts                   # Theme JS functions
│   │   └── main.ts                    # Main JS entry point
│   ├── package.json
│   └── vite.config.ts
├── Button/
│   └── BwButton.razor                 # Uses bw-btn-* classes
├── Alert/
│   └── BwAlert.razor                  # Uses bw-alert-* classes
├── Card/
│   └── BwCard.razor                   # Uses bw-card-* classes
├── Theme/
│   └── BwTheme.razor                  # Theme provider component
├── Services/
│   ├── IThemeService.cs
│   └── ThemeService.cs
└── wwwroot/
    ├── blazwind.js                    # Compiled JS
    └── css/
        └── themes/                    # Compiled theme CSS files
            ├── blazwind.css
            ├── ocean.css
            └── forest.css
```

### Step-by-Step Component Conversion Process

#### STEP 1: Analyze the Existing Component

Read the component `.razor` file and identify:

1. **Color switch expressions** - e.g., `Color switch { BwColor.Primary => "bg-blue-600", ... }`
2. **Variant switch expressions** - e.g., `Variant switch { BwVariant.Filled => "...", ... }`
3. **Hardcoded Tailwind classes** - e.g., `"bg-blue-600"`, `"text-gray-900"`, `"border-emerald-500"`
4. **Dark mode classes** - e.g., `"dark:bg-gray-800"`, `"dark:text-white"`

```razor
// EXAMPLE: What to look for
var variantClasses = (Color, Variant) switch {
    (BwColor.Primary, BwVariant.Filled) => "bg-blue-600 text-white hover:bg-blue-700",
    (BwColor.Success, BwVariant.Filled) => "bg-emerald-600 text-white hover:bg-emerald-700",
    // ... more hardcoded classes
};
```

#### STEP 2: Check Existing CSS File

Look in `frontend/src/styles/[component].css` for existing theme classes:

```bash
# Example: Check if button.css exists and has theme classes
cat frontend/src/styles/button.css
```

If the file exists, check if it uses CSS variables:
- ✅ GOOD: `background-color: var(--bw-color-primary);`
- ❌ BAD: `@apply bg-blue-600;` (hardcoded)

#### STEP 3: Create/Update Component CSS File

Create `frontend/src/styles/[component].css` with theme-aware classes:

**Naming Convention:**
```
.bw-[component]-[variant]-[color]
.bw-[component]-[element]-[color]

Examples:
- .bw-btn-filled-primary
- .bw-alert-soft-success
- .bw-card-icon-danger
- .bw-toast-border-warning
```

**CSS Structure Template:**
```css
/* ============================================
   [Component] Component Styles (Theme-Aware)
   ============================================ */

/* Base class */
.bw-[component] {
    @apply [tailwind-utilities];
    /* Use CSS variables for themeable properties */
    background-color: var(--bw-color-surface);
    color: var(--bw-color-text);
}

/* FILLED VARIANTS */
.bw-[component]-filled-primary {
    background-color: var(--bw-color-primary);
    color: var(--bw-color-text-inverse);
}

.bw-[component]-filled-primary:hover {
    background-color: var(--bw-color-primary-hover);
}

.bw-[component]-filled-success {
    background-color: var(--bw-color-success);
    color: var(--bw-color-text-inverse);
}

/* SOFT VARIANTS */
.bw-[component]-soft-primary {
    background-color: var(--bw-color-primary-soft-bg);
    color: var(--bw-color-primary-soft-text);
}

/* OUTLINE VARIANTS */
.bw-[component]-outline-primary {
    background: transparent;
    border: 1px solid var(--bw-color-primary);
    color: var(--bw-color-primary);
}

/* Repeat for: success, danger, warning, info, secondary, dark */
```

#### STEP 4: Update the Razor Component

Replace switch expressions with theme class references:

**BEFORE:**
```razor
@{
    var variantClasses = (Color, Variant) switch {
        (BwColor.Primary, BwVariant.Filled) => "bg-blue-600 text-white hover:bg-blue-700",
        (BwColor.Success, BwVariant.Filled) => "bg-emerald-600 text-white hover:bg-emerald-700",
        _ => "bg-blue-600 text-white"
    };
}

<button class="@CombineClasses($"base-classes {variantClasses}")">
```

**AFTER:**
```razor
@{
    // Base class
    var baseClass = "bw-[component]";
    
    // Size class (if applicable)
    var sizeClass = Size switch {
        BwSize.Small => "bw-[component]-small",
        BwSize.Large => "bw-[component]-large",
        _ => "bw-[component]-medium"
    };
    
    // Variant class mapping
    var variantClass = (Variant, Color) switch {
        (BwVariant.Filled, BwColor.Primary) => "bw-[component]-filled-primary",
        (BwVariant.Filled, BwColor.Success) => "bw-[component]-filled-success",
        (BwVariant.Filled, BwColor.Danger) => "bw-[component]-filled-danger",
        // ... all combinations
        (BwVariant.Soft, BwColor.Primary) => "bw-[component]-soft-primary",
        // ... etc
        _ => "bw-[component]-filled-primary"
    };
}

<button class="@CombineClasses($"{baseClass} {sizeClass} {variantClass}")">
```

#### STEP 5: Ensure CSS Import in style.css

Add import in `frontend/src/style.css`:

```css
/* Component Theming Classes */
@import "./styles/button.css";
@import "./styles/alert.css";
@import "./styles/card.css";
@import "./styles/[new-component].css";  /* ADD THIS */
```

#### STEP 6: Build and Test

```bash
# 1. Build frontend
cd src/Blazwind.Components/frontend
npm run build

# 2. Build .NET project
cd ../..
dotnet build

# 3. Run the app
dotnet run --project src/Blazwind.Docs
```

#### STEP 7: Verify Theme Switching

Test the component with all 3 themes:
1. **Blazwind** (blue) - Default
2. **Ocean** (cyan/teal)
3. **Forest** (green)

Verify:
- [ ] Colors change when switching themes
- [ ] Dark mode works correctly
- [ ] No visual regression from original

### CSS Variable Reference

When writing CSS, use these semantic variables (defined in theme files):

| Purpose | Variable |
|---------|----------|
| Primary color | `var(--bw-color-primary)` |
| Primary hover | `var(--bw-color-primary-hover)` |
| Primary soft bg | `var(--bw-color-primary-soft-bg)` |
| Primary soft text | `var(--bw-color-primary-soft-text)` |
| Success color | `var(--bw-color-success)` |
| Danger color | `var(--bw-color-danger)` |
| Warning color | `var(--bw-color-warning)` |
| Info color | `var(--bw-color-info)` |
| Secondary color | `var(--bw-color-secondary)` |
| Background | `var(--bw-color-background)` |
| Surface (card bg) | `var(--bw-color-surface)` |
| Text | `var(--bw-color-text)` |
| Text secondary | `var(--bw-color-text-secondary)` |
| Text inverse (white) | `var(--bw-color-text-inverse)` |
| Border | `var(--bw-color-border)` |
| Divider | `var(--bw-color-divider)` |

### Common Mistakes to Avoid

❌ **DON'T** use hardcoded Tailwind colors in CSS:
```css
.bw-btn-primary { @apply bg-blue-600; }  /* WRONG */
```

✅ **DO** use CSS variables:
```css
.bw-btn-primary { background-color: var(--bw-color-primary); }  /* CORRECT */
```

❌ **DON'T** keep color switch expressions in Razor:
```razor
var color = Color switch { BwColor.Primary => "blue", ... };  /* WRONG */
```

✅ **DO** map to CSS class names:
```razor
var colorClass = $"bw-component-{Color.ToString().ToLower()}";  /* CORRECT */
```

❌ **DON'T** use dark: prefix in CSS variables (already handled by theme):
```css
color: var(--bw-color-text); /* This automatically adapts to dark mode */
```

### Completed Components (Reference)

| Component | Razor File | CSS File | Status |
|-----------|------------|----------|--------|
| Button | `BwButton.razor` | `button.css` | ✅ Complete |
| Alert | `BwAlert.razor` | `alert.css` | ✅ Complete |
| Card | `BwCard.razor` | `card.css` | ✅ Complete |
| Toast | `toast.ts` | `toast.css` | ✅ Complete |

---

## 11. Migration Checklist

### For Each Component:

- [ ] Read the component and identify hardcoded colors
- [ ] Check/create CSS file in `frontend/src/styles/`
- [ ] Define CSS classes using `var(--bw-*)` variables
- [ ] Update Razor to use `bw-[component]-*` classes
- [ ] Ensure import in `style.css`
- [ ] Build frontend: `npm run build`
- [ ] Build .NET: `dotnet build`
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test theme switching (all 3 themes)
- [ ] Verify no visual regression

### Priority Order:

1. ~~**BwButton**~~ ✅ Complete
2. ~~**BwAlert**~~ ✅ Complete
3. **BwBadge** - Similar to button
4. **BwInput** - Form foundation
5. ~~**BwCard**~~ ✅ Complete
6. **BwDialog** - Modal styling
7. ~~**Toast (TypeScript)**~~ ✅ Complete
8. **BwProgress** - Color variants
9. **BwTable** - Complex component
10. **Remaining components**

---

## 12. Quick Reference

### Build Commands

```bash
# Build frontend (CSS + JS)
cd src/Blazwind.Components/frontend
npm run build

# Build .NET project
dotnet build

# Run docs project
dotnet run --project src/Blazwind.Docs
```

### File Locations

| Purpose | Location |
|---------|----------|
| Theme CSS files | `frontend/src/themes/` |
| Component CSS files | `frontend/src/styles/` |
| Main CSS entry | `frontend/src/style.css` |
| Theme JS functions | `frontend/src/theme.ts` |
| ThemeService | `Services/ThemeService.cs` |
| BwTheme component | `Theme/BwTheme.razor` |

### Find Hardcoded Colors

```bash
# Find remaining hardcoded Tailwind colors in Razor files
grep -rn "bg-blue-\|bg-emerald-\|bg-red-\|text-blue-\|text-gray-" --include="*.razor" src/
```

