// Adapted from https://gist.github.com/yavuzselimtas/454ecf30e47fa33f4064b16b25bf5726

/**
* Small helper class to detect os
*/
const Device = new (() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  this.windows = /windows phone/i.test(userAgent);
  this.android = /android/i.test(userAgent);
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  this.ios = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
})();
/**
* Execute any function with debounce of given wait amount
* @param  {number} wait       wait amount in miliseconds to bounce
* @param  {boolean} immediate true for immidate execution
*/
function debounce(func, wait, immediate, ...args) {
  let timeout;
  return () => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

$(() => {
  if (Device.ios) {
    // need to add event after body created
    document.body.addEventListener('touchmove', (e) => {
      e.preventDefault();
      // magically helps click events to be more precise
      if (e.target) {
        debounce(() => {
          e.target.click();
        }, 300, true)();
      }
    }, false);
  }
});
