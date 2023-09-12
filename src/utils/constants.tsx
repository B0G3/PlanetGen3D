export const MAX_PLANET_RADIUS : number = 20;
export const MIN_PLANET_RADIUS : number = 1;

export const MAX_STAR_RADIUS : number = 60;
export const MIN_STAR_RADIUS : number = 1;

export const MAX_PLANET_STEEPNESS : number = 10;
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