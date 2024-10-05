var map = L.map('map').setView([53.0372, -103.8881], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function csvToGeoJSON(csvData) {
    var features = [];
    csvData.forEach(row => {
        var feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [parseFloat(row[4]), parseFloat(row[3])]
            },
            "properties": {
                "country": row[2],
                "crop": row[5],
                "yield": row[6]
            }
        };
        features.push(feature);
    });

    return {
        "type": "FeatureCollection",
        "features": features
    };
}

Papa.parse('crop_data/Production_Crops_Livestock_E_All_Data_NOFLAG.csv', {
    download: true,
    header: false,
    complete: function (results) {
        var geojsonData = csvToGeoJSON(results.data);
        L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('Country: ' + feature.properties.country + '<br>Crop: ' + feature.properties.crop + '<br>Yield: ' + feature.properties.yield);
            },
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: 'https://img.icons8.com/emoji/48/000000/wheat-emoji.png',
                        iconSize: [25, 25]
                    })
                });
            }
        }).addTo(map);
    }
});