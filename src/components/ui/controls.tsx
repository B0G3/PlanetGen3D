import React from "react";
import Celestial from "../../models/celestial";
import CelestialControlsItem from "./celestialControlsItem";
import Entity from "../../models/entity";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import SatelliteControl from "./satelliteControl";
import CelestialControl from "./celestialControl";
import { createRandomGas, createRandomStar, createRandomTerrestial } from "../../utils/generator";

interface Props{
    celestials: Array<Celestial>,
    setCelestials: Function,
    selectedEntity: Celestial | Satellite | null,
    setSelectedEntity: Function
}

interface AddCelestialForm{
    visible: boolean,
    sequence: Array<number>
}

export default function Controls({celestials, setCelestials, selectedEntity, setSelectedEntity} : Props){
    const [addModal, setAddModal] = React.useState<AddCelestialForm>({visible: false, sequence: []});

    React.useEffect(()=>{
        if(!selectedEntity) selectEntity([0]);
    }, [selectedEntity])

    const findEntityBySequence = (indexSequence : Array<number>) => {
        const _entities = [...celestials];
        let currentItem : Celestial | Satellite = _entities.find(e => e.id === indexSequence[0]) as Celestial;
          
        for (let i = 1; i <= indexSequence.length - 1; i++) {
            if(currentItem instanceof Celestial){ 
                let entity = currentItem.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }else if(currentItem instanceof Satellite){
                let entity = currentItem.entity.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }
        }
        return currentItem;
    }

    const selectEntity = (indexSequence : Array<number>) => {
        let entity = findEntityBySequence(indexSequence);
        if(entity){
            setSelectedEntity(entity);
        }
    }
    

    const deleteEntity = (indexSequence : Array<number>) => {
        const _entities = [...celestials];

        if (indexSequence.length === 1) {
            let index = _entities.findIndex(e => e.id === indexSequence[0]);
            _entities.splice(index, 1);
        }else{
            const _entities = [...celestials];
            let currentItem : Celestial | Satellite = _entities.find(e => e.id === indexSequence[0]) as Celestial;
            
            for (let i = 1; i <= indexSequence.length - 2; i++) {
                if(currentItem instanceof Celestial){ 
                    let entity = currentItem.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                    currentItem = entity;
                }else if(currentItem instanceof Satellite){
                    let entity = currentItem.entity.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                    currentItem = entity;
                }
            }
            
            if(currentItem instanceof Celestial){ 
                let index = currentItem.satellites.findIndex(e => e.entity.id === indexSequence[indexSequence.length - 1]);
                currentItem.satellites.splice(index, 1)
            };
            if(currentItem instanceof Satellite) {
                let index = currentItem.entity.satellites.findIndex(e => e.entity.id === indexSequence[indexSequence.length - 1]);
                currentItem.entity.satellites.splice(index, 1)
            }
        }
        
        setCelestials(_entities);
    }

    const updateEntity = (indexSequence : Array<number>, data: Object, nested = true) =>{
        const _entities = [...celestials];
        let currentItem : Celestial | Satellite = _entities.find(e => e.id === indexSequence[0]) as Celestial;
          
        for (let i = 1; i <= indexSequence.length - 1; i++) {
            if(currentItem instanceof Celestial){ 
                let entity = currentItem.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }else if(currentItem instanceof Satellite){
                let entity = currentItem.entity.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }
        }
        
        if(!nested) Object.assign(currentItem, data);
        else{
            let item = currentItem as Satellite;
            Object.assign(item.entity, data);
        }
        setCelestials(_entities);
    }

    const addEntity = (entityType: 'terrestial'|'gas'|'star', indexSequence: Array<number>) => {
        const _entities = [...celestials];
        let currentItem : Celestial | Satellite = _entities.find(e => e.id === indexSequence[0]) as Celestial;
          
        for (let i = 1; i <= indexSequence.length - 1; i++) {
            if(currentItem instanceof Celestial){ 
                let entity = currentItem.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }else if(currentItem instanceof Satellite){
                let entity = currentItem.entity.satellites.find(e => e.entity.id === indexSequence[i]) as Satellite;
                currentItem = entity;
            }
        }
        if(currentItem instanceof Satellite) currentItem = currentItem.entity;
        currentItem = currentItem as Celestial;

        let entity = null;
        let satelliteRadius = Math.max(1, Math.floor(currentItem.radius/2), (Math.random()*currentItem.radius)-2);
        if(entityType === 'terrestial') entity = createRandomTerrestial(satelliteRadius);
        if(entityType === 'gas') entity = createRandomGas(satelliteRadius);
        if(entityType === 'star') entity = createRandomStar(satelliteRadius);
        if(entity){
            let radius = entity.radius ;
            let maxDist = Math.max(...currentItem.satellites.map(e => e.distance), 0);
            let speed = (20 + Math.random() * 180)/100;
            let tiltX = -Math.PI/2 + Math.random() * Math.PI;
            let tiltY = -Math.PI/2 + Math.random() * Math.PI;
            let satelliteCount = currentItem.satellites.length
            currentItem.addSatellite(entity, maxDist + radius + 8, speed, tiltX, tiltY);
            console.log(currentItem);
            setCelestials(_entities);

            // const newSequence = indexSequence;
            // newSequence.push(satelliteCount);
            selectEntity(entity.sequence);
        }
        closeAddModal();
    }

    const showAddModal = (indexSequence : Array<number>) => {
        setAddModal((prevAddModal) => ({
            ...prevAddModal,
            sequence: indexSequence,
            visible: true,
          }));
    }

    const closeAddModal = () => {
        setAddModal((prevAddModal) => ({
            ...prevAddModal,
            visible: false,
        }));
    }

    const updateSatellite = (data: Object) => {
        updateEntity(selectedEntity?.getSequence() ?? [], data, false);
    }

    const updateCelestial = (data: Object) => {
        updateEntity(selectedEntity?.getSequence() ?? [], data, true);
    }

    return (
       <>
            {addModal.visible && <div className="modal-wrapper">
                <div className="modal">
                    <div className="control-box">
                        <div className="title">
                            Add celestial
                            <div className="buttons">
                                <button style={{width: '1rem', height: '1rem'}} onClick={()=>closeAddModal()}>
                                    <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                                </button>
                            </div>
                        </div>
                        <div className="add-celestial">
                            <button onClick={()=>addEntity("terrestial", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 28 28" shapeRendering="crispEdges">
                                        <path stroke="#000000" d="M11 2h6M8 3h12M7 4h4M12 4h4M17 4h4M6 5h4M18 5h4M5 6h6M18 6h5M4 7h8M17 7h7M3 8h9M17 8h8M3 9h8M17 9h8M3 10h6M20 10h5M2 11h2M5 11h4M22 11h4M2 12h2M6 12h3M21 12h5M2 13h2M5 13h8M20 13h6M2 14h2M5 14h9M19 14h7M2 15h2M5 15h10M19 15h7M2 16h2M8 16h7M19 16h7M3 17h2M8 17h7M20 17h5M3 18h2M9 18h5M20 18h5M3 19h3M9 19h4M21 19h4M4 20h2M9 20h3M21 20h3M5 21h2M9 21h2M21 21h2M6 22h4M19 22h3M7 23h4M17 23h4M8 24h12M11 25h6" />
                                    </svg>
                                </div>
                                <div className="name">Terrestial</div>
                            </button>
                            <button onClick={()=>addEntity("gas", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 28 28" shapeRendering="crispEdges">
                                        <path stroke="#000000" d="M11 2h6M8 3h12M7 4h4M17 4h4M6 5h3M19 5h3M5 6h2M21 6h2M4 7h2M22 7h2M3 8h3M11 8h6M22 8h3M3 9h22M3 10h8M17 10h8M2 11h2M24 11h2M2 12h2M24 12h2M2 13h2M24 13h2M2 14h2M24 14h2M2 15h2M24 15h2M2 16h2M24 16h2M3 17h2M23 17h2M3 18h8M17 18h8M3 19h22M4 20h2M11 20h6M22 20h2M5 21h2M21 21h2M6 22h3M19 22h3M7 23h4M17 23h4M8 24h12M11 25h6" />
                                    </svg>
                                </div>
                                <div className="name">Gas</div>
                            </button>
                            <button onClick={()=>addEntity("star", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 28 28" shapeRendering="crispEdges">
                                      <path stroke="#000000" d="M6 2h1M11 2h6M6 3h1M8 3h12M5 4h6M17 4h4M4 5h2M7 5h2M19 5h3M2 6h3M8 6h4M21 6h2M4 7h2M7 7h2M22 7h2M3 8h5M18 8h1M22 8h3M3 9h2M6 9h1M18 9h1M23 9h2M3 10h2M6 10h1M17 10h3M23 10h2M2 11h2M6 11h1M17 11h3M24 11h2M2 12h2M16 12h2M19 12h2M24 12h2M2 13h2M16 13h2M19 13h2M24 13h2M2 14h2M16 14h2M19 14h2M24 14h2M2 15h2M13 15h5M19 15h7M2 16h2M11 16h6M20 16h6M3 17h2M9 17h4M23 17h5M3 18h2M11 18h6M20 18h6M3 19h3M13 19h5M19 19h6M4 20h2M16 20h2M19 20h2M22 20h2M5 21h2M16 21h2M19 21h4M6 22h3M16 22h2M19 22h3M7 23h4M17 23h4M8 24h12M11 25h6M18 25h1M18 26h1" />
                                    </svg>
                                </div>
                                <div className="name">Star</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="controls-wrapper">
                <div className="control-box">
                    <div id="entity-list">
                        {celestials.map((e, k) => <CelestialControlsItem key={e.id} entity={e} selectEntity={selectEntity} deleteEntity={deleteEntity} addEntity={showAddModal} currentSequence={selectedEntity?.getSequence()??[]}></CelestialControlsItem>)}
                    </div>
                </div>
                { 
                (selectedEntity?.getSequence()?.length) &&
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
                </div>}
            </div>
       </>
    )
}