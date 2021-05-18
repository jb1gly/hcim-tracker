import { run } from "./scraper/index";
import createDB from "./database/connection";
import * as CronJob from "cron";
import { Connection } from "typeorm";

let connection: Connection;

const setup = async () => {
  connection = await createDB();
  new CronJob.CronJob(
    // "* * * * *", // for testing purposes, start the job every minute
    "*/20 * * * *",
    () => init(),
    null,
    true,
    "America/Los_Angeles"
  );
  // init(); // for testing purposes, start the job and run it once
};

async function init() {
  console.log("Starting job");
  run(connection);
}

setup();
