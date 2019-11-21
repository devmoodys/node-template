import { stringify } from "query-string";
import { reject, isNil } from "ramda";

export function initializeMapWidget(window, document, mapProps) {
  const dropPin = mapProps.dropPin ? JSON.parse(mapProps.dropPin) : false;
  const clearPins = !!mapProps.clearPins;
  const center = mapProps.center ? JSON.parse(mapProps.center) : false;
  let lat, lon;
  if (center) {
    lat = mapProps.centerLocation.lat;
    lon = mapProps.centerLocation.lon;
  } else if (dropPin) {
    lat = mapProps.pins[0].lat;
    lon = mapProps.pins[0].lon;
  }
  const container = document.getElementById("widget-el");
  const percentiles = {
    location_score: ["0%", "20%", "40%", "60%", "80%", "100%"], //
    transportation: ["0%", "20%", "40%", "60%", "80%", "100%"],
    amenity: ["0%", "20%", "40%", "60%", "80%", "100%"],
    safety: ["0%", "20%", "40%", "60%", "80%", "100%"],
    economic_prosperity: ["0%", "20%", "40%", "60%", "80%", "100%"],
    spatial_demand: ["0%", "20%", "40%", "60%", "80%", "100%"],
    business_vitality: ["0%", "20%", "40%", "60%", "80%", "100%"],
    office: ["0%", "20%", "40%", "60%", "80%", "100%"],
    retail: ["0%", "20%", "40%", "60%", "80%", "100%"],
    hotel: ["0%", "20%", "40%", "60%", "80%", "100%"],
    industrial: ["0%", "20%", "40%", "60%", "80%", "100%"],
    multifamily: ["0%", "20%", "40%", "60%", "80%", "100%"],
    location_score_nat: [400, 651, 696, 731, 772, 1000],
    transportation_nat: [400, 618, 692, 749, 815, 1000],
    amenity_nat: [400, 643, 718, 769, 812, 1000],
    safety_nat: [400, 588, 639, 695, 792, 1000],
    economic_prosperity_nat: [400, 759, 797, 821, 847, 1000],
    spatial_demand_nat: [400, 719, 780, 830, 881, 1000],
    business_vitality_nat: [400, 662, 694, 724, 764, 1000],
    office_nat: [400, 597, 651, 694, 745, 1000],
    retail_nat: [400, 650, 692, 725, 765, 1000],
    hotel_nat: [400, 602, 640, 670, 731, 1000],
    industrial_nat: [400, 704, 739, 765, 795, 1000],
    multifamily_nat: [400, 660, 702, 735, 772, 1000]
  };

  const loans = [];
  const mapItems = getMapItemFeatures(mapProps);

  const {
    currentUser,
    customWeights,
    nationalParcelShading,
    shadingMethod,
    propertyReportInfo
  } = mapProps;
  const zoomLevel = clearPins ? 14 : 10; // TODO: find out if way to get current Zoom level (before widget is initiated/overriden)
  const widget = window.CompStak.default(container, {
    currentUser,
    customWeights,
    nationalParcelShading,
    shadingMethod,
    propertyReportInfo,
    percentiles,
    loans,
    mapItems,
    showSwitches: false,
    initialLocation: {
      center: { lat: lat, lng: lon },
      zoom: zoomLevel
    },
    onClick: _event => {
      return;
    }
  });

  if (dropPin && !clearPins) {
    dropPinsInMap(widget, mapProps.pins);
  }
  if (center) {
    widget.setCenter({
      center: { lat: lat, lng: lon },
      zoom: 10
    });
  }

  return widget;
}

export function getMapItemFeatures(mapProps) {
  let pinFeatures = [];
  if (mapProps.pins && mapProps.pins.length > 0) {
    pinFeatures = reject(
      isNil,
      mapProps.pins.map(pin => {
        if (pin.dropPin && typeof pin === "object") {
          return generateSinglePinFeature(pin);
        } else {
          return null;
        }
      })
    );
  }
  return {
    type: "FeatureCollection",
    features: pinFeatures
  };
}

export function generateSinglePinFeature(pin) {
  const {
    lat,
    lon,
    match,
    type,
    transportation,
    amenity,
    locationScore,
    safety,
    economicProsperity,
    spatial_demand,
    businessVitality,
    trnsprt_percentile,
    amenity_percentile,
    safety_percentile,
    economc_percentile,
    sptl_dm_percentile,
    vitalty_percentile,
    trnsprt_percentile_nat,
    amenity_percentile_nat,
    safety_percentile_nat,
    economc_percentile_nat,
    sptl_dm_percentile_nat,
    vitalty_percentile_nat,
    cre_percentile,
    cre_percentile_nat,
    property_type,
    msa,
    reisId,
    cre_of,
    cre_of_percentile_nat,
    cre_of_percentile,
    cre_mf,
    cre_mf_percentile_nat,
    cre_mf_percentile,
    cre_in,
    cre_in_percentile_nat,
    cre_in_percentile,
    cre_rt,
    cre_rt_percentile_nat,
    cre_rt_percentile,
    cre_ho,
    cre_ho_percentile,
    cre_ho_percentile_nat
  } = pin;

  const locationScoreArray = readScoreAndPercentile(
    locationScore,
    cre_percentile,
    cre_percentile_nat
  );

  const primary_color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  const secondary_color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lon, lat]
    },
    properties: {
      lat,
      lon,
      msa,
      title: match,
      type: type,
      primary_color,
      secondary_color,
      transportation: readScoreAndPercentile(
        transportation,
        trnsprt_percentile,
        trnsprt_percentile_nat
      ),
      reisId,
      amenity: readScoreAndPercentile(
        amenity,
        amenity_percentile,
        amenity_percentile_nat
      ),
      location_score: locationScoreArray,
      location_score_hotel: readScoreAndPercentile(
        cre_ho,
        cre_ho_percentile,
        cre_ho_percentile_nat
      ),
      location_score_industrial: readScoreAndPercentile(
        cre_in,
        cre_in_percentile,
        cre_in_percentile_nat
      ),
      location_score_multifamily: readScoreAndPercentile(
        cre_mf,
        cre_mf_percentile,
        cre_mf_percentile_nat
      ),
      location_score_office: readScoreAndPercentile(
        cre_of,
        cre_of_percentile,
        cre_of_percentile_nat
      ),
      location_score_retail: readScoreAndPercentile(
        cre_rt,
        cre_rt_percentile,
        cre_rt_percentile_nat
      ),
      safety: readScoreAndPercentile(
        safety,
        safety_percentile,
        safety_percentile_nat
      ),
      economic_prosperity: readScoreAndPercentile(
        economicProsperity,
        economc_percentile,
        economc_percentile_nat
      ),
      spatial_demand: readScoreAndPercentile(
        spatial_demand,
        sptl_dm_percentile,
        sptl_dm_percentile_nat
      ),
      business_vitality: readScoreAndPercentile(
        businessVitality,
        vitalty_percentile,
        vitalty_percentile_nat
      ),
      property_type: property_type
    }
  };
}

function readScoreAndPercentile(score, percentile, percentile_nat) {
  let readScore = score || "---";
  let readPercentile = percentile || "---";
  let readPercentileNat = percentile_nat || "---";
  if (readScore === "---" && readPercentile === "---") {
    return false;
  }
  return [readScore, readPercentile, readPercentileNat];
}

export function dropPinsInMap(widget, pinsList) {
  let createdPins = [];
  const arrayOfCoordinates = [];

  if (pinsList.length > 0) {
    createdPins = reject(
      isNil,
      pinsList.map(pin => {
        if (!pin.dropPin) {
          return null;
        }
        arrayOfCoordinates.push({ lat: pin.lat, lon: pin.lon });
        return generateSinglePinFeature(pin);
      })
    );
  }

  const coord = averageGeolocation(arrayOfCoordinates);
  const zoomLevel = calculateZoomLevel(arrayOfCoordinates);

  if (Boolean(coord.lat) && Boolean(coord.lon)) {
    widget.setCenter({
      center: coord,
      zoom: zoomLevel
    });
  }
  widget.setMapItems({
    type: "FeatureCollection",
    features: createdPins
  });
}

export function dropPinInNewTab(window, params) {
  const matchHTML = params.match.html;
  const mapParams = stringify({ ...params, matchHTML });
  const newLoc = `${process.env.CLS_URL}?${mapParams}`;
  window.open(newLoc);
}

function averageGeolocation(coords) {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coords) {
    let lat = (coord.lat * Math.PI) / 180;
    let lon = (coord.lon * Math.PI) / 180;

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  }

  let total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    lat: (centralLatitude * 180) / Math.PI,
    lon: (centralLongitude * 180) / Math.PI
  };
}

function calculateMaxDist(direction, coords) {
  let highest;
  let lowest;
  coords.forEach(function(coord) {
    if (!highest || parseFloat(coord[direction]) < highest) {
      highest = parseFloat(coord[direction]);
    }
    if (!lowest || parseFloat(coord[direction]) > lowest) {
      lowest = parseFloat(coord[direction]);
    }
  });
  return Math.abs(highest - lowest);
}

function calculateZoomLevel(coords) {
  const distanceLong = calculateMaxDist("lon", coords);
  const distanceLat = calculateMaxDist("lat", coords);

  if (
    (distanceLong !== 0 && !distanceLong) ||
    (distanceLat !== 0 && !distanceLat)
  ) {
    return 3.5;
  }
  if (distanceLong >= 41 || distanceLat >= 20) {
    return 3.5;
  }
  if (distanceLong > 37 || distanceLat > 14) {
    return 4;
  }
  if (distanceLong > 29 || distanceLat > 9) {
    return 4.5;
  }
  if (distanceLong > 21 || distanceLat > 7) {
    return 5;
  }
  if (distanceLong > 13 || distanceLat > 4) {
    return 5.5;
  }
  if (distanceLong > 1 || distanceLat > 1) {
    return 6.5;
  }
  if (distanceLong > 0.1 || distanceLat > 0.1) {
    return 8.5;
  }
  if (distanceLong > 0.05 || distanceLat > 0.05) {
    return 10.5;
  } else {
    return 11;
  }
}
