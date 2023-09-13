import { colord, extend, random } from "colord";
import hexColor from "../types/hexColor";
import { PLANET_COLORS, PLANET_PRESETS } from "../utils/constants";
import mixPlugin from "colord/plugins/mix";
import harmoniesPlugin from "colord/plugins/harmonies";

extend([harmoniesPlugin]);
extend([mixPlugin]);

interface PlanetColorsComputed{
    ice: Array<hexColor>;
    rock: Array<hexColor>;
    grass: Array<hexColor>;
    sand: Array<hexColor>;
    water: Array<hexColor>;

    // BIOME SPECIFIC
    // OCEAN DEPTHS
    deep_sand: Array<hexColor>;
    // deep_rock: Array<hexColor>;
  }

export default class planetColors{
    ice: hexColor = "#000000";
    rock: hexColor = "#000000";
    grass: hexColor = "#000000";
    sand: hexColor = "#000000";
    water: hexColor = "#000000";

    variantCount: number = 3;
    needsUpdate: boolean = false;
    computed: PlanetColorsComputed = this.compute();

    randomize(){
        const baseColor = random();
        let tints = baseColor.tints(5)
        const harmonies = baseColor.harmonies("double-split-complementary")
        tints = tints.map((e, i) => colord(e).mix(harmonies[i], 0.5))
        const preset = PLANET_PRESETS[(Math.floor(Math.random() * PLANET_PRESETS.length))]
        this.ice = tints[4].mix(preset.ice, 0.6 + Math.random()*0.3).toHex() as hexColor;
        this.rock = tints[3].mix(preset.rock,  0.6 + Math.random()*0.3).toHex() as hexColor;
        this.grass = tints[2].mix(preset.grass,  0.6 + Math.random()*0.3).toHex() as hexColor;
        this.sand = tints[1].mix(preset.sand,  0.6 + Math.random()*0.3).toHex() as hexColor;
        this.water = tints[0].mix(preset.water,  0.6 + Math.random()*0.3).toHex() as hexColor;

        // this.ice = tints[4].mix(preset.ice, 1).toHex() as hexColor;
        // this.rock = tints[3].mix(preset.rock,  1).toHex() as hexColor;
        // this.grass = tints[2].mix(preset.grass,  1).toHex() as hexColor;
        // this.sand = tints[1].mix(preset.sand,  1).toHex() as hexColor;
        // this.water = tints[0].mix(preset.water,  1).toHex() as hexColor;
        this.compute();
    }

    getVariant(key: string){
        const rand = Math.floor(Math.random() * this.variantCount);
        return this.computed[key as keyof PlanetColorsComputed][rand];
    }

    computeSingle(key: string){
        let maxDiff = 0.08;
        if(key === 'water') maxDiff = 0.16;
        const count = this.variantCount;
        const baseColor = this[key as keyof planetColors];
        const variants = [];
        for(let i = 1; i <= count; i++){
            variants.push(colord(baseColor as hexColor).darken(-maxDiff + (maxDiff/count)*i + 0.1).toHex())
        }

        return variants as Array<hexColor>;
    }

    setIce(value: hexColor){
        this.ice = value;
        this.computed.ice = this.computeSingle('ice');
    }
    setRock(value: hexColor){
        this.rock = value;
        this.computed.rock = this.computeSingle('rock');
    }
    setGrass(value: hexColor){
        this.grass = value;
        this.computed.grass = this.computeSingle('grass');
    }
    setSand(value: hexColor){
        this.sand = value;
        this.computed.sand = this.computeSingle('sand');
        this.computed.deep_sand = this._computeDeepSand();
    }
    setWater(value: hexColor){
        this.water = value;
        this.computed.water = this.computeSingle('water');
    }

    compute(){
        this.computed = {
            ice: this.computeSingle('ice'),
            rock: this.computeSingle('rock'),
            grass: this.computeSingle('grass'),
            sand: this.computeSingle('sand'),
            water: this.computeSingle('water'),

            deep_sand: this._computeDeepSand(),
        }
        return this.computed;
    }

    set(ice : hexColor, rock : hexColor, grass : hexColor, sand : hexColor, water : hexColor){
        this.ice = ice;
        this.rock = rock;
        this.grass = grass;
        this.sand = sand;
        this.water = water;

        this.compute();
    }

    // BIOME SPECIFIC
    _computeDeepSand(){
        const baseColor = this.sand;
        let maxDiff = 0.08;
        const count = this.variantCount;
        const variants = [];
        for(let i = 1; i <= count; i++){
            variants.push(colord(baseColor as hexColor).darken(0.15).darken(-maxDiff + (maxDiff/count)*i + 0.1).toHex())
        }

        return variants as Array<hexColor>;
    }
}