import ApiClient from "server/middleware/externalAPI/v1/apiClient";
import { propertyToAddress, extractId } from "services/map";
import { sendEmailToSetupCLSUser } from "services/email/email";
import { getClient } from "services/auth0";
import {
  changePassword,
  checkTemporaryPassword,
  findUserByEmail
} from "services/users";

export async function geoCode(req, res) {
  const { index } = req.params;
  const { query } = req.query;

  const apiClient = new ApiClient();
  const features = await apiClient.getGeoCodes(query, index);
  let properties = [];
  features.forEach(feature => {
    const [lon, lat] = feature.geometry.coordinates;
    const address = propertyToAddress(feature.properties);
    const { dmp_id, reis_id } = extractId(feature.properties.id);
    const operations = {
      cls: () => properties.push({ id: dmp_id, reis_id, address, lat, lon }),
      reis: () => properties.push({ id: reis_id, dmp_id, address, lat, lon })
    };
    operations[index]();
  });
  res.json(properties);
}

export async function reverseGeoCode(req, res) {
  const { index } = req.params;
  const { lat, long, radius } = req.query;
  const apiClient = new ApiClient();
  const response = await apiClient.reverseGeoCode(lat, long, radius, index);
  const properties = [];
  response.features.forEach(feature => {
    const [lon, lat] = feature.geometry.coordinates;
    const address = propertyToAddress(feature.properties);
    const { dmp_id, reis_id } = extractId(feature.properties.id);
    const operations = {
      cls: () => properties.push({ id: dmp_id, reis_id, address, lat, lon }),
      reis: () => properties.push({ id: reis_id, dmp_id, address, lat, lon })
    };
    operations[index]();
  });
  res.json(properties);
}

export async function emailSalesToSetupCLSUser(req, res) {
  const { username } = req.body;
  const clientId = req.user.azp;
  const client = getClient(clientId);
  await sendEmailToSetupCLSUser(username, client);
  res.sendStatus(200);
}

export async function resetPassword(req, res) {
  const { email, tempPassword, newPassword } = req.body;
  const user = await findUserByEmail(email);
  if (!newPassword.match(/^[a-zA-Z0-9]{8,}$/)) {
    return res.status(409).send({
      error:
        "password must only contain alphanumeric characters and be longer than 8 characters"
    });
  }
  if (!user) {
    return res.status(409).send({ error: "error occurred!" });
  }
  const authorized = await checkTemporaryPassword(user.id, tempPassword);
  if (!authorized) {
    return res
      .status(409)
      .send({ error: "password reset link is invalid or has expired" });
  }
  await changePassword(user.id, newPassword);
  res.sendStatus(200);
}
