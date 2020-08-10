import mapboxgl, { LngLatBounds, Map } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { appTheme } from "../../common/theming/theming";
import S3Image from "../S3Image";
import { LOGO_PLACEHOLDER } from "../S3Image/S3Image";
import { useStyles } from "./MapView.style";
import { MapPin, MapViewProps } from "./MapView.types";

mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
  process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN ||
  "";

const PROGRAMMATIC_MAX_ZOOM = 13;
const BOUNDING_BOX_PADDING = 50;

// utility function to render react element as popup
const addPopup = (el: JSX.Element, className: string) => {
  const placeholder = document.createElement("div");
  ReactDOM.render(el, placeholder);

  const popup = new mapboxgl.Popup({
    className,
    closeOnMove: true,
    closeButton: false,
  }).setDOMContent(placeholder);

  return popup;
};

const getBoundingBox = (pins: MapPin[]): LngLatBounds => {
  if (pins.length === 0) {
    return mapboxgl.LngLatBounds.convert([
      [-130, 25],
      [-66, 50],
    ]); // bounding box for USA
  }
  const southMostLatitude = pins.reduce(
    (min, currentValue) => Math.min(currentValue.address.location.latitude, min),
    pins[0].address.location.latitude
  );
  const northMostLatitude = pins.reduce(
    (max, currentValue) => Math.max(currentValue.address.location.latitude, max),
    pins[0].address.location.latitude
  );
  const westMostLongitude = pins.reduce(
    (min, currentValue) => Math.min(currentValue.address.location.longitude, min),
    pins[0].address.location.longitude
  );
  const eastMostLongitude = pins.reduce(
    (max, currentValue) => Math.max(currentValue.address.location.longitude, max),
    pins[0].address.location.longitude
  );
  return mapboxgl.LngLatBounds.convert([
    [westMostLongitude, southMostLatitude],
    [eastMostLongitude, northMostLatitude],
  ]);
};

const MapView = ({ pins, activePin = -1, height = 500 }: MapViewProps) => {
  const classes = useStyles(height);
  const [map, setMap] = useState<Map | null>(null);
  const [pinsChanged, setPinsChanged] = useState(false);

  const currentMarkers = useRef<mapboxgl.Marker[]>([]);

  const mapContainer = useRef<HTMLDivElement | null>(null);

  // create map component
  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: appTheme.mapboxTheme,
        bounds: getBoundingBox(pins),
        fitBoundsOptions: {
          padding: BOUNDING_BOX_PADDING,
          maxZoom: 15,
        },
      });

      // Add geolocation control to the map
      const userLocation = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        fitBoundsOptions: {
          maxZoom: PROGRAMMATIC_MAX_ZOOM,
        },
        trackUserLocation: true,
      });

      map.addControl(userLocation);

      map.on("load", () => {
        setMap(map);
        // userLocation.trigger();
        // map.resize();
      });
    };

    if (!map) {
      initializeMap();
    }
  }, [map, pins]);

  // detect pin change
  const pinsStr = JSON.stringify(
    pins.map((pin) => ({
      location: pin.address.location,
      name: pin.name,
      logo: pin.logoUrl,
    }))
  );
  useEffect(() => {
    // need to do it with timeout because there's a LOT of weirdness with adding
    // markers right when the map is loading; if you try, half the time the map doesn't
    // even move, half the time they load but are strangely invisible, and half
    // the time it works just fine and makes you think you're crazy. This timeout
    // seems to work well on normal connections, fast 3G, and slow 3G; may need to revisit
    // it in the future.
    setTimeout(() => {
      setPinsChanged(true);
    }, 5000);
  }, [pinsStr]);

  // add pins to map, on pin change only, once map is loaded
  useEffect(() => {
    if (!map) {
      return;
    }
    if (!pinsChanged) {
      return;
    }
    if (!map.loaded() || !map.isStyleLoaded()) {
      return;
    }
    setPinsChanged(false);
    currentMarkers.current.forEach((marker) => {
      marker.remove();
    });
    // if (currentMarkers.current.length > 0)
    //   console.log(`Removed ${currentMarkers.current.length} markers`);
    const newMarkers: mapboxgl.Marker[] = [];
    pins.forEach((pin: MapPin) =>
      newMarkers.push(
        new mapboxgl.Marker({ color: appTheme.color.pink })
          .setLngLat([pin.address.location.longitude, pin.address.location.latitude])
          .setPopup(
            addPopup(
              <div className={classes.restaurantPopup}>
                <S3Image
                  location={pin.logoUrl || LOGO_PLACEHOLDER}
                  alt={`${pin.name} logo`}
                  key={pin.name}
                />
                <div>
                  <p>{pin.name}</p>
                </div>
              </div>,
              classes.popup
            )
          )
          .addTo(map)
      )
    );
    // if (newMarkers.length > 0) console.log(`Added ${newMarkers.length} markers`);
    currentMarkers.current = newMarkers;
    map.fitBounds(getBoundingBox(pins), {
      padding: BOUNDING_BOX_PADDING,
      maxZoom: PROGRAMMATIC_MAX_ZOOM,
    });
    map.triggerRepaint();
  }, [pins, pinsChanged, map, classes.popup, classes.restaurantPopup]);

  // move map to current activePin
  useEffect(() => {
    if (!map || activePin === -1) {
      return;
    }
    if (0 <= activePin && activePin < pins.length) {
      const currentPin = pins[activePin];
      map.flyTo({
        center: [
          currentPin.address.location.longitude,
          currentPin.address.location.latitude,
        ],
        zoom: PROGRAMMATIC_MAX_ZOOM,
      });
    } else {
      map.fitBounds(getBoundingBox(pins), {
        padding: BOUNDING_BOX_PADDING,
        maxZoom: PROGRAMMATIC_MAX_ZOOM,
      });
    }
  }, [map, pins, activePin]);

  return (
    <div className={classes.container}>
      <div className={classes.mapContainer} ref={(el) => (mapContainer.current = el)} />
    </div>
  );
};

export default MapView;
