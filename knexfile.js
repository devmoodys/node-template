// require("./config/dotenv.js");
module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev"
    }
  },
  // test: {
  //   client: "pg",
  //   connection: process.env.TEST_DATABASE_URL,
  //   migrations: {
  //     directory: "./db/migrations"
  //   },
  //   seeds: {
  //     directory: "./db/seeds/dev"
  //   }
  // },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/prod"
    }
  }
};
