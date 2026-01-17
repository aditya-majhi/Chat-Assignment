import { tool } from "ai";
import axios from "axios";
import { z } from "zod";

const f1RaceDetailsTool = tool({
    description: "Get the upcoming F1 race details.",
    inputSchema: z.object({}),
    execute: async () => {
        const raceData = await axios.get(`http://api.jolpi.ca/ergast/f1/current/races`);
        console.log({ raceData: raceData.data });
        return {
            raceData: raceData.data.MRData.RaceTable.Races[0]
        }
    },
});

export default f1RaceDetailsTool;