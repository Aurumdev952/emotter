import { create } from "zustand";

interface Store {
  chat_id: string | null;
  notificationscount: number;
  setChatId: (chat_id: string) => void;
  setNotificationCount: (count: number) => void;
}

export const useStore = create<Store>((set) => ({
  chat_id: null,
  notificationscount: 0,
  setChatId(chat_id) {
    set({
      chat_id,
    });
  },
  setNotificationCount(count) {
    set({
      notificationscount: count,
    });
  },
}));
