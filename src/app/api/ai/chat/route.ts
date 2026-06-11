import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT_CHAT } from "@/lib/ai/prompts";
import { fetchMatches } from "@/lib/api/fetchers";
import type { Match } from "@/types/api";
import fs from "fs";
import path from "path";

// ── Manual Environment Variable Resolver ──────

function getOpenRouterApiKey(): string | undefined {
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  // Force loading from .env.local directly to bypass Next.js environment cache
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^OPENROUTER_API_KEY\s*=\s*(.*)$/m);
      if (match && match[1]) {
        const val = match[1].trim();
        // Remove quotes if present
        return val.replace(/^["']|["']$/g, "");
      }
    }
  } catch (err) {
    console.error("Error manually reading .env.local:", err);
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { messages: rawMessages, message, history, blogContext } = await req.json();

    let messages = rawMessages;
    if (!messages && message) {
      messages = [
        ...(Array.isArray(history) ? history : []),
        { role: "user", content: message }
      ];
    }

    // Fetch active matches from API/fetchers layer
    const matches = await fetchMatches("football");

    // Format matches into structured context
    const matchesContext = matches
      .map((m) => {
        const isLive = m.status === "live" || m.status === "halftime";
        const isFinished = m.status === "finished";
        const isScheduled = m.status === "scheduled";

        let statusStr = "";
        if (isLive) statusStr = `LIVE (${m.minute}')`;
        else if (isFinished) statusStr = "FINISHED (FT)";
        else if (isScheduled) statusStr = `SCHEDULED (Starts: ${m.startTime})`;

        return `- **${m.homeTeam.name} vs ${m.awayTeam.name}** (${m.league.name})
  Match ID: ${m.id}
  Status: ${statusStr}
  Score: ${isScheduled ? "Not Started" : `${m.score.home} - ${m.score.away}`}
  Country: ${m.league.country}`;
      })
      .join("\n\n");

    let blogPromptContext = "";
    if (blogContext && blogContext.title) {
      blogPromptContext = `
---
READER'S BLOG ARTICLE CONTEXT:
The user is currently reading the following sports blog article. Direct your responses towards analyzing and discussing this specific post, its concepts, and the tactical formations described within:
- **Title**: ${blogContext.title}
- **Summary**: ${blogContext.summary}
- **Content**:
${blogContext.content}
---`;
    }

    const systemPromptContext = `${SYSTEM_PROMPT_CHAT}
${blogPromptContext}

ADDITIONAL CONTEXT (TODAY'S TOURNAMENT GAMES):
Below is the live, active list of all football matches playing today, including scores, minute, status, and leagues. Always refer to these specific matches and stats when answering the user's questions. Avoid saying "I don't have access to today's matches" because they are fully provided to you here.

${matchesContext}`;

    // Resolve API key manually to bypass Next.js process cache
    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Using dynamic fallback response.");
      return NextResponse.json(
        {
          content: generateFallbackResponse(messages, matches, blogContext),
        },
        { status: 200 }
      );
    }

    // ── Resilient Fallback Model Retries ──
    const modelsToTry = [
      "openrouter/free",
      "z-ai/glm-4.5-air:free",
      "stepfun/step-3.5-flash:free",
      "tngtech/deepseek-r1t-chimera:free",
    ];

    let content = "";
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        console.log(`[AI Chat] Attempting query with model: ${model}`);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "SportsFC AI",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPromptContext },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Detect API provider rate limit errors wrapped inside a 200 OK
          if (data.error) {
            console.warn(`[AI Chat] OpenRouter returned 200 OK error for model ${model}:`, data.error);
            lastError = data.error;
            continue; // Retry with next model!
          }

          content = data.choices?.[0]?.message?.content || "";
          if (content) {
            console.log(`[AI Chat] Successfully generated response using model: ${model}`);
            break; // Stop retrying on success!
          }
        } else {
          const errorText = await response.text();
          console.warn(`[AI Chat] Model ${model} HTTP failed:`, errorText);
          try {
            const errObj = JSON.parse(errorText);
            lastError = errObj.error || errObj;
          } catch {
            lastError = errorText;
          }
        }
      } catch (err) {
        console.error(`[AI Chat] Network error with model ${model}:`, err);
        lastError = err;
      }
    }

    // If all models failed or were rate-limited, fall back to our premium dynamic generator
    if (!content) {
      console.warn("[AI Chat] All OpenRouter models were rate-limited or failed. Falling back to dynamic generator.", lastError);
      return NextResponse.json(
        {
          content: generateFallbackResponse(messages, matches, blogContext),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { content: "An error occurred. Please try again." },
      { status: 200 }
    );
  }
}

// Fallback response when OpenRouter key is not set or rate-limited
function generateFallbackResponse(
  messages: { role: string; content: string }[],
  matches: Match[],
  blogContext?: { title: string; summary: string; content: string }
): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  if (blogContext && blogContext.title) {
    if (
      lastMessage.includes("st etienne") ||
      lastMessage.includes("etienne") ||
      lastMessage.includes("block") ||
      lastMessage.includes("nice") ||
      lastMessage.includes("tactical")
    ) {
      return `### Tactical Dissection: St Etienne's 4-5-1 Transition Block

In the article **"${blogContext.title}"**, Marc Debusschere outlines a masterclass in modern spatial neutralization:

1. **Midfield Compactness**: By collapsing into a central 5-man screen, St Etienne locked Nice's pivots out of the central channels.
2. **Defensive Stepping**: St Etienne's central defenders aggressively stepped into the half-spaces when Nice attempted to turn, forcing backward rotations.

This matches our real-time tactical Scout profile. Do you think Nice's full-backs pushed too high during these sequences?`;
    }

    if (
      lastMessage.includes("half-space") ||
      lastMessage.includes("space") ||
      lastMessage.includes("overload")
    ) {
      return `### Tactical Concept: Overloading the Half-Spaces

As analyzed in **"${blogContext.title}"**, half-spaces are key attacking territory:
- The **half-spaces** are the vertical channels situated between the central channel and the wide flanks.
- By moving advanced midfielders and wingers into these zones, an attacking team forces the opposing full-backs and center-backs into a cognitive overload—they must decide who leaves their line to press the ball, opening up diagonal gaps.`;
    }

    if (
      lastMessage.includes("pressing") ||
      lastMessage.includes("trap") ||
      lastMessage.includes("wing-back")
    ) {
      return `### Tactical Concept: High-Intensity Pressing Traps

According to performance analytics:
- A **pressing trap** is a deliberate defensive tactic designed to funnel the opposition into a highly compact, restricted zone (usually the wide sideline) before aggressively closing them down.
- **Wing-backs** act as the pressing triggers: they slide up to press the wide defender while their midfield teammates shift across to lock all passing exits.`;
    }

    return `I am your AI Analyst! I am currently analyzing the article: **"${blogContext.title}"**.

You can ask me to break down St Etienne's 4-5-1 formations, define half-space overloads, or discuss modern wing-back pressing traps mentioned in this publication!`;
  }

  if (
    lastMessage.includes("game") ||
    lastMessage.includes("match") ||
    lastMessage.includes("play") ||
    lastMessage.includes("live") ||
    lastMessage.includes("schedule")
  ) {
    const live = matches.filter((m) => m.status === "live" || m.status === "halftime");
    const upcoming = matches.filter((m) => m.status === "scheduled");
    const fallbackMatches = live.length === 0 && upcoming.length === 0 ? matches.slice(0, 5) : [];
    let responseText = `Here is today's match schedule on **SportsFC**:\n\n`;

    if (live.length > 0) {
      responseText += `🔴 **Live Now:**\n`;
      live.forEach((m) => {
        responseText += `- **${m.homeTeam.name} vs ${m.awayTeam.name}** (${m.score.home}-${m.score.away}) in the ${m.league.name}\n`;
      });
      responseText += `\n`;
    }

    if (upcoming.length > 0) {
      responseText += `📅 **Upcoming Fixtures:**\n`;
      upcoming.slice(0, 5).forEach((m) => {
        responseText += `- **${m.homeTeam.name} vs ${m.awayTeam.name}** (${m.league.name}) - starts at ${new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
      });
    }

    if (fallbackMatches.length > 0) {
      responseText += `📋 **All Available Matches:**\n`;
      fallbackMatches.forEach((m) => {
        const status =
          m.status === "finished"
            ? `FT (${m.score.home}-${m.score.away})`
            : m.status === "scheduled"
              ? `starts at ${new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : m.status === "live" || m.status === "halftime"
                ? `${m.status.toUpperCase()} (${m.minute}')`
                : m.status.replace(/_/g, " ");
        responseText += `- **${m.homeTeam.name} vs ${m.awayTeam.name}** (${m.league.name}) - ${status}\n`;
      });
    }

    if (live.length === 0 && upcoming.length === 0 && fallbackMatches.length === 0) {
      return `Here is today's match schedule on **SportsFC**:\n\nNo live, upcoming, or recent football matches are available right now.`;
    }

    return responseText.trimEnd();
  }

  return `I'm SportsFC AI, your expert tournament assistant! 🤖⚽

I am currently tracking **${matches.length} matches** across various leagues.

You can ask me about live match stats, head-to-head history, team forms, and match details. How can I help you today?`;
}
