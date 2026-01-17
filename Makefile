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