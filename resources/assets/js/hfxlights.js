window.hfxLights = {
  getPreciseLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    });
  },
  geocodeAddress(address) {
    // stub
  },
  retrievePointsByBoundingBox(boundingBox) {
    // stub
  }
};
