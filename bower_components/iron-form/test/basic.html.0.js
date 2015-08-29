
  suite('registration', function() {
    var f;
    test('elements can be registered', function() {
      f = fixture('Basic');

      assert.equal(f._customElements.length, 1);
      assert.equal(f.elements.length, 1);
    });

    test('elements can be unregistered', function(done) {
      f = fixture('Basic');
      var element = f.querySelector('simple-element');

      assert.equal(f._customElements.length, 1);
      assert.equal(f.elements.length, 1);

      f.removeChild(element);

      setTimeout(function() {
        assert.equal(f._customElements.length, 0);
        assert.equal(f.elements.length, 1);
        done();
      }, 200);
    });
  });

  suite('serializing', function() {
    var f;
    test('serializes both custom and native elements', function() {
      f = fixture('Basic');

      assert.equal(f._customElements.length, 1);
      assert.equal(f.elements.length, 1);

      var json = f.serialize();
      assert.equal(Object.keys(json).length, 2);
      assert.equal(json['zig'], 'zag');
      assert.equal(json['foo'], 'bar');
    });

    test('serializes elements with duplicate names', function() {
      f = fixture('Dupes');

      assert.equal(f._customElements.length, 3);
      assert.equal(f.elements.length, 2);

      var json = f.serialize();
      assert.equal(Object.keys(json).length, 2);
      assert.equal(json['foo'].length, 2);
      assert.equal(json['foo'][0], 'bar');
      assert.equal(json['foo'][1], 'barbar');
      assert.equal(json['zig'].length, 3);
      assert.equal(json['zig'][0], 'zig');
      assert.equal(json['zig'][1], 'zag');
      assert.equal(json['zig'][2], 'zug');
    });

    test('serializes elements with checked states', function() {
      f = fixture('CheckedStates');

      assert.equal(f._customElements.length, 0);
      assert.equal(f.elements.length, 4);

      var json = f.serialize();
      assert.equal(Object.keys(json).length, 1);
      assert.equal(json['foo'].length, 2);
      assert.equal(json['foo'][0], 'bar1');
      assert.equal(json['foo'][1], 'bar3');
    });

    test('does not serialize disabled elements', function() {
      f = fixture('Disabled');

      assert.equal(f._customElements.length, 0);
      assert.equal(f.elements.length, 3);

      var json = f.serialize();
      assert.equal(Object.keys(json).length, 1);
      assert.equal(json['foo'], 'bar1');
    });

  });

  suite('submitting', function () {
    var server;
    var form;

    setup(function() {
      server = sinon.fakeServer.create();
      server.respondWith(
        'GET',
        /\/responds_with_json.*/,
        [
          200,
          '{"Content-Type":"application/json"}',
          '{"success":true}'
        ]
      );

      server.respondWith(
        'POST',
        /\/responds_with_json.*/,
        [
          200,
          '{"Content-Type":"application/json"}',
          '{"success":true}'
        ]
      );

      server.respondWith(
        'GET',
        /\/responds_with_error.*/,
        [
          404,
          '{"Content-Type":"application/text"}',
          '{"success":false}'
        ]
      );
    });

    teardown(function() {
      server.restore();
    });

    test('does not submit forms with invalid native elements', function(done) {
      form = fixture('InvalidForm');
      var nativeElement = form.querySelector('input');
      var customElement = form.querySelector('simple-element');
      customElement.value = "foo";

      var submitted = false;
      form.addEventListener('iron-form-submit', function() {
        submitted = true;
      });

      form.addEventListener('iron-form-invalid', function() {
        expect(submitted).to.be.equal(false);
        expect(nativeElement.validity.valid).to.be.equal(false);
        expect(customElement.invalid).to.be.equal(false);
        done();
      });

      form.submit();
      server.respond();
    });

    test('can submit with method=get', function(done) {
      form = fixture('FormGet');

      var submitted = false;
      form.addEventListener('iron-form-submit', function() {
        submitted = true;
      });

      form.addEventListener('iron-form-response', function(event) {
        expect(submitted).to.be.equal(true);

        var response = event.detail;
        expect(response).to.be.ok;
        expect(response).to.be.an('object');
        expect(response.success).to.be.equal(true);
        done();
      });

      form.submit();
      server.respond();
    });

    test('can submit with method=post', function(done) {
      form = fixture('FormPost');

      var submitted = false;
      form.addEventListener('iron-form-submit', function() {
        submitted = true;
      });

      form.addEventListener('iron-form-response', function(event) {
        expect(submitted).to.be.equal(true);
        var response = event.detail;
        expect(response).to.be.ok;
        expect(response).to.be.an('object');
        expect(response.success).to.be.equal(true);
        done();
      });

      form.submit();
      server.respond();
    });

    test('can relay errors', function(done) {
      form = fixture('FormPost');
      form.action = "/responds_with_error";

      form.addEventListener('iron-form-error', function(event) {
        var error = event.detail;

        expect(error).to.be.ok;
        expect(error).to.be.an('object');
        expect(error.error).to.be.ok;
        done();
      });

      form.submit();
      server.respond();
    });

  });

  