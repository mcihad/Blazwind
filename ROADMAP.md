# Blazwind Q2 2026 Release Roadmap

**Current Date:** 2026-01-26
**Target Release:** Q2 2026 (April - June)
**Status:** Alpha
**License:** MIT
**Goal:** High-quality, intuitive, predictable, AI-ready Blazor Component Library.

## 📌 Executive Summary

This roadmap outlines the path from Alpha to v1.0 Release. The focus is on **standardization**, **predictability**, **testing**, and **AI-readiness**. We aim for a "Premium" developer experience where code is intuitive and documentation is machine-parsable.

---

## 🗓️ Phase 1: Standardization & Architecture (Weeks 1-3)

*Goal: Ensure every component feels like part of a preset system, not a collection of isolated scripts.*

### 1.1 Core Architecture Refactoring
- [ ] **Inheritance Standardization**: Refactor *ALL* components to inherit from `BwBase` (or `BwComponentBase`).
    -   Ensure unified handling of `Id`, `Class`, `Style`, `AdditionalAttributes`.
    -   Remove duplicate parameter definitions across 100+ components.
- [ ] **Enum Consolidation**:
    -   Audit `Blazwind.Components/Shared` to ensure NO duplicate enums exist.
    -   Enforce usage of `BwColor`, `BwSize`, `BwVariant`, `BwShape`, etc.
    -   Eliminate magic strings in component logic.
- [ ] **Semantic CSS Layer**:
    -   Introduce "Semantic Classes" (e.g., `.bw-button`, `.bw-card`) alongside Tailwind utilities.
    -   This enables easier testing (selectors) and potential future theming hooks.
    -   Write a `.editorconfig` to enforce coding styles (indentation, braces).

### 1.2 Development Experience (DX)
- [ ] **Analyzer Rules**: Add a Roslyn Analyzer or strict `.editorconfig` to warn on:
    -   Missing XML documentation.
    -   Public properties without default values.
    -   Parameters not being compatible with the base class.
- [ ] **Coding Rules Document**: Create `rules/CODING_STANDARDS.md`.
    -   Define logical ordering of properties (Parameters -> Inject -> State -> Methods).
    -   Define Naming conventions (`On[EvenName]`, `Is[State]`).
- [ ] **Design Rules Document**: Create `rules/DESIGN_SYSTEM.md`.
    -   Define strict token usage (Color palette URNs, Spacing logic).

---

## 🛠️ Phase 2: Testing & Quality Assurance (Weeks 4-7)

*Goal: Move from "It works on my machine" to "It works everywhere". Target Coverage: 60%.*

### 2.1 Testing Infrastructure
- [ ] **CI Pipeline**: Set up GitHub Actions to run tests on PRs.
- [ ] **Snapshot Testing**: Implement HTML snapshot testing (using verified bUnit output) to detect accidental UI regressions.

### 2.2 Unit Test Expansion
- [ ] **Core Component Coverage**: Rewrite/Create tests for Top 20 most used components:
    -   [ ] Button, Input, Select, Checkbox, Switch
    -   [ ] Grid, Stack/Flex, Container
    -   [ ] Card, Modal, Drawer
- [ ] **Interaction Testing**: Test `OnClick`, `OnValidSubmit`, `OnDismiss` events.
- [ ] **Corner Cases**: Test `null` inputs, `Disabled` states, and empty children.

### 2.3 Static Analysis
- [ ] **Accessibility Audit**: Run automated checks for ARIA labels, roles, and contrast ratios.
- [ ] **Architecture Tests**: Use `NetArchTest` to enforce dependency rules (e.g., *Components should not depend on Feature logic*).

---

## 🤖 Phase 3: Documentation & AI-Readiness (Weeks 8-10)

*Goal: Make the library "Self-Documenting" for humans and "Structurally Parsable" for AI Agents.*

### 3.1 Structured Documentation
- [ ] **Metadata Schema**: Add YAML frontmatter to all `Docs/*.md` files.
    -   `title`, `type`, `complexity`, `related_components`.
- [ ] **XML Comments**: **Mandatory** XML summaries for every public Parameter and Method.
    -   Why? So IDES *and* AI agents looking at source code understand intent immediately.
- [ ] **Single Source of Truth**:
    -   Update `COMPONENTS.md` to be the master index.
    -   Ensure no "orphan" components without docs.

### 3.2 AI Integration Kit
- [ ] **`llms.txt` Evolution**: Upgrade `llms.txt` to a full content map.
    -   Include short descriptions of every component.
    -   Include "Best Practice" snippets for AI code generation.
- [ ] **Context Window Optimization**: Create a `dist/blazwind-context.md` that concatenates high-level API definitions for use in Agent Prompts.

### 3.3 Examples & Demo
- [ ] **Interactive Playground**: (Optional) A WASM-based "Try it" page.
- [ ] **Copy-Paste Ready**: Ensure all code blocks in docs include necessary `@using` statements.

---

## 🔐 Phase 4: Polish, Performance & Security (Weeks 11-12)

*Goal: Production readiness.*

### 4.1 Security
- [ ] **Dependency Audit**: Scan all NuGet and NPM packages for vulnerabilities.
- [ ] **XSS Prevention**: Audit all `RenderFragment` and `MarkupString` usage. Ensure strict sanitization.
- [ ] **Input Validation**: Harden `BwForm` components against malformed inputs.

### 4.2 Performance
- [ ] **Render Cycle Optimization**: Use `bUnit` to count render cycles. Eliminate unnecessary re-renders.
- [ ] **Lazy Loading**: Ensure heavy JS (Maps, Charts) is lazy-loaded only when requested.
- [ ] **Tree Shaking**: Verify Tailwind CSS build only includes used classes.

---

## 🚀 Phase 5: Release Readiness (2 Weeks before Launch)

- [ ] **NuGet Packaging**: Finalize `.nuspec` metadata (Tags, Icon, License, Readme).
- [ ] **Changelog**: Generate a detailed Changelog from Git history.
- [ ] **v1.0.0 Tag**: Release candidate builds.
- [ ] **Announcement Post**: Blog post highlighting "AI-First Component Library".

---

## 📊 Success Metrics
1.  **Test Coverage**: > 60%
2.  **Documentation Coverage**: 100% of public API.
3.  **Lighthouse Score**: 95+ on Demo/Docs site.
4.  **Zero Critical Security Issues**.
