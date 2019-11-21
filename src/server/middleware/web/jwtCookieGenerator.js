import { sign } from "jsonwebtoken";

export default function jwtCookieGenerator(request, response, next) {
  const jwtPayload = {};

  if (request.user) {
    jwtPayload["id"] = request.user.id;
  }
  const jwt = sign(jwtPayload, process.env.JWT_KEY);
  response.cookie("metropolis-jwt", jwt);

  next();
}
