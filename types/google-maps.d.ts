declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    controls: any[];
    setCenter(latLng: LatLng): void;
    addListener(event: string, handler: Function): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(latLng: LatLng | null): void;
    getPosition(): LatLng | null;
    addListener(event: string, handler: Function): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  interface MapOptions {
    center: { lat: number; lng: number };
    zoom: number;
    styles?: Array<MapTypeStyle>;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers: Array<{ [key: string]: string }>;
  }

  interface MarkerOptions {
    map?: Map;
    position?: { lat: number; lng: number } | LatLng;
    draggable?: boolean;
  }

  interface MapMouseEvent {
    latLng?: LatLng;
  }

  enum ControlPosition {
    TOP_LEFT
  }

  namespace places {
    class SearchBox {
      constructor(inputField: HTMLInputElement);
      addListener(event: string, handler: Function): void;
      getPlaces(): Array<{
        geometry?: {
          location?: {
            lat(): number;
            lng(): number;
          };
        };
        formatted_address?: string;
      }>;
    }
  }
} 