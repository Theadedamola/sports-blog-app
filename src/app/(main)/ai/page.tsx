import type { Metadata } from "next";
import { AIChatClient } from "./AIChatClient";

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description:
    "Chat with our AI football analyst. Get predictions, team comparisons, and match insights.",
};

export default function AIChatPage() {
  return <AIChatClient />;
}
