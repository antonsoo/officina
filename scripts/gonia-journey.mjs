// Current catalogue destination. Older receipts retain the Doric-corner journey.
import { runJourneys } from "./ancient-journeys.mjs";
await runJourneys(process.argv[2], process.argv[3], "gonia");
