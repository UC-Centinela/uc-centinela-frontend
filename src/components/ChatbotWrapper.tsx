'use client'

import dynamic from "next/dynamic";

// Importar el chatbot solo en el cliente
const FlowiseChatbot = dynamic(() => import("./FlowiseChatbot"), {
  ssr: false,
  loading: () => null
});

export default function ChatbotWrapper() {
  return <FlowiseChatbot />
}
