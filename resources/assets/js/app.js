/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl';

require('./bootstrap');
require('./hfxlights');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3NleW1vdXIiLCJhIjoiY2phOTB0YndoMDJ5ejMybmNheGJlc294MyJ9.nr0mzYdRzGFNBQUrJLBZMQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  attributionControl: false,
  center: [-63.571389, 44.647778],
  zoom: 13,
});

$(() => {
  // eslint-disable-next-line
  $('.filter__button--geo').on('click', (e) => {
    hfxLights.getPreciseLocation()
      .then((position) => {
        map.flyTo({
          center: [
            position.coords.longitude,
            position.coords.latitude,
          ],
        }).then(() => {
          console.log('test: map.flyto complete!  (Load points, pop-up point list)');
        });
      })
      .then(() => {
        console.log('test: getPreciseLocation & map.flyto complete! (Load points, pop-up point list)');
      });
  });

  $('.filter__option--address').on('submit', (e) => {
    e.preventDefault();
    console.log('test: ');
  });
});
