export interface MapSettings {
    map: {
        status: number;
        mapLayer: string;
        disableDoubleClickZoom: boolean;
        autoFitBounds: boolean;
        showPlaces: boolean;
        zoomLevel: number;
    };
    marker: {
        draggable: boolean;
        showGridlines: boolean;
        markerAnimation: string;
        clickableIcons: boolean;
    };
    controls: {
        showCompass: boolean;
        showZoomControls: boolean;
        showStreetView: boolean;
        showFullscreenControl: boolean;
    };
    interactivity: {
        panControl: boolean;
        scrollWheelZoom: boolean;
        keyboardShortcuts: boolean;
        dragToRotate: boolean;
    };
    overlays: {
        showTrafficLayer: boolean;
        showTransitLayer: boolean;
    }
}

export const defaultMapSettings: MapSettings = {
    map: {
        status: 0,
        mapLayer: 'roadmap',
        disableDoubleClickZoom: true,
        autoFitBounds: true,
        showPlaces: true,
        zoomLevel: 11,
    },
    marker: {
        draggable: false,
        showGridlines: false,
        markerAnimation: 'drop',
        clickableIcons: true
    },
    controls: {
        showCompass: true,
        showZoomControls: true,
        showStreetView: true,
        showFullscreenControl: true
    },
    interactivity: {
        panControl: true,
        scrollWheelZoom: true,
        keyboardShortcuts: true,
        dragToRotate: false
    },
    overlays: {
        showTrafficLayer: false,
        showTransitLayer: false
    }
};
