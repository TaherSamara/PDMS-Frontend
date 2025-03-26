import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrsService } from '../../../services/toaster.service';
import { defaultMapSettings, MapSettings } from '../../../models/map-settings';
import { PublicService } from '../../../services/public.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  form: FormGroup;
  defaultSettings: MapSettings;
  currentSettings: MapSettings;

  constructor(private toastrsService: ToastrsService, private publicService: PublicService) {
    this.defaultSettings = defaultMapSettings;
  }

  ngOnInit(): void {
    const encryptedSettings = localStorage.getItem('paltel-settings');
    let settings: any | null = null;
    if (encryptedSettings) {
      settings = this.publicService.decryptData(encryptedSettings);
    }

    this.currentSettings = settings
      ? { ...this.defaultSettings, ...settings }
      : this.defaultSettings;

    this.initForm();
    this.handleFormInteractions();
  }

  initForm(): void {
    this.form = new FormGroup({
      // Map Settings
      Status: new FormControl(this.currentSettings.map.status),
      MapLayer: new FormControl(this.currentSettings.map.mapLayer),
      DisableDoubleClickZoom: new FormControl(this.currentSettings.map.disableDoubleClickZoom),
      AutoFitBounds: new FormControl(this.currentSettings.map.autoFitBounds),
      ShowPlaces: new FormControl(this.currentSettings.map.showPlaces),
      ZoomLevel: new FormControl(this.currentSettings.map.zoomLevel),

      // Marker Settings
      DraggableIcons: new FormControl(this.currentSettings.marker.draggable),
      ShowGridlines: new FormControl(this.currentSettings.marker.showGridlines),
      MarkerAnimation: new FormControl(this.currentSettings.marker.markerAnimation),
      ClickableIcons: new FormControl(this.currentSettings.marker.clickableIcons),

      // Control Settings
      ShowCompass: new FormControl(this.currentSettings.controls.showCompass),
      ShowZoomControls: new FormControl(this.currentSettings.controls.showZoomControls),
      ShowStreetView: new FormControl(this.currentSettings.controls.showStreetView),
      ShowFullscreenControl: new FormControl(this.currentSettings.controls.showFullscreenControl),

      // Interactivity Settings
      PanControl: new FormControl(this.currentSettings.interactivity.panControl),
      ScrollWheelZoom: new FormControl(this.currentSettings.interactivity.scrollWheelZoom),
      KeyboardShortcuts: new FormControl(this.currentSettings.interactivity.keyboardShortcuts),
      DragToRotate: new FormControl(this.currentSettings.interactivity.dragToRotate),

      // Overlay Settings
      ShowTrafficLayer: new FormControl(this.currentSettings.overlays.showTrafficLayer),
      ShowTransitLayer: new FormControl(this.currentSettings.overlays.showTransitLayer)
    });
  }

  save(): void {
    try {
      this.currentSettings = this.mapFormToSettings();
      const encryptedData = this.publicService.encryptData(this.currentSettings);
      localStorage.setItem('paltel-settings', encryptedData);
      this.toastrsService.ShowSuccess('Settings updated successfully.');
    } catch (error) {
      this.toastrsService.ShowError('Failed to save settings. Please try again!');
    }
  }

  reset(): void {
    this.form.reset(this.mapSettingsToFormValues(this.defaultSettings));
    this.toastrsService.ShowInfo('Settings reset to default values.');
  }

  private mapFormToSettings(): MapSettings {
    return {
      map: {
        status: this.form.value.Status,
        mapLayer: this.form.value.MapLayer,
        disableDoubleClickZoom: this.form.value.DisableDoubleClickZoom,
        autoFitBounds: this.form.value.AutoFitBounds,
        showPlaces: this.form.value.ShowPlaces,
        zoomLevel: this.form.value.ZoomLevel
      },
      marker: {
        draggable: this.form.value.DraggableIcons,
        showGridlines: this.form.value.ShowGridlines,
        markerAnimation: this.form.value.MarkerAnimation,
        clickableIcons: this.form.value.ClickableIcons
      },
      controls: {
        showCompass: this.form.value.ShowCompass,
        showZoomControls: this.form.value.ShowZoomControls,
        showStreetView: this.form.value.ShowStreetView,
        showFullscreenControl: this.form.value.ShowFullscreenControl
      },
      interactivity: {
        panControl: this.form.value.PanControl,
        scrollWheelZoom: this.form.value.ScrollWheelZoom,
        keyboardShortcuts: this.form.value.KeyboardShortcuts,
        dragToRotate: this.form.value.DragToRotate
      },
      overlays: {
        showTrafficLayer: this.form.value.ShowTrafficLayer,
        showTransitLayer: this.form.value.ShowTransitLayer
      }
    };
  }

  private mapSettingsToFormValues(settings: MapSettings): any {
    return {
      Status: settings.map.status,
      MapLayer: settings.map.mapLayer,
      DisableDoubleClickZoom: settings.map.disableDoubleClickZoom,
      AutoFitBounds: settings.map.autoFitBounds,
      ShowPlaces: settings.map.showPlaces,
      ZoomLevel: settings.map.zoomLevel,

      DraggableIcons: settings.marker.draggable,
      ShowGridlines: settings.marker.showGridlines,
      MarkerAnimation: settings.marker.markerAnimation,
      ClickableIcons: settings.marker.clickableIcons,

      ShowCompass: settings.controls.showCompass,
      ShowZoomControls: settings.controls.showZoomControls,
      ShowStreetView: settings.controls.showStreetView,
      ShowFullscreenControl: settings.controls.showFullscreenControl,

      PanControl: settings.interactivity.panControl,
      ScrollWheelZoom: settings.interactivity.scrollWheelZoom,
      KeyboardShortcuts: settings.interactivity.keyboardShortcuts,
      DragToRotate: settings.interactivity.dragToRotate,

      ShowTrafficLayer: settings.overlays.showTrafficLayer,
      ShowTransitLayer: settings.overlays.showTransitLayer
    };
  }

  handleFormInteractions(): void {
    this.form.get('AutoFitBounds')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.toastrsService.ShowInfo(
          'Auto Fit Bounds is enabled. Zoom Level adjustments will be overridden to fit all markers automatically.'
        );
      } else {
        this.toastrsService.ShowWarning(
          'Auto Fit Bounds is disabled. You can now manually set the Zoom Level.'
        );
      }
    });

    this.form.get('ZoomLevel')?.valueChanges.subscribe(() => {
      if (this.form.get('AutoFitBounds')?.value) {
        this.toastrsService.ShowWarning(
          'Manual Zoom Level changes are not effective when Auto Fit Bounds is enabled.'
        );
      }
    });
  }
}
