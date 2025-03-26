import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ApiService } from '../../services/api.service';
import { MapLoaderService } from './google-map.loader';
import { GlobalConstants } from 'src/app/common/global-constants';
import { PublicService } from '../../services/public.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent {

  @Input() height: string = '500px';
  @Input() operationType: 'viewMarkers' | 'addPolygon' | 'viewPolygons' = 'viewMarkers';
  @Input() vertices: google.maps.LatLngLiteral[] = [];
  @Input() polygon: google.maps.LatLngLiteral[] = [];
  @Input() color: string = '#000';

  @Output() polygonDrawn: EventEmitter<google.maps.LatLngLiteral[]> = new EventEmitter();

  map: google.maps.Map;
  options: any = {};
  markers: google.maps.Marker[] = [];
  trafficLayer: google.maps.TrafficLayer;
  transitLayer: google.maps.TransitLayer;
  interval: any;

  constructor(private zone: NgZone, private httpService: HttpService, private api: ApiService, private publicService: PublicService) { }

  ngOnInit() {
    const encryptedSettings = localStorage.getItem('paltel-settings');
    if (encryptedSettings) {
      this.options = this.publicService.decryptData(encryptedSettings);
    }

    this.zone.runOutsideAngular(() => {
      MapLoaderService.load().then(() => {
        this.initializeMap();

        switch (this.operationType) {
          case 'viewMarkers':
            this.listMarkers();
            break;
          case 'addPolygon':
            this.createPolygon();
            break;
          case 'viewPolygons':
            this.displayPolygon();
            break;
        }
      });
    });
  }

  initializeMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 31.42, lng: 34.37 }, // مركز الخريطة
      zoom: this.options.map.zoomLevel, // مستوى التكبير
      tilt: 180, // زاوية العرض
      minZoom: 1, // الحد الأدنى للتكبير
      maxZoom: 20, // الحد الأقصى للتكبير
      scaleControl: true, // ظهار أو إخفاء مقياس المسافة في الخريطة
      draggable: this.options.interactivity.panControl, // تحكم السحب
      scrollwheel: this.options.interactivity.scrollWheelZoom,
      mapTypeId: this.options.map.mapLayer, // نوع طبقة الخريطة
      disableDoubleClickZoom: this.options.map.disableDoubleClickZoom, // تعطيل التكبير بالنقر المزدوج
      fullscreenControl: this.options.controls.showFullscreenControl, // تحكم ملء الشاشة
      zoomControl: this.options.controls.showZoomControls, // أزرار التكبير والتصغير
      streetViewControl: this.options.controls.showStreetView, // عرض التجوّل الافتراضي
      rotateControl: this.options.interactivity.dragToRotate, // تحكم الدوران
      gestureHandling: this.options.interactivity.scrollWheelZoom ? 'auto' : 'none', // التحكم بحركة الماوس
      keyboardShortcuts: this.options.interactivity.keyboardShortcuts, // اختصارات لوحة المفاتيح
      clickableIcons: this.options.marker.clickableIcons, // أيقونات النقر
      styles: this.options.map.showPlaces ? [] : [ // التحكم بظهور الأماكن
        {
          featureType: "poi", // Points of Interest (المطاعم، المدارس، إلخ)
          stylers: [{ visibility: "on" }]
        }
      ],
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    // إضافة الطبقات بناءً على الإعدادات
    if (this.options.overlays.showTrafficLayer) {
      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map);
    }

    if (this.options.overlays.showTransitLayer) {
      this.transitLayer = new google.maps.TransitLayer();
      this.transitLayer.setMap(this.map);
    }
  }

  listMarkers(): void {
    let params = new HttpParams();

    if (this.options.map.status > 0) {
      params = params.set('status', this.options.map.status);
    }

    this.httpService.list(this.api.map.list, { params }).subscribe({
      next: (res: any) => {
        if (res.success && this.map) {
          const bounds = new google.maps.LatLngBounds();
          const infoWindow = new google.maps.InfoWindow();

          res.data.data.forEach((device: any) => {
            const position = { lat: Number(device.latitude), lng: Number(device.longitude) };
            const marker = new google.maps.Marker({
              position,
              map: this.map,
              title: device.name,
              draggable: this.options.marker.draggable,
              animation: this.getMarkerAnimation(),
              icon: this.getIcon(device),
            });

            marker.addListener('click', () => {
              infoWindow.setContent(`
                <div style="font-family: Arial, sans-serif;">
                  <h4 style="margin: 5px 0;">${device.name}</h4>
                  <p style="margin: 5px 0;">Gaza Strip</p>
                  <a href="https://maps.google.com?q=${device.latitude},${device.longitude}" target="_blank">
                    View on Google Maps
                  </a>
                </div>
              `);

              infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
            bounds.extend(position);
          });

          if (this.options.map.autoFitBounds) {
            this.map.fitBounds(bounds);
          }
        }
      },
    });
  }

  createPolygon(): void {
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon' as google.maps.drawing.OverlayType],
      },
    });

    drawingManager.setMap(this.map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const vertices = event.overlay.getPath().getArray();
        const resultVertices = vertices.map((vertex: any) => ({
          lat: vertex.lat(),
          lng: vertex.lng(),
        }));
        this.polygonDrawn.emit(resultVertices);
      }
    });
  }

  displayPolygon(): void {
    const bounds = new google.maps.LatLngBounds();
    const polygonCoords = this.polygon;
    const polygon = new google.maps.Polygon({
      paths: polygonCoords,
      strokeColor: this.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.color,
      fillOpacity: 0.35,
    });

    polygon.setMap(this.map);
    polygonCoords.forEach(coord => bounds.extend(coord));

    if (this.options.map.autoFitBounds) {
      this.map.fitBounds(bounds);
    }
  }

  private markerClick(marker: google.maps.Marker): void {
    console.log(`Marker clicked: ${marker.getTitle()}`);
  }

  private getMarkerAnimation(): google.maps.Animation | null {
    switch (this.options.marker.markerAnimation) {
      case 'bounce':
        return google.maps.Animation.BOUNCE;
      case 'drop':
        return google.maps.Animation.DROP;
      default:
        return null;
    }
  }

  private getIcon(device: any): google.maps.Icon {
    const deviceType = device?.device_type?.toLowerCase()?.replace(' ', '_')?.trim();
    const status = device?.status;

    // تحديد اللون بناءً على الحالة
    let color = '#28a745'; // Default color for Online
    if (status === 2) {
      color = '#ffc107'; // Warning color for OfflineShortTerm
    } else if (status === 3) {
      color = '#dc3545'; // Danger color for OfflineLongTerm
    }

    const svgContent = GlobalConstants.getIcon(deviceType, color);
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    const iconSize = {
      access_point: new google.maps.Size(16, 16),
      switch: new google.maps.Size(20, 20),
      customer: new google.maps.Size(12, 12),
    };

    const size = iconSize[deviceType as keyof typeof iconSize];

    return {
      url: url,
      scaledSize: size
    };
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
