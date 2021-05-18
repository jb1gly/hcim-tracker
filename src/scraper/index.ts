import hiscores from "osrs-json-hiscores";
import { Connection } from "typeorm";
import { insertPlayer, getPlayerByRSN, updatePlayer } from "../database";
import { Player } from "../database/entities/player.entity";
import { sendTweet } from "../twitter";
import names from "./list";

const run = async (conn: Connection) => {
  for (let i = 0; i < names.length; i++) {
    try {
      const stats = await fetchStats(names[i]);

      const player = await getPlayerByRSN(conn, names[i]);

      if (!player) {
        const player = new Player();

        player.rsn = names[i];
        player.mode = "hardcore";
        player.deironed = false;
        player.dead = false;
        player.skills = JSON.stringify(stats.skills);
        player.clues = JSON.stringify(stats.clues);
        player.bosses = JSON.stringify(stats.bosses);

        await addPlayerToDB(conn, player);
      } else {
        const resp = await diffStats(player, stats);

        await updatePlayer(conn, names[i], stats);

        if (
          Object.keys(resp.differences.skills).length > 0 ||
          Object.keys(resp.differences.clues).length > 0 ||
          Object.keys(resp.differences.bosses).length > 0
        ) {
          await sendTweet(resp);
        }
      }
    } catch (e) {
      // console.log(e);
    }
  }
};

const diffStats = async (
  player: Player,
  stats: Record<string, any>
): Promise<Record<string, any>> => {
  const playerStats = JSON.parse(player.skills);
  const apiStats = stats.skills;

  delete playerStats.overall;
  delete apiStats.overall;

  let differences: Record<string, any> = {
    skills: {},
    clues: {},
    bosses: {},
  };

  Object.keys(apiStats).forEach((key: string) => {
    if (apiStats[key].xp - playerStats[key].xp) {
      differences.skills[key] = apiStats[key].xp - playerStats[key].xp;
    }
  });

  const playerClues = JSON.parse(player.clues);
  const apiClues = stats.clues;

  delete playerClues.all;
  delete apiClues.all;

  Object.keys(apiClues).forEach((key) => {
    if (apiClues[key].score > playerClues[key].score) {
      differences.clues[key] = apiClues[key].score - playerClues[key].score;
    }
  });

  const playerBosses = JSON.parse(player.bosses);
  const apiBosses = stats.bosses;

  Object.keys(apiBosses).forEach((key) => {
    if (apiBosses[key].score > playerBosses[key].score) {
      differences.bosses[key] = apiBosses[key].score - playerBosses[key].score;
    }
  });

  return {
    rsn: player.rsn,
    differences,
  };
};

const fetchStats = async (rsn: string): Promise<Record<string, any>> => {
  const stats = await hiscores.getStatsByGamemode(rsn, "hardcore");

  return stats;
};

const addPlayerToDB = async (
  connection: Connection,
  player: Player
): Promise<void> => {
  await insertPlayer(connection, player);
};

export { run };
