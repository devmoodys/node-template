import { Factory } from "rosie";
import * as faker from "faker";

export const propertyFactory = Factory.define("clsProperty")
  .attr("lat", () => faker.address.latitude())
  .attr("lon", () => faker.address.longitude())
  .attr("locationScoreObj", () => ({
    cre_of: faker.random.number(1000),
    cre_in: faker.random.number(1000),
    cre_rt: faker.random.number(1000),
    cre_ho: faker.random.number(1000),
    cre: faker.random.number(1000),
    cre_mf: faker.random.number(1000),
    prp_typ: faker.random.arrayElement(["OF", "MF", "IN", "RT", "LO"]),
    trnsprt: faker.random.number(1000),
    amenity: faker.random.number(1000),
    safety: faker.random.number(1000),
    economc: faker.random.number(1000),
    sptl_dm: faker.random.number(1000),
    vitalty: faker.random.number(100),
    trnsprt_percentile: faker.random.number(100),
    amenity_percentile: faker.random.number(100),
    msa: faker.random.number(10000),
    cre_percentile: faker.random.number(100),
    safety_percentile: faker.random.number(100),
    economc_percentile: faker.random.number(100),
    sptl_dm_percentile: faker.random.number(100),
    vitalty_percentile: faker.random.number(100)
  }));
