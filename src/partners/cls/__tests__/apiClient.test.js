import ApiClient from "../apiClient";

afterEach(() => {
  fetch.resetMocks();
});

describe("getLocationScores", () => {
  const query = "405 Howard Street San Francisco CA 94105";

  function subject() {
    const apiClient = new ApiClient();
    return apiClient.getGeoCodes(query);
  }

  describe("when response.status is 500", () => {
    beforeEach(() => {
      fetch.mockResponse("oh no", { status: 500 });
    });

    it("throws an error", () => {
      return expect(subject()).rejects.toThrow("oh no");
    });
  });

  describe("when response.status is 200", () => {
    const responseJson = {
      geocoding: {
        version: "0.2",
        attribution: "http://localhost:3107/attribution",
        query: {
          text: "405 howard street, pennsylvania",
          size: 10,
          sources: ["openaddresses"],
          private: false,
          lang: {
            name: "English",
            iso6391: "en",
            iso6393: "eng",
            defaulted: true
          },
          querySize: 20,
          parser: "addressit",
          parsed_text: {
            name: "405 howard street",
            admin_parts: "pennsylvania",
            number: "405",
            street: "howard street",
            state: "PA"
          }
        },
        engine: {
          name: "Pelias",
          author: "Mapzen",
          version: "1.0"
        },
        timestamp: 1553892467560
      },
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-76.196625, 40.682478]
          },
          properties: {
            id: "100660192_81203151:267268",
            gid: "openaddresses:address:100660192_81203151:267268",
            layer: "address",
            source: "openaddresses",
            source_id: "100660192_81203151:267268",
            name: "405 Howard Street",
            housenumber: "405",
            street: "Howard Street",
            postalcode: "17901",
            confidence: 1,
            match_type: "exact",
            accuracy: "point",
            region: "PA",
            region_gid: "whosonfirst:region:PA",
            locality: "Pottsville",
            locality_gid: "whosonfirst:locality:Pottsville",
            label: "405 Howard Street, Pottsville"
          }
        }
      ]
    };

    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(responseJson), { status: 200 });
    });

    it("makes a GET request to /v1/search using the query", async () => {
      await subject();
      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      expect(fetchUrl).toMatch(/\/v1\/search/);
      expect(fetchOptions).toMatchObject({
        method: "get"
      });
      expect(fetchOptions.headers.get("Content-Type")).toEqual(
        "application/json"
      );
      expect(fetchOptions.headers.get("Accept")).toEqual("application/json");
    });

    it("returns the data from the response", async () => {
      const result = await subject();
      expect(result[0]).toMatchObject({
        geometry: { coordinates: [-76.196625, 40.682478], type: "Point" },
        properties: {
          accuracy: "point",
          confidence: 1,
          gid: "openaddresses:address:100660192_81203151:267268",
          housenumber: "405",
          id: "100660192_81203151:267268",
          label: "405 Howard Street, Pottsville",
          layer: "address",
          locality: "Pottsville",
          locality_gid: "whosonfirst:locality:Pottsville",
          match_type: "exact",
          name: "405 Howard Street",
          postalcode: "17901",
          region: "PA",
          region_gid: "whosonfirst:region:PA",
          source: "openaddresses",
          source_id: "100660192_81203151:267268",
          street: "Howard Street"
        },
        type: "Feature"
      });
    });
  });
});

describe("getDmp", () => {
  const lat = 50;
  const long = 50;

  function subject() {
    const apiClient = new ApiClient();
    return apiClient.getDmp(lat, long);
  }

  describe("when response.status is 500", () => {
    beforeEach(() => {
      fetch.mockResponse("oh no", { status: 500 });
    });

    it("throws an error", () => {
      return expect(subject()).rejects.toThrow("oh no");
    });
  });

  describe("when response.status is 200", () => {
    const responseJson = [{ dmp_id: 1234 }];

    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(responseJson), { status: 200 });
    });

    it("makes a GET request to /geocode/boundary using the query", async () => {
      await subject();
      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      expect(fetchUrl).toMatch(/\/geocode\/boundary/);
      expect(fetchOptions).toMatchObject({
        method: "get"
      });
      expect(fetchOptions.headers.get("Content-Type")).toEqual(
        "application/json"
      );
      expect(fetchOptions.headers.get("Accept")).toEqual("application/json");
    });

    it("returns the data from the response", async () => {
      const result = await subject();
      expect(result).toEqual(responseJson[0].dmp_id);
    });
  });
});

describe("getLocationScoreObj", () => {
  const apn = 101010;

  function subject() {
    const apiClient = new ApiClient();
    return apiClient.getLocationScoreObj(apn);
  }

  describe("when response.status is 500", () => {
    beforeEach(() => {
      fetch.mockResponse("oh no", { status: 500 });
    });

    it("throws an error", () => {
      return expect(subject()).rejects.toThrow("oh no");
    });
  });

  describe("when response.status is 200", () => {
    const responseJson = [
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
      fetch.mockResponse(JSON.stringify(responseJson), { status: 200 });
    });

    it("makes a GET request to /geocode/locationscore using the query", async () => {
      await subject();
      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      expect(fetchUrl).toMatch(/\/locationscore/);
      expect(fetchOptions).toMatchObject({
        method: "get"
      });
      expect(fetchOptions.headers.get("Content-Type")).toEqual(
        "application/json"
      );
      expect(fetchOptions.headers.get("Accept")).toEqual("application/json");
    });

    it("returns the data from the response", async () => {
      const result = await subject();
      expect(result).toMatchObject({
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
      });
    });
  });
});

describe("healthCheck", () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  function subject() {
    const apiClient = new ApiClient();
    return apiClient.healthCheck();
  }

  describe("when response.status is 500", () => {
    beforeEach(() => {
      fetch.mockResponse("oh no", { status: 500 });
    });

    it("throws an error", () => {
      return expect(subject()).rejects.toThrow("oh no");
    });
  });

  describe("when response.status is 200", () => {
    beforeEach(() => {
      fetch.mockResponse(JSON.stringify({}), { status: 200 });
    });

    it("makes a GET request to /locationscore/scoremapping", async () => {
      await subject();
      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      expect(fetchUrl).toMatch(/\/locationscore\/scoremapping/);
      expect(fetchOptions).toMatchObject({ method: "get" });
      expect(fetchOptions.headers.get("Accept")).toEqual("application/json");
    });
  });
});
