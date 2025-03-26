import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MapLoaderService {
    private static promise: Promise<void>;

    public static load(): Promise<void> {
        if (!this.promise) {
            const browserKey = "AIzaSyBPP4uPku5JVfd9pWICx-NTnXh5qFxOaF8";
            const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${browserKey}&libraries=geometry,drawing`;

            this.promise = new Promise((resolve, reject) => {
                // Check if Google Maps API is already loaded
                if ((window as any).google && (window as any).google.maps) {
                    resolve();
                    return;
                }

                // Check if script already exists in DOM
                const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
                if (existingScript) {
                    existingScript.addEventListener('load', () => resolve());
                    existingScript.addEventListener('error', (err) => reject(err));
                    return;
                }

                // Dynamically load script
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = scriptUrl;
                script.async = true;
                script.defer = true;

                script.onload = () => resolve();
                script.onerror = (err) => reject(err);

                document.head.appendChild(script);
            });
        }

        return this.promise;
    }
}
