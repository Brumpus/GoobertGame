import React from "react";
import PipeObject from "./PipeObject";
import Pipe from "./pipe";

const pipesOne = [
    new Pipe("cross"),
    new Pipe("eye"),
    new Pipe("tee"),
    new Pipe("el")
];

const pipesTwo = [
    new Pipe("cross"),
    new Pipe("eye"),
    new Pipe("el"),
    new Pipe("el")
];

const pipesThree = [
    new Pipe("eye"),
    new Pipe("tee"),
    new Pipe("tee"),
    new Pipe("cross")
];

const PipeRow = () => {

	
	return (
		<>
			<div className="row">
				{pipesOne.map((pipe, i) => <PipeObject {...pipe} key={i} />)}
			</div>
            <div className="row">
				{pipesTwo.map((pipe, i) => <PipeObject {...pipe} key={i} />)}
			</div>
            <div className="row">
				{pipesThree.map((pipe, i) => <PipeObject {...pipe} key={i} />)}
			</div>
		</>
	);
};

export default PipeRow;