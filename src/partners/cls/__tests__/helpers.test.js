import { keys } from "ramda";

import { propertyFactory } from "__tests__/support/entities.factory";
import {
  clsResponseToSearchResults,
  clsPropertyToInterchangeFormat,
  locationScoreObjToReadable,
  propertyTypeMappings,
  getAddressStringHtml
} from "partners/cls/helpers";
import zipcodes from "zipcodes";
import { propertyFactory as clsPropertyFactory } from "partners/cls/__tests__/support/entities.factory";

jest.mock("partners/cls/index", () => {
  return {
    addressHasLocationScores: jest.fn().mockReturnValue(Promise.resolve(true)),
    pipLookup: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});

const mockAddressHasLocationScores = require("partners/cls/index")
  .addressHasLocationScores;
const mockPipLookup = require("partners/cls/index").pipLookup;

describe("clsPropertyToInterchangeFormat", () => {
  let clsProperty;
  const propertyId = "405 Howard Street, San Francisco, CA 94015";
  function subject() {
    return clsPropertyToInterchangeFormat(clsProperty, propertyId);
  }

  beforeEach(() => {
    clsProperty = clsPropertyFactory.build();
  });

  // Todo: Update interchange format with new keys
  it("includes only properties allowed by the interchange format", () => {
    const allowedKeys = keys(propertyFactory.build());
    const actualKeys = keys(subject());
    expect(allowedKeys).toEqual(expect.arrayContaining(actualKeys));
  });

  it("sets latitude from clsProperty.lat", () => {
    expect(subject().latitude).toEqual(clsProperty.lat);
  });

  it("sets longitude from clsPropery.lon", () => {
    expect(subject().longitude).toEqual(clsProperty.lon);
  });

  it("sets locationScoreObj from clsProperty.locationScoreObj", () => {
    expect(subject().locationScoreObj).toMatchObject(
      locationScoreObjToReadable(clsProperty.locationScoreObj)
    );
  });

  it("sets type from clsProperty.lcoationScoreObj.prp_typ", () => {
    expect(subject().type).toEqual(
      propertyTypeMappings[clsProperty.locationScoreObj.prp_typ]
    );
  });

  it("sets transportation from trnsprt", () => {
    expect(subject().transportation).toEqual(
      clsProperty.locationScoreObj.trnsprt
    );
  });

  it("sets amenity from amenity", () => {
    expect(subject().amenity).toEqual(clsProperty.locationScoreObj.amenity);
  });

  it("sets locationScore from cre", () => {
    expect(subject().locationScore).toEqual(clsProperty.locationScoreObj.cre);
  });

  it("sets safety from safety", () => {
    expect(subject().safety).toEqual(clsProperty.locationScoreObj.safety);
  });

  it("sets economicProsperity from economc", () => {
    expect(subject().economicProsperity).toEqual(
      clsProperty.locationScoreObj.economc
    );
  });

  // Todo: Fix test to updated interchange format
  it("sets spatial_demand from sptl_dm", () => {
    expect(subject().spatial_demand).toEqual(
      clsProperty.locationScoreObj.sptl_dm
    );
  });

  it("sets businessVitality from vitalty", () => {
    expect(subject().businessVitality).toEqual(
      clsProperty.locationScoreObj.vitalty
    );
  });
});

describe("clsResponseToSearchResults", () => {
  beforeEach(() => {
    mockAddressHasLocationScores.mockReturnValue(Promise.resolve(true));
    mockPipLookup.mockReturnValue(Promise.resolve({}));
    mockPipLookup.mockClear();
  });
  it("extracts the data", async () => {
    const response = [
      {
        geometry: {
          type: "Point",
          coordinates: [-85.772732, 42.905948]
        },
        properties: {
          id: "dmp_id:12345:reis_id:e953cf2a5c7cbe18",
          gid: "openaddresses:address:ventura:e953cf2a5c7cbe18",
          layer: "address",
          source: "openaddresses",
          source_id: "ventura:e953cf2a5c7cbe18",
          name: "405 Howard St",
          housenumber: "405",
          street: "Howard St",
          postalcode: "93003",
          accuracy: "point",
          label: "405 Howard St"
        }
      }
    ];
    const transformed = await clsResponseToSearchResults(response);
    const streetAddress = response[0].properties.name;
    const zip = response[0].properties.postalcode;
    const zipcodeLookup = zipcodes.lookup(zip);
    const city = zipcodeLookup.city;
    const state = zipcodeLookup.state;
    const [lon, lat] = response[0].geometry.coordinates;
    expect(transformed).toEqual({
      total: 1,
      results: [
        {
          dataTags: ["addressInformation", "propertyType"],
          type: "property",
          updatedAt: "2018-06-27", // updatedAt is a hardcoded for now and same as cls/helpers.js
          match: {
            label: "Address",
            html: getAddressStringHtml(streetAddress, city, state, zip)
          },
          entityId: JSON.stringify({
            streetAddress,
            city,
            state,
            zip,
            lat,
            lon,
            dmp_id: "12345",
            reis_id: "e953cf2a5c7cbe18"
          })
        }
      ],
      dataTags: ["addressInformation", "propertyType"]
    });
  });
  it("calls pipLookup for results without zip code, city, or state", async () => {
    const response = [
      {
        geometry: {
          type: "Point",
          coordinates: [-85.772732, 42.905948]
        },
        properties: {
          id: "ventura:e953cf2a5c7cbe18",
          gid: "openaddresses:address:ventura:e953cf2a5c7cbe18",
          layer: "address",
          source: "openaddresses",
          source_id: "ventura:e953cf2a5c7cbe18",
          name: "405 Howard St",
          housenumber: "405",
          street: "Howard St",
          accuracy: "point",
          label: "405 Howard St"
        }
      }
    ];
    await clsResponseToSearchResults(response);
    expect(mockPipLookup).toHaveBeenCalled();
  });
  it("does not call pipLookup for results with city, state, or zip", async () => {
    const response = [
      {
        geometry: {
          type: "Point",
          coordinates: [-85.772732, 42.905948]
        },
        properties: {
          id: "ventura:e953cf2a5c7cbe18",
          gid: "openaddresses:address:ventura:e953cf2a5c7cbe18",
          layer: "address",
          source: "openaddresses",
          source_id: "ventura:e953cf2a5c7cbe18",
          name: "405 Howard St",
          housenumber: "405",
          street: "Howard St",
          postalcode: "93003",
          accuracy: "point",
          label: "405 Howard St"
        }
      }
    ];
    await clsResponseToSearchResults(response);
    expect(mockPipLookup).not.toHaveBeenCalled();
  });
});
