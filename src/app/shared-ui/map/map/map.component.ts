import { Component, Input, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { MapService } from 'src/app/services/map.service';
import { getUid } from 'ol/util';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() lonLat?: any;
  @Input() name: any;
  @Input() readOnly?: boolean = false;
  subject$ = new Subject<void>();
  lang = 'en';
  //map>layer>source>feature
  //this.markerVectorSource.removeFeature(this.markerVectorSource.getFeatureByUid('3'));
  //this.markerVectorSource.getFeatureById('idname')
  // /feature.setId('idname');
  //this.markerVectorSource.getFeatures()[0].ol_uid
  markerVectorSource: any;
  constructor(
    private mapService: MapService
  ) { }

  map: any;

  ngOnInit(): void {
    this.markerVectorSource = new VectorSource({})
    this.renderMap();
    this.map.addLayer(this.getMarkerVectorLayer("initial", this.markerVectorSource));
    if (this.lonLat) {
      this.markerVectorSource.addFeature(this.addIconFeature(this.lonLat, true));
    }
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  renderMap() {
    const tiles_url = `https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=${this.lang.toLowerCase()}`;
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 3,
      }),
      layers: [
        new TileLayer({
          //source: new OSM({ 'url': tiles_url }),
          source: new OSM()
        })
      ],
      //target: this.lang
    });
    setTimeout(() => {
      if (!this.readOnly) {
        this.addListener();
      }
      this.map.setTarget(this.name);
      this.map.getView().setZoom(15);
      if (this.lonLat){
        this.map.getView().setCenter(olProj.transform(this.lonLat, 'EPSG:4326', 'EPSG:3857'));
      }
     
      
    }, 0);
  }

  addListener() {
    this.map.on('singleclick', ((event: any) => {
      let lonLat = olProj.toLonLat(event.coordinate);
      let addIcon = this.addIconFeature(lonLat, true);
      this.mapService.setCoordinateLIST(addIcon);
    }));
    this.mapService.getMapCoordinateLIST()
      .pipe(takeUntil(this.subject$)).subscribe(
        data => {
          let addIcon = this.addIconFeature(data, true);
          this.map.getView().setZoom(15);
          this.map.getView().setCenter(olProj.transform(data, 'EPSG:4326', 'EPSG:3857'));
          this.mapService.setCoordinateLIST(addIcon);
        }
      )
  }


  addIconFeature(lonLat: any, clear: boolean) {
    if (clear) {
      this.markerVectorSource.clear()
    }
    let feature = this.getIconFeature(lonLat);
    this.markerVectorSource.addFeature(feature);
    console.log(getUid(feature));
    if (getUid(feature)) {
      return { ol_uid: getUid(feature), lonLat: lonLat };
    }
    else {
      return { ol_uid: null, lonLat: lonLat };
    }
  }

  getMarkerVectorLayer(custom_name: string, vectorSource: any) {
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: { customname: custom_name }
    });
    return vectorLayer;
  }

  convertToOlpoint(lonLat: any) {
    return new Point(olProj.transform(lonLat, 'EPSG:4326', 'EPSG:3857'))
  }

  getIconFeature(lonLat: any) {
    const iconFeature = new Feature({
      geometry: this.convertToOlpoint(lonLat),
      name: 'Null Island',
      population: 4000,
      rainfall: 500,
    });
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        color: '#ff4081',
        src: '/assets/icons/location_on_black_24dp.svg',
      }),
    });
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }


}
