import { getCLSDataFromAddress, getCLSDataFromLatLong } from "partners/cls";
import { getClient } from "services/auth0";

export async function getCLSBadgeInternal(request, response) {
  const { address } = request.query;
  if (!address) {
    return response.status(409).send({ error: "invalid input!" });
  }
  const data = await getCLSDataFromAddress(address);
  if (!data) {
    return response.status(409).send({ error: "No cls data!" });
  }
  response.json(data);
}

export async function getCLSBadge(request, response) {
  const clientId = request.user.azp;
  const client = getClient(clientId);
  const { address } = request.query;
  const data = await getCLSDataFromAddress(address);
  if (!data) {
    return response.status(409).send({ error: "No cls data!" });
  }
  response.json({ ...data, clientRequesting: client });
}

export async function getCLSBadgeFromLatLong(request, response) {
  const clientId = request.user.azp;
  const client = getClient(clientId);
  const { lat, long } = request.query;
  const data = await getCLSDataFromLatLong(lat, long);
  if (!data) {
    return response.status(409).send({ error: "No cls data!" });
  }
  response.json({ ...data, clientRequesting: client });
}
