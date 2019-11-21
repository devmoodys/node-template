import { JsonApiClient } from "systems/fetch";

const AUTH0_ISSUER = process.env.AUTH0_ISSUER;

export default class AuthenticationClient {
  constructor() {
    this.client = new JsonApiClient(AUTH0_ISSUER);
  }

  authenticate = async () => {
    const response = await this.client.post("/oauth/token/", {
      client_id: process.env.CLS_CLIENT_ID,
      client_secret: process.env.CLS_CLIENT_SECRET,
      audience: process.env.METROPOLIS_URL.replace(/\/$/, ""),
      grant_type: "client_credentials"
    });
    const result = await response.json();
    return result.access_token;
  };
}
