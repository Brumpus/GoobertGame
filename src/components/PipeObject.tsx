import React, { useState } from "react";

interface Props {
	name: string,
}

const [rotation, setRotation] = useState<number>(0);

const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
};

class PipeObject extends React.Component<Props> {

    name: string;

	constructor(props: Props) {
        super(props);
        this.name = props.name;
	}

	render() {
		return (
			<div className='pipe'>
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
            </div>
        );
	}
}

export default PipeObject;