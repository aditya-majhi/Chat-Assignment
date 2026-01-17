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
            stockData: {
                symbol: stockData.data["Global Quote"]["01. symbol"],
                price: stockData.data["Global Quote"]["05. price"],
                volume: stockData.data["Global Quote"]["06. volume"],
                latestTradingDay: stockData.data["Global Quote"]["07. latest trading day"],
            }
        }
    }
})

export default stockPriceTool;
