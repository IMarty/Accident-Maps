
    var hyd = require('hydrolysis');
    var Loader = hyd.Loader;
    var XHRResolver = hyd.XHRResolver;

    suite('XHR Resolver', function() {
      test('Resolve', function(done) {
        var l = new Loader();
        var x = new XHRResolver({});
        l.addResolver(x);
        var url = new URL('static/xhr-text.txt', document.baseURI).href;
        l.request(url).then(function(content) {
          assert.equal(content.trim(), 'Hello!');
          done();
        }, function(err) {
          throw err;
        });
      });

      test('Reject', function(done) {
        var l = new Loader();
        var x = new XHRResolver({});
        l.addResolver(x);
        var url = new URL('static/not-found', document.baseURI).href;
        l.request(url).then(function() {
          throw 'not expected';
        }, function(err) {
          done();
        });
      });

      test('Document', function(done) {
        var l = new Loader();
        var x = new XHRResolver({
          responseType: 'document'
        });
        l.addResolver(x);
        var url = new URL('static/xhr-document.html', document.baseURI).href;
        l.request(url).then(function(doc) {
          assert.instanceOf(doc, Document, 'document return type');
          assert.equal(doc.querySelector('#xhr').textContent, 'success');
          done();
        }, function(err) {
          throw err;
        });
      });
    });
  