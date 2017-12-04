/* eslint-disable no-console */
import hfxLights from './hfxlights';

require('./bootstrap');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3NleW1vdXIiLCJhIjoiY2phOTB0YndoMDJ5ejMybmNheGJlc294MyJ9.nr0mzYdRzGFNBQUrJLBZMQ';

hfxLights.map.init();

$(() => {
  $('#mapFilter, #mapAddMarker')
    .on('hfxLights:toggleAddMarker', (e) => {
      if ($(e.target).is(':visible')) {
        $(e.target).hide().prop('aria-hidden', true);
      } else {
        $(e.target).show().prop('aria-hidden', false);
      }
    });

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

  $('.filter__option--add').on('click', () => {
    $(window).trigger('hfxLights:toggleAddMarker');
  });

  $('#mapSearch').on('focus', () => {
    $('#mapFilter').addClass('filter--search');
  }).on('blur', () => {
    $('#mapFilter').removeClass('filter--search');
  });

  hfxLights.map.search.init();
});
