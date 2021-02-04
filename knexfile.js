require("dotenv").config({path: ".env.local"});
const path = require("path");

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, "models/migrations")
    },
    seeds: {
      directory: path.join(__dirname, "models/seeds")
    }
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "models/testdb.sqlite")
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "models/migrations")
    },
    seeds: {
      directory: path.join(__dirname, "models/seeds")
    }
  },
  production: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
