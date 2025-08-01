const express = require("express");
const cors = require("cors");
const { interpret } = require("xstate");
const toggleMachine = require("./machine");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.post("/", (req, res) => {
  const httpReq = req.body;
  console.log("[FSM] Incoming request from frontend:", httpReq);

  const service = interpret(
    toggleMachine.withConfig({
      actions: {
        sendCtx: (context) => {
          console.log("[FSM] Sending context to client:", context);
          res.json(context);
        },
      },
    })
  );

  service.onTransition((state) => {
    console.log("[FSM] State transition:", state.value, "Context:", state.context);
    
    // Check if we're in the wrong state
    if (state.value === 'LoginRequest' && state.context.name) {
      console.log("[FSM] WARNING: In LoginRequest state but context has name field!");
    }
    
    if (state.value === 'SignupRequest' && !state.context.name) {
      console.log("[FSM] WARNING: In SignupRequest state but context missing name field!");
    }
  });

  service.start();
  
  console.log("[FSM] Sending event:", { type: httpReq.transition, value: httpReq.data });
  
  // Check if the transition type is valid
  if (httpReq.transition !== 'LOGIN' && httpReq.transition !== 'SIGNUP') {
    console.log("[FSM] Invalid transition type:", httpReq.transition);
    res.status(400).json({ error: 'Invalid transition type' });
    return;
  }
  
  service.send({ type: httpReq.transition, value: httpReq.data });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`FSM server running at http://localhost:${PORT}`);
});
