
import React from "react";

const SLEEP_MUTANT_ASSET = 'images/goobert-parts/mutant-tired.gif';
const DIRTY_MUTANT_ASSET = 'images/goobert-parts/mutant-dirty.gif';
const BORED_MUTANT_ASSET = 'images/goobert-parts/mutant-bored.png';
const HUNGRY_MUTANT_ASSET = 'images/goobert-parts/mutant-hungry.gif';

enum MutantType {SLEEPLESS, DIRTY, BORED, HUNGRY}

type MutantProps = {
    //goobert: Goobert,
    type: MutantType,
    x: string,
    y: string,
}


export default function Mutant({/*goobert,*/ type, x, y}: MutantProps): React.JSX.Element {
    //let [x, setX] = useState(goobert.x);
    //let [y, setY] = useState(goobert.y);
    let setType = () => {
        switch (type) {
            case MutantType.SLEEPLESS:
                return SLEEP_MUTANT_ASSET;
            case MutantType.DIRTY:
                return DIRTY_MUTANT_ASSET;
            case MutantType.BORED:
                return BORED_MUTANT_ASSET;
            case MutantType.HUNGRY:
                return HUNGRY_MUTANT_ASSET;
            default:
                return 'images/backgrounds/AnnoyingTexture.webp';
        }
    }

    return (
        <div className="mutant-container" style={
            {    
                left: x,
                top: y
            }}>
            <img src={setType()}/>
        </div>
            
    )
}

export {MutantType};