import React from "react";
import Entity from "../../models/entity";
import Celestial from "../../models/celestial";

interface Props{
    entity: Entity,
    selectEntity: Function,
    deleteEntity: Function,
    sequence: Array<number>,
    currentSequence: Array<number>,
}

export default function CelestialControlsItem(props: Props){
    const [collapsed, setCollapsed] = React.useState(true);
    return (
        <div className={"item" + ((props.sequence.toString() == props.currentSequence.toString())?' active':'')}>
            {props.entity instanceof Celestial && <>
                <div className="header">
                    <div className="name">
                        {props.entity.name}
                    </div>
                    <div className="buttons">
                        <button onClick={() => props.selectEntity(props.sequence)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges">
                        <path stroke="#000000" d="M0 0h13M0 1h13M0 2h13M0 3h3M10 3h3M0 4h3M10 4h3M0 5h3M10 5h3M0 6h3M6 6h2M10 6h3M0 7h3M6 7h7M0 8h3M7 8h7M0 9h3M7 9h9M0 10h16M0 11h16M0 12h15M8 13h6M9 14h4M9 15h3" />
                        </svg>
                        </button>
                        {(props.entity.satellites.length > 0) && (<button onClick={() => setCollapsed(!collapsed)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" shapeRendering="crispEdges"><path stroke="black" d="M0 0h16M0 1h16M0 2h16M0 6h16M0 7h16M0 8h16M0 12h16M0 13h16M0 14h16"></path></svg>
                        </button>)}
                        <button onClick={() => props.deleteEntity(props.sequence)}>
                            <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                        </button>
                        
                    </div>
                </div>
                {!collapsed && <div className="submenu">
                    {props.entity.satellites.map((e, k) => <CelestialControlsItem key={e.entity.id} entity={e.entity} selectEntity={props.selectEntity} deleteEntity={props.deleteEntity} sequence={[...props.sequence, k]} currentSequence={props.currentSequence}></CelestialControlsItem>)}
                </div>}
            </>}
            
        </div>
    )
}