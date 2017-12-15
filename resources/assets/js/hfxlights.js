/* eslint-disable no-console */

const hfxLights = {
  hfxLights: null,
  placesGeoJson: {},
  newPlaceGeoJson: {},
  isDragging: false,
  isCursorOverPoint: false,
  longPressTimeout: null,
  longPressInterval: 2000,
  performingLongPress: false,

  init() {
    const emptyGeoJson = {
      type: 'FeatureCollection',
      features: [],
    };
    this.placesGeoJson = emptyGeoJson;
    this.newPlaceGeoJson = emptyGeoJson;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      attributionControl: false,
      center: [-63.571389, 44.647778],
      zoom: 13,
    })
      .on('load', this.populateMap)
      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      .on('click', 'places', this.createPlacePopup)
      .on('mouseenter', 'places', () => {
        hfxLights.map.getCanvas().style.cursor = 'pointer';
      })
      .on('mouseleave', 'places', () => {
        hfxLights.map.getCanvas().style.cursor = '';
      });

    const cancelLongPress = () => {
      // Cancel long press timeouts while moving

      if (hfxLights.performingLongPress) {
        hfxLights.performingLongPress = false;
        window.clearTimeout(hfxLights.longPressTimeout);
        hfxLights.longPressTimeout = null;
      }
    };

    this.map
      .on('move', cancelLongPress)
      .on('zoom', cancelLongPress)
      .on('rotate', cancelLongPress)
      .on('pinch', cancelLongPress);

    this.map.on('mouseenter', 'newPlace', () => {
      hfxLights.map.setPaintProperty('newPlace', 'circle-color', '#FF0000');
      hfxLights.map.getCanvas().style.cursor = 'move';
      hfxLights.isCursorOverPoint = true;
      hfxLights.map.dragPan.disable();
      // TODO: fix on touch devices:
      // point gets selected and can be freely draged around hfxLights,
      // tap on hfxLights outside and point becomes deselected
    });

    this.map.on('mouseleave', 'newPlace', () => {
      hfxLights.map.setPaintProperty('newPlace', 'circle-color', '#0000FF');
      hfxLights.map.getCanvas().style.cursor = '';
      hfxLights.isCursorOverPoint = false;
      hfxLights.map.dragPan.enable();
    });

    this.map.on('touchstart', this.eventMouseDown);
    this.map.on('mousedown', this.eventMouseDown);
  },
  eventMouseDown(e) {
    if (!hfxLights.isCursorOverPoint) {
      hfxLights.performingLongPress = true;

      hfxLights.longPressTimeout =
        window.setTimeout(hfxLights.createNewPlaceMarker, hfxLights.longPressInterval, e.lngLat);
    } else {
      hfxLights.isDragging = true;

      // Set a cursor indicator
      hfxLights.map.getCanvas().style.cursor = 'grab';
      // Mouse events
      hfxLights.map.on('touchmove', hfxLights.eventMouseMove);
      hfxLights.map.on('mousemove', hfxLights.eventMouseMove);
    }
    hfxLights.map.once('touchcancel', hfxLights.eventMouseUp);
    hfxLights.map.once('touchend', hfxLights.eventMouseUp);
    hfxLights.map.once('mouseup', hfxLights.eventMouseUp);
  },
  eventMouseMove(e) {
    hfxLights.performingLongPress = false;
    window.clearTimeout(hfxLights.longPressTimeout);
    hfxLights.longPressTimeout = null;
    if (!hfxLights.isDragging) return;
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    hfxLights.map.getCanvas().style.cursor = 'grabbing';

    // Update the newPlace feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    hfxLights.newPlaceGeoJson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    hfxLights.map.getSource('newPlace').setData(hfxLights.newPlaceGeoJson);
  },
  eventMouseUp(e) {
    window.clearTimeout(hfxLights.longPressTimeout);
    hfxLights.longPressTimeout = null;
    if (!hfxLights.isDragging) return;

    const coords = e.lngLat;

    // do a thing with coords
    console.log('eventMouseUp', coords);

    hfxLights.map.getCanvas().style.cursor = '';
    hfxLights.isDragging = false;

    // Unbind mouse events
    hfxLights.map.off('touchmove', hfxLights.eventMouseMove);
    hfxLights.map.off('mousemove', hfxLights.eventMouseMove);
  },
  populateMap() {
    const layerPaintOptions = {
      paint: {
        'circle-radius': 12,
        'circle-color': '#00FF00',
      },
    };

    hfxLights.map
      .addSource('places', {
        type: 'geojson',
        data: hfxLights.placesGeoJson,
      })
      .addLayer(Object.assign({
        id: 'places',
        type: 'circle',
        source: 'places',
        layout: {
          visibility: 'visible',
        },
      }, layerPaintOptions));

    hfxLights.map
      .addSource('newPlace', {
        type: 'geojson',
        data: hfxLights.newPlaceGeoJson,
      })
      .addLayer(Object.assign({
        id: 'newPlace',
        type: 'circle',
        source: 'newPlace',
        layout: {
          visibility: 'visible',
        },
      }, layerPaintOptions));

    hfxLights.refreshPlaces();
  },
  refreshPlaces() {
    axios.get('/places')
      .then((response) => {
        hfxLights.map.getSource('places').setData(response.data.data);
      });
  },
  createPlacePopup(e) {
    const source = document.getElementById('placeMarker').innerHTML;
    const template = handlebars.compile(source);
    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(template(e.features[0]))
      .addTo(hfxLights.map);
  },
  createNewPlaceMarker(coords) {
    // Sometimes performingLongPress is set to false, return if needed
    if (hfxLights.map.isMoving() || !hfxLights.performingLongPress) return;

    hfxLights.performingLongPress = false;
    // empty Features array
    hfxLights.newPlaceGeoJson.features.length = 0;
    // push new marker onto array
    hfxLights.newPlaceGeoJson.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          coords.lng,
          coords.lat,
        ],
      },
    });
    hfxLights.map.getSource('newPlace').setData(hfxLights.newPlaceGeoJson);
    hfxLights.controls.changeControls('add');
  },
};

hfxLights.search = {
  popper: null,
  init() {
    $('.filter__option--address').on('submit', this.searchSubmitEvent);
  },
  searchSubmitEvent(e) {
    const searchBox = $('.filter__search', e.target);
    e.preventDefault();
    searchBox.prop('disabled', true);
    axios
      .post($(e.target).prop('action'), {
        q: searchBox.prop('value'),
      })
      .then(hfxLights.search.popupContent.bind(this, searchBox))
      .then(() => {
        searchBox.prop('disabled', false);
      });
  },
  popupContent(searchBox, response) {
    handlebars.registerPartial('placeItem', document.getElementById('placeItem').innerHTML);
    const searchResults = response.data.data.data;
    const source = document.getElementById('placeItems').innerHTML;
    const template = handlebars.compile(source);
    const content = $(template({ searchResults })).insertAfter(searchBox);
    // Make dynamic?
    if (hfxLights.search.popper) {
      hfxLights.search.popper.destroy();
    }
    hfxLights.search.popper = new Popper(searchBox, content);
  },
};

hfxLights.controls = {
  container: null,
  init(element) {
    if (typeof element === 'undefined') throw new Error('Argument is required');
    this.container = $(element);

    // Trigger general mode change
    this.container.on('hfxlights:controlchange', (e, controlName) => {
      // Save current active control name for teardown
      const previousControlName = $(e.currentTarget).data('active-control');
      // Do not destroy and init controls if both are the same
      if (previousControlName === controlName) return;

      // Destroy control
      if (Object.prototype.hasOwnProperty.call(hfxLights.controls.methods, previousControlName)) {
        if (Object.prototype.hasOwnProperty.call(hfxLights.controls.methods[previousControlName], 'destroy')) {
          hfxLights.controls.methods[previousControlName].destroy();
        }
      }

      $('[data-control]', e.currentTarget).each((index, control) => {
        const controlElement = $(control);
        if (controlElement.data('control') === controlName) {
          // Store current active control for later
          $(e.currentTarget).data('active-control', controlName);
          controlElement.show().prop('aria-hidden', false);
          // Initialize new control
          if (Object.prototype.hasOwnProperty.call(hfxLights.controls.methods, controlName)) {
            if (Object.prototype.hasOwnProperty.call(hfxLights.controls.methods[controlName], 'init')) {
              hfxLights.controls.methods[controlName].init();
            }
          }
        } else {
          controlElement.hide().prop('aria-hidden', true);
        }
      });
    });

    // Toggle controls
    $('[data-toggle-control]', this.container).on('click', (e) => {
      hfxLights.controls.changeControls($(e.currentTarget).data('toggle-control'));
    });
  },
  changeControls(controlName) {
    hfxLights.controls.container.trigger('hfxlights:controlchange', controlName);
  },
  // Do not use these methods directly. Instead, use changeControls()
  methods: {
    add: {
      init() {
        hfxLights.map.setLayoutProperty('places', 'visibility', 'none');
        // If we initialize Add Mode without any points in the 'newplace' layer,
        // add a marker in the center of the hfxLights
        if (hfxLights.newPlaceGeoJson.features.length === 0) {
          const coords = hfxLights.map.getCenter();
          hfxLights.newPlaceGeoJson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                coords.lng,
                coords.lat,
              ],
            },
          });
          hfxLights.map.getSource('newPlace').setData(hfxLights.newPlaceGeoJson);
        }
        // Initialize add form
        const source = document.getElementById('placeFormTemplate').innerHTML;
        const template = handlebars.compile(source);
        const formdata = {
          location: hfxLights.newPlaceGeoJson.features[0].geometry.coordinates,
        };
        $('#addForm').html(template(formdata));
        // Dynamically update latitude and longitude in form
        hfxLights.map.on('sourcedata', hfxLights.controls.methods.add.changeAddFormCoordsOnUpdate);
      },
      changeAddFormCoordsOnUpdate(e) {
        if (e.sourceId !== 'newPlace') return;
        const coords = e.source.data.features[0].geometry.coordinates;
        $('[name="location"]', '#addForm').val(coords);
      },
      destroy() {
        $('#drawer').removeClass('drawer--collapse');

        hfxLights.newPlaceGeoJson.features.length = 0;
        hfxLights.map.getSource('newPlace').setData(hfxLights.newPlaceGeoJson);
        hfxLights.map.setLayoutProperty('places', 'visibility', 'visible');
        // Remove specific newPlace listener
        hfxLights.map.off('sourcedata', hfxLights.controls.methods.add.changeAddFormCoordsOnUpdate);
      },
    },
  },
};

hfxLights.utils = {
  getPreciseLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    });
  },
};

export default hfxLights;
