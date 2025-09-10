import { useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { toast } from "./use-toast";

export const useForumNotifications = () => {
  const { socket, on, off } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for new discussions
      const handleNewDiscussion = (data: { title: string; author: string }) => {
        toast({
          title: "New Discussion",
          description: `${data.author} started a new discussion: "${data.title}"`,
          duration: 5000,
        });
      };

      // Listen for new replies to discussions you're following
      const handleNewReply = (data: {
        discussionTitle: string;
        author: string;
        content: string;
        discussionId: string;
      }) => {
        toast({
          title: "New Reply",
          description: `${data.author} replied to "${data.discussionTitle}"`,
          duration: 5000,
          action: (
            <button
              onClick={() =>
                (window.location.href = `/forum/${data.discussionId}`)
              }
              className="text-sm underline"
            >
              View
            </button>
          ),
        });
      };

      // Listen for likes on your discussions/replies
      const handleLike = (data: {
        type: "discussion" | "reply";
        title: string;
        author: string;
        discussionId: string;
      }) => {
        toast({
          title: "New Like",
          description: `${data.author} liked your ${data.type}: "${data.title}"`,
          duration: 3000,
        });
      };

      // Listen for mentions
      const handleMention = (data: {
        author: string;
        content: string;
        discussionId: string;
        replyId?: string;
      }) => {
        toast({
          title: "You were mentioned",
          description: `${data.author} mentioned you in a reply`,
          duration: 5000,
          action: (
            <button
              onClick={() =>
                (window.location.href = `/forum/${data.discussionId}${
                  data.replyId ? `#reply-${data.replyId}` : ""
                }`)
              }
              className="text-sm underline"
            >
              View
            </button>
          ),
        });
      };

      on("newDiscussion", handleNewDiscussion);
      on("newReply", handleNewReply);
      on("like", handleLike);
      on("mention", handleMention);

      return () => {
        off("newDiscussion", handleNewDiscussion);
        off("newReply", handleNewReply);
        off("like", handleLike);
        off("mention", handleMention);
      };
    }
  }, [socket, on, off]);

  // Function to join discussion room for real-time updates
  const joinDiscussionRoom = useCallback(
    (discussionId: string) => {
      if (socket) {
        socket.emit("joinDiscussion", discussionId);
      }
    },
    [socket]
  );

  // Function to leave discussion room
  const leaveDiscussionRoom = useCallback(
    (discussionId: string) => {
      if (socket) {
        socket.emit("leaveDiscussion", discussionId);
      }
    },
    [socket]
  );

  return {
    joinDiscussionRoom,
    leaveDiscussionRoom,
  };
};
