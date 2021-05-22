import './App.css';
import React, { useReducer, useState, useRef } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet';

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

function App() {
  const inputRef = useRef();
  const imageRef = useRef();
  const reducer = (currentState, event) =>
    stateMachine.states[currentState].on[event] || stateMachine.initial;

  const [appState, dispatch] =
    useReducer(reducer, stateMachine.initial)
  const next = () => dispatch("next")
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [results, setResults] = useState([])

  const load = async () => {
    next()
    const model = await mobilenet.load();
    setModel(model)
    next()
  }

  const identify = async () => {
    console.log("called identify")
    next();
    const results = await model.classify(imageRef.current);
    setResults(results)
    console.log(results)
    next();
  }

  const reset = () => {
    setResults([])
    setImageUrl(null)
    next();
  }

  const handleUpload = event => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageUrl(url)
      next();
    }
  };

  const formatResult = ({ className, probability}) => (
    <li key={className}>
    {`${className}: %${(probability * 100).toFixed(2)}`}
    </li>
   )

  const buttonProps = {
    initial: { text: "Load Model", action: load },
    loadingModel: { text: "Loading Model…", action: () => {} },
    modelReady: { text: "Upload Image", action: () => inputRef.current.click() },
    imageReady: { text: "Identify Breed", action: identify },
    identifying: { text: "Identifying…", action: () => {} },
    complete: { text: "Reset", action: reset }
  };

  const {
    showImage = false,
    showResults = false
  } = stateMachine.states[appState];

  return (
    <div>
      { showImage &&
        <img
        src={imageUrl}
        alt="upload-preview"
        ref={imageRef}
        />
      }
      { 
        showResults && (
        <ul>{results.map(formatResult)}</ul>
        )
      }
      <button onClick={buttonProps[appState].action}>
        {buttonProps[appState].text}
      </button>
      <input type="file" accept="image/*" capture="camera" ref={inputRef} onChange={handleUpload}>
      </input>
    </div>
  );
}

export default App;
