import './App.css';
import React, { useReducer } from "react";

const stateMachine = {
  initial: "initial",
  states: {
  initial: { on: { next: "loadingModel", text: 'Load Model' } },
  loadingModel: { on: { next: "modelReady", text: 'Loading Model' } },
  modelReady: { on: { next: "imageReady", text: 'Upload Image' } },
  imageReady: { on: { next: "identifying" }, text: 'Identify Breed', showImage: true },
  identifying: { on: { next: "complete", text: 'Identifying…'} },
  complete: { on: { next: "modelReady" }, text: 'Reset', showImage: true, showResults: true }
  }
 };

 const buttonProps = {
  initial: { text: "Load Model", action: () => {} },
  loadingModel: { text: "Loading Model…", action: () => {} },
  modelReady: { text: "Upload Image", action: () => {} },
  imageReady: { text: "Identify Breed", action: () => {} },
  identifying: { text: "Identifying…", action: () => {} },
  complete: { text: "Reset", action: () => {} }
  };

const reducer = (currentState, event) =>
  stateMachine.states[currentState].on[event] || stateMachine.initial;

function App() {
  const [appState, dispatch] =
    useReducer(reducer, stateMachine.initial)
  const next = () => dispatch("next")
  return (
    <div>
      <button onClick={buttonProps[appState].action}>
        {buttonProps[appState].text}
      </button>
    </div>
  );
}

export default App;
