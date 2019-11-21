import {
  DROP_PINS,
  CLEAR_PINS,
  UPDATE_PARCEL_SHADING,
  UPDATE_CUSTOM_WEIGHTS,
  GET_CUSTOM_WEIGHTS,
  // GENERATE_REPORT,
  CENTER_MAP_LOCATION
} from "ui/store/actions/mapWidget";
import { INITIAL_MAP_PIN } from "ui/configs/map";

export default function mapWidget(state, action) {
  const initialState = {
    pins: [
      {
        ...INITIAL_MAP_PIN,
        dropPin: false,
        center: false,
        match: "",
        type: "",
        transportation: "",
        amenity: "",
        locationScore: "",
        msa: "",
        safety: "",
        economicProsperity: "",
        spatial_demand: "",
        businessVitality: ""
      }
    ],
    centerLocation: INITIAL_MAP_PIN,
    dropPin: false,
    center: false
  };
  switch (action.type) {
    case DROP_PINS: {
      let { pins } = action;
      if (pins.length < 1) {
        return { ...initialState, customWeights: { ...state.customWeights } };
      }
      return {
        ...initialState,
        center: false,
        dropPin: true,
        pins: pins,
        customWeights: { ...state.customWeights },
        nationalParcelShading: state.nationalParcelShading,
        shadingMethod: state.shadingMethod
      };
    }
    case CLEAR_PINS: {
      let { pins } = action;
      return {
        ...{ centerLocation: { lat: pins[0].lat, lon: pins[0].lon } },
        center: false,
        dropPin: true,
        clearPins: true,
        pins: pins,
        customWeights: { ...state.customWeights },
        nationalParcelShading: state.nationalParcelShading,
        shadingMethod: state.shadingMethod
      };
    }
    // case GENERATE_REPORT: {
    //   return {
    //     ...initialState,
    //     parcelInfo: action.parcelInfo
    //   };
    // }
    case CENTER_MAP_LOCATION: {
      let { lat, lon } = action;
      return {
        ...initialState,
        center: true,
        dropPin: false,
        centerLocation: { lat, lon },
        customWeights: { ...state.customWeights },
        nationalParcelShading: state.nationalParcelShading,
        shadingMethod: state.shadingMethod
      };
    }
    case GET_CUSTOM_WEIGHTS: {
      const { customWeights } = action;
      const customWeightsObj = {};

      customWeights.forEach(function(rec) {
        const {
          property_type,
          safety,
          trnsprt,
          vitalty,
          economc,
          sptl_dm,
          amenity
        } = rec;

        customWeightsObj[property_type] = {
          safety,
          trnsprt,
          vitalty,
          economc,
          sptl_dm,
          amenity
        };
      });
      return {
        ...initialState,
        customWeights: customWeightsObj,
        nationalParcelShading: state.nationalParcelShading,
        shadingMethod: state.shadingMethod
      };
    }
    case UPDATE_PARCEL_SHADING: {
      let { shadingMethod, nationalParcelShading } = action;
      return {
        ...initialState,
        shadingMethod,
        nationalParcelShading
      };
    }
    case UPDATE_CUSTOM_WEIGHTS: {
      let {
        property_type,
        safety,
        trnsprt,
        vitalty,
        economc,
        sptl_dm,
        amenity
      } = action;
      const customWeights = { ...state.customWeights };
      customWeights[property_type] = {
        safety,
        trnsprt,
        vitalty,
        economc,
        sptl_dm,
        amenity
      };

      return {
        ...initialState,
        customWeights: customWeights,
        nationalParcelShading: state.nationalParcelShading,
        shadingMethod: state.shadingMethod
      };
    }
    default: {
      const customWeights =
        state && state.customWeights ? { ...state.customWeights } : {};
      return { ...initialState, customWeights };
    }
  }
}
