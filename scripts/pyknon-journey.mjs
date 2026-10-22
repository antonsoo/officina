// Current catalogue destination. Older receipts retain the tetrachord journey.
import { runJourneys } from "./ancient-journeys.mjs";
await runJourneys(process.argv[2], process.argv[3], "pyknon");
