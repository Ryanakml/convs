"use client";

import { useVapi } from "@/modules/widgets/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    startCall,
    endCall,
    transcriptMessages,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">WIDGET APPS</h1>
        <Button onClick={() => startCall()}>Start Call</Button>
        <Button onClick={() => endCall()}>End Call</Button>
        <p>{`isConnected: ${isConnected}`}</p>
        <p>{`isConnecting: ${isConnecting}`}</p>
        <p>{`isSpeaking: ${isSpeaking}`}</p>
        <p>{`user: ${JSON.stringify(transcriptMessages, null, 2)}`}</p>
      </div>
    </div>
  );
}
