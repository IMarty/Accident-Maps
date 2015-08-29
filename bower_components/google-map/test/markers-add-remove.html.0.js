
var map = document.querySelector('#map1');

suite('markers', function() {

  test('markers are defined, added, removed', function(done) {
    map.addEventListener('google-map-ready', function(e) {

      // Check if marker children were setup and can be added/removed.
      assert.equal(map.markers.length, 2);

      var marker = map.markers[0];
      Polymer.dom((Polymer.dom(marker).parentNode)).removeChild(marker);
      Polymer.dom.flush();
      async.nextTick(function() { // needed because map.updateMarkers has mutationObserver
        assert.equal(map.markers.length, 1);
        assert.isNull(
            marker.marker.map, 'removed marker is still visible on map');
        Polymer.dom(map).appendChild(marker);
        Polymer.dom.flush();
        async.nextTick(function() {
          assert.isNotNull(
              marker.marker.map, 're-added marker is not visible.');
          done();
        });
      });
    });
  });

});

