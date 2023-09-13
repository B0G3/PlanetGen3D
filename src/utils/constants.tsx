export const MAX_PLANET_RADIUS : number = 20;
export const MIN_PLANET_RADIUS : number = 1;

export const MAX_STAR_RADIUS : number = 60;
export const MIN_STAR_RADIUS : number = 1;

export const MAX_PLANET_STEEPNESS : number = 20;
export const MIN_PLANET_STEEPNESS : number = 0;

export const MAX_PLANET_MOUNTAINOUSNESS : number = 10;
export const MIN_PLANET_MOUNTAINOUSNESS : number = 0;

export const PLANET_COLORS : any = { // TODO: change any
    ice: [
        '#FFFFFF', // White
        '#F0F8FF', // Alice Blue
        '#E6F7FF', // Baby Blue Eyes
        '#D6EBFF', // Lavender Blue
        '#C4E1FF', // Periwinkle
        '#B0E2FF', // Light Ice Blue
        '#A4D3EE', // Light Sky Blue
        '#96CDE3'  // Pale Cerulean
    ],
    rock: [
        '#555555', // Dim Gray
        '#808080', // Gray
        '#A9A9A9', // Dark Gray
        '#D3D3D3', // Light Gray
        '#708090', // Slate Gray
        '#2F4F4F', // Dark Slate Gray
        '#4682B4', // Steel Blue
        '#5F9EA0', // Cadet Blue
        '#8B4513', // Saddle Brown
        '#A0522D', // Sienna
        '#CD853F', // Peru
        '#8A795D', // Rosy Brown
        '#696969', // Dim Gray
        '#556B2F', // Dark Olive Green
        '#9ACD32', // Yellow Green
        '#8FBC8F'  // Dark Sea Green
    ],
    grass: [
        '#228B22', // Forest Green
        '#008000', // Green
        '#006400', // Dark Green
        '#7CFC00', // Lawn Green
        '#ADFF2F', // Green Yellow
        '#556B2F', // Dark Olive Green
        '#9ACD32', // Yellow Green
        '#32CD32', // Lime Green
        '#7FFF00', // Chartreuse
        '#8FBC8F', // Dark Sea Green
        '#98FB98', // Pale Green
        '#9ACD32', // Yellow Green
        '#ADFF2F', // Green Yellow
        '#556B2F', // Dark Olive Green
        '#228B22', // Forest Green
        '#008000'  // Green
    ],
    sand: [
        '#D2B48C', // Tan
        '#C2B280', // Earth Yellow
        '#CDB79E', // Khaki
        '#D8C0AD', // Dusty Grey
        '#E0D3C3', // Desert Sand
        '#E6D5B8', // Fawn
        '#EAC083', // Dark Sand
        '#E9CBA7', // Light Brown
        '#D4C4A8', // Pale Oyster
        '#CDB7B5', // Pinkish Grey
        '#A89F91', // Driftwood
        '#8C8374'  // Taupe Gray
    ],
    water: [
        '#1E90FF', // Dodger Blue
        '#00BFFF', // Deep Sky Blue
        '#87CEEB', // Sky Blue
        '#ADD8E6', // Light Blue
        '#00CED1', // Dark Turquoise
        '#48D1CC', // Medium Turquoise
        '#20B2AA', // Light Sea Green
        '#5F9EA0'  // Cadet Blue
    ],
}

export const PLANET_PRESETS = [
    {ice: "#f0f3f4", rock: "#b2b2b2", grass: "#459e4f", sand: "#e8cd5d", water: "#27a1f9"}, // Earth-like
    {ice: "#efefef", rock: "#7590a7", grass: "#496880", sand: "#848a9b", water: "#9ac1eb"}, // Frozen
    {ice: "#656565", rock: "#8d8c8b", grass: "#995353", sand: "#5f5253", water: "#ff9969"}, // Crimson
    {ice: "#d7e382", rock: "#6d6c6c", grass: "#769a6f", sand: "#62725c", water: "#ddfc58"}, // Toxic
    {ice: "#6b5752", rock: "#8e7161", grass: "#cdba8e", sand: "#a28a78", water: "#2ce8ff"}, // Drought
    {ice: "#f9fdff", rock: "#6d7c81", grass: "#39644d", sand: "#9beaaf", water: "#4b7beb"}, // Mountains
    {ice: "#a4c7ef", rock: "#5247b0", grass: "#8b54b3", sand: "#b0a0e0", water: "#0eaede"}, // Crystals
    {ice: "#b7d3bd", rock: "#a8a6a5", grass: "#5f6665", sand: "#828487", water: "#758c65"}, // Decay
    {ice: "#e5bb76", rock: "#a75c41", grass: "#aa8a78", sand: "#e1cb9e", water: "#32908f"}, // Mesa
    {ice: "#8b7ba8", rock: "#635975", grass: "#5c4c7a", sand: "#977baf", water: "#6840d6"}, // Mercury
    {ice: "#c96b18", rock: "#5f5043", grass: "#8c5e35", sand: "#a07f62", water: "#4597ad"}, // Venus
    {ice: "#e2e9e0", rock: "#663b7f", grass: "#913470", sand: "#bb91a1", water: "#863dc8"}, // Pinkie
    {ice: "#752f2f", rock: "#553535", grass: "#752f2f", sand: "#9c5543", water: "#538ead"}, // Mars
]

export const PLANET_NAME_ADJECTIVES = [
    'Ethereal', 'Celestial', 'Mystic', 'Luminous', 'Radiant', 'Astral', 'Cosmic', 'Vibrant',
    'Cerulean', 'Verdant', 'Sapphire', 'Emerald', 'Ruby', 'Topaz', 'Golden', 'Silver',
    'Crystal', 'Pearlescent', 'Opalescent', 'Iridescent', 'Prismatic', 'Nebulous', 'Spectral', 'Aureate',
    'Hallowed', 'Resplendent', 'Diaphanous', 'Effulgent', 'Lustrous', 'Incandescent', 'Phosphorescent', 'Aurelian',
    'Cynosural', 'Stellar', 'Galactic', 'Infinite', 'Eternal', 'Endless', 'Boundless', 'Limitless',
    'Interstellar', 'Nebular', 'Auroral', 'Solemn', 'Vivid', 'Serene', 'Halcyon', 'Tranquil',
    'Serendipitous', 'Harmonious', 'Labyrinthine', 'Ecliptic', 'Lunar', 'Solar', 'Orbital', 'Polar',
    'Zephyrous', 'Ignited', 'Celestia', 'Horizon', 'Aurelia', 'Nebulon', 'Galactron', 'Heliux',
    'Aurum', 'Caelum', 'Vividus', 'Lunaris', 'Seraphic', 'Cynosural', 'Flaring', 'Zephyric',
    'Luminar', 'Oblivion', 'Etherean', 'Abyssal', 'Eclipsed', 'Radiant', 'Ephemeral', 'Eonian',
    'Echelon', 'Emanating', 'Halation', 'Incandescing', 'Luminating', 'Nebulizing', 'Oscillating', 'Phosphoring',
    'Quiescent', 'Radiating', 'Scintillating', 'Twinkling', 'Umbra', 'Vibrating', 'Wavering', 'Xenon',
    'Yonder', 'Zephyr', 'Adrift', 'Boundless', 'Calm', 'Distant', 'Ephemeral', 'Free',
    'Gentle', 'Harmonious', 'Infinite', 'Joyous', 'Kaleidoscopic', 'Luminous', 'Majestic', 'Nebulous'
  ];
  export const PLANET_NAME_NOUNS = [
    'Star', 'Planet', 'Moon', 'Galaxy', 'Sun', 'Nebula', 'Comet', 'Asteroid',
    'Orbit', 'Cosmos', 'Void', 'Supernova', 'Quasar', 'Nova', 'Pulsar', 'Cluster',
    'Infinity', 'Horizon', 'Eclipse', 'Celestial', 'Sapphire', 'Emerald', 'Ruby', 'Topaz',
    'Jewel', 'Umbra', 'Luminous', 'Radiant', 'Abyss', 'Oasis', 'Dream', 'Eon',
    'Wanderer', 'Epoch', 'Zephyr', 'Oblivion', 'Haven', 'Eon', 'Zephyr', 'Oblivion',
    'Haven', 'Mystic', 'Enigma', 'Whisper', 'Ethereal', 'Tranquil', 'Solstice', 'Cerulean',
    'Aurora', 'Horizon', 'Constellation', 'Stellar', 'Cosmic', 'Cynosure', 'Eclipse', 'Nebulous',
    'Radiance', 'Celestia', 'Stardust', 'Galactic', 'Serenity', 'Zodiac', 'Eternity', 'Ecliptic',
    'Paragon', 'Astro', 'Luminary', 'Astral', 'Verdant', 'Lustrous', 'Halcyon', 'Equinox',
    'Nebulous', 'Labyrinth', 'Spectre', 'Eclipse', 'Voyager', 'Wanderlust', 'Infinite', 'Harmony',
    'Aurelia', 'Nebulon', 'Galactron', 'Heliux', 'Aurum', 'Caelum', 'Vividus', 'Lunaris',
    'Seraph', 'Cynosura', 'Flare', 'Galaxia', 'Zephyrus', 'Ignis', 'Lucida', 'Oblivio',
    'Ecliptis', 'Celestius', 'Astoria', 'Chronos', 'Helix', 'Zirconia', 'Luminara', 'Nebuluna',
    'Plutonia', 'Spectra', 'Stellara', 'Umbrium', 'Veloria', 'Xenoria', 'Yondera', 'Zefyra'
  ]