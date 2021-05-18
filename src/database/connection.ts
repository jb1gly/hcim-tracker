import { Connection, createConnection } from "typeorm";
import { Player } from "./entities/player.entity";

const createDB = async (): Promise<Connection> => {
  const connection: Connection = await createConnection({
    type: "sqlite",
    database: "./db.sql",
    entities: [Player],
    logging: false,
    logger: "simple-console",
    synchronize: true,
  });

  return connection;
};

export default createDB;
