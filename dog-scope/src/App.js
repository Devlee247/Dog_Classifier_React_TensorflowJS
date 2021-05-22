import './App.css';

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

 const reducer = (currentState, event) =>
 stateMachine.states[currentState].on[event] || stateMachine.initial;

function App() {
  return (
    <div></div>
  );
}

export default App;
