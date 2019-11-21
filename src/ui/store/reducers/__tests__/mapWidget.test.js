import { DROP_PINS } from "ui/store/actions/mapWidget";
import mapWidget from "../mapWidget";

describe("mapWidget", () => {
  describe("given a state", () => {
    const state = {};
    const stateObject = {
      pins: [
        {
          dropPin: false,
          center: false,
          match: "",
          type: "",
          transportation: "",
          amenity: "",
          lat: "41.8781",
          lon: "-87.6358",
          locationScore: "",
          msa: "",
          safety: "",
          economicProsperity: "",
          spatial_demand: "",
          businessVitality: ""
        }
      ],
      center: false,
      dropPin: false,
      centerLocation: {
        lat: "41.8781",
        lon: "-87.6358"
      },
      customWeights: {}
    };
    const pins = [
      {
        dropPin: true,
        param1: "PARAM1",
        param3: "PARAM3",
        PARAM5: false
      }
    ];

    describe("given a `DROP_PINS` action", () => {
      const action = {
        pins,
        type: DROP_PINS
      };

      it("returns the pins as the new state", () => {
        expect(mapWidget(state, action)).toEqual(
          expect.objectContaining({ pins })
        );
      });
    });

    describe("given any other action", () => {
      const action = { type: "FIZZ_BUZZ", foo: "bar" };
      it("returns the state unchange", () => {
        expect(mapWidget(state, action)).toEqual(stateObject);
      });
    });
  });
});
