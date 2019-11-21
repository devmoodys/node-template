module.exports = {
  database: {
    connection:
      process.env.NODE_ENV == "test" ? "TEST_DATABASE_URL" : "DATABASE_URL"
  }
};
