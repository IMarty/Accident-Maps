

    suite('<iron-iconset>', function () {

      suite('basic behavior', function () {
        var iconset;
        var meta;

        setup(function () {
          var elements = fixture('TrivialIconsetSvg');
          iconset = elements[0];
          meta = elements[1];
        });

        test('it can be accessed via iron-meta', function () {
          expect(meta.byKey('foo')).to.be.equal(iconset);
        });
      });

      suite('when paired with a size and SVG definition', function () {
        var iconset;
        var div;

        setup(function () {
          var elements = fixture('StandardIconsetSvg');
          iconset = elements[0];
          div = elements[1];
        });

        test('appends a child to the target element', function () {
          expect(div.firstElementChild).to.not.be.ok;
          iconset.applyIcon(div, 'circle');
          expect(div.firstElementChild).to.be.ok;
        });

        test('can be queried for all available icons', function () {
          expect(iconset.getIconNames()).to.deep.eql(['my-icons:circle', 'my-icons:square']);
        });

        test('supports any icon defined in the svg', function () {
          var lastSvgIcon;

          iconset.getIconNames().forEach(function (iconName) {
            iconset.applyIcon(div, iconName.split(':').pop());
            expect(div.firstElementChild).to.not.be.equal(lastSvgIcon);
            lastSvgIcon = div.firstElementChild;
          });
        });

      });

    });

  