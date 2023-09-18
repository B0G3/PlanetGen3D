import React from "react";
import Entity from "../../models/entity";
import Celestial from "../../models/celestial";

interface Props{
    entity: Celestial,
    selectEntity: Function,
    deleteEntity: Function,
    addEntity: Function,
    // sequence: Array<number>,
    currentSequence: Array<number>,
}

export default function CelestialControlsItem(props: Props){
    const [collapsed, setCollapsed] = React.useState(true);
    return (
        <div className={"item" + ((props.entity.sequence.toString() == props.currentSequence.toString())?' active':'')}>
            {props.entity instanceof Celestial && <>
                <div className="header">
                    <div className="name" onClick={() => props.selectEntity(props.entity.sequence)}>
                        {props.entity.name}
                    </div>
                    <div className="buttons">
                        {(props.entity.satellites.length > 0) && (<button onClick={() => setCollapsed(!collapsed)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" shapeRendering="crispEdges"><path stroke="black" d="M0 0h16M0 1h16M0 2h16M0 6h16M0 7h16M0 8h16M0 12h16M0 13h16M0 14h16"></path></svg>
                        </button>)}
                        {(props.entity.sequence.length > 1) && <button onClick={() => props.deleteEntity(props.entity.sequence)}>
                            <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                        </button>}
                        {(props.entity.sequence.length < 8) && <button onClick={() => props.addEntity(props.entity.sequence)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                <path stroke="#000000" d="M6 0h4M6 1h4M6 2h4M6 3h4M6 4h4M6 5h4M0 6h16M0 7h16M0 8h16M0 9h16M6 10h4M6 11h4M6 12h4M6 13h4M6 14h4M6 15h4" />
                            </svg>
                        </button>}
                    </div>
                </div>
                {!collapsed && <div className="submenu">
                    {props.entity.satellites.map((e, k) => e.entity instanceof Celestial && <CelestialControlsItem key={e.entity.id} entity={e.entity} selectEntity={props.selectEntity} deleteEntity={props.deleteEntity} addEntity={props.addEntity} currentSequence={props.currentSequence}></CelestialControlsItem>)}
                </div>}
            </>}
            
        </div>
    )
}