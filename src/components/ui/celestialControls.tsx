import React from "react";
import Celestial from "../../models/celestial";
import CelestialControlsItem from "./celestialControlsItem";
import Entity from "../../models/entity";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";

interface Props{
    celestials: Array<Celestial>,
    setCelestials: Function,
    selectedEntity: Celestial | Satellite | null,
    setSelectedEntity: Function
}

export default function CelestialControls({celestials, setCelestials, selectedEntity, setSelectedEntity} : Props){
    const [currentSequence, setCurrentSequence] = React.useState<Array<number>>([]);

    const findEntityBySequence = (indexSequence : Array<number>) => {
        const _entities = [...celestials];
        let currentItem : Celestial | Satellite = _entities[indexSequence[0]];
          
        for (let i = 1; i <= indexSequence.length - 1; i++) {
            if(currentItem instanceof Celestial ){ 
                let entity : Satellite = currentItem.satellites[indexSequence[i]];
                if(entity instanceof Satellite) currentItem = entity;
            }else if(currentItem instanceof Satellite){
                let entity : Renderable = currentItem.entity;
                if(entity instanceof Celestial) currentItem = entity.satellites[indexSequence[i]];
            }
        }
        return currentItem;
    }

    const selectEntity = (indexSequence : Array<number>) => {
        let entity = findEntityBySequence(indexSequence);
        if(entity){ 
            setCurrentSequence(indexSequence)
            setSelectedEntity(entity);
            console.log(currentSequence, selectedEntity);
        }
    }

    const deleteEntity = (indexSequence : Array<number>) => {
        // const _entities = [...entities];

        // if (indexSequence.length === 1) {
        //   _entities.splice(indexSequence[0], 1);
        // } else {
        //   let currentItem = _entities[indexSequence[0]];
      
        //   for (let i = 1; i < indexSequence.length - 1; i++) {
        //     currentItem = currentItem.satellites[indexSequence[i]].entity;
        //   }
      
        //   currentItem.satellites.splice(indexSequence[indexSequence.length - 1], 1);
        // }
      
        // setEntities(_entities);
    }

    return (
       <>
            <div className="controls-wrapper">
                <div className="control-box">
                    <div id="entity-list">
                        {celestials.map((e, k) => <CelestialControlsItem key={e.id} entity={e} selectEntity={selectEntity} deleteEntity={deleteEntity} sequence={[k]}></CelestialControlsItem>)}
                    </div>
                </div>
            </div>
       </>
    )
}