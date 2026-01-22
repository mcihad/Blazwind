.PHONY: build run frontend-build package

# Frontend Build: Compiles TypeScript and builds both main and MapLibre bundles
frontend-build:
	cd src/Blazwind.Components/frontend && npm run build

# Build: Builds frontend first, then builds the .NET solution (Docs project)
build: frontend-build
	dotnet build src/Blazwind.Docs/Blazwind.Docs.csproj

# Run: Builds frontend first, then runs the Docs project
run: frontend-build
	dotnet run --project src/Blazwind.Docs/Blazwind.Docs.csproj

# Package: Builds frontend first, then packs the Blazwind.Components library
package: frontend-build
	dotnet pack src/Blazwind.Components/Blazwind.Components.csproj -c Release

# Release: Tags the commit and pushes to remote to trigger CI/CD
release:
	@if [ -z "$(v)" ]; then echo "Error: Version is required. Usage: make release v=v1.0.0"; exit 1; fi
	git tag -a $(v) -m "Release $(v)"
	git push origin $(v)

# Test: Runs unit tests
test:
	dotnet test tests/Blazwind.UnitTests/Blazwind.UnitTests.csproj