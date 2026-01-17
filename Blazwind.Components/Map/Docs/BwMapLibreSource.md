# Map Source

Component for adding data sources to a MapLibre map. Supports Vector tiles, Raster tiles, GeoJSON, WMS, and other source types.

## Examples

### Vector Tile Source
Verify data from a vector tile server like Martin.

```razor
<BwMapLibre Center="@(new[] { 37.0156, 39.7477 })" Zoom="14">
    <BwMapLibreSource 
        Id="buildings"
        Type="@MapSourceType.Vector"
        Tiles="@(new List<string> { "https://harita.sivas.bel.tr/buildings/{z}/{x}/{y}" })"
        MinZoom="10"
        MaxZoom="20" />
</BwMapLibre>
```

### GeoJSON Source (URL)
Fetch data from a remote GeoJSON file.

```razor
<BwMapLibreSource 
    Id="poi-data"
    Type="@MapSourceType.GeoJson"
    Data="https://example.com/api/points.geojson" />
```

### GeoJSON Source (Inline Data)
Provide GeoJSON data directly using a C# object.

```razor
<BwMapLibreSource 
    Id="my-points"
    Type="@MapSourceType.GeoJson"
    Data="@geoJsonData"
    GenerateId="true" />

@code {
    private object geoJsonData = new
    {
        type = "FeatureCollection",
        features = new[]
        {
            new
            {
                type = "Feature",
                geometry = new { type = "Point", coordinates = new[] { 37.0156, 39.7477 } },
                properties = new { name = "Center Station" }
            }
        }
    };
}
```

### Clustering
Enable clustering for a GeoJSON point source.

```razor
<BwMapLibreSource 
    Id="clustered-points"
    Type="@MapSourceType.GeoJson"
    Data="https://example.com/points.geojson"
    Cluster="true"
    ClusterRadius="50"
    ClusterMaxZoom="14" />
```

### WMS Raster Source
Use the `WmsSourceHelper` to easily create a WMS source.

```razor
@code {
    private async Task AddWms(BwMapLibre map)
    {
        var wms = WmsSourceHelper.CreateWmsSource(
            id: "weather-wms",
            baseUrl: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
            layers: "nexrad-n0r-900913",
            version: "1.1.1");
        
        await map.AddSourceAsync(wms);
    }
}
```

## API

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Id` | `string` | Auto-generated | Unique source identifier. |
| `Type` | `string` | `vector` | Source type: `vector`, `raster`, `raster-dem`, `geojson`, `image`, `video`. |
| `Tiles` | `List<string>?` | `null` | Array of tile URL templates (for vector/raster). |
| `Url` | `string?` | `null` | URL to a TileJSON or style resource. |
| `Data` | `object?` | `null` | GeoJSON data (object or URL string). |
| `TileSize` | `int?` | `512` | Tile size in pixels. |
| `MinZoom` | `int?` | `null` | Minimum zoom level for the source. |
| `MaxZoom` | `int?` | `null` | Maximum zoom level for the source. |
| `Cluster` | `bool?` | `null` | Whether to cluster points (GeoJSON only). |
| `ClusterRadius`| `int?` | `50` | Cluster radius in pixels. |
| `ClusterMaxZoom`| `int?` | `null` | Maximum zoom to cluster points at. |
| `Attribution` | `string?` | `null` | Attribution HTML text. |

### Methods

| Method | Description |
| :--- | :--- |
| `SetDataAsync(object)` | Update GeoJSON data for an existing source. |

### Source Helpers

Blazwind provides static helpers in the `Blazwind.Components.Map.Models` namespace:

- `WmsSourceHelper.CreateWmsSource(...)`: Generates a `MapSource` configured for WMS.
- `MartinSourceHelper.CreateMartinSource(...)`: Configures a vector source for Martin tile servers.
- `GeoServerSourceHelper.CreateGeoServerWmsSource(...)`: Specific helper for GeoServer WMS.
