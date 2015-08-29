
    document.getElementById('formGet').addEventListener('iron-form-submit', display);
    document.getElementById('formPost').addEventListener('iron-form-submit', display);

    function display(event) {
      var output = document.getElementById('output');
      output.innerHTML = JSON.stringify(event.detail);
    }

    function clickHandler(event) {
      Polymer.dom(event).localTarget.parentElement.submit();
    }
  