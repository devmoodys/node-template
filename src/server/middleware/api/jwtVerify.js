import { find } from "services/users";
import logger from "systems/logger";

export default function jwtVerify(jwtPayload, done) {
  find(jwtPayload.id)
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        done(null, false, { message: "No such user" });
      }
    })
    .catch(error => {
      logger.error(error.stack);
      done(null, false);
    });
}
