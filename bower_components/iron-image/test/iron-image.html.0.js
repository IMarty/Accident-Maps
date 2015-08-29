
      suite('<iron-image>', function() {
        function randomImageUrl () {
          return '../demo/polymer.svg?' + Math.random();
        }

        var image;

        suite('basic behavior', function() {
          setup(function() {
            image = fixture('TrivialImage');
          });

          test('can load images given a src', function(done) {
            image.addEventListener('loaded-changed', function onLoadedChanged() {
              image.removeEventListener('loaded-changed', onLoadedChanged);

              try {
                expect(image.loaded).to.be.eql(true);
                done();
              } catch (e) {
                done(e);
              }
            });
            image.src = randomImageUrl();
          });

          test('will reload images when src changes', function(done) {
            var loadCount = 0;

            image.addEventListener('loaded-changed', function onLoadedChanged() {
              if (image.loaded === true) {
                loadCount++;

                if (loadCount === 2) {
                  done();
                } else {
                  image.src = randomImageUrl();
                  image.removeEventListener('loaded-changed', onLoadedChanged);
                }
              }
            });

            image.src = randomImageUrl();
          });
        });
      });
    