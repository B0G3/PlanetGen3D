import React from "react";
import Entity from "../../models/entity";
import Celestial from "../../models/celestial";

interface Props{
    entity: Entity,
    selectEntity: Function,
    deleteEntity: Function,
    sequence: Array<number>
}

export default function CelestialControlsItem(props: Props){
    const [collapsed, setCollapsed] = React.useState(true);

    return (
        <div className="item">
            {props.entity instanceof Celestial && <>
                <div className="header">
                    <div className="name">
                        {props.entity.name}
                    </div>
                    <div className="buttons">
                        <button onClick={() => props.selectEntity(props.sequence)}>S</button>
                        <button onClick={() => props.deleteEntity(props.sequence)}>D</button>
                        {(props.entity.satellites.length > 0) && (<button onClick={() => setCollapsed(!collapsed)}>T</button>)}
                    </div>
                </div>
                {!collapsed && <div className="submenu">
                    {props.entity.satellites.map((e, k) => <CelestialControlsItem key={e.entity.id} entity={e.entity} selectEntity={props.selectEntity} deleteEntity={props.deleteEntity} sequence={[...props.sequence, k]}></CelestialControlsItem>)}
                </div>}
            </>}
            
        </div>
    )
}