
    suite('active-state', function() {
      var activeTarget;

      setup(function() {
        activeTarget = fixture('TrivialActiveState');
      });

      suite('non-primary pointer input source', function() {
        test('does not cause state to change', function() {
          var rightClickMouseEvent = new CustomEvent('mousedown');
          rightClickMouseEvent.buttons = 2;
          activeTarget.dispatchEvent(rightClickMouseEvent);
          expect(activeTarget.pressed).to.be.equal(false);
        });
      });

      suite('active state with toggles attribute', function() {
        setup(function() {
          activeTarget = fixture('ToggleActiveState');
        });

        suite('when clicked', function() {
          test('is activated', function(done) {
            MockInteractions.downAndUp(activeTarget, function() {
              try {
                expect(activeTarget.hasAttribute('active')).to.be.eql(true);
                done();
              } catch (e) {
                done(e);
              }
            });
          });

          test('is deactivated by a subsequent click', function(done) {
            MockInteractions.downAndUp(activeTarget, function() {
              MockInteractions.downAndUp(activeTarget, function() {
                try {
                  expect(activeTarget.hasAttribute('active')).to.be.eql(false);
                  done();
                } catch (e) {
                  done(e);
                }
              });
            });
          });
        });
      });

      suite('without toggles attribute', function() {
        suite('when mouse is down', function() {
          test('does not get an active attribute', function() {
            expect(activeTarget.hasAttribute('active')).to.be.eql(false);
            MockInteractions.down(activeTarget);
            expect(activeTarget.hasAttribute('active')).to.be.eql(false);
          });
        });

        suite('when mouse is up', function() {
          test('does not get an active attribute', function() {
            MockInteractions.down(activeTarget);
            expect(activeTarget.hasAttribute('active')).to.be.eql(false);
            MockInteractions.up(activeTarget);
            expect(activeTarget.hasAttribute('active')).to.be.eql(false);
          });
        });
      });

      suite('when space is pressed', function() {
        test('triggers a click event', function(done) {
          activeTarget.addEventListener('click', function() {
            done();
          });
          MockInteractions.pressSpace(activeTarget);
        });

        test('only triggers click after the key is released', function(done) {
          var keyupTriggered = false;

          activeTarget.addEventListener('keyup', function() {
            keyupTriggered = true;
          });

          activeTarget.addEventListener('click', function() {
            try {
              expect(keyupTriggered).to.be.eql(true);
              done();
            } catch (e) {
              done(e);
            }
          });

          MockInteractions.pressSpace(activeTarget);
        });
      });

      suite('when enter is pressed', function() {
        test('triggers a click event', function(done) {
          activeTarget.addEventListener('click', function() {
            done();
          });

          MockInteractions.pressEnter(activeTarget);
        });

        test('only triggers click before the key is released', function(done) {
          var keyupTriggered = false;

          activeTarget.addEventListener('keyup', function() {
            keyupTriggered = true;
          });

          activeTarget.addEventListener('click', function() {
            try {
              expect(keyupTriggered).to.be.eql(false);
              done();
            } catch (e) {
              done(e);
            }
          });

          MockInteractions.pressEnter(activeTarget);
        });
      });
    });
  