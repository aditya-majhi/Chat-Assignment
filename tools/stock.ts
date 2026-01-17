import { tool } from "ai";
import axios from "axios";
import { z } from "zod";

const stockPriceTool = tool({
    description: "Get the current stock price for a specific company by it's symbol.",
    inputSchema: z.object({
        symbol: z.string().describe("The stock symbol of the company, e.g., AAPL for Apple."),
    }),
    execute: async ({ symbol }) => {
        console.log({ symbol });

        const stockData = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);

        console.log({ stockData: stockData.data });

        return {
            stockData: stockData.data["Global Quote"]
        }
    }
})

export default stockPriceTool;
