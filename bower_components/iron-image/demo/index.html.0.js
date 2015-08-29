
      var scope = document.querySelector('template[is=dom-bind]');

      scope.preload = function(e) {
        var img = document.querySelector('#' + e.target.getAttribute('target'));
        img.src = './polymer.svg?' + Math.random();
        e.target.textContent = 'Reload image';
      };
    