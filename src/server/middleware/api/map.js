import { getAddressesFromLatLong } from "services/map";
import geoip from "geoip-lite";

export async function reverseGeocode(req, res) {
  const { partner } = req.params;
  const { lat, long, map_dmp_id } = req.query;
  if (partner === "cls" && !map_dmp_id) {
    return res.status(409).send({ error: "map_dmp_id is required for cls" });
  }
  const addresses = await getAddressesFromLatLong(
    lat,
    long,
    partner,
    map_dmp_id
  );
  res.json(addresses);
}

export async function getUserLatLong(req, res) {
  const { clientIp } = req.query;
  const locationDetails = await geoip.lookup(clientIp);
  const [lat, lon] = locationDetails.ll;
  res.json({ lat, lon });
}
