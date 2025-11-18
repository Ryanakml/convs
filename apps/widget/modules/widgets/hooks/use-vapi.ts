import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessages {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptMessages, setTranscriptMessages] = useState<
    TranscriptMessages[]
  >([]);

  useEffect(() => {
    const vapiInstance = new Vapi("05a6ecd3-3ac8-48c5-b0c3-971aba71d0e6");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnecting(false);
      setIsConnected(true);
      setTranscriptMessages([]);
    });

    vapiInstance.on("call-end", () => {
      setIsConnecting(false);
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
      setIsConnecting(false);
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscriptMessages((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = () => {
    setIsConnecting(true);

    if (vapi) {
      vapi.start("efd30a3a-4cea-498a-a3fd-ac59c07c46bf");
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    startCall,
    endCall,
    transcriptMessages,
  };
};
