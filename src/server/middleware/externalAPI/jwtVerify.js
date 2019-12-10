import jwt from "express-jwt";
import jwks from "jwks-rsa";

const jwtVerify = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
  }),
  audience: process.env.METROPOLIS_URL.replace(/\/$/, ""),
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"]
});

export default jwtVerify;
