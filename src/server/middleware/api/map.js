import geoip from "geoip-lite";

export async function getUserLatLong(req, res) {
  const { clientIp } = req.query;
  const locationDetails = await geoip.lookup(clientIp);
  const [lat, lon] = locationDetails.ll;
  res.json({ lat, lon });
}
