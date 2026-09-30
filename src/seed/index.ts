import { adminSeed } from "./admin.seed.js";
import { configSeed } from "./config.seed.js";

const runAllSeeders = async () => {
  try {
    console.log("Starting all seeders...");
    await Promise.all([configSeed(), adminSeed()]);
  } catch (error) {
    console.error("Error running seeders:", error);
  }
};
runAllSeeders();
