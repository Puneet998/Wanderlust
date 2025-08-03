let locationName = document.querySelector(".location").textContent.trim();
let countryName = document.querySelector(".country").textContent.trim();
let fullLocation = `${locationName}, ${countryName}`;

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullLocation)}`)
  .then(response => response.json())
  .then(data => {
    if (data && data.length > 0) {
      let lat = parseFloat(data[0].lat);
      let lon = parseFloat(data[0].lon);
      console.log(`${lat},${lon}`);
                  
      // Red icon
      let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Init map
      var map = L.map('map').setView([lat, lon], 17);

      const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
        {
          attribution: 'Tiles © Esri',
          maxZoom: 19,
          minZoom: 0
        }
      ).addTo(map);

      const labels = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', 
        {
          attribution: 'Labels © Esri',
          maxZoom: 19,
          minZoom: 0
        }
      ).addTo(map);

      // Main red marker
      L.marker([lat, lon], { icon: redIcon }).addTo(map)
        .bindPopup(`<strong>${locationName}, ${countryName}</strong>`)
        .openPopup();

      // Get nearby POIs using Overpass API
      let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:500,${lat},${lon})[amenity];out;`;

      fetch(overpassUrl)
        .then(res => res.json())
        .then(poiData => {
          poiData.elements.forEach(place => {
            let name = place.tags.name || "Unnamed";
            let type = place.tags.amenity || "POI";

            // Icon emoji by type
            let emojiMap = {
              hospital: "🏥",
              restaurant: "🍴",
              cafe: "☕",
              school: "🏫",
              bank: "🏦",
              pharmacy: "💊",
              library: "📚",
              place_of_worship: "🕌",
              fuel: "⛽",
              post_office: "📮",
              parking: "🅿️",
              fast_food: "🍔",
              pub: "🍻",
              default: "📍"
            };
            let emoji = emojiMap[type] || emojiMap.default;

            let poiIcon = L.divIcon({
              className: 'custom-poi-icon',
              html: `<div style="font-size:16px;">${emoji}</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            L.marker([place.lat, place.lon], { icon: poiIcon })
              .addTo(map)
              .bindPopup(`<strong>${name}</strong><br>Type: ${type}`);
          });
        })
        .catch(err => console.error("Nearby POIs fetch error:", err));

    } else {
      // Location not found, try country location instead
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}`)
        .then(res => res.json())
        .then(countryData => {
          if (countryData && countryData.length > 0) {
            let cLat = parseFloat(countryData[0].lat);
            let cLon = parseFloat(countryData[0].lon);

            var map = L.map('map').setView([cLat, cLon], 6); // country zoom

            const satellite = L.tileLayer(
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
              {
                attribution: 'Tiles © Esri',
                maxZoom: 19,
                minZoom: 0
              }
            ).addTo(map);

            const labels = L.tileLayer(
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', 
              {
                attribution: 'Labels © Esri',
                maxZoom: 19,
                minZoom: 0
              }
            ).addTo(map);

            L.popup()
              .setLatLng([cLat, cLon])
              .setContent(`Location not found, showing ${countryName} instead.`)
              .openOn(map);

          } else {
            alert("Country location bhi nahi mila!");
          }
        })
        .catch(err => {
          console.error("Country location fetch error:", err);
          alert("Location and country location dono nahi mile.");
        });
    }
  })
  .catch(err => {
    console.error("Geocoding error:", err);
  });