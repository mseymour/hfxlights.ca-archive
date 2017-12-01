/* eslint-disable no-console */

window.hfxLights = {
  map: null,
  getPreciseLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    });
  },
  handleAxiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  },
  // geocodeAddress(address) {
  //   // stub
  // },
  // retrievePointsByBoundingBox(boundingBox) {
  //   // stub
  // },
};

window.hfxLights.addPlaceMode = {
  enabled: false,
  isCursorOverPoint: false,
  isDragging: false,
  canvas: null,
  geojson: null,
  toggleEvent(e) {
    console.log('toggleEvent');
    e.preventDefault();
    e.stopPropagation();

    if (this.enabled) {
      console.log('addPlaceMode enabled, tearing down...');
      // Tear down Add Place Mode
      hfxLights.map.setLayoutProperty('places', 'visibility', 'visible');
      hfxLights.map.removeLayer('newMarker');
      this.enabled = false;
      this.isCursorOverPoint = false;
      this.isDragging = false;
      this.canvas = null;
      this.geojson = null;
    } else {
      console.log('addPlaceMode disabled, booting...');
      // Setup Add Place Mode
      this.geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        }],
      };
      hfxLights.map.setLayoutProperty('places', 'visibility', 'none');
      this.enabled = true;
      this.canvas = hfxLights.map.getCanvasContainer();

      hfxLights.map.addSource('newMarkerPoint', {
        type: 'geojson',
        data: this.geojson,
      });

      hfxLights.map.addLayer({
        id: 'newMarkerPoint',
        type: 'circle',
        source: 'newMarkerPoint',
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be',
        },
      });

      // When the cursor enters a feature in the point layer, prepare for dragging.
      hfxLights.map.on('mouseenter', 'newMarkerPoint', () => {
        console.log('mouseenter newMarkerPoint', this);
        hfxLights.map.setPaintProperty('newMarkerPoint', 'circle-color', '#3bb2d0');
        this.canvas.style.cursor = 'move';
        this.isCursorOverPoint = true;
        hfxLights.map.dragPan.disable();
      });

      hfxLights.map.on('mouseleave', 'newMarkerPoint', () => {
        console.log('mouseleave newMarkerPoint', this);
        hfxLights.map.setPaintProperty('newMarkerPoint', 'circle-color', '#3887be');
        this.canvas.style.cursor = '';
        this.isCursorOverPoint = false;
        hfxLights.map.dragPan.enable();
      });

      hfxLights.map.on('mousedown', this.mouseDownEvent);
    }
  },
  mouseDownEvent() {
    console.log('mouseDownEvent', this);
    if (!this.isCursorOverPoint) return;

    this.isDragging = true;

    // Set a cursor indicator
    this.canvas.style.cursor = 'grab';

    // Mouse events
    hfxLights.map.on('mousemove', this.onMove);
    hfxLights.map.once('mouseup', this.onUp);
  },
  onMove(e) {
    console.log('onMove', this);
    if (!this.isDragging) return;
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    this.canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    this.geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    hfxLights.map.getSource('newMarkerPoint').setData(this.geojson);
  },
  onUp(e) {
    console.log('onUp', this);
    if (!this.isDragging) return;
    console.log(e.lngLat);

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    // coordinates.style.display = 'block';
    // coordinates.innerHTML = 'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
    this.canvas.style.cursor = '';
    this.isDragging = false;

    // Unbind mouse events
    hfxLights.map.off('mousemove', this.onMove);
  },
};

window.hfxLights.search = {
  resultsElement: null,
  popup(searchResults, popupReference) {
    handlebars.registerPartial('placeItem', document.getElementById('placeItem').innerHTML);
    const source = document.getElementById('placeItems').innerHTML;
    const template = handlebars.compile(source);
    const content = $(template({ searchResults }));
    if (this.resultsElement !== null) {
      this.resultsElement.replaceWith(content);
      this.resultsElement = content;
    } else {
      this.resultsElement = content;
      this.resultsElement.addClass('animated slideInRight');
      $(popupReference).parents('#mapHud').append(this.resultsElement);
    }
    $('.results__close', this.resultsElement).on('click', () => {
      this.resultsElement
        .addClass('animated slideOutLeft')
        .on('animationend webkitAnimationEnd msAnimationEnd oAnimationEnd', () => {
          this.resultsElement.remove();
          this.resultsElement = null;
        });
      console.log(this.resultsElement);
    });
  },
};
