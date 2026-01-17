import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import f1RaceDetailsTool from "@/tools/f1";
import stockPriceTool from "@/tools/stock";
import weatherDetailsTool from "@/tools/weather";
import { generateId, generateText, stepCountIs, streamText, } from "ai";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { google } from '@ai-sdk/google'

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userChats = await db.select().from(chats).where(eq(chats.userId, session.user.id));

        return new Response(JSON.stringify(userChats), { status: 200 });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { chatId, userMessage } = await request.json();

        let currChatId = chatId;

        if (!chatId) {
            currChatId = generateId();

            await db.insert(chats).values({
                id: currChatId,
                userId: session.user.id,
                title: userMessage.length > 20 ? userMessage.substring(0, 20) + "..." : userMessage,
            });
        }

        const { text: aiResponse, steps } = await generateText({
            model: google("gemini-2.5-flash"),
            system:
                "You are a helpful assistant. Use the available tools when appropriate.",
            messages: [
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            tools: {
                getWeather: weatherDetailsTool,
                getStockPrice: stockPriceTool,
                getF1Race: f1RaceDetailsTool
            },
            onStepFinish: async ({ text, toolCalls, toolResults }) => {
                console.log({ text, toolCalls, toolResults: toolResults[0]?.output });

                if (text?.length) {
                    await db.insert(messages).values({
                        id: generateId(),
                        conversationId: currChatId!,
                        content: text,
                        role: "assistant",
                        kind: "text",
                        createdAt: new Date(),
                    });
                } else if (toolCalls?.length && toolResults?.length) {
                    await db.insert(messages).values({
                        id: generateId(),
                        conversationId: currChatId!,
                        content: toolResults[0]?.output,
                        role: "assistant",
                        kind: "tool",
                        toolName: toolCalls[0]?.toolName,
                        createdAt: new Date(),
                    });
                }

            }
        });

        console.log({ steps, aiResponse });

        return new Response(
            JSON.stringify({
                chatId: currChatId,
                message: aiResponse,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error processing chat message:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}