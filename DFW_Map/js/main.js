// Global Variables
var map, clientID, clientSecret;

function AppViewModel() {
    var self = this;

    this.searchOption = ko.observable("");
    this.markers = [];

    // Populate window
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Foursquare API Client
            clientID = "W02CO40GBMFT3HGOB4QX30QPIU04NO30YU5KFDJ0WRKDM1A2";
            clientSecret =
                "IO04BTDOKRQJEEOLATRSNL2E55C21KMTEHSWPVXFDA55RWRR";
            // URL for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0]? response.location.formattedAddress[0]: 'N/A';
                self.city = response.location.formattedAddress[1]? response.location.formattedAddress[1]: 'N/A';
                self.zip = response.location.formattedAddress[3]? response.location.formattedAddress[3]: 'N/A';
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                    '<h5 class="subtitle">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="address_title"> Address: </h6>' +
                    '<p class="address">' + self.street + '</p>' +
                    '<p class="address">' + self.city + '</p>' +
                    '<p class="address">' + self.zip + '</p>' +
                    '</p>' + '</div>' + '</div>';

                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert on error
                alert(
                    "Foursquare API failed to load. Please refresh your page to try again."
                );
            });

            this.htmlContent = '<div>' + '<h4 class="iw_title">' + marker.title +
                '</h4>';

            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(32.899809, -97.040335),
            zoom: 11,
            styles: styles
        };
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].lat;
            this.markerLng = myLocations[i].lng;
            // Google Maps marker setup
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }

         this.resetMap = function() {
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
            map.setZoom(11);
            map.setCenter(mapOptions.center);
        } else if(windowWidth > 1080) {
            map.setZoom(11);
            map.setCenter(mapOptions.center);
        }
            }
    };

    this.initMap();

    // Append locations to a list using data-bind and make it filter
    this.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function startApp() {
    ko.applyBindings(new AppViewModel());
}
