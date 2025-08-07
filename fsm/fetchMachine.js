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
              headers: event.value.headers || { "Content-Type": "application/json" },
            })),
          },
        },
      },
      Fetching: {
        invoke: {
          src: (context, event) => async () => {
            console.log("[FSM] Making fetch request to:", context.url);
            console.log("[FSM] Method:", context.method);
            console.log("[FSM] Payload:", context.payload);
            console.log("[FSM] Headers:", context.headers);
            
            const fetchOptions = {
              method: context.method,
              headers: context.headers,
            };
            
            // Only add body for non-GET requests
            if (context.method !== 'GET' && context.payload) {
              fetchOptions.body = JSON.stringify(context.payload);
            }
            
            const res = await fetch(context.url, fetchOptions);
            
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
