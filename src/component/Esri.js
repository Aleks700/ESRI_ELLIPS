import React from 'react';
import { loadModules } from 'esri-loader';
import './Esri.css';

export  default class WebMapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(['esri/Map', 'esri/views/MapView',], { css: true })
    .then(([Map, MapView]) => {
      const map = new Map({
        basemap: 'topo-vector'
      });

     this.view = new MapView({
        container: this.mapRef.current,
        map: map,
        center: [30, 60],
        zoom: 8
      });
      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "7px 15px 5px";
      this.view.ui.add(coordsWidget, "bottom-right");

        const showCoordinates=(pt)=>{
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
            " | Scale 1:" + Math.round(this.view.scale * 1) / 1 +
            " | Zoom " + this.view.zoom;
        coordsWidget.innerHTML = coords;
      }
      
      //*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
      this.view.watch(["stationary"], ()=>{
        showCoordinates(this.view.center);
      });

      //*** Add event to show mouse coordinates on click and move ***//
      this.view.on(["pointer-down","pointer-move"], (evt)=>{
        showCoordinates(this.view.toMap({ x: evt.x, y: evt.y }));
      });
      
    });
  }

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }

  render() {
    return (
      <div className="webmap" ref={this.mapRef} />
    );
  }
}