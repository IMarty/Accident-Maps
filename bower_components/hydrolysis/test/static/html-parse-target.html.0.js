
Polymer({

  is: 'test-element',

  /**
   * Fired when properties on `data` are added, removed, or modified.
   *
   * @event data-change
   */

  /**
   * Fired when an error occurs on an interaction with Firebase.  The
   * `details.error` property contains the `Error` object provided by
   * the Firebase API.
   *
   * @event error
   */

  published: {
    /**
     * I am a string!
     */
    stringProp: String,
    /**
     * I am a number!
     */
    numProp: Number,
    /**
     * I am an object!
     */
    objectProp: Object,
    /**
     * I am an object with explicit type!
     * @type HTMLElement
     */
    elementProp: Object,
    /**
     * I am an object with notify=true!
     */
    objectNotify: {
      type: Object,
      notify: true
    },
    /**
     * I am a boolean property!
     */
    boolProp: Boolean
  },

  bind: {
    numProp: 'numChanged',
    elementProp: 'elemChanged'
  },

  numChanged: function() {

  },

  elemChanged: function() {

  }


});

