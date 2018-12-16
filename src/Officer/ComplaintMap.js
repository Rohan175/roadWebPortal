import React, { Component } from 'react'

function loadMaps(src) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function () {
      resolve();
    });
    script.addEventListener('error', function (e) {
      reject(e);
    });
    document.body.appendChild(script);
  })
};

function displayInfobox(e) {
  pinInfobox.setOptions({ title: e.target.Title, description: e.target.Description, visible: true, offset: new window.Microsoft.Maps.Point(0, 25) });
  pinInfobox.setLocation(e.target.getLocation());
}

function hideInfobox(e) {
  pinInfobox.setOptions({ visible: false });
}


// Promise Interface can ensure load the script only once.
var mMapScript = loadMaps('https://www.bing.com/api/maps/mapcontrol?key=AjlGU3ieeFyzhwTbfMkukBolwpcjkab8my5_x_qfnz88Kc5RHh04Y8dL5_acLQ3P');
var pinInfobox;

export default class ComplaintMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'start'
    };
  }

  do_load = (data) => {
    const mThis = this;
    console.log('maps do load fun');

    mMapScript.then(function () {
      mThis.setState({ 'status': 'done' });

      const map = new window.Microsoft.Maps.Map(document.getElementById('mMap'), {})
      console.log('Loaded');
      let pushpinInfos = [];
      //pushpinInfos[0] = { 'lat': 23.456574, 'lng': 72.234324, 'title': 'Kipper Market', 'description': 'Braka Miladinovi 178, 1200 Tetovë, Tetovo, Macedonia' };
      //pushpinInfos[1] = { 'lat': 41.799645, 'lng': 20.913514, 'title': 'Kipper Market', 'description': 'Kipper Gostilet' };
      
      data.forEach(d => {
        pushpinInfos.push({ 'lat': d.location[0], 'lng': d.location[1], 'title': d.name, 'description': 'Status : ' + d.complaint_status + ' \n' + d.grievType })
        console.log(d.location[0],d.location[1],d.name);
      });



      let infoboxLayer = new window.Microsoft.Maps.EntityCollection();
      let pinLayer = new window.Microsoft.Maps.EntityCollection();
      let apiKey = "<api key>";
  
      //let map = new window.Microsoft.Maps.Map(document.getElementById("map"), { credentials: apiKey });
  
      // Create the info box for the pushpin
      pinInfobox = new window.Microsoft.Maps.Infobox(new window.Microsoft.Maps.Location(0, 0), { visible: false });
      infoboxLayer.push(pinInfobox);
  
      let locs = [];
      for (let i = 0 ; i < pushpinInfos.length; i++) {
          locs[i] = new window.Microsoft.Maps.Location(pushpinInfos[i].lat, pushpinInfos[i].lng);
          let pin = new window.Microsoft.Maps.Pushpin(locs[i]);
          pin.Title = pushpinInfos[i].title;
          pin.Description = pushpinInfos[i].description;
          pinLayer.push(pin); 
          window.Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
      }
  
      map.entities.push(pinLayer);
      map.entities.push(infoboxLayer);
      console.log('Pins : ',pinLayer)
      let bestview = window.Microsoft.Maps.LocationRect.fromLocations(locs);
      map.setView({ center: bestview.center, zoom: 11 });

    }).catch(function () {
      mThis.setState({ 'status': 'error' });
      console.log('Error');

    })
  }

 

  componentWillMount() {

    if (this.state.status === 'start') {
      this.setState({ status: 'loading' });
      console.log('Maps loading');

      this.do_load(this.props.complaintsData);
    }

  }


  render() {

    return (
      <div id="mMap" style={{ width: 'auto', height: '90vh' }}> mMap</div>
    )
  }

}


