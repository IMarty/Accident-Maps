
  Polymer({
    is: 'x-key-aware',

    behaviors: [
      Polymer.IronA11yKeysBehavior
    ],

    properties: {
      pressed: {
        type: String,
        readOnly: true,
        value: ''
      },

      boundKeys: {
        type: Array,
        value: function() {
          return Object.keys(this.keyBindings).join(' ').split(' ');
        }
      },

      keyEventTarget: {
        type: Object,
        value: function() {
          return document.body;
        }
      }
    },

    keyBindings: {
      '* pageup pagedown left right down up shift+a alt+a home end space enter': '_updatePressed'
    },

    _updatePressed: function(event) {
      console.log(event.detail);

      this._setPressed(
        this.pressed + event.detail.combo + ' pressed!\n'
      );
    }
  });
