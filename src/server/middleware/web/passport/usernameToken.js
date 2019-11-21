import cors from "cors";
import passport from "passport";
import passportCustom from "passport-custom";
const CustomStrategy = passportCustom.Strategy;
import {
  findUserByEmail,
  create,
  find,
  updateUserLoginTypes
} from "services/users";
import { getCompany } from "services/companies";
import { getClient } from "services/auth0";
import { statusActive, companyTermActive } from "helpers/auth";
import jwtVerify from "server/middleware/externalAPI/jwtVerify";
// store credentials here will be an api that goes to Reis Network to save the Reis credentials.
// import { storeCredentials } from "services/partnerCredentials";

const usernameAndTokenStrategy = "usernameToken";

/*
  Added localhost:8000 to allowed origins for development purposes for reis network demo page
  reconfigure when ready to deploy.
*/
const corsOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(/\s*,\s*/)
  : [];

export default function setupPassport(router) {
  const corsOptions = {
    origin: function(origin, callback) {
      if (origin === undefined || corsOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  };
  passport.use(usernameAndTokenStrategy, new CustomStrategy(verify));

  // CORS pre-flight support
  router.options("/usernameTokenLogin", cors(corsOptions));

  router.post(
    "/usernameTokenLogin",
    cors(corsOptions),
    jwtVerify,
    passport.authenticate(usernameAndTokenStrategy),
    function(req, res, next) {
      const { queryString } = req.body;
      const userId = req.user.id;
      if (!userId) {
        return res.status(409).send({
          error: "username and token does not relate to a user in the db"
        });
      }
      // this may be wrong
      req.logIn(req.user, function(err) {
        if (err) {
          return next(err);
        }
        const redirectUrl = `/${queryString || ""}`;
        req.session.previousUrl = undefined;
        return res.redirect(redirectUrl);
      });
    }
  );
}

async function verify(req, done) {
  const { username } = req.body;
  if (!username) {
    return done(null, false);
  }
  const clientId = req.user.azp;
  const client = getClient(clientId);
  const clientInstructions = {
    reis: async () => {
      // from reis, the user names are emails
      const email = username;
      const user = await findUserByEmail(email);
      if (user) {
        await updateUserLoginTypes(user, "reis");
        // commented out because go to Reis Network to save these credentials.
        // await storeCredentials(user.id, "reis", {
        //   token: process.env.DEFAULT_REIS_TOKEN,
        //   username
        // });
        if (!statusActive(user.status)) {
          return null;
        }
        const company = await getCompany(user.company_id);
        if (!companyTermActive(company)) {
          return null;
        }
        return user.id;
      }
      return null;
    },
    val: async () => {
      const email = username;
      const userId = await findOrRegisterUserByEmail(email);
      const user = await find(userId);
      await updateUserLoginTypes(user, "val");
      if (!statusActive(user.status)) {
        return null;
      }
      const company = await getCompany(user.company_id);
      if (!companyTermActive(company)) {
        return null;
      }
      return userId;
    }
  };
  const instructions = clientInstructions[client];
  let userId;
  if (instructions) {
    userId = await instructions();
  }
  if (userId) {
    return done(null, { id: userId });
  } else {
    return done(null, false);
  }
}

export async function findOrRegisterUserByEmail(email) {
  let user = await findUserByEmail(email);
  if (!user) {
    user = await create(email, null, "user");
  }
  return user.id;
}
