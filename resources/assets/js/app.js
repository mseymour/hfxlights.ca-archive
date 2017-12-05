/* eslint-disable no-console */
import hfxLights from './hfxlights';

require('./bootstrap');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3NleW1vdXIiLCJhIjoiY2phOTB0YndoMDJ5ejMybmNheGJlc294MyJ9.nr0mzYdRzGFNBQUrJLBZMQ';

hfxLights.map.init();

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

  $('#mapSearch').on('focus', () => {
    $('#mapFilter').addClass('filter--search');
  }).on('blur', () => {
    $('#mapFilter').removeClass('filter--search');
  });

  hfxLights.map.search.init();
  hfxLights.map.add.init();
});
