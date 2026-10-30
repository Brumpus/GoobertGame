//import react somehow
//make picture rotate on click
//step 3 make game
import React, { useState } from 'react';

export default function PipeGame() {
  const [rotation, setRotation] = useState<number>(0);

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <img
        className='img-fluid'
        src='src\components\pipeGame.tsx'
        alt="BRUH"
        // style={{
        //   transform: `rotate(${rotation}deg)`,
        //   transition: 'transform 0.3s ease',
        // }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleRotate}>Rotate Image</button>
      </div>
    </div>
  );
}