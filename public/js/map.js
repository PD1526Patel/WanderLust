mapboxgl.accessToken = mapToken;

const coordinates = listing.geometry.coordinates;

const map = new mapboxgl.Map({
  // accessToken: 'pk.eyJ1IjoicGQtcGF0ZWwtMTUyNiIsImEiOiJjbXRsbGRxYjkwMGxsMnlzYWVwMGtjZjlyIn0.m9F6Arjct51JhT9P7TQ3TA',
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12', // Use the standard style for the map
  // projection: 'globe', // display the map as a globe
  zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
  center: coordinates, // center the map on this longitude and latitude
});

const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`,
    ),
  )
  .addTo(map);
