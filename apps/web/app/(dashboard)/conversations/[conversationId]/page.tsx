import { ConversationIdView } from "@/modules/dashboard/ui/view/conversation-id-view";
import { Id } from "@workspace/backend/_generated/dataModel";

const page = async ({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) => {
  const { conversationId } = await params;
  return (
    <ConversationIdView
      conversationId={conversationId as Id<"conversations">}
    />
  );
};

export default page;
