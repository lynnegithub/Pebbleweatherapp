var UI = require('ui');
var ajax = require('ajax');
//var Vector2 = require('vector2');
var Accel = require('ui/accel');//for access the accelerometer 
var Vibe = require('ui/vibe');

// choose the icon for the weather
var chooseIcon=function(iconid) {

  switch (iconid) {
    default:
      return '';
    case "01n":
        return 'images/01n.png';
    case "01d":
       return 'images/01d.png'; 
    case "02n":
       return 'images/02n.png';
    case "02d":
        return 'images/02d.png'; 
    case "03d":
        return 'images/03d.png'; 
    case "03n":
        return 'images/03n.png'; 
    case "04d":
        return 'images/04d.png';
    case "04n":
        return 'images/04n.png';
    case "09d":      
        return 'images/09d.png';  
    case "09n":      
        return 'images/09n.png';  
    case "10d":      
        return 'images/10d.png';
    case "10n":     
        return 'images/10n.png';      
    case "11d":  
      return 'images/11d.png'; 
    case "11n":  
      return 'images/11n.png';  
    case "13d":
        return 'images/13n.png';   
    case "13n":
        return 'images/13d.png'; 
    case "50d":
       return 'images/50d.png';      

  }
};
var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase() + title.substring(1);
    var idicon = data.list[i].weather[0].icon;
    console.log("idicon = "+idicon);
    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);
    var icon = chooseIcon(idicon);
    //console.log(icon);
    // Add to menu items array
    items.push({
      title:title,
      subtitle:time,
      icon:icon
    });
  }

  // Finally return whole array
  return items;
};
/*
// Show splash screen while waiting for data
var splashWindow = new UI.Window({
   backgroundColor:'white'
});

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 30),
  size: new Vector2(144, 40),
  text:'Trying hard to load:)',
  font:'GOTHIC_14',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();
*/
// Make request to openweathermap.org
var cityMenu = new UI.Menu({
  sections :[{
    title:'Canada',
    items: [{
      title: 'Waterloo',
    }, 
    {
      title: 'Ottawa'
    },
    {
       title:'Toronto'
    },
    {
      title:'Mississauga'
    },
    {
      title:'vancouver'
    },
    {
      title:'montreal'
    }
           ]
    
  }]
  
});
cityMenu.show();
/*cityMenu.on('accelTap', function(e){
  if(e.axis === 'z' && e.direction === '1'){
    
  }
  else if(e.axis === 'z' && e.direction === '-1')
  {
    
    
  }
  
}*/
cityMenu.on('select',function(e){

  ajax(
    {
      url:'http://api.openweathermap.org/data/2.5/forecast?q='+e.item.title,
      type:'json'
    },
    function(data) {
      // Create an array of Menu items
      var menuItems = parseFeed(data, 5);
  
      // Construct Menu to show to user
      var resultsMenu = new UI.Menu({
        sections: [{
          title: 'Current Forecast',
          items: menuItems
        }]
      });
      //add feature for the menu
       resultsMenu.on('select', function(g) {
        // Get that forecast
      var forecast = data.list[g.itemIndex];
    
      // Assemble body string
      var content = data.list[g.itemIndex].weather[0].description;
    
      // Capitalize first letter
      content = content.charAt(0).toUpperCase() + content.substring(1);
    
      // Add temperature, pressure etc
      content += '\nTemperature: ' + Math.round(forecast.main.temp - 273.15) + '°C'  + '\nPressure: ' + Math.round(forecast.main.pressure) + ' mbar' +
        '\nWind: ' + Math.round(forecast.wind.speed) + ' mph, ' + 
        Math.round(forecast.wind.deg) + '°';
      var detailCard = new UI.Card({
        title:'More Information',
        subtitle:g.item.subtitle,
        body: content,
        scrollable:true
      });
      detailCard.show();
      });
  
  
      // Show the Menu, hide the splash
      resultsMenu.show();
  
    resultsMenu.on('accelTap', function(f) {
        // Make another request to openweathermap.org
        ajax(
          {
            url:'http://api.openweathermap.org/data/2.5/forecast?q='+e.item.title,
            type:'json'
          },
          function(data) {
            // Create an array of Menu items
            var newItems = parseFeed(data, 6);
            
            // Update the Menu's first section
            resultsMenu.items(0, newItems);
            
            // Notify the user
            Vibe.vibrate('double');
          },
          function(error) {
            console.log('Download failed: ' + error);
          }
        );
      });
    },
    function(error) {
      console.log('Download failed: ' + error);
    }
  );
});
    // Prepare the accelerometer
    Accel.init();
/*Accel.on('tap', function(e) {
   Vibe.vibrate('short');
  console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
});*/
