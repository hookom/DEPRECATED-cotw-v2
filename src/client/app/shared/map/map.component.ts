import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'cotw-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
}) 

export class MapComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: []
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  // from: string = '';
  // to: string = '';
  // distance: number = 0;

  // ngOnInit() {
  //   var directionsService = new google.maps.DirectionsService;
  //   var directionsDisplay = new google.maps.DirectionsRenderer;
  //   var map = new google.maps.Map(document.getElementById('cotw-map'), {
  //        zoom: 7,
  //        center: {lat: 41.85, lng: -87.65}
  //   });
  //   directionsDisplay.setMap(map);
    

  // }

  // /**
  //  * Creates route on the map with given inputs.
  //  * @return {boolean} false to prevent default form submit behavior to refresh the page.
  //  */
  // climbRoute(): boolean {
  //   calculateAndDisplayRoute(directionsService, directionsDisplay);

  //   function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //     var waypts = [];
  //     var checkboxArray:any[] = [
  //         'winnipeg', 'regina','calgary'
  //     ];
  //     for (var i = 0; i < checkboxArray.length; i++) {

  //       waypts.push({
  //         location: checkboxArray[i],
  //         stopover: true
  //       });

  //     }

  //     directionsService.route({
  //       origin: {lat: 41.85, lng: -87.65},
  //       destination: {lat: 49.3, lng: -123.12},
  //       waypoints: waypts,
  //       optimizeWaypoints: true,
  //       travelMode: 'DRIVING'
  //     }, function(response, status) {
  //       if (status === 'OK') {
  //         directionsDisplay.setDirections(response);
  //       } else {
  //         window.alert('Directions request failed due to ' + status);
  //       }
  //     });
  //   }

  //   this.from = '';
  //   this.to = '';
  //   this.distance = 0;
    
  //   return false;
  // }

}