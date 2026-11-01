import React, { useState } from 'react';
import "../games/pipe-game.css"
import PipeObject from './PipeObject';
import PipeRow from './PipeRow';
import Pipe from './Pipe';

const pipes = [
  new Pipe("steve"),
  new Pipe('david')
];

export default function PipeGame() {

  return (
    <div className='pipe-grid'>
      <div className='row'>
        <PipeRow pipes={[...pipes]} />
        {/* <div className='pipe'>
          <button onClick={handleRotate}>
            <img
              className="img-fluid"
              src="images/games/testpipe.webp"
              alt="BRUH"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
            />
          </button>
        </div> */}
      </div>
    </div>
  );
}