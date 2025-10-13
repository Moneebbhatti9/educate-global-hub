// Socket.io configuration
// Derive a clean socket URL (origin only) when only API base is provided
const deriveSocketUrl = () => {
  const explicitUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (explicitUrl) return explicitUrl;

  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!apiBase) return "http://localhost:5000";

  try {
    const url = new URL(apiBase);
    // If API base has a path like /api, strip it for socket origin
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:5000";
  }
};

export const socketConfig = {
  // Socket server URL - defaults to same host as API origin
  url: deriveSocketUrl(),

  // Connection options
  options: {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
    // Allow configuring a socket path; default to `/socket.io` (server default)
    path: (import.meta.env.VITE_SOCKET_PATH as string) || "/socket.io",
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
