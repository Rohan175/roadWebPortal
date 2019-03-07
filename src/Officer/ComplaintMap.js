import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';

import ComplaintFullView from "../Components/ComplaintFullView";

import Button from '@material-ui/core/Button';

import {openLocationInGoogleMaps} from '../constants';
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
var pinInfobox,map;

export default class ComplaintMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'start',
      openIndividiualCompaintDialog : false,
      ComplaintDialogData: null
    };
  }

  openIndividiualCompaintDialog = (i) => {

    console.log("--------> " ,  this.props.complaintsData[i], i);
    

    this.setState({
      openIndividiualCompaintDialog : true,
      ComplaintDialogData:this.props.complaintsData[i]
    })
  }

  
  handleClose = () => {
    this.setState({ openIndividiualCompaintDialog: false, ComplaintDialogData: null });
};
  

  load_Data = (data) => {
    
    let pushpinInfos = [];
    //pushpinInfos[0] = { 'lat': 23.456574, 'lng': 72.234324, 'title': 'Kipper Market', 'description': 'Braka Miladinovi 178, 1200 Tetovë, Tetovo, Macedonia' };
    //pushpinInfos[1] = { 'lat': 41.799645, 'lng': 20.913514, 'title': 'Kipper Market', 'description': 'Kipper Gostilet' };
    //console.log(data);
    
    data.forEach((d,i) => {
      pushpinInfos.push({ 'lat': d.location[0] , 
                          'lng': d.location[1] , 
                          'title': d.name.slice(0,50) + "... ", 
                          'description': '<div onclick = window.complaintMapThis.openIndividiualCompaintDialog('+i+') > <div>Status : ' + d.complaint_status +
                           ' ( ' + d.griev_type + ' ) '+
                           '<div><a style="color : blue;font-size: 15px" onclick = window.complaintMapThis.openIndividiualCompaintDialog()> View more</a></div></div>'})
    });

    let apiKey = "<api key>";

    //let map = new window.Microsoft.Maps.Map(document.getElementById("map"), { credentials: apiKey });
    let infoboxLayer = new window.Microsoft.Maps.EntityCollection();
    let pinLayer = new window.Microsoft.Maps.EntityCollection();  

    // Create the info box for the pushpin
    
    pinInfobox = new window.Microsoft.Maps.Infobox(new window.Microsoft.Maps.Location(0, 0), { visible: false });
    infoboxLayer.push(pinInfobox);


    //console.log(pinLayer, infoboxLayer, map, pinLayer['_primitives'],pinLayer['_id']);

    //pinLayer['_primitives'] = []


    let locs = [];
    for (let i = 0 ; i < pushpinInfos.length; i++) {
        locs[i] = new window.Microsoft.Maps.Location(pushpinInfos[i].lat, pushpinInfos[i].lng);
        let pin = new window.Microsoft.Maps.Pushpin(locs[i]);
        pin.Title = pushpinInfos[i].title;
        pin.Description = pushpinInfos[i].description;
        pinLayer.push(pin); 
        window.Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
    }

    //console.log(map.entities, typeof map.entities);

    map.entities.push(pinLayer);
    map.entities.push(infoboxLayer);
    //console.log('Pins : ', pinLayer)
    let bestview = window.Microsoft.Maps.LocationRect.fromLocations(locs);
    map.setView({ center: bestview.center, zoom: 8 });
}

  do_load = (data) => {
    const mThis = this;
    
    //console.log(data);
    

    mMapScript.then(function () {
      //console.log(data);
      // window.onload = () => {
        mThis.setState({ 'status': 'done' });

        map = new window.Microsoft.Maps.Map(document.getElementById('mMap'), {})
    
        //console.log('Loaded');
        mThis.load_Data(data);

    }).catch(function (err) {
      //console.log(err);
      
      mThis.setState({ 'status': 'error' });
      //console.log('Error');

    })
  }


  componentWillMount() {
    console.log(window);
    
    window.complaintMapThis = this;

//    console.log(window);
    
    if (this.state.status === 'start') {
      this.setState({ status: 'loading' });
      console.log('Maps loading');
      if(document.readyState != 'complete') {
        window.onload = () => {
          this.do_load(this.props.complaintsData);
        }
      } else {
        this.do_load(this.props.complaintsData);
      }
    }

  }

  componentWillReceiveProps(newProps){
    
    if(this.state.status === 'done'){ 
      console.log("semdomg ", newProps.complaintsData.length);


      for (var i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
            map.entities.removeAt(i);
        }
      }

      this.load_Data(newProps.complaintsData);
    }
  }

  render() {
    const LoadingState = (this.state.status == 'loading');

    return (

      <div>


        <ComplaintFullView 
                ComplaintDialogData={this.state.ComplaintDialogData} 
                handleComplaintDialogClose={this.handleClose} 
                openComplaintDialogState={this.state.openIndividiualCompaintDialog}  
                handleIndividualComplaintChange={this.props.handleIndividualComplaintChange}/>

        { LoadingState ? (<LinearProgress />) :
        (<div id="mMap" style={{ width: 'auto', height: '90vh' }}> mMap</div>)
        }
      </div>
    )
  }

}