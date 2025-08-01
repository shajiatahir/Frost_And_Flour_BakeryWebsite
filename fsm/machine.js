const { createMachine, assign, spawn, sendParent } = require("xstate");
const fetchMachine = require("./fetchMachine");

const toggleMachine = createMachine(
  {
    id: "AuthMachine",
    initial: "Idle",
    context: {},
    states: {
      Idle: {
        on: {
          LOGIN: {
            target: "LoginRequest",
            actions: assign((context, event) => {
              console.log("[FSM] LOGIN transition triggered");
              return {
                email: event.value.email,
                password: event.value.password,
              };
            }),
          },
          SIGNUP: {
            target: "SignupRequest",
            actions: assign((context, event) => {
              console.log("[FSM] SIGNUP transition triggered with event:", event);
              console.log("[FSM] Event value:", event.value);
              const newContext = {
                name: event.value.name,
                email: event.value.email,
                password: event.value.password,
                role: event.value.role,
              };
              console.log("[FSM] New context after SIGNUP:", newContext);
              return newContext;
            }),
          },
        },
      },

      LoginRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Entering LoginRequest state");
            console.log("[FSM] Context in LoginRequest:", context);
            trigger(
              context,
              "http://localhost:3001/api/login",
              "POST",
              {
                email: context.email,
                password: context.password,
              },
              "LOGIN_SUCCESS",
              "LOGIN_FAILURE"
            );
          },
        ],
        on: {
          LOGIN_SUCCESS: {
            actions: ["setUser", "sendCtx"],
            target: "LoggedIn",
          },
          LOGIN_FAILURE: {
            actions: ["receiveError", "sendCtx"],
            target: "Idle",
          },
        },
      },

      SignupRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Entering SignupRequest state");
            console.log("[FSM] Context in SignupRequest:", context);
            
            // Ensure all required fields are present
            if (!context.name || !context.email || !context.password) {
              console.log("[FSM] Missing required fields in context:", {
                name: !!context.name,
                email: !!context.email,
                password: !!context.password
              });
              // Send error directly
              context.fetchRef.send({
                type: "SIGNUP_FAILURE",
                errorMessage: "Missing required fields in FSM context"
              });
              return;
            }
            
            console.log("[FSM] Triggering signup with data:", {
              name: context.name,
              email: context.email,
              password: context.password,
              role: context.role,
            });
            trigger(
              context,
              "http://localhost:3001/api/signup",
              "POST",
              {
                name: context.name,
                email: context.email,
                password: context.password,
                role: context.role,
              },
              "SIGNUP_SUCCESS",
              "SIGNUP_FAILURE"
            );
          },
        ],
        on: {
          SIGNUP_SUCCESS: {
            actions: [
              assign({
                success: (_, event) => event.result.success,
                message: (_, event) => event.result.message
              }),
              "sendCtx"
            ],
            target: "SignedUp",
          },
          SIGNUP_FAILURE: {
            actions: ["receiveError", "sendCtx"],
            target: "Idle",
          },
        },
      },

      LoggedIn: {
        type: "final",
      },

      SignedUp: {
        type: "final",
      },
    },
  },
  {
    actions: {
      spawnFetch: assign({
        fetchRef: () => {
          console.log("[FSM] Spawning fetch machine");
          return spawn(fetchMachine);
        },
      }),
      sendCtx: sendParent((context) => {
        console.log("[FSM] Sending context to parent:", context);
        return { ...context };
      }),
      setUser: assign({
        user: (_, event) => event.result.user,
      }),
      receiveError: assign({
        errorMessage: (_, event) => {
          console.log("[FSM] Error received:", event.errorMessage);
          return event.errorMessage;
        },
      }),
    },
  }
);

function trigger(
  context,
  url,
  method,
  payload,
  successEvent,
  failureEvent
) {
  console.log("[FSM] Trigger function called with:", {
    url,
    method,
    payload,
    successEvent,
    failureEvent
  });
  
  if (!context.fetchRef) {
    console.log("[FSM] Error: fetchRef is not available");
    return;
  }
  
  context.fetchRef.send({
    type: "FETCH",
    value: { url, method, payload, successEvent, failureEvent },
  });
}

module.exports = toggleMachine;
  