import { merge } from "ramda";

import { isConnectionHealthy, getEntity, search } from "partners/cls";

const mockGetGeoCodes = jest.fn();
const mockGetDmp = jest.fn();
const mockGetLocationScoreObj = jest.fn();
const mockHealthCheck = jest.fn();
const mockSearch = jest.fn();

jest.mock("partners/cls/apiClient", () => {
  return jest.fn().mockImplementation(() => ({
    getGeoCodes: mockGetGeoCodes,
    getDmp: mockGetDmp,
    getLocationScoreObj: mockGetLocationScoreObj,
    healthCheck: mockHealthCheck,
    search: mockSearch
  }));
});

jest.mock("partners/cls/helpers", () => {
  return {
    clsResponseToSearchResults: jest.fn(),
    clsPropertyToInterchangeFormat: jest.fn()
  };
});

jest.mock("services/search/queries", () => {
  return {
    getAllQueries: jest.fn()
  };
});

describe("getEntity", () => {
  const mockClsPropertyToInterchangeFormat = require("partners/cls/helpers")
    .clsPropertyToInterchangeFormat;

  const userId = "123";

  const property = JSON.stringify({
    streetAddress: "405 Howard Street",
    city: "San Francisco",
    state: "CA",
    zip: 94105,
    lat: 37.7891426227,
    lon: -122.3951069219,
    reisId: "noReisId"
  });

  const geoCodesResponse = [
    {
      rating: 0,
      lat: 37.7891426227,
      lon: -122.3951069219,
      stno: 405,
      street: "Howard",
      styp: "St",
      city: "San Francisco",
      st: "CA",
      zip: "94105"
    }
  ];
  const dmpResponse = "3703730";

  const locationScoreResponse = [
    {
      apn: "3737030",
      fips: null,
      dmp_id: null,
      loc_id: null,
      prp_typ: "OF",
      description: "Office",
      muni_de: null,
      muni_co: null,
      uc_std: null,
      uc_std_: null,
      uc_ctgr: 3,
      uc_ctgr_: null,
      cre: 840,
      cre_of: 840,
      cre_mf: 845,
      cre_in: 880,
      cre_rt: 897,
      cre_ho: 852,
      bsnss_s: 901,
      bc_prdc: 915,
      servics: 931,
      fire: 927,
      trade: 933,
      ci_othr: 925
    }
  ];

  beforeEach(() => {
    mockGetGeoCodes.mockReturnValue(Promise.resolve(geoCodesResponse));
    mockGetDmp.mockReturnValue(Promise.resolve(dmpResponse));
    mockGetLocationScoreObj.mockReturnValue(
      Promise.resolve(locationScoreResponse[0])
    );
  });

  function subject() {
    return getEntity(userId, "property", property);
  }

  it("makes 2 API calls to get the data", async () => {
    await subject();
    expect(mockGetDmp).toHaveBeenCalledWith(37.7891426227, -122.3951069219);
    expect(mockGetLocationScoreObj).toHaveBeenCalledWith(dmpResponse);
  });

  it("combines and returns the data using clsPropertyToInterchangeFormat", async () => {
    mockClsPropertyToInterchangeFormat.mockReturnValue("interchangeEntity");
    const entity = await subject();

    expect(entity).toEqual("interchangeEntity");
    const propertyWithLocationScoreObj = merge(JSON.parse(property), {
      locationScoreObj: locationScoreResponse[0]
    });
    expect(mockClsPropertyToInterchangeFormat).toHaveBeenCalledWith(
      propertyWithLocationScoreObj
    );
  });
});

describe("isConnectionHealthy", () => {
  it("calls cls api healthCheck", async () => {
    await isConnectionHealthy(123);
    expect(mockHealthCheck).toHaveBeenCalled();
  });

  describe("when health check is successful", () => {
    beforeEach(() => {
      mockHealthCheck.mockReturnValue(Promise.resolve({}));
    });

    it("returns true", async () => {
      expect(await isConnectionHealthy(123)).toEqual(true);
    });
  });

  describe("when health check fails", () => {
    const error = new Error("Something went horribly wrong");
    beforeEach(() => {
      mockHealthCheck.mockReturnValue(Promise.reject(error));
    });

    it("returns false", async () => {
      expect(await isConnectionHealthy(123)).toEqual(false);
    });
  });
});

describe("search", () => {
  const mockCLSResponseToSearchResults = require("partners/cls/helpers")
    .clsResponseToSearchResults;
  const mockGetAllQueries = require("services/search/queries").getAllQueries;

  const userId = 123;
  const query = "405 Howard Street San Francisco CA 94105";

  const geoCodesResponse = [
    {
      rating: 0,
      lon: -122.3951069219,
      lat: 37.7891426227,
      stno: 405,
      street: "Howard",
      styp: "St",
      city: "San Francisco",
      st: "CA",
      zip: "94105"
    }
  ];

  function subject() {
    return search(userId, query);
  }

  beforeEach(() => {
    mockGetGeoCodes.mockReturnValue(Promise.resolve(geoCodesResponse));
    mockGetAllQueries.mockReturnValue([query]);
  });

  it("calls cls api getGeoCodes", async () => {
    await subject();
    expect(mockGetGeoCodes).toHaveBeenCalled();
  });

  it("calls cls helper function clsResponseToSearchResults with response from getGeoCodes", async () => {
    await subject();
    expect(mockCLSResponseToSearchResults).toHaveBeenCalledWith(
      geoCodesResponse
    );
  });
});
