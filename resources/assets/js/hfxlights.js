/* eslint-disable no-console */
const hfxLights = {
  getPreciseLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    });
  },
};

hfxLights.map = {
  map: null,
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
      style: 'mapbox://styles/mapbox/streets-v9',
      attributionControl: false,
      center: [-63.571389, 44.647778],
      zoom: 13,
    })
      .on('load', this.populateMap)
      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      .on('click', 'places', this.createPlacePopup)
      .on('mouseenter', 'places', () => {
        hfxLights.map.map.getCanvas().style.cursor = 'pointer';
      })
      .on('mouseleave', 'places', () => {
        hfxLights.map.map.getCanvas().style.cursor = '';
      });

    const cancelLongPress = () => {
      // Cancel long press timeouts while moving
      const { map } = hfxLights;
      if (map.performingLongPress) {
        map.performingLongPress = false;
        window.clearTimeout(map.longPressTimeout);
        map.longPressTimeout = null;
      }
    };

    this.map
      .on('move', cancelLongPress)
      .on('zoom', cancelLongPress)
      .on('rotate', cancelLongPress)
      .on('pinch', cancelLongPress);

    this.map.on('mouseenter', 'newPlace', () => {
      const { map } = hfxLights;
      map.map.setPaintProperty('newPlace', 'circle-color', '#FF0000');
      map.map.getCanvas().style.cursor = 'move';
      map.isCursorOverPoint = true;
      map.map.dragPan.disable();
      // TODO: fix on touch devices:
      // point gets selected and can be freely draged around map,
      // tap on map outside and point becomes deselected
    });

    this.map.on('mouseleave', 'newPlace', (e) => {
      console.log(`mouseleave ${e.type}`);
      const { map } = hfxLights;
      map.map.setPaintProperty('newPlace', 'circle-color', '#0000FF');
      map.map.getCanvas().style.cursor = '';
      map.isCursorOverPoint = false;
      map.map.dragPan.enable();
    });

    this.map.on('touchstart', this.eventMouseDown);
    this.map.on('mousedown', this.eventMouseDown);
  },
  eventMouseDown(e) {
    const { map } = hfxLights;

    if (!map.isCursorOverPoint) {
      map.performingLongPress = true;

      map.longPressTimeout =
        window.setTimeout(map.createNewPlaceMarker, map.longPressInterval, e.lngLat);
    } else {
      map.isDragging = true;

      // Set a cursor indicator
      map.map.getCanvas().style.cursor = 'grab';
      // Mouse events
      map.map.on('touchmove', map.eventMouseMove);
      map.map.on('mousemove', map.eventMouseMove);
    }
    map.map.once('touchcancel', map.eventMouseUp);
    map.map.once('touchend', map.eventMouseUp);
    map.map.once('mouseup', map.eventMouseUp);
  },
  eventMouseMove(e) {
    const { map } = hfxLights;
    map.performingLongPress = false;
    window.clearTimeout(map.longPressTimeout);
    map.longPressTimeout = null;
    if (!map.isDragging) return;
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    map.map.getCanvas().style.cursor = 'grabbing';

    // Update the newPlace feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    map.newPlaceGeoJson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.map.getSource('newPlace').setData(map.newPlaceGeoJson);
  },
  eventMouseUp(e) {
    const { map } = hfxLights;
    window.clearTimeout(map.longPressTimeout);
    map.longPressTimeout = null;
    if (!map.isDragging) return;

    const coords = e.lngLat;

    // do a thing with coords
    console.log(coords);

    map.map.getCanvas().style.cursor = '';
    map.isDragging = false;

    // Unbind mouse events
    map.map.off('touchmove', map.eventMouseMove);
    map.map.off('mousemove', map.eventMouseMove);
  },
  populateMap() {
    const { map } = hfxLights;
    const layerPaintOptions = {
      paint: {
        'circle-radius': 12,
        'circle-color': '#00FF00',
      },
    };

    map.map
      .addSource('places', {
        type: 'geojson',
        data: map.placesGeoJson,
      })
      .addLayer(Object.assign({
        id: 'places',
        type: 'circle',
        source: 'places',
        layout: {
          visibility: 'visible',
        },
      }, layerPaintOptions));

    map.map
      .addSource('newPlace', {
        type: 'geojson',
        data: map.newPlaceGeoJson,
      })
      .addLayer(Object.assign({
        id: 'newPlace',
        type: 'circle',
        source: 'newPlace',
        layout: {
          visibility: 'visible',
        },
      }, layerPaintOptions));

    map.refreshPlaces();
  },
  refreshPlaces() {
    axios.get('/places')
      .then((response) => {
        hfxLights.map.map.getSource('places').setData(response.data.data);
      });
  },
  createPlacePopup(e) {
    const source = document.getElementById('placeMarker').innerHTML;
    const template = handlebars.compile(source);
    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(template(e.features[0]))
      .addTo(hfxLights.map.map);
  },
  createNewPlaceMarker(coords) {
    const { map } = hfxLights;


    map.performingLongPress = false;
    if (map.map.isMoving()) return;
    // empty Features array
    map.newPlaceGeoJson.features.length = 0;
    // push new marker onto array
    map.newPlaceGeoJson.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          coords.lng,
          coords.lat,
        ],
      },
    });
    map.map.getSource('newPlace').setData(map.newPlaceGeoJson);
    map.controls.changeControls('add');
  },
};

hfxLights.map.search = {
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
      .then(hfxLights.map.search.popupContent.bind(this, searchBox))
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
    if (hfxLights.map.search.popper) {
      hfxLights.map.search.popper.destroy();
    }
    hfxLights.map.search.popper = new Popper(searchBox, content);
  },
};

hfxLights.map.controls = {
  container: null,
  init(element) {
    if (typeof element === 'undefined') throw new Error('Argument is required');
    this.container = $(element);

    // Trigger general mode change
    this.container.on('hfxlights:controlchange', (e, controlName) => {
      const { map } = hfxLights;
      // Save current active control name for teardown
      const previousControlName = $(e.currentTarget).data('active-control');
      // Do not destroy and init controls if both are the same
      if (previousControlName === controlName) return;

      // Destroy control
      if (Object.prototype.hasOwnProperty.call(map.controls.methods, previousControlName)) {
        if (Object.prototype.hasOwnProperty.call(map.controls.methods[previousControlName], 'destroy')) {
          map.controls.methods[previousControlName].destroy();
        }
      }

      $('[data-control]', e.currentTarget).each((index, control) => {
        const controlElement = $(control);
        if (controlElement.data('control') === controlName) {
          // Store current active control for later
          $(e.currentTarget).data('active-control', controlName);
          controlElement.show().prop('aria-hidden', false);
          // Initialize new control
          if (Object.prototype.hasOwnProperty.call(map.controls.methods, controlName)) {
            if (Object.prototype.hasOwnProperty.call(map.controls.methods[controlName], 'init')) {
              map.controls.methods[controlName].init();
            }
          }
        } else {
          controlElement.hide().prop('aria-hidden', true);
        }
      });
    });

    // Toggle controls
    $('[data-toggle-control]', this.container).on('click', (e) => {
      hfxLights.map.controls.changeControls($(e.currentTarget).data('toggle-control'));
    });
  },
  changeControls(controlName) {
    hfxLights.map.controls.container.trigger('hfxlights:controlchange', controlName);
  },
  // Do not use these methods directly. Instead, use changeControls()
  methods: {
    add: {
      init() {
        const { map } = hfxLights;
        map.map.setLayoutProperty('places', 'visibility', 'none');
        // If we initialize Add Mode without any points in the 'newplace' layer,
        // add a marker in the center of the map
        if (map.newPlaceGeoJson.features.length === 0) {
          const coords = map.map.getCenter();
          map.newPlaceGeoJson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                coords.lng,
                coords.lat,
              ],
            },
          });
          map.map.getSource('newPlace').setData(map.newPlaceGeoJson);
        }
      },
      destroy() {
        const { map } = hfxLights;
        map.newPlaceGeoJson.features.length = 0;
        map.map.getSource('newPlace').setData(map.newPlaceGeoJson);
        map.map.setLayoutProperty('places', 'visibility', 'visible');
      },
    },
  },
};

export default hfxLights;
