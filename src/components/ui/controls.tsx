import React from "react";
import Celestial from "../../models/celestial";
import CelestialControlsItem from "./celestialControlsItem";
import Entity from "../../models/entity";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import SatelliteControl from "./satelliteControl";
import CelestialControl from "./celestialControl";
import { createRandomGas, createRandomStar, createRandomTerrestial } from "../../utils/generator";
import GlobalForm from "./globalForm";

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
    const [helpModal, setHelpModal] = React.useState(false);
    const [helpPulse, setHelpPulse] = React.useState(true);
    const [hud, setHud] = React.useState(true);

    React.useEffect(()=>{
        if(!selectedEntity) selectEntity([0]);
    }, [selectedEntity])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isInputFocused = document.activeElement instanceof HTMLInputElement ||
            document.activeElement instanceof HTMLTextAreaElement;

            if(!isInputFocused && (event.key === 'H' || event.key === 'h')){
                setHud((prev) => !prev)
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
  

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
        let match = true;
        indexSequence.forEach((e, index) => {
            if(currentSequence){
                if(currentSequence[index] === null) match = false;
                if(currentSequence[index] !== e) match = false;
            }
            else match = false;
        
        })
        if(indexSequence && match){
            if(indexSequence.length > 1){
                indexSequence.pop();
                selectEntity(indexSequence);
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

    const showHelpModal = () => {
        setHelpModal(true);
        if(helpPulse) setHelpPulse(false);
    }

    const updateSatellite = (data: Object) => {
        updateEntity(selectedEntity?.getSequence() ?? [], data, false);
    }

    const updateCelestial = (data: Object) => {
        updateEntity(selectedEntity?.getSequence() ?? [], data, true);
    }

    return (
       <>
            <div className="mobile-overlay">
                <div>
                    <div className="pc-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 89 60" shapeRendering="crispEdges">
                            <path stroke="#efefef" d="M2 0h55M2 1h55M0 2h2M57 2h2M0 3h2M57 3h2M0 4h2M57 4h2M0 5h2M57 5h2M0 6h2M7 6h45M57 6h2M0 7h2M6 7h1M51 7h2M57 7h2M0 8h2M6 8h1M51 8h2M57 8h2M0 9h2M6 9h1M51 9h2M57 9h2M64 9h23M0 10h2M6 10h1M51 10h2M57 10h2M64 10h23M0 11h2M6 11h1M51 11h2M57 11h2M62 11h2M87 11h2M0 12h2M6 12h1M51 12h2M57 12h2M62 12h2M87 12h2M0 13h2M6 13h1M16 13h2M22 13h2M33 13h2M40 13h2M51 13h2M57 13h2M62 13h2M68 13h15M87 13h2M0 14h2M6 14h1M17 14h2M21 14h2M34 14h2M39 14h2M51 14h2M57 14h2M62 14h2M66 14h2M83 14h2M87 14h2M0 15h2M6 15h1M18 15h4M35 15h2M38 15h2M51 15h2M57 15h2M62 15h2M66 15h2M83 15h2M87 15h2M0 16h2M6 16h1M19 16h2M36 16h3M51 16h2M57 16h2M62 16h2M66 16h2M69 16h13M83 16h2M87 16h2M0 17h2M6 17h1M18 17h4M36 17h3M51 17h2M57 17h2M62 17h2M66 17h2M69 17h13M83 17h2M87 17h2M0 18h2M6 18h1M17 18h2M21 18h2M35 18h2M38 18h2M51 18h2M57 18h2M62 18h2M66 18h2M83 18h2M87 18h2M0 19h2M6 19h1M16 19h2M22 19h2M34 19h2M39 19h2M51 19h2M57 19h2M62 19h2M66 19h2M76 19h2M80 19h2M83 19h2M87 19h2M0 20h2M6 20h1M33 20h2M40 20h2M51 20h2M57 20h2M62 20h2M66 20h2M80 20h2M83 20h2M87 20h2M0 21h2M6 21h1M51 21h2M57 21h2M62 21h2M66 21h2M83 21h2M87 21h2M0 22h2M6 22h1M51 22h2M57 22h2M62 22h2M66 22h2M83 22h2M87 22h2M0 23h2M6 23h1M51 23h2M57 23h2M62 23h2M68 23h15M87 23h2M0 24h2M6 24h1M51 24h2M57 24h2M62 24h2M87 24h2M0 25h2M6 25h1M51 25h2M57 25h2M62 25h2M87 25h2M0 26h2M6 26h1M51 26h2M57 26h2M62 26h2M87 26h2M0 27h2M6 27h1M25 27h6M51 27h2M57 27h2M62 27h2M68 27h15M87 27h2M0 28h2M6 28h1M23 28h10M51 28h2M57 28h2M62 28h2M66 28h2M83 28h2M87 28h2M0 29h2M6 29h1M22 29h3M31 29h3M51 29h2M57 29h2M62 29h2M66 29h2M83 29h2M87 29h2M0 30h2M6 30h1M21 30h2M33 30h2M51 30h2M57 30h2M62 30h2M66 30h2M69 30h13M83 30h2M87 30h2M0 31h2M6 31h1M20 31h3M33 31h3M51 31h2M57 31h2M62 31h2M66 31h2M69 31h13M83 31h2M87 31h2M0 32h2M6 32h1M20 32h2M34 32h2M51 32h2M57 32h2M62 32h2M66 32h2M83 32h2M87 32h2M0 33h2M6 33h1M51 33h2M57 33h2M62 33h2M66 33h2M76 33h2M80 33h2M83 33h2M87 33h2M0 34h2M6 34h1M51 34h2M57 34h2M62 34h2M66 34h2M80 34h2M83 34h2M87 34h2M0 35h2M6 35h1M51 35h2M57 35h2M62 35h2M66 35h2M83 35h2M87 35h2M0 36h2M6 36h1M51 36h2M57 36h2M62 36h2M66 36h2M83 36h2M87 36h2M0 37h2M7 37h45M57 37h2M62 37h2M68 37h15M87 37h2M0 38h2M57 38h2M62 38h2M87 38h2M0 39h2M57 39h2M62 39h2M87 39h2M0 40h2M57 40h2M62 40h2M87 40h2M0 41h2M12 41h27M43 41h2M46 41h2M49 41h2M57 41h2M62 41h2M68 41h5M87 41h2M0 42h2M11 42h1M39 42h1M43 42h2M46 42h2M49 42h2M57 42h2M62 42h2M66 42h2M73 42h2M87 42h2M0 43h2M7 43h2M10 43h1M40 43h1M43 43h2M46 43h2M49 43h2M57 43h2M62 43h2M66 43h2M73 43h2M87 43h2M0 44h2M7 44h2M10 44h2M39 44h2M57 44h2M62 44h2M66 44h2M73 44h2M87 44h2M0 45h2M7 45h2M10 45h31M43 45h2M46 45h2M49 45h2M57 45h2M62 45h2M66 45h2M73 45h2M87 45h2M0 46h2M57 46h2M62 46h2M66 46h2M73 46h2M87 46h2M0 47h4M55 47h4M62 47h2M66 47h2M73 47h2M87 47h2M2 48h2M55 48h2M62 48h2M66 48h2M73 48h2M87 48h2M2 49h3M54 49h3M62 49h2M66 49h2M73 49h2M87 49h2M2 50h3M54 50h3M62 50h2M66 50h2M73 50h2M87 50h2M5 51h49M62 51h2M66 51h9M87 51h2M5 52h49M62 52h2M68 52h5M87 52h2M21 53h2M35 53h2M62 53h2M87 53h2M21 54h2M35 54h2M62 54h2M87 54h2M12 55h9M37 55h9M62 55h2M87 55h2M12 56h2M44 56h2M62 56h2M87 56h2M12 57h2M44 57h2M62 57h2M87 57h2M12 58h34M62 58h27M14 59h30M64 59h23" />
                        </svg>
                    </div>
                    <div className="title">ERROR</div>
                    This app is meant for PC only.
                </div>
            </div>
            {(addModal.visible || helpModal) && <div className="modal-wrapper">
                {helpModal && 
                <div className="modal">
                    <div className="control-box" style={{'width': '460px'}}>
                        <div className="title">
                            <span>ABOUT</span>
                            <div className="buttons">
                                <button style={{width: '1rem', height: '1rem'}} onClick={()=>setHelpModal(false)}>
                                    <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                                </button>
                            </div>
                        </div>
                        <div className="about">
                            <p className="text-muted">
                            The sole purpose of creating this project was to improve both my React and Three.js skills. I aimed to develop something unique that I would genuinely enjoy coding, unlike yet another copy-paste app/website. The project is not intended to represent the real-life universe; there's no gravity nor collision. Instead, it focuses on creating planet and star constellations while allowing customization.
                            </p>
                            <p className="text-muted">
                            Although the project is mostly finished, there are aspects that could be improved and rewritten, along with new features I plan to add. However, I want to avoid getting stuck in a perfection loop. For now, I'm content with the current results. Please note that this app is designed for PC usage only.
                            </p>
                            <div className="controls">
                                <div>
                                Controls:
                                <div className="buttons">
                                    <div className="item">
                                        <button className="toggle unclickable" >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" shapeRendering="crispEdges"><path stroke="#252525" d="M0 0h16M0 1h16M0 2h16M0 6h16M0 7h16M0 8h16M0 12h16M0 13h16M0 14h16"></path></svg>
                                        </button>
                                        Toggle sub-entities
                                    </div>
                                    <div className="item">
                                        <button className="delete unclickable">
                                            <svg fill="#252525" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                                        </button>
                                        Delete entity
                                    </div>
                                    <div className="item">
                                        <button className="add unclickable">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                                <path stroke="#252525" d="M6 0h4M6 1h4M6 2h4M6 3h4M6 4h4M6 5h4M0 6h16M0 7h16M0 8h16M0 9h16M6 10h4M6 11h4M6 12h4M6 13h4M6 14h4M6 15h4" />
                                            </svg>
                                        </button>
                                        Add new sub-entity
                                    </div>
                                    <div className="item">
                                        <button className="unclickable" style={{'justifyContent': 'center'}}>
                                            H 
                                        </button>
                                        Toggle HUD
                                    </div>
                                </div>
                                </div>
                                <div>
                                    <div>Have fun,</div>
                                    <div>MARCIN AKA B0G3</div>
                                    <div className="text-muted">marcin.kostrzemski@gmail.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {addModal.visible && 
                <div className="modal">
                    <div className="control-box">
                        <div className="title">
                            <span>Add celestial</span>
                            <div className="buttons">
                                <button style={{width: '1rem', height: '1rem'}} onClick={()=>closeAddModal()}>
                                    <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg>
                                </button>
                            </div>
                        </div>
                        <div className="add-celestial">
                            <button disabled onClick={()=>addEntity("gas", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                        <path stroke="#252525" d="M5 0h6M3 1h10M2 2h4M10 2h4M1 3h3M12 3h3M1 4h2M6 4h4M13 4h2M0 5h3M5 5h6M13 5h3M0 6h2M4 6h8M14 6h2M0 7h2M4 7h8M14 7h2M0 8h2M4 8h8M14 8h2M0 9h2M4 9h8M14 9h2M0 10h3M5 10h6M13 10h3M1 11h2M6 11h4M13 11h2M1 12h3M12 12h3M2 13h4M10 13h4M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Gas</div>
                            </button>
                            <button onClick={()=>addEntity("terrestial", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                        <path stroke="#252525" d="M5 0h6M3 1h10M2 2h12M1 3h14M1 4h14M0 5h16M0 6h16M0 7h16M0 8h16M0 9h16M0 10h16M1 11h14M1 12h14M2 13h12M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Terrestial</div>
                            </button>
                            <button onClick={()=>addEntity("star", addModal.sequence)}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                        <path stroke="#252525" d="M5 0h6M3 1h10M2 2h4M10 2h4M1 3h3M12 3h3M1 4h2M13 4h2M0 5h3M13 5h3M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h3M13 10h3M1 11h2M13 11h2M1 12h3M12 12h3M2 13h4M10 13h4M3 14h10M5 15h6" />
                                    </svg>
                                </div>
                                <div className="name">Star</div>
                            </button>
                        </div>
                    </div>
                </div>}
            </div>}
            {hud && <div className="hud">
                <div className="control-box" style={{'top': '1rem', 'left': '1rem', 'position': 'absolute', 'zIndex': 10}}>
                    <div className="title">
                        Global settings
                        <div className="toggle">
                            <button onClick={()=>showHelpModal()} id="about" className={helpPulse?'pulse':''}>
                                {/* <svg fill="#252525" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" version="1.1"><polygon points="365.71 231.62 365.71 195.05 402.29 195.05 402.29 158.48 438.86 158.48 438.86 121.9 475.43 121.9 475.43 85.333 512 85.333 512 36.571 475.43 36.571 475.43 0 426.67 0 426.67 36.571 390.1 36.571 390.1 73.143 353.52 73.143 353.52 109.71 316.95 109.71 316.95 146.29 280.38 146.29 280.38 182.86 231.62 182.86 231.62 146.29 195.05 146.29 195.05 109.71 158.48 109.71 158.48 73.143 121.9 73.143 121.9 36.571 85.333 36.571 85.333 0 36.571 0 36.571 36.571 0 36.571 0 85.333 36.571 85.333 36.571 121.9 73.143 121.9 73.143 158.48 109.71 158.48 109.71 195.05 146.29 195.05 146.29 231.62 182.86 231.62 182.86 280.38 146.29 280.38 146.29 316.95 109.71 316.95 109.71 353.52 73.143 353.52 73.143 390.1 36.571 390.1 36.571 426.67 0 426.67 0 475.43 36.571 475.43 36.571 512 85.333 512 85.333 475.43 121.9 475.43 121.9 438.86 158.48 438.86 158.48 402.29 195.05 402.29 195.05 365.71 231.62 365.71 231.62 329.14 280.38 329.14 280.38 365.71 316.95 365.71 316.95 402.29 353.52 402.29 353.52 438.86 390.1 438.86 390.1 475.43 426.67 475.43 426.67 512 475.43 512 475.43 475.43 512 475.43 512 426.67 475.43 426.67 475.43 390.1 438.86 390.1 438.86 353.52 402.29 353.52 402.29 316.95 365.71 316.95 365.71 280.38 329.14 280.38 329.14 231.62"></polygon></svg> */}
                                <svg style={{'rotate': '180deg'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                                <path stroke="#252525" d="M3 0h10M3 1h10M1 2h13M1 3h14M1 4h5M10 4h5M1 5h4M10 5h5M1 6h4M7 6h8M7 7h7M5 8h6M5 9h6M5 10h6M5 11h6M5 14h6M5 15h6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <GlobalForm></GlobalForm>
                    <div className="title">Celestial list</div>
                    <div style={{'margin': '4px 0 0 0 '}} id="entity-list">
                        {celestials.map((e, k) => <CelestialControlsItem key={e.id} entity={e} selectEntity={selectEntity} deleteEntity={deleteEntity} addEntity={showAddModal} currentSequence={selectedEntity?.getSequence()??[]}></CelestialControlsItem>)}
                    </div>
                </div>
                {/* <div className="controls-wrapper"> */}
                    { 
                    (selectedEntity && selectedEntity?.getSequence()?.length) &&
                    <div className="control-box" style={{'top': '1rem', 'right': '1rem', 'position': 'absolute'}}>
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
                {/* </div> */}
            </div>}
       </>
    )
}