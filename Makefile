.PHONY: build run frontend-build package

# Frontend Build: Compiles TypeScript and builds both main and MapLibre bundles
frontend-build:
	cd Blazwind.Components/frontend && npm run build

# Build: Builds frontend first, then builds the .NET solution (Examples project)
build: frontend-build
	dotnet build Blazwind.Examples

# Run: Builds frontend first, then runs the Examples project
run: frontend-build
	dotnet run --project Blazwind.Examples

runrep:
	cd Blazwind.Components.Reporting/reporting && npm run build && cd ../.. && dotnet run --project Blazwind.Examples

buildrep:
	cd Blazwind.Components.Reporting/reporting && npm run build && cd ../.. && dotnet build Blazwind.Examples

# Package: Builds frontend first, then packs the Blazwind.Components library
package: frontend-build
	dotnet pack Blazwind.Components -c Release

# Release: Tags the commit and pushes to remote to trigger CI/CD
release:
	@if [ -z "$(v)" ]; then echo "Error: Version is required. Usage: make release v=v1.0.0"; exit 1; fi
	git tag -a $(v) -m "Release $(v)"
	git push origin $(v)