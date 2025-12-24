import { writable } from "svelte/store";

const SESSION_KEY = "chat_session_id";

function createSessionStore() {
  let initialValue: string | null = null;

  // Only access localStorage in browser
  if (typeof window !== "undefined") {
    initialValue = localStorage.getItem(SESSION_KEY);
  }

  const { subscribe, set, update } = writable<string | null>(initialValue);

  return {
    subscribe,
    set: (value: string | null) => {
      if (typeof window !== "undefined") {
        if (value) {
          localStorage.setItem(SESSION_KEY, value);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      set(value);
    },
    clear: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(SESSION_KEY);
      }
      set(null);
    },
  };
}

export const sessionStore = createSessionStore();
