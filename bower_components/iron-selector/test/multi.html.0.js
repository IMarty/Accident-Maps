

    suite('multi', function() {

      var s;

      setup(function () {
        s = fixture('test');
      });

      test('honors the multi attribute', function() {
        assert.isTrue(s.multi);
      });

      test('has sane defaults', function() {
        assert.equal(s.selectedValues, undefined);
        assert.equal(s.selectedClass, 'iron-selected');
        assert.equal(s.items.length, 5);
      });

      test('set multi-selection via selected property', function() {
        // set selectedValues
        s.selectedValues = [0, 2];
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('set multi-selection via tap', function() {
        // set selectedValues
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        s.children[2].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('fire iron-select/deselect events', function() {
        // setup listener for iron-select event
        var selectEventCounter = 0;
        s.addEventListener('iron-select', function(e) {
          selectEventCounter++;
        });
        // setup listener for core-deselect event
        var deselectEventCounter = 0;
        s.addEventListener('iron-deselect', function(e) {
          deselectEventCounter++;
        });
        // tap to select an item
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check events
        assert.equal(selectEventCounter, 1);
        assert.equal(deselectEventCounter, 0);
        // tap on already selected item should deselect it
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check selectedValues
        assert.equal(s.selectedValues.length, 0);
        // check class
        assert.isFalse(s.children[0].classList.contains('iron-selected'));
        // check events
        assert.equal(selectEventCounter, 1);
        assert.equal(deselectEventCounter, 1);
      });

      /* test('toggle multi from true to false', function() {
        // set selected
        s.selected = [0, 2];
        var first = s.selected[0];
        // set mutli to false, so to make it single-selection
        s.multi = false;
        // selected should not be an array
        assert.isNotArray(s.selected);
        // selected should be the first value from the old array
        assert.equal(s.selected, first);
      }); */

    });

  