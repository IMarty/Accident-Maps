
  Polymer({

    is: 'google-map-directions',

/**
Fired whenever the directions service returns a result.

@event google-map-response
@param {Object} detail
@param {object} detail.response The directions service response.
*/
    properties: {
      /**
       * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
       */
      apiKey: String,

      /**
       * The Google map object.
       *
       * @type google.maps.Map
       */
      map: {
        type: Object,
        observer: '_mapChanged'
      },
      /**
       * Start address or latlng to get directions from.
       *
       * @type string|google.maps.LatLng
       */
      startAddress: {
        type: String,
        value: null
      },

      /**
       * End address or latlng for directions to end.
       *
       * @type string|google.maps.LatLng
       */
      endAddress: {
        type: String,
        value: null
      },

      /**
       * Travel mode to use.  One of 'DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'.
       */
      travelMode: {
        type: String,
        value: 'DRIVING'
      },

      /**
       * A comma separated list (e.g. "places,geometry") of libraries to load
       * with this map. Defaults to "places". For more information see
       * https://developers.google.com/maps/documentation/javascript/libraries.
       *
       * Note, this needs to be set to the same value as the one used on <google-map>.
       * If you're overriding that element's `libraries` property, this one also
       * needs to be set to the Maps API loads the library code.
       */
      libraries: {
        type: String,
        value: 'places'
      },

      /**
       * The localized language to load the Maps API with. For more information
       * see https://developers.google.com/maps/documentation/javascript/basics#Language
       *
       * Note: the Maps API defaults to the preffered language setting of the browser.
       * Use this parameter to override that behavior.
       */
      language: {
        type: String,
        value: null
      },

      /**
       * The response from the directions service.
       *
       */
      response: {
        type: Object,
        observer: '_responseChanged',
        notify: true
      }
    },

    observers: [
      '_route(startAddress, endAddress, travelMode)'
    ],

    _mapApiLoaded: function() {
      this._route();
    },

    _responseChanged: function() {
      if (this.directionsRenderer && this.response) {
        this.directionsRenderer.setDirections(this.response);
      }
    },

    _mapChanged: function() {
      if (this.map && this.map instanceof google.maps.Map) {
        if (!this.directionsRenderer) {
          this.directionsRenderer = new google.maps.DirectionsRenderer();
        }
        this.directionsRenderer.setMap(this.map);
        this._responseChanged();
      } else {
        // If there is no more map, remove the directionsRenderer from the map and delete it.
        this.directionsRenderer.setMap(null);
        this.directionsRenderer = null;
      }
    },

    _route: function() {
      // Abort attempts to _route if the API is not available yet or the
      // required attributes are blank.
      if (typeof google == 'undefined' || typeof google.maps == 'undefined' ||
          !this.startAddress || !this.endAddress) {
        return;
      }

      // Construct a directionsService if necessary.
      // Wait until here where the maps api has loaded and directions are actually needed.
      if (!this.directionsService) {
        this.directionsService = new google.maps.DirectionsService();
      }

      var request = {
        origin: this.startAddress,
        destination: this.endAddress,
        travelMode: this.travelMode
      };
      this.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          this.response = response;
          this.fire('google-map-response', {response: response});
        }
      }.bind(this));
    }
  });
