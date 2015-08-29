
suite('Polymer.IronA11yKeysBehavior', function() {
  var keys;

  suiteSetup(function() {
    var KeysTestBehavior = [Polymer.IronA11yKeysBehavior, {
      properties: {
        keyCount: {
          type: Number,
          value: 0
        }
      },

      _keyHandler: function(event) {
        this.keyCount++;
        this.lastEvent = event;
      }
    }];

    Polymer({
      is: 'x-a11y-basic-keys',

      behaviors: [
        KeysTestBehavior
      ],

      keyBindings: {
        'space': '_keyHandler'
      }
    });

    Polymer({
      is: 'x-a11y-combo-keys',

      behaviors: [
        KeysTestBehavior
      ],

      keyBindings: {
        'ctrl+shift+a': '_keyHandler'
      }
    });

    Polymer({
      is: 'x-a11y-alternate-event-keys',

      behaviors: [
        KeysTestBehavior
      ],

      keyBindings: {
        'space:keyup': '_keyHandler'
      }
    });

    var XA11yBehavior = {
      keyBindings: {
        'enter': '_keyHandler'
      }
    };

    Polymer({
      is: 'x-a11y-behavior-keys',

      behaviors: [
        KeysTestBehavior,
        XA11yBehavior
      ],

      keyBindings: {
        'space': '_keyHandler'
      }
    });
  });

  suite('basic keys', function() {
    setup(function() {
      keys = fixture('BasicKeys');
    });

    test('trigger the handler when the specified key is pressed', function() {
      MockInteractions.pressSpace(keys);

      expect(keys.keyCount).to.be.equal(1);
    });

    test('do not trigger the handler for non-specified keys', function() {
      MockInteractions.pressEnter(keys);

      expect(keys.keyCount).to.be.equal(0);
    });

    test('can have bindings added imperatively', function() {
      keys.addOwnKeyBinding('enter', '_keyHandler');

      MockInteractions.pressEnter(keys);
      expect(keys.keyCount).to.be.equal(1);

      MockInteractions.pressSpace(keys);
      expect(keys.keyCount).to.be.equal(2);
    });

    test('can remove imperatively added bindings', function() {
      keys.addOwnKeyBinding('enter', '_keyHandler');
      keys.removeOwnKeyBindings();

      MockInteractions.pressEnter(keys);
      expect(keys.keyCount).to.be.equal(0);

      MockInteractions.pressSpace(keys);
      expect(keys.keyCount).to.be.equal(1);
    });

    suite('edge cases', function() {
      test('knows that `spacebar` is the same as `space`', function() {
        var event = new CustomEvent('keydown');
        event.key = 'spacebar';
        expect(keys.keyboardEventMatchesKeys(event, 'space')).to.be.equal(true);
      });
    });

    suite('matching keyboard events to keys', function() {
      test('can be done imperatively', function() {
        var event = new CustomEvent('keydown');
        event.keyCode = 65;
        expect(keys.keyboardEventMatchesKeys(event, 'a')).to.be.equal(true);
      });

      test('can be done with a provided keyboardEvent', function() {
        var event;
        MockInteractions.pressSpace(keys);
        event = keys.lastEvent;

        expect(event.detail.keyboardEvent).to.be.okay;
        expect(keys.keyboardEventMatchesKeys(event, 'space')).to.be.equal(true);
      });

      test('can handle variations in arrow key names', function() {
        var event = new CustomEvent('keydown');
        event.key = 'up';
        expect(keys.keyboardEventMatchesKeys(event, 'up')).to.be.equal(true);
        event.key = 'ArrowUp';
        expect(keys.keyboardEventMatchesKeys(event, 'up')).to.be.equal(true);
      });
    });
  });

  suite('combo keys', function() {
    setup(function() {
      keys = fixture('ComboKeys');
    });

    test('trigger the handler when the combo is pressed', function() {
      var event = new CustomEvent('keydown');

      event.ctrlKey = true;
      event.shiftKey = true;
      event.keyCode = event.code = 65;

      keys.dispatchEvent(event);

      expect(keys.keyCount).to.be.equal(1);
    });
  });

  suite('alternative event keys', function() {
    setup(function() {
      keys = fixture('AlternativeEventKeys');
    });

    test('trigger on the specified alternative keyboard event', function() {
      MockInteractions.keyDownOn(keys, 32);

      expect(keys.keyCount).to.be.equal(0);

      MockInteractions.keyUpOn(keys, 32);

      expect(keys.keyCount).to.be.equal(1);
    });
  });

  suite('behavior keys', function() {
    setup(function() {
      keys = fixture('BehaviorKeys');
    });

    test('bindings in other behaviors are transitive', function() {
      MockInteractions.pressEnter(keys);
      MockInteractions.pressSpace(keys);

      expect(keys.keyCount).to.be.equal(2);
    });
  });

});
  