
    var t = document.querySelector('#t');

    t.loadedShortener = function(event) {
      var request = event.target.api.url.get({
        shortUrl: 'http://goo.gl/fbsS'
      })
      request.execute(function(resp) {
        console.log(resp);
      });
    };

    t.loaded = function(e) {
      document.querySelector('#messages').innerHTML +=
        e.target.localName + ' loaded' + '<br>';
      console.log(e.target.localName + ' loaded', event.target.api);
    };
  