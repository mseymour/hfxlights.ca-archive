const hfxLights = {};

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
    $('.filter__option--address').on('submit', this.popupContent);
  },

  searchSubmitEvent(e) {
    const searchBox = $('.filter__search', e.target);
    e.preventDefault();
    searchBox.prop('disabled', true);
    axios
      .post($(e.target).prop('action'), {
        q: searchBox.prop('value'),
      })
      .then(this.popupContent.bind(this, searchBox));
  },
  popupContent(searchBox, response) {
    handlebars.registerPartial('placeItem', document.getElementById('placeItem').innerHTML);
    const searchResults = response.data.data;
    const source = document.getElementById('placeItems').innerHTML;
    const template = handlebars.compile(source);
    const content = $(template({ searchResults }));
    if (this.popper) {
      // update popper content
    } else {
      this.popper = new Popper(searchBox, content);
    }
  },
};

hfxLights.map.add = {
  init() {
    //
  },
};

export default hfxLights;
