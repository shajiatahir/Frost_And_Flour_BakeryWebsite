const { createMachine, assign, sendParent } = require("xstate");
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const fetchMachine = createMachine(
  {
    id: "FetchMachine",
    initial: "Idle",
    context: {},
    states: {
      Idle: {
        on: {
          FETCH: {
            target: "Fetching",
            actions: assign((context, event) => ({
              url: event.value.url,
              method: event.value.method,
              payload: event.value.payload,
              successEvent: event.value.successEvent,
              failureEvent: event.value.failureEvent,
            })),
          },
        },
      },
      Fetching: {
        invoke: {
          src: (context, event) => async () => {
            console.log("[FSM] Making fetch request to:", context.url);
            console.log("[FSM] Payload:", context.payload);
            
            const res = await fetch(context.url, {
              method: context.method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(context.payload),
            });
            
            console.log("[FSM] Response status:", res.status);
            
            if (!res.ok) {
              const errorData = await res.json();
              console.log("[FSM] Error response:", errorData);
              throw new Error(errorData.message || `HTTP ${res.status}`);
            }
            
            const data = await res.json();
            console.log("[FSM] Success response:", data);
            return data;
          },
          onDone: {
            target: "Idle",
            actions: sendParent((context, event) => ({
              type: context.successEvent,
              result: event.data,
            })),
          },
          onError: {
            target: "Idle",
            actions: sendParent((context, event) => {
              console.log("[FSM] Fetch error:", event.data || event.message);
              return {
                type: context.failureEvent,
                errorMessage: event.data || event.message,
              };
            }),
          },
        },
      },
    },
  }
);

module.exports = fetchMachine;
