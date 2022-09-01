mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: store.geometry.coordinates,
    zoom: 10,
    projection: 'globe'
});
    
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat(store.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${store.title}</h4><p>${store.location}</p>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());