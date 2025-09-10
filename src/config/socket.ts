// Socket.io configuration
export const socketConfig = {
  // Socket server URL - defaults to same host as API
  url:
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000",

  // Connection options
  options: {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
  },

  // Event names
  events: {
    // Discussion events
    NEW_DISCUSSION: "newDiscussion",
    DISCUSSION_UPDATE: "discussionUpdate",
    DISCUSSION_LIKE: "discussionLike",

    // Reply events
    NEW_REPLY: "newReply",
    REPLY_UPDATE: "replyUpdate",
    REPLY_LIKE: "replyLike",

    // User events
    USER_ONLINE: "userOnline",
    USER_OFFLINE: "userOffline",

    // Notification events
    NOTIFICATION: "notification",
  },

  // Room names
  rooms: {
    FORUM: "forum",
    DISCUSSION: (id: string) => `discussion:${id}`,
    USER: (id: string) => `user:${id}`,
  },
};
