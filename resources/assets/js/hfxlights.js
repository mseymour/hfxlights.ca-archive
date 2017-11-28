/* eslint-disable no-console */

window.hfxLights = {
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
      $(popupReference).parents('#mapHud').append(this.resultsElement);
    }
  },
};
