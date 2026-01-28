# Blazwind Roadmap to Release (Target: June 15, 2026)

**Start Date:** Jan 28, 2026

**Mission:** Create an AI-First, Mobile-First, mature Blazor Component Library with a standardized design system and premium developer experience.

## �️ Strategic Foundations

Before executing the timeline, these core principles apply to **all** phases:

1.  **Strict Branching Strategy**:
    *   Every phase/feature uses a dedicated branch (e.g., `feature/standardization`, `feature/theme-designer`).
    *   No direct commits to `main` until fully tested and verified.
2.  **AI-First & Mobile-First**:
    *   All components must be touch-friendly and responsive by default.
    *   "AI Support" means the library provides context and utilities that make it easy for AI agents to generate Blazwind code.
3.  **First-Class Documentation**:
    *   **Human Docs**: Interactive examples, detailed API refs.
    *   **AI Docs**: Structured `llms.txt` and context files for agents.
    *   **Code Docs**: 100% XML documentation coverage for IntelliSense.

---

## 🗓️ Phase 1: Standardization & Architecture (Jan 28 - Feb 28)

**Goal:** Lay the unbreakable foundation. Standardize styles and naming conventions.

*   **Style Standardization** (Feature Branch: `standardization`)
    *   [ ] **Enum to CSS Variable Mapping**:
        *   Implement automatic mapping of `BwColor` enums to CSS variables (e.g., `BwColor.Primary` â†’ `--bw-color-primary`).
        *   Ensure strict naming consistency across all CSS variables.
    *   [ ] **Component API Unification**:
        *   Standardize parameter names (e.g., `Size`, `Variant`, `Color` across all components).
        *   Refactor CSS classes to follow the generic `bw-{component}-{part}` pattern everywhere.
*   **Infrastructure**
    *   [ ] Setup branch protection and CI workflow updates to support the new roadmap.

---

## 🛠️ Phase 2: Core Maturity & Quality (Mar 1 - Mar 31)

**Goal:** Elevate every component to "Mature" status with robust implementation (Logic & Tests).

*   **Code Quality Drive** (Feature Branch: `quality-core`)
    *   [ ] **Component Review Loops**:
        *   Iterate through *every* component (Inputs, Layouts, Feedback, Navigation).
        *   Refactor internal logic for readability and performance.
        *   Ensure "Mobile First" behavior implementation in CSS/JS.
*   **Testing Foundation**
    *   [ ] **Razor C# Unit Tests**: Setup bUnit and write baseline tests for key components.
    *   [ ] **TypeScript Unit Tests**: Setup Jest/Vitest for any JS interop code.

---

## 🤖 Phase 3: The AI Engine & Validations (Apr 1 - Apr 30)

**Goal:** Solidify the "AI First" capabilities through tools and servers.

*   **AI Integration** (Feature Branch: `ai-features`)
    *   [ ] **AI Helper Utilities**: Add features that assist AI in reasoning about the UI state (e.g., semantic accessibility trees).
    *   [ ] **Blazwind MCP Server** (Feature Branch: `mcp-server`)
        *   **Objective**: Create a Model Context Protocol (MCP) server to directly feed context to AI IDEs.
        *   **Features**: Provide real-time component documentation, snippets, and validating potential new code against the current codebase rules.
*   **Comprehensive Testing** (Feature Branch: `testing-sprint`)
    *   [ ] **Unit Test Expansion**: Reach high code coverage (target > 80%).
    *   [ ] **Edge Case Testing**: Verify mobile gestures, touch targets, and responsiveness.

---

## 📚 Phase 4: Documentation & Ecosystem (May 1 - May 31)

**Goal:** Now that the Code is Stable, write the "First Class" Documents and build the tools.

*   **Documentation Sprint** (Feature Branch: `docs-full`)
    *   [ ] **Complete XML Documentation**:
        *   Add `<summary>`, `<param>`, and `<example>` tags to 100% of public classes, properties, and methods. (Done *now* to avoid churn during refactors).
    *   [ ] **AI Documentation Suite**:
        *   Create high-quality `llms.txt` and "System Prompt" assets.
        *   Document component hierarchies in machine-readable formats.
*   **Creative Tools** (Feature Branch: `theme-designer`)
    *   [ ] **Blazwind.ThemeDesigner**:
        *   Develop a standalone (or embedded) GUI tools to adjust standard `BwColor`, `BwSize`, etc.
        *   **Feature**: Save/Load mechanism for sets of CSS variables (Themes).
        *   **Feature**: "Download Theme" functionality for users.
*   **Blazwind.com** (Feature Branch: `website`)
    *   [ ] **Official Website Launch**:
        *   Landing page with "Mobile AI First" messaging.
        *   Hosting the documentation and Theme Designer.
        *   Interactive demos.

---

## 🚀 Phase 5: Final Polish & Launch (June 1 - June 15)

**Goal:** Optimization, final verification, and Release.

*   **Final Polish** (Feature Branch: `release-prep`)
    *   [ ] **Optimizations**: Tree-shaking verification, CSS minification, JS Interop performance tuning.
    *   [ ] **Regression Testing**: Full manual and automated sweep of the entire library.
    *   [ ] **Merge**: Consolidate all branches into `main`.
*   **Release Day (June 15, 2026)**
    *   [ ] Publish NuGet Package v1.0.0.
    *   [ ] Go Live with Blazwind.com.
    *   [ ] Public Announcement.
