const PostgresConnectionStringParser = require('pg-connection-string');

const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

const connectionOptions = PostgresConnectionStringParser.parse(
  `${process.env.DATABASE_URL}`
);

module.exports = [
  {
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: ['./src/models/*.ts'],
    migrations: ['./src/database/migrations/*.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    cli: {
      migrationsDir: './src/database/migrations',
    },
  },
  {
    name: 'seed',
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.username,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: ['./src/models/*.ts'],
    migrations: ['./src/database/seeds/*.ts'],
    cli: {
      migrationsDir: './src/database/seeds',
    },
  },
];
