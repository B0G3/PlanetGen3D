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

        let currentSequence = selectedEntity?.getSequence();
        if(currentSequence?.toString() == indexSequence.toString()){
            
            if(currentSequence.length > 1){
                currentSequence.pop();
                selectEntity(currentSequence);
            }
            else selectEntity([0]);
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
        let satelliteRadius = Math.max(1, Math.floor(currentItem.radius/2), (Math.random()*currentItem.radius)-3);
        if(entityType === 'terrestial') entity = createRandomTerrestial(satelliteRadius);
        if(entityType === 'gas') entity = createRandomGas(satelliteRadius);
        if(entityType === 'star') entity = createRandomStar(satelliteRadius);
        if(entity){
            let radius = entity.radius;
            let maxDist = Math.max(...currentItem.satellites.map(e => e.distance), 0);
            let speed = (20 + Math.random() * 180)/100;
            let tiltX = -Math.PI/2 + Math.random() * Math.PI;
            let tiltY = -Math.PI/2 + Math.random() * Math.PI;
            currentItem.addSatellite(entity, maxDist + radius + 8, speed, tiltX, tiltY);
            console.log(currentItem);
            setCelestials(_entities);
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
                            <span>Add celestial</span>
                            <div className="buttons">
                                <button style={{width: '1rem', height: '1rem'}} onClick={()=>closeAddModal()}>
                                    <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                                </button>
                            </div>
                        </div>
                        <div className="add-celestial">
                            <button disabled onClick={()=>addEntity("gas", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges">
                                        <path stroke="#000000" d="M5 0h6M3 1h10M2 2h4M10 2h4M1 3h3M12 3h3M1 4h2M6 4h4M13 4h2M0 5h3M5 5h6M13 5h3M0 6h2M4 6h8M14 6h2M0 7h2M4 7h8M14 7h2M0 8h2M4 8h8M14 8h2M0 9h2M4 9h8M14 9h2M0 10h3M5 10h6M13 10h3M1 11h2M6 11h4M13 11h2M1 12h3M12 12h3M2 13h4M10 13h4M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Gas</div>
                            </button>
                            <button onClick={()=>addEntity("terrestial", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                        <path stroke="#000000" d="M5 0h6M3 1h10M2 2h12M1 3h14M1 4h14M0 5h16M0 6h16M0 7h16M0 8h16M0 9h16M0 10h16M1 11h14M1 12h14M2 13h12M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Terrestial</div>
                            </button>
                            <button onClick={()=>addEntity("star", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                        <path stroke="#000000" d="M5 0h6M3 1h10M2 2h4M10 2h4M1 3h3M12 3h3M1 4h2M13 4h2M0 5h3M13 5h3M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h3M13 10h3M1 11h2M13 11h2M1 12h3M12 12h3M2 13h4M10 13h4M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Star</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="hud">
                <div className="control-box" style={{maxHeight: 'calc(100vh - 6rem)', overflowY: 'scroll'}}>
                    <div id="entity-list">
                        {celestials.map((e, k) => <CelestialControlsItem key={e.id} entity={e} selectEntity={selectEntity} deleteEntity={deleteEntity} addEntity={showAddModal} currentSequence={selectedEntity?.getSequence()??[]}></CelestialControlsItem>)}
                    </div>
                </div>
                <div className="controls-wrapper">
                    { 
                    (selectedEntity && selectedEntity?.getSequence()?.length) &&
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
            </div>
       </>
    )
}