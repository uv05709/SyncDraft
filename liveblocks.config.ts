declare global {
  interface Liveblocks {
    Presence: {};
    UserMeta: {
      id: string;
      info: {
        name: string;
        color: string;
        avatar: string;
      };
    };
    RoomEvent: {};
    ThreadMetadata: {};
  }
}

export {};
