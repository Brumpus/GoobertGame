import React from "react";
import PipeObject from "./PipeObject";
import type Pipe from "./Pipe";

interface Props {
    pipes: Pipe[];
}

class PipeRow extends React.Component<Props>{

    // for (let i = 0; i < pipes.length; i++) {
    // pipeRow.push(<div key={i}>{pipes[i]}</div>);
    render() {
		console.log(this.props.pipes);
		return (
			<div className="row">
               {this.props.pipes.map((member, i) => <PipeObject {...member} key={i} />)}
			</div>
		);
	}
};

export default PipeRow;