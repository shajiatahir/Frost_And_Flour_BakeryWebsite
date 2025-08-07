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
              return {
                email: event.value.email,
                password: event.value.password,
              };
            }),
          },
          SIGNUP: {
            target: "SignupRequest",
            actions: assign((context, event) => {
              return {
                name: event.value.name,
                email: event.value.email,
                password: event.value.password,
                role: event.value.role,
              };
            }),
          },
          MENU_FETCH: {
            target: "MenuFetchRequest",
            actions: assign((context, event) => {
              return {
                menuRequest: true,
              };
            }),
          },
          ORDERS_FETCH: {
            target: "OrdersFetchRequest",
            actions: assign((context, event) => {
              return {
                ordersRequest: true,
                userEmail: event.value.userEmail,
                userRole: event.value.userRole,
              };
            }),
          },
        },
      },

      LoginRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Login request initiated");
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
            target: "LoginError",
          },
        },
      },

      LoginError: {
        on: {
          LOGIN: {
            target: "LoginRequest",
            actions: assign((context, event) => {
              return {
                email: event.value.email,
                password: event.value.password,
                errorMessage: null,
              };
            }),
          },
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                email: null,
                password: null,
                errorMessage: null,
                user: null,
              };
            }),
          },
        },
      },

      SignupRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Signup request initiated");
            
            if (!context.name || !context.email || !context.password) {
              console.log("[FSM] Missing required fields for signup");
              context.fetchRef.send({
                type: "SIGNUP_FAILURE",
                errorMessage: "Missing required fields in FSM context"
              });
              return;
            }
            
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
            target: "SignupError",
          },
        },
      },

      SignupError: {
        on: {
          SIGNUP: {
            target: "SignupRequest",
            actions: assign((context, event) => {
              return {
                name: event.value.name,
                email: event.value.email,
                password: event.value.password,
                role: event.value.role,
                errorMessage: null,
              };
            }),
          },
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                name: null,
                email: null,
                password: null,
                role: null,
                errorMessage: null,
              };
            }),
          },
        },
      },

      MenuFetchRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Menu fetch initiated");
            trigger(
              context,
              "http://localhost:3001/api/menu",
              "GET",
              {},
              "MENU_FETCH_SUCCESS",
              "MENU_FETCH_FAILURE"
            );
          },
        ],
        on: {
          MENU_FETCH_SUCCESS: {
            actions: ["setMenuItems", "sendCtx"],
            target: "MenuFetched",
          },
          MENU_FETCH_FAILURE: {
            actions: ["receiveError", "sendCtx"],
            target: "MenuError",
          },
        },
      },

      MenuError: {
        on: {
          MENU_FETCH: {
            target: "MenuFetchRequest",
            actions: assign((context, event) => {
              return {
                menuRequest: true,
                errorMessage: null,
              };
            }),
          },
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                menuRequest: null,
                menuItems: null,
                errorMessage: null,
              };
            }),
          },
        },
      },

      OrdersFetchRequest: {
        entry: [
          "spawnFetch",
          (context, event) => {
            console.log("[FSM] Orders fetch initiated");
            
            const headers = {
              "Content-Type": "application/json",
              "x-user-email": context.userEmail,
              "x-user-role": context.userRole
            };
            
            trigger(
              context,
              "http://localhost:3001/api/orders",
              "GET",
              {},
              "ORDERS_FETCH_SUCCESS",
              "ORDERS_FETCH_FAILURE",
              headers
            );
          },
        ],
        on: {
          ORDERS_FETCH_SUCCESS: {
            actions: ["setOrders", "sendCtx"],
            target: "OrdersFetched",
          },
          ORDERS_FETCH_FAILURE: {
            actions: ["receiveError", "sendCtx"],
            target: "OrdersError",
          },
        },
      },

      OrdersError: {
        on: {
          ORDERS_FETCH: {
            target: "OrdersFetchRequest",
            actions: assign((context, event) => {
              return {
                ordersRequest: true,
                userEmail: event.value.userEmail,
                userRole: event.value.userRole,
                errorMessage: null,
              };
            }),
          },
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                ordersRequest: null,
                orders: null,
                userEmail: null,
                userRole: null,
                errorMessage: null,
              };
            }),
          },
        },
      },

      LoggedIn: {
        on: {
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              console.log("[FSM] User logged out");
              return {
                user: null,
                email: null,
                password: null,
                errorMessage: null,
              };
            }),
          },
          MENU_FETCH: {
            target: "MenuFetchRequest",
            actions: assign((context, event) => {
              return {
                menuRequest: true,
              };
            }),
          },
          ORDERS_FETCH: {
            target: "OrdersFetchRequest",
            actions: assign((context, event) => {
              return {
                ordersRequest: true,
                userEmail: event.value.userEmail,
                userRole: event.value.userRole,
              };
            }),
          },
        },
      },

      SignedUp: {
        on: {
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                name: null,
                email: null,
                password: null,
                role: null,
                success: null,
                message: null,
                errorMessage: null,
              };
            }),
          },
          LOGIN: {
            target: "LoginRequest",
            actions: assign((context, event) => {
              return {
                email: event.value.email,
                password: event.value.password,
              };
            }),
          },
        },
      },

      MenuFetched: {
        on: {
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                menuItems: null,
                menuRequest: null,
                errorMessage: null,
              };
            }),
          },
          MENU_FETCH: {
            target: "MenuFetchRequest",
            actions: assign((context, event) => {
              return {
                menuRequest: true,
              };
            }),
          },
        },
      },

      OrdersFetched: {
        on: {
          LOGOUT: {
            target: "Idle",
            actions: assign((context) => {
              return {
                orders: null,
                ordersRequest: null,
                userEmail: null,
                userRole: null,
                errorMessage: null,
              };
            }),
          },
          ORDERS_FETCH: {
            target: "OrdersFetchRequest",
            actions: assign((context, event) => {
              return {
                ordersRequest: true,
                userEmail: event.value.userEmail,
                userRole: event.value.userRole,
              };
            }),
          },
        },
      },
    },
  },
  {
    actions: {
      spawnFetch: assign({
        fetchRef: () => {
          return spawn(fetchMachine);
        },
      }),
      sendCtx: sendParent((context) => {
        return { ...context };
      }),
      setUser: assign({
        user: (_, event) => event.result.user,
      }),
      setMenuItems: assign({
        menuItems: (_, event) => event.result,
      }),
      setOrders: assign({
        orders: (_, event) => event.result,
      }),
      receiveError: assign({
        errorMessage: (_, event) => {
          console.log("[FSM] Error:", event.errorMessage);
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
  failureEvent,
  headers = { "Content-Type": "application/json" }
) {
  if (!context.fetchRef) {
    console.log("[FSM] Error: fetchRef is not available");
    return;
  }
  
  context.fetchRef.send({
    type: "FETCH",
    value: { url, method, payload, successEvent, failureEvent, headers },
  });
}

module.exports = toggleMachine;
  