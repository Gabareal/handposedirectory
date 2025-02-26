import React, { useRef, useState, useEffect } from "react";

import * as tf from '@tensorflow/tfjs';
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
import Cards from "./Cards"; // Import the new Cards component

import { CloseGesture, OpenGesture, TwoGesture, OneGesture } from './Gestures.js'

import '@tensorflow/tfjs-backend-webgl';
tf.setBackend('webgl').then(() => {
  console.log('WebGL backend initialized successfully');
}).catch(error => {
  console.error('Failed to initialize WebGL backend:', error);
  // Fallback to CPU if WebGL fails
  tf.setBackend('cpu').then(() => {
    console.log('Fallback to CPU backend successful');
  });
});

function App() {
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [pose, setPose] = useState(null); //setPose updates the emoji variable
  const [modelLoaded, setModelLoaded] = useState(null);
  const [contentVisible, setContentVisible] = useState(false);
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setModelLoaded(true);
    
    // Fade in the content after model is loaded
    setTimeout(() => {
      setContentVisible(true);
    }, 500);
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);
      const knownGestures = [CloseGesture,OpenGesture,TwoGesture, OneGesture]

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator(knownGestures);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          var detectedpose = gesture.gestures[maxConfidence].name
          setPose(detectedpose);
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(()=>{runHandpose()},[]);
  useEffect(()=>{
    if (pose) {
      console.log(`Pose detected: ${pose}`)
    }
  }, [pose]);

  
  return (
    <div className="App">
      {!modelLoaded ? (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Model is warming up... (est. 30s)</p>
          </div>
        </div>
      ) : (
        <div className={`app-content ${contentVisible ? 'visible' : ''}`}>
          {/* Instructions banner */}
          <div className="instructions-banner">
            <p>Open to open, Close to close, One for left, Two for right</p>
          </div>
          
          {/* Cards component */}
          <Cards poseDetected={pose?.toLowerCase()} />
          
          {/* Webcam and canvas */}
          <Webcam 
            ref={webcamRef}
            className="webcam mirrored"
          />
          <header className="App-header">
            <canvas
              ref={canvasRef}
              className="canvas mirrored"
            />
            <div className="pose-text">
              {pose ? (
                <p>
                  {pose} is detected!
                </p>
              ) : (
                <p>No pose detected!</p>
              )}
            </div>
          </header>
        </div>
      )}
    </div>
  );
}

export default App;
