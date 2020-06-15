const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

module.exports = [
  {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'tm_food2',
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
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'tm_food2',
    entities: ['./src/models/*.ts'],
    migrations: ['./src/database/seeds/*.ts'],
    cli: {
      migrationsDir: './src/database/seeds',
    },
  },
];
