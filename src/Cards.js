import React, { useState, useEffect } from 'react';

const Cards = ({ poseDetected }) => {
  // State to track card positions
  const [expanded, setExpanded] = useState(true);
  const [centerCardIndex, setCenterCardIndex] = useState(1); // 0, 1, or 2 (for cards 1, 2, 3)
  const [previousPose, setPreviousPose] = useState(null);
  
  // Update expanded state based on pose
  useEffect(() => {
    // Only process if we have a pose and it's different from the previous pose
    if (poseDetected && poseDetected !== previousPose) {
      if (poseDetected === 'close') {
        setExpanded(false);
      } else if (poseDetected === 'open') {
        setExpanded(true);
      } else if (expanded) {
        // Only process shifting if cards are expanded
        if (poseDetected === 'one' && centerCardIndex > 0) {
          // Shift left - decrease center card index
          setCenterCardIndex(centerCardIndex - 1);
        } else if (poseDetected === 'two' && centerCardIndex < 2) {
          // Shift right - increase center card index
          setCenterCardIndex(centerCardIndex + 1);
        }
      }
      
      // Update previous pose for next comparison
      setPreviousPose(poseDetected);
    }
  }, [poseDetected, previousPose, expanded, centerCardIndex]);
  
  // Calculate position classes based on current state
  const getCardClasses = (cardIndex) => {
    if (!expanded) {
      return `card card-${cardIndex + 1} collapsed`;
    }
    
    // Calculate relative position (left, center, right)
    const relativePosition = cardIndex - centerCardIndex;
    
    let positionClass = '';
    if (relativePosition < 0) {
      positionClass = 'position-left';
    } else if (relativePosition > 0) {
      positionClass = 'position-right';
    } else {
      positionClass = 'position-center';
    }
    
    return `card card-${cardIndex + 1} expanded ${positionClass}`;
  };
  
  return (
    <div className="cards-container">
      <div className={getCardClasses(0)}>
        <div className="card-content">
          <h3>Card 1</h3>
          <p>This is the first card content</p>
        </div>
      </div>
      
      <div className={getCardClasses(1)}>
        <div className="card-content">
          <h3>Card 2</h3>
          <p>This is the second card content</p>
        </div>
      </div>
      
      <div className={getCardClasses(2)}>
        <div className="card-content">
          <h3>Card 3</h3>
          <p>This is the third card content</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;