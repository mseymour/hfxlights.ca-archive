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
  init() {
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
  },
  populateMap() {
    hfxLights.map.map
      .addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      .addLayer({
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

    hfxLights.map.refreshPlaces();
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
      // Save current active control name for teardown
      const previousControlName = $(e.currentTarget).data('active-control');
      // Destroy control
      hfxLights.map.controls.methods[previousControlName].destroy();
      $('[data-control]', e.currentTarget).each((index, control) => {
        const controlElement = $(control);
        if (controlElement.data('control') === controlName) {
          // Store current active control for later
          $(e.currentTarget).data('active-control', controlName);
          controlElement.show().prop('aria-hidden', false);
          // Initialize new control
          hfxLights.map.controls.methods[controlName].init();
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
  methods: {
    filter: {
      init() {},
      destroy() {},
    },
    add: {
      isDragging: false,
      isCursorOverPoint: false,
      geojson: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        }],
      },
      init() {
        const { map } = hfxLights.map;
        const canvas = map.getCanvasContainer();
        map.setLayoutProperty('places', 'visibility', 'none');

        this.geojson.features[0].geometry.coordinates = map.getCenter();

        map.addSource('point', {
          type: 'geojson',
          data: this.geojson,
        });

        map.addLayer({
          id: 'point',
          type: 'circle',
          source: 'point',
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be',
          },
        });

        // When the cursor enters a feature in the point layer, prepare for dragging.
        map.on('mouseenter', 'point', () => {
          map.setPaintProperty('point', 'circle-color', '#3bb2d0');
          canvas.style.cursor = 'move';
          this.isCursorOverPoint = true;
          map.dragPan.disable();
        });

        map.on('mouseleave', 'point', () => {
          map.setPaintProperty('point', 'circle-color', '#3887be');
          canvas.style.cursor = '';
          this.isCursorOverPoint = false;
          map.dragPan.enable();
        });

        map.on('mousedown', this.mouseDown);
      },

      mouseDown() {
        if (!this.isCursorOverPoint) return;
        this.isDragging = true;

        const { map } = hfxLights.map;
        const canvas = map.getCanvasContainer();

        // Set a cursor indicator
        canvas.style.cursor = 'grab';

        // Mouse events
        map.on('mousemove', this.onMove);
        map.once('mouseup', this.onUp);
      },

      onMove(e) {
        if (!this.isDragging) return;
        const { map } = hfxLights.map;
        const canvas = map.getCanvasContainer();
        const coords = e.lngLat;

        // Set a UI indicator for dragging.
        canvas.style.cursor = 'grabbing';

        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        this.geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
        map.getSource('point').setData(this.geojson);
      },

      onUp(e) {
        if (!this.isDragging) return;
        const { map } = hfxLights.map;
        const coords = e.lngLat;

        console.log(coords);

        this.isDragging = false;

        // Unbind mouse events
        map.off('mousemove', this.onMove);
      },

      destroy() {
        this.isDragging = false;
        this.isCursorOverPoint = false;
        const { map } = hfxLights.map;
        map.setLayoutProperty('places', 'visibility', 'visible');
        map.removeLayer('point');
      },
    },
  },
};

export default hfxLights;
