/* eslint-disable no-console */
require('./bootstrap');
require('./hfxlights');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3NleW1vdXIiLCJhIjoiY2phOTB0YndoMDJ5ejMybmNheGJlc294MyJ9.nr0mzYdRzGFNBQUrJLBZMQ';

hfxLights.map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  attributionControl: false,
  center: [-63.571389, 44.647778],
  zoom: 13,
});

hfxLights.map.on('load', () => {
  axios.get('/places')
    .then((response) => {
      hfxLights.map.addSource('places', {
        type: 'geojson',
        data: response.data.data,
      }).addLayer({
        id: 'places',
        type: 'circle',
        source: 'places',
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': 10,
          'circle-color': 'rgba(55,148,179,1)',
        },
      });
    })
    .catch(hfxLights.handleAxiosError);
});

// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
hfxLights.map.on('click', 'places', (e) => {
  const source = document.getElementById('placeMarker').innerHTML;
  const template = handlebars.compile(source);
  new mapboxgl.Popup()
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML(template(e.features[0]))
    .addTo(hfxLights.map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
hfxLights.map.on('mouseenter', 'places', () => {
  hfxLights.map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
hfxLights.map.on('mouseleave', 'places', () => {
  hfxLights.map.getCanvas().style.cursor = '';
});

$(() => {
  $('.filter__option--geo').on('click', () => {
    hfxLights.getPreciseLocation()
      .then((position) => {
        hfxLights.map.flyTo({
          center: [
            position.coords.longitude,
            position.coords.latitude,
          ],
        }).then(() => {
          console.log('test: hfxLights.map.flyto complete!  (Load points, pop-up point list)');
        });
      })
      .then(() => {
        console.log('test: getPreciseLocation & hfxLights.map.flyto complete! (Load points, pop-up point list)');
      });
  });

  $('.filter__option--add').on('click', hfxLights.addPlaceMode.toggleEvent);

  $('#mapSearch').on('focus', () => {
    $('#mapFilter').addClass('filter--search');
  }).on('blur', () => {
    $('#mapFilter').removeClass('filter--search');
  });

  $('.filter__option--address').on('submit', (e) => {
    const searchBox = $('.filter__search', e.target);
    e.preventDefault();
    searchBox.prop('disabled', true);
    axios
      .post($(e.target).prop('action'), {
        q: searchBox.prop('value'),
      })
      .then((response) => {
        // do things with Response
        window.hfxLights.search.popup(response.data.data.features, searchBox.get(0));
      })
      // eslint-disable-next-line
      .catch((exception) => {
        searchBox.prop('disabled', false);
      })
      .then(() => {
        searchBox.prop('disabled', false);
      });
  });
});
