import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import { ContactPanel } from "../components/contact-panel";

export const ConversationIdLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
      <ResizablePanel defaultSize={60} className="h-full">
        <div className="flex flex-1 h-full flex-col">{children}</div>
        <ResizableHandle className="hidden lg:block" />
      </ResizablePanel>
      <ResizablePanel
        defaultSize={40}
        maxSize={40}
        minSize={20}
        className="hidden lg:block"
      >
        <ContactPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
