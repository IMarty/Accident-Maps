
      var goodLib = document.querySelector('#plusone');
      var badliburl = document.querySelector('#badliburl');
      var badlibcallback = document.querySelector('#badlibcallback');

      suite('<iron-jsonp-library>', function() {

        test('good library loads', function(done) {
          goodLib.addEventListener('api-load', function() {
            assert.equal(goodLib.libraryLoaded, true);
            done();
          });
        });

        test('bad library dns fails to load', function() {
          badliburl.addEventListener('libraryErrorMessage-changed', function() {
            assert.isNotNull(badliburl.libraryErrorMessage);
            done();
          });
        });

        test('libraryurl mising %%callback%%', function() {
          assert.isNotNull(badlibcallback.libraryErrorMessage);
        });

      });
    