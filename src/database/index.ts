import { Connection } from "typeorm";
import { Player } from "./entities/player.entity";

const seedRecord = async (connection: Connection) => {
  const entityManager = connection.manager;

  const record = await entityManager.find(Player);
};

const getPlayerByRSN = async (
  connection: Connection,
  rsn: string
): Promise<Player | undefined> => {
  const entityManager = connection.manager;

  const record = await entityManager.findOne(Player, { where: { rsn } });

  return record ? record : undefined;
};

const insertPlayer = async (
  connection: Connection,
  player: Player
): Promise<Player> => {
  const entityManager = connection.manager;

  const response = await entityManager.save(player);

  return response;
};

const updatePlayer = async (
  conn: Connection,
  rsn: string,
  stats: Record<string, any>
): Promise<Player | undefined> => {
  const entityManager = conn.manager;
  let dbPlayer = await getPlayerByRSN(conn, rsn);

  let newPlayerProps: Record<string, any> = {
    skills: JSON.stringify(stats.skills),
    clues: JSON.stringify(stats.clues),
    bosses: JSON.stringify(stats.bosses),
  };

  dbPlayer = {
    ...dbPlayer,
    ...newPlayerProps,
  } as Player;

  const resp = await entityManager.save(Player, dbPlayer);

  return resp ? resp : undefined;
};

export { seedRecord, insertPlayer, getPlayerByRSN, updatePlayer };
