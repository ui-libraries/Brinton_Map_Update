var mbAttr = 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://mapbox.com">Mapbox</a>';

var blanktile = L.esri.tiledMapLayer({
    url: "https://gis.lib.uiowa.edu/gislib1/rest/services/brinton/brintonmap/MapServer"
  }),

  stamenmap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 18,
    ext: 'png'
  });

//define the map
var map = L.map('map', {
  center: [37.2, -87],
  //zoom: 6,
  minZoom: 5,
  maxZoom: 12,
  layers: [blanktile],
  zoomControl: false
});

//sets the map panning boundary so it can't go past the United States
var corner1 = L.latLng(51, -125),
  corner2 = L.latLng(23, -69)
var bounds = L.latLngBounds(corner1, corner2);
map.setMaxBounds(bounds);

//add a scale bar
L.control.scale({
  position: 'bottomright'
}).addTo(map);

//load the data asynchronously
d3.queue()
  .defer(d3.json, 'data/Brinton.geojson') //the Brinton points layer
  .await(drawMap); //load the layers after the map loads

//provide instructions for drawing the map
function drawMap(err, Brinton1) {

  var blackCircleMarkers = L.geoJson(Brinton1, { //define layer with a variable
    pointToLayer: function(feature, ll) {

      //define an empty array into which you can add tags for the filter buttons
      var tags = [];
      var props = feature.properties;

      //push properties into the tags array for later referencing by the filter buttons
      tags.push(props.Year);
      tags.push(props.Month);
      tags.push(props.Town);
      tags.push(props.State);
      tags.push(props.Amount_Made_ranges);
      tags.push(props.House_Takes_ranges);

      //style the points as circle markers
      return L.circleMarker(ll, {
        radius: 7,
        fillColor: "black",
        color: "orange",
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
        tags: tags //define the tags with the tags array
      })
    }, //end pointToLayer

    //restyle on mouseover, reset style on mouseout
    onEachFeature: function(feature, layer) {

      var props = layer.feature.properties;

      //define what happens on mouseover
      layer.on("mouseover", function(e) {
        layer.setStyle({
          radius: 7,
          fillColor: "yellow",
          color: "#3978BF",
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0,
        });
      });

      //bind a popup window to each circle marker
      layer.bindPopup("<h3 style='font-size:20px'>" + props.Town + ", " + props.State + "</h3>" + "<br>" +
        "<h4 style='font-size:12px'>" + props.Month + " " + props.Day + ", " + props.Year +
        "<br>Venue: " + props.Venue +
        "<br>Amount Made: " + props.Amount_Made_D +
        "<br>House Take: " + props.House_Takes_P +
        "<br>Notes: " + props.Notes + "</h4>"
      );

      //define what happens on mouseout
      layer.on("mouseout", function(e) {

        //style the points
        layer.setStyle({
          radius: 7,
          fillColor: "black",
          color: "orange",
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0,
        });

      });

    } //end onEachFeature

  }).addTo(map);

  //add filter buttons for:
  //years
  L.control.tagFilterButton({
    data: ['1904', '1905', '1906', '1907', '1908'],
    filterOnEveryClick: true,
    icon: '<i class="fa fa-pagelines"></i>',
  }).addTo(map);

  //months
  L.control.tagFilterButton({
    data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    filterOnEveryClick: true,
    icon: '<i class="far fa-calendar-alt"></i>',
  }).addTo(map);

  //towns
  L.control.tagFilterButton({
    data: ['Ada', 'Ainsworth', 'Albert Lea', 'Algona', 'Alvin', 'Ames', 'Anamosa', 'Arkansas City', 'Austin', 'Baltimore', 'Barnes City', 'Beatrice', 'Belle Plaine', 'Belleville', 'Blairstown', 'Blue Rapids', 'Boone', 'Brenham', 'Brighton', 'Britt', 'Brooklyn', 'Brownville', 'Bryan', 'Burlington', 'Caney', 'Cascade', 'Cedar Rapids', 'Centerville', 'Central City', 'Chanute', 'Chapin', 'Charles City', 'Chatfield', 'Chelsea', 'Cherryvale', 'Chicago', 'Chillicothe', 'Claremore', 'Clarion', 'Coalgate', 'Coffeyville', 'Corning', 'Crawfordsville', 'Cresco', 'Creston', 'David City', 'Deep River', 'Delavan', 'Delta', 'Denison', 'Denton', 'Des Moines', 'Dunlap', 'Eagle Grove', 'Eagle Lake', 'Eddyville', 'Edgar', 'Eldon', 'Eldora', 'Ellsworth', 'Essex', 'Estherville', 'Fairbury', 'Fairfield', 'Fairmont', 'Faribault', 'Farmington', 'Fonda', 'Fort Dodge', 'Fredericksburg', 'Fremont', 'Gainesville', 'Galena', 'Galveston', 'Girard', 'Granville', 'Greenfield', 'Grinnell', 'Hamburg', 'Hamilton', 'Hampton', 'Harper', 'Haskins', 'Hawatha', 'Hearne', 'Hedrick', 'Hendrick', 'Hillsboro', 'Horton', 'Hot Springs', 'Hutchinson', 'Ida Grove', 'Independence', 'Iowa City', 'Iowa Falls', 'Kalona', 'Kaufman', 'Keota', 'Keswick', 'Knoxville', 'Lawrence', 'Leon', 'Logan', 'Lyndon', 'Lyons', 'Malcom', 'Manchester', 'Manhattan', 'Mankato', 'Marshalltown', 'Martinsburg', 'Marysville', 'Mason City', 'McKinney', 'Mexia', 'Miami', 'Minneapolis', 'Montezuma', 'Montezumma', 'Monticello', 'Mount Pleasant', 'Nashua', 'Nebraska City', 'Nevada', 'New Hampton', 'New London', 'New Ulm', 'New York', 'Newkirk', 'Newton', 'Norfolk', 'Norman', 'North English', 'Northfield', 'Norway', 'Odebolt', 'Oelwein', 'Oklahoma City', 'Ollie', 'Osage', 'Osage City', 'Osawatomie', 'Osceola', 'Oskaloosa', 'Ottumwa', 'Owatonna', 'Perry', 'Philadelphia', 'Pittsburg', 'Plattsburg', 'Princeton', 'Purcell', 'Quincy', 'Red Oak', 'Richland', 'Richmond', 'Riverside', 'Rochester', 'Rubio', 'Sabetha', 'Sac City', 'Saint Charles', 'Saint James', 'Saint Louis', 'Saint Peter', 'Salina', 'San Antonia', 'Sedan', 'Sheffield', 'Shenandoah', 'Sigourney', 'South English', 'St. James', 'Storm Lake', 'Sulphur', 'Summer', 'Tama', 'Tecumseh', 'Tipton', 'Trenton', 'Valley', 'Vinita', 'Vinton', 'Wahoo', 'Waseca', 'Washington', 'Waterville', 'Waverly', 'Waxahachie', 'Wayland', 'Webster', 'Webster City', 'Wellington', 'Wellman', 'Wells', 'West Branch', 'West Chester', 'West Liberty', 'West Union', 'Wharton', 'What Cheer', 'Wilber', 'Williamsburg', 'Winfield', 'Winnebago City', 'Winona', 'Woodbine', 'Wymore', 'Yates Center'],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-map-marked-alt"></i>',
  }).addTo(map);

  //states and territories
  L.control.tagFilterButton({
    data: ['AR', 'DC', 'IA', 'IL', 'I.T. (Indian Territory)', 'KS', 'MD', 'MN', 'MO', 'NE', 'NY', 'OK', 'PA', 'TX', 'VA'],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-globe-americas"></i>',
  }).addTo(map);

  //dollars made
  L.control.tagFilterButton({
    data: ['$0 - $31.55', '$31.56 - $52.95', '$52.96 - $77.65', '$77.66 - $114.05', '$114.06 - $201.75', 'No Revenue Data'],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-dollar-sign"></i>',
  }).addTo(map);

  //percent taken by house
  L.control.tagFilterButton({
    data: ['0% - 12.5%', '12.6% - 25.0%', '25.1% - 33.5%', '33.6% - 41.2%', '41.3% - 68.7%', 'House Take Unknown'],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-percent"></i>',
  }).addTo(map);

  jQuery('.easy-button-button').click(function() {
    target = jQuery('.easy-button-button').not(this);
    target.parent().find('.tag-filter-tags-container').css({
      'display': 'none',
    });
  });

  //disable dragging of the map after clicking a filter button
  jQuery('.easy-button-button').click(function() {
    map.dragging.disable();
  });

  //enable dragging of the map after clicking on the map
  map.on('click', function() {
    map.dragging.enable();
  });

  var orangeCircleMarkers = L.geoJson(Brinton1, { //define layer with a variable
    pointToLayer: function(feature, ll) {
      return L.circleMarker(ll, {
        radius: 7,
        fillColor: "orange",
        color: "black",
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
      })
    }, //end pointToLayer

    //restyle on mouseover, reset style on mouseout
    onEachFeature: function(feature, layer) {

      var props = layer.feature.properties;

      //define what happens on mouseover
      layer.on("mouseover", function(e) {
        layer.setStyle({
          radius: 7,
          fillColor: "yellow",
          color: "#3978BF",
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0,
        });
      });

      //bind a popup window to each circle marker
      layer.bindPopup("<h3 style='font-size:20px'>" + props.Town + ", " + props.State + "</h3>" + "<br>" +
        "<h4 style='font-size:12px'>" + props.Month + " " + props.Day + ", " + props.Year +
        "<br>Venue: " + props.Venue +
        "<br>Amount Made: " + props.Amount_Made_D +
        "<br>House Take: " + props.House_Takes_P +
        "<br>Notes: " + props.Notes + "</h4>"
      );

      //define what happens on mouseout
      layer.on("mouseout", function(e) {

        //style the points
        layer.setStyle({
          radius: 7,
          fillColor: "orange",
          color: "black",
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0,
        });

      });

    } //end onEachFeature

  });

  //fit the map to the extent of the circle markers upon drawing
  map.fitBounds(blackCircleMarkers.getBounds());

  //define currentDate as the dynamic slider entry
  var currentDate = $('.slider').val();

  sequenceUI(orangeCircleMarkers); // calls the function to make the time slider
  createTemporalLegend(currentDate); // produces temporal legend upon map loading
  updateCircles(orangeCircleMarkers);

  //define layers
  var overlays = {
    "All Brinton Shows": blackCircleMarkers,
  };

  //send the layers to the layer control
  L.control.layers(null, overlays, {
    collapsed: false,
  }).addTo(map);

}; //end drawMap function

//add a temporal legend in sync with the UI slider
function createTemporalLegend(currentDate) {

  var temporalLegend = L.control({
    position: 'bottomleft' //place the temporal legend at bottom left corner
  });

  //when added to the map
  temporalLegend.onAdd = function(map) {

    var div = L.DomUtil.get("temporal"); //get the style settings

    //disable the mouse events
    L.DomEvent.disableScrollPropagation(div);
    L.DomEvent.disableClickPropagation(div);

    return div; //return the style settings

  }

  //convert the Julian Day Number to the Gregorian Calendar Date
  var X = parseFloat(currentDate) + 0.5;
  var Z = Math.floor(X); //Get day without time
  var F = X - Z; //Get time
  var Y = Math.floor((Z - 1867216.25) / 36524.25);
  var A = Z + 1 + Y - Math.floor(Y / 4);
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var G = Math.floor((B - D) / 30.6001);
  //must get number less than or equal to 12)
  var month_p = (G < 13.5) ? (G - 1) : (G - 13);
  //if Month is January or February, or the rest of year
  var year = (month_p < 2.5) ? (C - 4715) : (C - 4716);
  month_p -= 1; //Handle JavaScript month format
  var month = month_p + 1
  var UT = B - D - Math.floor(30.6001 * G) + F;
  var day = Math.floor(UT);
  //Determine time
  UT -= Math.floor(UT);
  UT *= 24;
  var hour = Math.floor(UT);
  UT -= Math.floor(UT);
  UT *= 60;
  var minute = Math.floor(UT);
  //end conversion of Julian Day Number to Gregorian Calendar date

  $('#temporal span').html(month + "/" + day + "/" + year); //change grade value to that currently selected by UI slider

  temporalLegend.addTo(map); //add the temporal legend to the map

}; //end createTemporalLegend function

//add a UI slider
function sequenceUI(orangeCircleMarkers) {

  //create Leaflet control for the slider
  var sliderControl = L.control({
    position: 'bottomleft',
    follow: true
  });

  //add controls to the slider
  sliderControl.onAdd = function(map) {

    var controls = L.DomUtil.get("slider");

    L.DomEvent.disableScrollPropagation(controls);
    L.DomEvent.disableClickPropagation(controls);

    return controls;

  }

  //add the control to the map
  sliderControl.addTo(map);

  $('.slider') //call the slider
    .on('input change', function() { //when the slider is moved...
      var currentDate = $(this).val(); //identifies the year selected
      createTemporalLegend(currentDate);
      updateCircles(orangeCircleMarkers);
    });

  $('.slider')
    .on('mouseover', function(e) {
      map.dragging.disable();
    });

  $('.slider')
    .on('mouseout', function(e) {
      map.dragging.enable();
    });

}; //End sequenceUI function

function updateCircles(orangeCircleMarkers) {

  var currentDate = $('.slider').val();

  orangeCircleMarkers.eachLayer(function(layer) {
    if (layer.feature.properties.Julian_Date <= currentDate) {
      layer.addTo(map);
    } else if (layer.feature.properties.Julian_Date > currentDate) {
      map.removeLayer(layer);
    }
  });

}; //End updateCircles function
