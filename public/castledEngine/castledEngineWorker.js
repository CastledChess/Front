import init, { init_wasm, main_wasm } from './CastledEngine.js';

let isReady = false;

init().then(() => {
  init_wasm();
  isReady = true;
  executeCommandStack();
});

const commandStack = [];

// /**
//  * Handles incoming messages and finds the opening name based on the provided PGN.
//  * @param {MessageEvent} message - The message event containing the PGN data.
//  */
self.onmessage = (message) => {
  if (!isReady) {
    return commandStack.push(message.data);
  }

  main_wasm(message.data);
};

const executeCommandStack = () => {
  const command = commandStack.shift();

  if (!command) return;

  main_wasm(command);

  if (commandStack.length) {
    executeCommandStack();
  }
};
