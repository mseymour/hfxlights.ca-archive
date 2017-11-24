window.hfxLights = {
  getPreciseLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    });
  },
  // geocodeAddress(address) {
  //   // stub
  // },
  // retrievePointsByBoundingBox(boundingBox) {
  //   // stub
  // },
};
