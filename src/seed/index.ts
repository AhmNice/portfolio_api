import { configSeed } from "./config.seed.js";

const runAllSeeders = async () => {
  try {
    console.log("Starting all seeders...");
    await configSeed();
  } catch (error) {
    console.error("Error running seeders:", error);
  }
};
runAllSeeders();
