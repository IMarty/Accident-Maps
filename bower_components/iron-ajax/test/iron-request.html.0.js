
    suite('<iron-request>', function () {
      var jsonResponseHeaders;
      var successfulRequestOptions;
      var request;
      var server;

      setup(function () {
        jsonResponseHeaders = {
          'Content-Type': 'application/json'
        };
        server = sinon.fakeServer.create();
        server.respondWith('GET', '/responds_to_get_with_json', [
          200,
          jsonResponseHeaders,
          '{"success":true}'
        ]);

        server.respondWith('GET', '/responds_to_get_with_500', [
          500,
          {},
          ''
        ]);

        server.respondWith('GET', '/responds_to_get_with_100', [
          100,
          {},
          ''
        ]);

        server.respondWith('GET', '/responds_to_get_with_0', [
          0,
          jsonResponseHeaders,
          '{"success":true}'
        ]);


        request = fixture('TrivialRequest');
        successfulRequestOptions = {
          url: '/responds_to_get_with_json'
        };
      });

      teardown(function () {
        server.restore();
      });

      suite('basic usage', function () {
        test('creates network requests, requiring only `url`', function () {
          request.send(successfulRequestOptions);

          server.respond();

          expect(request.response).to.be.ok;
        });

        test('sets async to true by default', function () {
          request.send(successfulRequestOptions);
          expect(request.xhr.async).to.be.eql(true);
        });

        test('can be aborted', function (done) {
          request.send(successfulRequestOptions);

          request.abort();

          server.respond();

          request.completes.then(function () {
            done(new Error('Request did not abort appropriately!'));
          }).catch(function (e) {
            expect(request.response).to.not.be.ok;
            done();
          });
        });

        test('default responseType is text', function (done) {

          request.send(successfulRequestOptions);
          server.respond();

          request.completes.then(function() {
            expect(request.response).to.be.an('string')
            done();
          }).catch(function(e) {
            done(new Error('Response was not a Object'));
          });

        });

        test('responseType can be configured via handleAs option', function (done) {

          var options = Object.create(successfulRequestOptions);
          options.handleAs = 'json';

          request.send(options);
          server.respond();

          request.completes.then(function() {
            expect(request.response).to.be.an('object');
            done();
          }).catch(function(e) {
            done(new Error('Response was not type Object'));
          });

        });

      });

      suite('special cases', function() {
        test('treats status code 0 as success, though the outcome is ambiguous', function() {
          // Note: file:// status code will probably be 0 no matter what happened.
          request.send({
            url: '/responds_to_get_with_0'
          });

          server.respond();

          expect(request.succeeded).to.be.equal(true);
        });
      });

      suite('errors', function() {
        test('treats status codes between 1 and 199 as errors', function() {
          request.send({
            url: '/responds_to_get_with_100'
          });

          server.respond();

          expect(request.succeeded).to.be.equal(false);
        });

        test('treats status codes between 300 and ∞ as errors', function() {
          request.send({
            url: '/responds_to_get_with_500'
          });

          server.respond();

          expect(request.succeeded).to.be.equal(false);
        });
      });

      suite('status codes', function() {
        test('status and statusText is set after a ambiguous request', function() {
          request.send({
            url: '/responds_to_get_with_0'
          });

          server.respond();
          
          expect(request.status).to.be.equal(0);
          expect(request.statusText).to.be.equal('');
        });

        test('status and statusText is set after a request that succeeded', function() {
          request.send({
            url: '/responds_to_get_with_json'
          });

          server.respond();

          expect(request.status).to.be.equal(200);
          expect(request.statusText).to.be.equal('OK');
        });

        test('status and statusText is set after a request that failed', function() {
          request.send({
            url: '/responds_to_get_with_500'
          });

          server.respond();

          expect(request.status).to.be.equal(500);
          expect(request.statusText).to.be.equal('Internal Server Error');
        });
      });
    });
  