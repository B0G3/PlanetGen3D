import React from "react";
import Celestial from "../../models/celestial";
import CelestialControlsItem from "./celestialControlsItem";
import Entity from "../../models/entity";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import SatelliteInterface from '../../interfaces/satellite'
import SatelliteControl from "./satelliteControl";
import CelestialControl from "./celestialControl";

interface Props{
    celestials: Array<Celestial>,
    setCelestials: Function,
    selectedEntity: Entity | null,
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
                currentItem = entity;
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
        }
    }

    const deleteEntity = (indexSequence : Array<number>) => {
        const _entities = [...celestials];

        if (indexSequence.length === 1) {
          _entities.splice(indexSequence[0], 1);
        }else{
            let currentItem : Celestial | Satellite = _entities[indexSequence[0]];
      
            for (let i = 1; i < indexSequence.length - 1; i++) {
                if(currentItem instanceof Celestial ){ 
                    let entity : Satellite = currentItem.satellites[indexSequence[i]];
                    currentItem = entity;
                }else if(currentItem instanceof Satellite){
                    let entity : Renderable = currentItem.entity;
                    if(entity instanceof Celestial) currentItem = entity.satellites[indexSequence[i]];
                }
            }

            if(currentItem instanceof Celestial) currentItem.satellites.splice(indexSequence[indexSequence.length - 1], 1);
            if(currentItem instanceof Satellite) {
                let entity = currentItem.entity as Celestial
                entity.satellites.splice(indexSequence[indexSequence.length - 1], 1);
            }
        }
        
        setCelestials(_entities);
        if(indexSequence.length <= currentSequence.length){
            let _currentSequence = [...currentSequence];
            for(let i = 0; i < indexSequence.length; i++){
                if(indexSequence[i] < currentSequence[i]) _currentSequence[i] -= 1;
                if(indexSequence[i] > currentSequence[i]) break;
            }
            setCurrentSequence(_currentSequence);
            let entity = findEntityBySequence(_currentSequence);
            if(!entity) setSelectedEntity(null);
        }
    }

    const updateEntity = (indexSequence : Array<number>, data: Object, nested = true) =>{
        const _entities = [...celestials];
        let currentItem : Celestial | Satellite = _entities[indexSequence[0]];
          
        for (let i = 1; i <= indexSequence.length - 1; i++) {
            if(currentItem instanceof Celestial ){ 
                let entity : Satellite = currentItem.satellites[indexSequence[i]];
                currentItem = entity;
            }else if(currentItem instanceof Satellite){
                let entity : Renderable = currentItem.entity;
                if(entity instanceof Celestial) currentItem = entity.satellites[indexSequence[i]];
            }
        }
        
        if(!nested) Object.assign(currentItem, data);
        else{
            let item = currentItem as Satellite;
            Object.assign(item.entity, data);
        }
        setCelestials(_entities);
    }

    const updateSatellite = (data: Object) => {
        updateEntity(currentSequence, data, false);
    }

    const updateCelestial = (data: Object) => {
        updateEntity(currentSequence, data, true);
    }

    return (
       <>
            <div className="controls-wrapper">
                <div className="control-box">
                    <div id="entity-list">
                        {celestials.map((e, k) => <CelestialControlsItem key={e.id} entity={e} selectEntity={selectEntity} deleteEntity={deleteEntity} sequence={[k]} currentSequence={currentSequence}></CelestialControlsItem>)}
                    </div>
                </div>
                <div className="control-box">
                    {selectedEntity instanceof Celestial && <>
                        <CelestialControl data={selectedEntity} update={updateSatellite}></CelestialControl>
                    </>}
                    {selectedEntity instanceof Satellite && <>
                        <SatelliteControl data={selectedEntity} update={updateSatellite}></SatelliteControl>
                        {selectedEntity.entity instanceof Celestial && <>
                            <CelestialControl data={selectedEntity.entity} update={updateCelestial}></CelestialControl>
                        </>}
                    </>}
                </div>
            </div>
       </>
    )
}