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
    entities: [
      `./${process.env.ENVIRONMENT_FOLDER}/models/*.${process.env.ENVIRONMENT_FILES}`,
    ],
    migrations: [
      `./${process.env.ENVIRONMENT_FOLDER}/database/migrations/*.${process.env.ENVIRONMENT_FILES}`,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    cli: {
      migrationsDir: `./${process.env.ENVIRONMENT_FOLDER}/database/migrations`,
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
    entities: [
      `./${process.env.ENVIRONMENT_FOLDER}/models/*.${process.env.ENVIRONMENT_FILES}`,
    ],
    migrations: [
      `./${process.env.ENVIRONMENT_FOLDER}/database/seeds/*.${process.env.ENVIRONMENT_FILES}`,
    ],
    cli: {
      migrationsDir: `./${process.env.ENVIRONMENT_FOLDER}/database/seeds`,
    },
  },
];
