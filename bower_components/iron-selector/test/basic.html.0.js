

    suite('defaults', function() {

      var s1;

      setup(function () {
        s1 = fixture('defaults');
      });

      test('to nothing selected', function() {
        assert.equal(s1.selected, null);
      });

      test('to iron-selected as selectedClass', function() {
        assert.equal(s1.selectedClass, 'iron-selected');
      });

      test('to false as multi', function() {
        assert.isFalse(s1.multi);
      });

      test('to tap as activateEvent', function() {
        assert.equal(s1.activateEvent, 'tap');
      });

      test('to nothing as attrForSelected', function() {
        assert.equal(s1.attrForSelected, null);
      });

      test('as many items as children', function() {
        assert.equal(s1.items.length, s1.querySelectorAll('div').length);
      });
    });

    suite('basic', function() {

      var s2;

      setup(function () {
        s2 = fixture('basic');
      });

      test('honors the attrForSelected attribute', function() {
        assert.equal(s2.attrForSelected, 'id');
        assert.equal(s2.selected, 'item2');
        assert.equal(s2.selectedItem, document.querySelector('#item2'));
      });

      test('allows assignment to selected', function() {
        // set selected
        s2.selected = 'item4';
        // check selected class
        assert.isTrue(s2.children[4].classList.contains('iron-selected'));
        // check item
        assert.equal(s2.selectedItem, s2.children[4]);
      });

      test('fire iron-select when selected is set', function() {
        // setup listener for iron-select event
        var selectedEventCounter = 0;
        s2.addEventListener('iron-select', function(e) {
          selectedEventCounter++;
        });
        // set selected
        s2.selected = 'item4';
        // check iron-select event
        assert.equal(selectedEventCounter, 1);
      });

      test('set selected to old value', function() {
        // setup listener for iron-select event
        var selectedEventCounter = 0;
        s2.addEventListener('iron-select', function(e) {
          selectedEventCounter++;
        });
        // selecting the same value shouldn't fire iron-select
        s2.selected = 'item2';
        assert.equal(selectedEventCounter, 0);
      });

    });

  