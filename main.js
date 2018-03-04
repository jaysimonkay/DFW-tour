var map;
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:  ‎32.768799, lng: -97.309341},
          zoom: 13
        });
      }
