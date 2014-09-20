var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');//for access the accelerometer 
var Vibe = require('ui/vibe');
var chooseIcon=function(id,time) {
 // var icon;
  var inttime = parseInt(time.substring(time.indexOf(' ')+1,time.indexOf(':')));
  switch (id) {
    default:
      return '';
 //     break;
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
    case 520:
    case 521:
    case 522:
    case 531:
      
        return 'images/09d.png';
  //      break;
      
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
      
        return 'images/10d.png';
  //      break;
      
    case 200:
    case 201:
    case 201:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
  
      return 'images/11d.png';
      //  break;
      
    case 511:
    case 600:
    case 601:
    case 602:
    case 611:
    case 612:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
      
        return 'images/13d.png';
     //   break;
      
    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
    case 761:
    case 762:
    case 771:
    case 781:
       return 'images/50d.png';
     //   break;
      
    case 800:
      if(inttime>20){
        return 'images/01n.png';
      }
      else
      {
       return 'images/01d.png'; 
      }

        break;
   case 801:
      if(inttime>20){
       return 'images/02n.png';
      }
      else
      {
        return 'images/02d.png'; 
      }

        break;
    case 802:

        return 'images/03d.png'; 


      //  break;
    case 803:
      if(inttime > 20){
        return 'images/04d.png';
      }
      else
      {
        return 'images/03d.png'; 
      }

        break;
    case 804:

        return 'images/04d.png'; 
      //  break;
  }
};
var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase() + title.substring(1);
    var id = data.list[i].weather[0].id;
    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);
    var icon =chooseIcon(id,time);
    console.log(icon);
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

// Make request to openweathermap.org
ajax(
  {
    url:'http://api.openweathermap.org/data/2.5/forecast?q=Waterloo',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    var menuItems = parseFeed(data, 10);

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Current Forecast',
        items: menuItems,
        icon:'images/sun79.png'
      }]
    });
    //add feature for the menu
     resultsMenu.on('select', function(e) {
      // Get that forecast
    var forecast = data.list[e.itemIndex];
  
    // Assemble body string
    var content = data.list[e.itemIndex].weather[0].description;
  
    // Capitalize first letter
    content = content.charAt(0).toUpperCase() + content.substring(1);
  
    // Add temperature, pressure etc
    content += '\nTemperature: ' + Math.round(forecast.main.temp - 273.15) + '°C'  + '\nPressure: ' + Math.round(forecast.main.pressure) + ' mbar' +
      '\nWind: ' + Math.round(forecast.wind.speed) + ' mph, ' + 
      Math.round(forecast.wind.deg) + '°';
    var detailCard = new UI.Card({
      title:'Details',
      subtitle:e.item.subtitle,
      body: content
    });
    detailCard.show();
    });


    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();

  resultsMenu.on('accelTap', function(e) {
      // Make another request to openweathermap.org
      ajax(
        {
          url:'http://api.openweathermap.org/data/2.5/forecast?q=London',
          type:'json'
        },
        function(data) {
          // Create an array of Menu items
          var newItems = parseFeed(data, 10);
          
          // Update the Menu's first section
          resultsMenu.items(0, newItems);
          
          // Notify the user
          Vibe.vibrate('short');
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
    // Prepare the accelerometer
    Accel.init();
