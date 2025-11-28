import { ConversationsLayouts } from "@/modules/dashboard/ui/layouts/conversations-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ConversationsLayouts>{children}</ConversationsLayouts>;
}
