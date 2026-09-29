import fs from 'node:fs';
import path from 'node:path';
import { PixelCanvas } from './pixel-canvas.js';

const PUBLIC_ASSETS = path.resolve('public/assets');
const SRC_ASSETS = path.resolve('src/assets');

function saveAsset(subPath, canvas) {
  const p1 = path.join(PUBLIC_ASSETS, subPath);
  const p2 = path.join(SRC_ASSETS, subPath);
  canvas.save(p1);
  canvas.save(p2);
  console.log(`Generated: ${subPath} (${canvas.width}x${canvas.height})`);
}

// ============================================================================
// 🎨 "NEO-TOKYO GOLDEN HOUR & WARM CONTEMPORARY TECH" MASTER PALETTE
// ============================================================================
const PALETTE = {
  trans: [0, 0, 0, 0],

  // Warm Darks (Never flat dead black; rich espresso, dark mahogany, warm obsidian)
  black: [16, 14, 22, 255],
  darkEspresso: [28, 20, 26, 255],
  obsidian: [24, 28, 38, 255],
  slateDark: [36, 44, 58, 255],
  slateMid: [58, 70, 92, 255],
  slateLight: [92, 108, 138, 255],
  slateHighlight: [142, 162, 198, 255],

  // Golden Hour & Twilight Sky Gradient
  twilightPurple: [42, 24, 68, 255],
  twilightPlum: [78, 30, 80, 255],
  sunsetMagenta: [140, 42, 92, 255],
  sunsetCoral: [216, 76, 52, 255],
  sunsetOrange: [242, 134, 40, 255],
  sunsetGold: [250, 190, 58, 255],
  sunsetWarmYellow: [255, 230, 130, 255],
  sunGlare: [255, 250, 220, 255],

  // Warm Contemporary Woods
  honeyOakLight: [232, 172, 110, 255],
  honeyOakMid: [198, 136, 78, 255],
  honeyOakDark: [154, 98, 48, 255],
  honeyOakShadow: [112, 68, 32, 255],
  birchLight: [242, 218, 174, 255],
  birchMid: [218, 184, 138, 255],
  birchDark: [180, 142, 98, 255],
  mahoganyLight: [148, 58, 44, 255],
  mahoganyMid: [108, 38, 28, 255],
  mahoganyDark: [74, 24, 18, 255],

  // Warm Marble & Flooring
  marbleCreamLight: [250, 246, 236, 255],
  marbleCreamMid: [236, 226, 208, 255],
  marbleCreamDark: [212, 198, 176, 255],
  terracottaLight: [214, 112, 84, 255],
  terracottaMid: [182, 84, 58, 255],
  terracottaDark: [142, 58, 38, 255],
  rugNavy: [26, 38, 64, 255],
  rugTeal: [28, 92, 108, 255],
  rugGoldTrim: [228, 176, 64, 255],

  // Contemporary Wall & Architectural Trim
  wallCream: [242, 238, 230, 255],
  wallGreige: [222, 216, 204, 255],
  wallShadow: [188, 180, 166, 255],
  brassLight: [255, 222, 110, 255],
  brassMid: [226, 178, 54, 255],
  brassDark: [168, 124, 30, 255],

  // Lush Botanical Greenery
  leafHighlight: [148, 240, 172, 255],
  leafLight: [82, 198, 118, 255],
  leafMid: [44, 142, 78, 255],
  leafDark: [24, 92, 48, 255],
  leafDeep: [14, 56, 30, 255],
  potTerracotta: [198, 92, 62, 255],
  potTerracottaShadow: [146, 62, 40, 255],

  // Vibrant Cyber & Office Accents
  cyberCyan: [0, 220, 245, 255],
  cyberCyanLight: [160, 248, 255, 255],
  cyberBlue: [40, 120, 240, 255],
  neonGreen: [40, 230, 120, 255],
  neonAmber: [255, 170, 30, 255],
  neonCoral: [255, 75, 95, 255],
  electricPurple: [175, 65, 245, 255],
  hotPink: [255, 65, 150, 255],
  postItYellow: [255, 240, 85, 255],
  postItPink: [255, 130, 175, 255],
  postItMint: [110, 245, 190, 255],
  coffeeBrown: [86, 48, 28, 255],
  coffeeCream: [215, 185, 155, 255],

  // Glass & Reflections
  glassSunsetSky: [180, 95, 110, 200],
  glassSunsetHighlight: [255, 180, 130, 220],
  glassClearBlue: [80, 160, 210, 160],
  glassBrightGlint: [255, 255, 255, 240],

  // Exterior Street Elements
  streetPaveLight: [145, 138, 132, 255],
  streetPaveMid: [118, 112, 106, 255],
  streetPaveDark: [94, 88, 82, 255],
  roadAsphalt: [38, 40, 48, 255],
  roadMarkingAmber: [248, 190, 48, 255],
  cabYellow: [255, 204, 0, 255],
  cabYellowDark: [218, 162, 0, 255],
  ginkgoGold: [255, 205, 45, 255],
  ginkgoAmber: [228, 158, 28, 255],
  ginkgoOrange: [195, 110, 20, 255],

  // Characters
  skinLight: [255, 215, 185, 255],
  skinLightShadow: [228, 180, 150, 255],
  skinMid: [228, 178, 142, 255],
  skinMidShadow: [192, 140, 105, 255],
  skinDark: [165, 115, 85, 255],
  skinDarkShadow: [128, 82, 56, 255],
  hairJetBlack: [24, 22, 30, 255],
  hairDarkBrown: [58, 38, 28, 255],
  hairGoldenBlonde: [240, 200, 95, 255],
  hairAuburn: [168, 68, 38, 255],
  white: [255, 255, 255, 255],
  clothWhite: [245, 248, 252, 255],
  clothTeal: [18, 128, 142, 255],
  clothPlum: [112, 38, 78, 255],
  clothExecutiveNavy: [24, 42, 74, 255],
  clothCrimson: [196, 38, 56, 255],
  clothMustard: [218, 156, 32, 255],
  clothCharcoal: [48, 52, 64, 255]
};

// ============================================================================
// 1. ENVIRONMENT TILES (32x32)
// ============================================================================

// Smooth Honey-Oak Parquet Floor for Main Office (Seamless, low-contrast)
function generateFloorOffice() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.honeyOakMid);

  // Subtle horizontal plank seams (8px tall planks)
  for (let y = 0; y < 32; y += 8) {
    c.fillRect(0, y, 32, 1, ...PALETTE.honeyOakLight);
    c.fillRect(0, y + 7, 32, 1, ...PALETTE.honeyOakDark);
    // Staggered vertical plank ends
    const staggerX = (y % 16 === 0) ? 14 : 26;
    c.fillRect(staggerX, y, 1, 8, ...PALETTE.honeyOakDark);
  }

  saveAsset('environment/floor_office.png', c);
}

// Polished Ivory Marble Floor (Reception / Lobby) (Clean, low-contrast luxury)
function generateFloorMarble() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.marbleCreamMid);

  // Very subtle 1px mortar border
  c.strokeRect(0, 0, 32, 32, ...PALETTE.marbleCreamDark);
  // Extremely subtle warm specular sheen in center
  c.fillRect(8, 8, 16, 16, ...PALETTE.marbleCreamLight);

  saveAsset('environment/floor_marble.png', c);
}

// Executive Woven Carpet (Manager's Office) (Clean, non-repetitive, no polka-dots)
function generateFloorCarpet() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.rugNavy);

  // Subtle microscopic woven texture with minimal contrast
  for (let y = 0; y < 32; y += 2) {
    for (let x = (y % 4 === 0 ? 0 : 2); x < 32; x += 4) {
      c.setPixel(x, y, 32, 46, 76, 255);
    }
  }

  saveAsset('environment/floor_carpet.png', c);
}

// High-Tech Raised Access Datacenter Floor (IT Room) (Clean, zero noisy grid lines)
function generateFloorDark() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.obsidian);

  // Subtle raised floor panel bevel
  c.strokeRect(0, 0, 32, 32, ...PALETTE.slateDark);
  c.fillRect(1, 1, 30, 1, ...PALETTE.slateMid);
  // 4 corner screw dimples
  c.setPixel(2, 2, ...PALETTE.darkEspresso);
  c.setPixel(29, 2, ...PALETTE.darkEspresso);
  c.setPixel(2, 29, ...PALETTE.darkEspresso);
  c.setPixel(29, 29, ...PALETTE.darkEspresso);

  saveAsset('environment/floor_dark.png', c);
}

// Architectural Contemporary Wall with Walnut Baseboard
function generateWallOffice() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.wallCream);

  // Top ceiling moulding
  c.fillRect(0, 0, 32, 3, ...PALETTE.wallShadow);
  c.fillRect(0, 0, 32, 1, ...PALETTE.white);

  // Rich walnut wood baseboard at bottom
  c.fillRect(0, 24, 32, 8, ...PALETTE.mahoganyMid);
  c.fillRect(0, 24, 32, 1, ...PALETTE.mahoganyLight);
  c.fillRect(0, 31, 32, 1, ...PALETTE.mahoganyDark);

  saveAsset('environment/wall_office.png', c);
}

// Architectural Glass Window Panel (Smooth sunset reflection, NO miniature cities!)
function generateWallWindow() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.wallCream);

  // Dark architectural window frame
  c.fillRect(1, 2, 30, 22, ...PALETTE.darkEspresso);

  // Smooth glass pane with warm golden-hour sky gradient
  c.fillRect(3, 4, 26, 6, ...PALETTE.twilightPurple);
  c.fillRect(3, 10, 26, 6, ...PALETTE.sunsetMagenta);
  c.fillRect(3, 16, 26, 6, ...PALETTE.sunsetOrange);

  // Vertical bronze mullion divider
  c.fillRect(15, 3, 2, 20, ...PALETTE.brassDark);

  // Diagonal reflection gleam across the glass
  for (let i = 0; i < 18; i++) {
    c.setPixel(4 + i, 5 + Math.floor(i * 0.8), ...PALETTE.glassSunsetHighlight);
  }

  // Baseboard
  c.fillRect(0, 24, 32, 8, ...PALETTE.mahoganyMid);
  c.fillRect(0, 24, 32, 1, ...PALETTE.mahoganyLight);

  saveAsset('environment/wall_window.png', c);
}

// Contemporary Glass Entrance Doors
function generateDoorOffice() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.wallCream);

  // Bronze door frame
  c.fillRect(1, 2, 30, 30, ...PALETTE.darkEspresso);
  c.strokeRect(1, 2, 30, 30, ...PALETTE.brassMid);

  // Glass panels with warm golden glow
  c.fillRect(3, 4, 12, 26, ...PALETTE.sunsetWarmYellow);
  c.fillRect(17, 4, 12, 26, ...PALETTE.sunsetWarmYellow);

  // Polished brass handles
  c.fillRect(13, 14, 2, 8, ...PALETTE.brassLight);
  c.fillRect(17, 14, 2, 8, ...PALETTE.brassLight);

  saveAsset('environment/door_office.png', c);
}

// Warm Interlocking Stone Sidewalk (Clean, low-contrast, non-repetitive)
function generateExteriorSidewalk() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.streetPaveMid);

  // Subtle clean 1px paver seams
  c.strokeRect(0, 0, 32, 32, ...PALETTE.streetPaveDark);
  c.fillRect(1, 1, 30, 1, ...PALETTE.streetPaveLight);

  saveAsset('environment/exterior_sidewalk.png', c);
}

// Plain Asphalt Road Tile (No lines! Clean dark asphalt)
function generateExteriorRoad() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.roadAsphalt);
  saveAsset('environment/exterior_road.png', c);
}

// Dedicated Centerline Road Tile (ONLY placed on the middle row!)
function generateExteriorRoadLine() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.roadAsphalt);

  // Single clean golden dashed road stripe
  c.fillRect(4, 14, 24, 4, ...PALETTE.roadMarkingAmber);
  c.fillRect(4, 15, 24, 2, ...PALETTE.sunGlare);

  saveAsset('environment/exterior_road_line.png', c);
}

// Park Grass Tile with Subtle Tufts
function generateExteriorGrass() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.leafDark);

  // Natural subtle grass texture
  for (let y = 3; y < 30; y += 8) {
    for (let x = 3; x < 30; x += 8) {
      c.fillRect(x, y, 1, 3, ...PALETTE.leafMid);
      c.fillRect(x + 1, y - 1, 1, 4, ...PALETTE.leafLight);
    }
  }

  saveAsset('environment/exterior_grass.png', c);
}

// Modern Corporate Building Granite & Bronze Facade (Clean, non-repetitive)
function generateExteriorWall() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.darkEspresso);

  // Smooth architectural bronze panels
  c.strokeRect(0, 0, 32, 32, ...PALETTE.brassDark);
  c.fillRect(1, 1, 30, 30, ...PALETTE.obsidian);
  c.fillRect(1, 1, 30, 1, 48, 54, 70, 255); // Top edge bevel

  saveAsset('environment/exterior_wall.png', c);
}

// Soft Semi-Transparent Contact Drop Shadow for Characters & Objects
function generateContactShadow() {
  const c = new PixelCanvas(48, 24);
  // Transparent background, draw smooth elliptical gradient shadow
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 48; x++) {
      const dx = (x - 24) / 22;
      const dy = (y - 12) / 10;
      const dist = dx * dx + dy * dy;
      if (dist <= 1.0) {
        const alpha = Math.floor((1.0 - dist) * 90); // max alpha ~90 out of 255
        c.setPixel(x, y, 0, 0, 0, alpha);
      }
    }
  }
  saveAsset('environment/shadow_contact.png', c);
}

// Grand Headquarters Entrance with Warm Golden Spilling Light
function generateBuildingEntrance() {
  const c = new PixelCanvas(64, 48);
  c.fillRect(0, 0, 64, 48, ...PALETTE.darkEspresso);

  // Grand architectural bronze arch
  c.strokeRect(2, 2, 60, 46, ...PALETTE.brassMid);
  c.fillRect(4, 4, 56, 44, ...PALETTE.obsidian);

  // Illuminated warm golden canopy & sign header
  c.fillRect(6, 6, 52, 8, ...PALETTE.sunsetOrange);
  c.fillRect(8, 7, 48, 6, ...PALETTE.sunsetWarmYellow);
  c.fillRect(10, 8, 44, 4, ...PALETTE.sunGlare);

  // Double glass revolving/sliding doors with warm golden lobby interior
  c.fillRect(8, 16, 22, 30, ...PALETTE.sunsetWarmYellow);
  c.fillRect(34, 16, 22, 30, ...PALETTE.sunsetWarmYellow);

  // Glass specular reflections
  for (let i = 0; i < 18; i++) {
    c.setPixel(10 + i, 18 + i, ...PALETTE.white);
    c.setPixel(36 + i, 18 + i, ...PALETTE.white);
  }

  // Polished brass revolving door axis & handles
  c.fillRect(18, 16, 2, 30, ...PALETTE.brassDark);
  c.fillRect(44, 16, 2, 30, ...PALETTE.brassDark);

  // Welcome carpet mat in rich burgundy with gold border
  c.fillRect(14, 43, 36, 5, ...PALETTE.mahoganyMid);
  c.strokeRect(14, 43, 36, 5, ...PALETTE.brassMid);

  saveAsset('environment/building_entrance.png', c);
}

// Glowing Neon Headquarters Sign (Amber & Cyan)
function generateExteriorSign() {
  const c = new PixelCanvas(96, 32);
  c.fillRect(0, 0, 96, 32, ...PALETTE.darkEspresso);
  c.strokeRect(1, 1, 94, 30, ...PALETTE.brassMid);
  c.strokeRect(3, 3, 90, 26, ...PALETTE.obsidian);

  // Warm amber glowing background halo
  c.fillRect(6, 6, 84, 20, ...PALETTE.sunsetOrange);
  c.fillRect(8, 8, 80, 16, ...PALETTE.sunsetGold);

  // 5x7 block font for "CYBER CO"
  const font5x7 = {
    C: [' 1111', '11   ', '11   ', '11   ', '11   ', '11   ', ' 1111'],
    Y: ['11  11', '11  11', ' 1111 ', '  11  ', '  11  ', '  11  ', '  11  '],
    B: ['1111 ', '11  11', '11  11', '11111 ', '11  11', '11  11', '1111 '],
    E: ['11111', '11   ', '11   ', '1111 ', '11   ', '11   ', '11111'],
    R: ['1111 ', '11  11', '11  11', '1111 ', '11 11 ', '11  11', '11  11'],
    O: [' 1111 ', '11  11', '11  11', '11  11', '11  11', '11  11', ' 1111 '],
    ' ': ['  ', '  ', '  ', '  ', '  ', '  ', '  ']
  };

  const text = 'CYBER CO';
  let curX = 14;
  for (const char of text) {
    const glyph = font5x7[char];
    if (glyph) {
      for (let r = 0; r < glyph.length; r++) {
        for (let col = 0; col < glyph[r].length; col++) {
          if (glyph[r][col] === '1') {
            c.fillRect(curX + col * 2, 9 + r * 2, 2, 2, ...PALETTE.white);
          }
        }
      }
      curX += (glyph[0].length * 2) + 2;
    }
  }

  // Cyan corner LED studs
  c.fillRect(2, 2, 3, 3, ...PALETTE.cyberCyan);
  c.fillRect(91, 2, 3, 3, ...PALETTE.cyberCyan);
  c.fillRect(2, 27, 3, 3, ...PALETTE.cyberCyan);
  c.fillRect(91, 27, 3, 3, ...PALETTE.cyberCyan);

  saveAsset('environment/exterior_sign.png', c);
}

// Warm Ornate Streetlamp with Soft Amber Light Cone
function generateExteriorStreetLamp() {
  const c = new PixelCanvas(32, 64);

  // Cast iron lamp pole with brass accents
  c.fillRect(15, 10, 3, 54, ...PALETTE.darkEspresso);
  c.fillRect(13, 58, 7, 6, ...PALETTE.obsidian);
  c.fillRect(14, 30, 5, 2, ...PALETTE.brassMid); // decorative ring

  // Lamp lantern head
  c.fillRect(9, 6, 15, 4, ...PALETTE.brassMid);
  c.fillRect(10, 10, 13, 8, ...PALETTE.sunsetWarmYellow);
  c.fillRect(12, 11, 9, 6, ...PALETTE.sunGlare); // glowing bright core

  // Atmospheric warm sodium light cone radiating downward
  for (let y = 18; y < 64; y += 2) {
    const spread = Math.floor((y - 18) * 0.45);
    c.fillRect(16 - spread, y, spread * 2, 1, 255, 200, 80, 28);
  }

  saveAsset('environment/exterior_lamp.png', c);
}

// Golden-Hour Ginkgo / Autumn Maple Tree
function generateExteriorTree() {
  const c = new PixelCanvas(32, 48);

  // Warm wood trunk
  c.fillRect(14, 28, 4, 16, ...PALETTE.honeyOakDark);
  c.fillRect(15, 28, 2, 16, ...PALETTE.honeyOakMid);

  // Terracotta & Brass planter
  c.fillRect(8, 40, 16, 8, ...PALETTE.terracottaMid);
  c.strokeRect(8, 40, 16, 8, ...PALETTE.terracottaDark);
  c.fillRect(7, 39, 18, 2, ...PALETTE.brassMid);

  // Brilliant Golden Ginkgo Foliage canopy
  c.fillRect(5, 6, 22, 24, ...PALETTE.ginkgoOrange);
  c.fillRect(7, 4, 18, 26, ...PALETTE.ginkgoAmber);
  c.fillRect(8, 7, 16, 18, ...PALETTE.ginkgoGold);
  c.fillRect(10, 9, 12, 12, ...PALETTE.sunsetWarmYellow);
  c.fillRect(12, 11, 6, 6, ...PALETTE.sunGlare); // Sunlit peak highlight

  saveAsset('environment/exterior_tree.png', c);
}

// Futuristic Sunflower-Yellow & Black Cyber-Cab (Exterior Prop)
function generateCyberCab() {
  const c = new PixelCanvas(64, 32);

  // Aerodynamic body
  c.fillRect(8, 12, 48, 14, ...PALETTE.cabYellow);
  c.fillRect(12, 6, 36, 8, ...PALETTE.cabYellow);

  // Tinted aerodynamic glass canopy
  c.fillRect(14, 8, 32, 6, ...PALETTE.obsidian);
  for (let i = 0; i < 12; i++) {
    c.setPixel(16 + i, 8 + (i % 5), ...PALETTE.sunsetCoral);
  }

  // Black cyber trim & rocker panels
  c.fillRect(6, 22, 52, 4, ...PALETTE.darkEspresso);

  // Glowing cyan headlights & ruby taillights
  c.fillRect(54, 15, 3, 4, ...PALETTE.cyberCyan);
  c.fillRect(7, 15, 2, 4, ...PALETTE.neonCoral);

  // Magnetic levitation / low-profile cyber wheels
  c.fillRect(14, 24, 10, 6, ...PALETTE.black);
  c.fillRect(16, 26, 6, 2, ...PALETTE.cyberCyan);
  c.fillRect(40, 24, 10, 6, ...PALETTE.black);
  c.fillRect(42, 26, 6, 2, ...PALETTE.cyberCyan);

  // Taxi sign on roof
  c.fillRect(26, 3, 12, 3, ...PALETTE.black);
  c.fillRect(28, 4, 8, 2, ...PALETTE.sunsetWarmYellow);

  saveAsset('environment/cyber_cab.png', c);
}

// ============================================================================
// 2. OFFICE OBJECTS & FURNITURE (Rich Warm Contemporary Style)
// ============================================================================

// Contemporary Birch & Walnut Workstation Desk
function generateDesk() {
  const c = new PixelCanvas(64, 32);

  // Desk top surface in warm Scandinavian birch
  c.fillRect(2, 4, 60, 14, ...PALETTE.birchMid);
  c.fillRect(2, 4, 60, 2, ...PALETTE.birchLight); // Chamfered top edge
  c.fillRect(2, 17, 60, 2, ...PALETTE.birchDark);  // Under-rim shadow

  // Walnut legs and drawer pedestal
  c.fillRect(4, 19, 4, 12, ...PALETTE.mahoganyMid);
  c.fillRect(44, 19, 16, 12, ...PALETTE.mahoganyMid);

  // Drawers with brushed brass bar pulls
  c.fillRect(46, 21, 12, 4, ...PALETTE.mahoganyDark);
  c.fillRect(50, 22, 4, 2, ...PALETTE.brassLight);
  c.fillRect(46, 26, 12, 4, ...PALETTE.mahoganyDark);
  c.fillRect(50, 27, 4, 2, ...PALETTE.brassLight);

  // Small potted succulent on desk corner
  c.fillRect(6, 11, 4, 4, ...PALETTE.potTerracotta);
  c.fillRect(7, 8, 3, 3, ...PALETTE.leafLight);

  saveAsset('objects/desk.png', c);
}

// Player's Workstation: Dual Glowing SOC Monitors, RGB Keyboard, Clutter
function generateDeskWithPC() {
  const c = new PixelCanvas(64, 32);

  // Base birch desk
  c.fillRect(2, 4, 60, 14, ...PALETTE.birchMid);
  c.fillRect(2, 4, 60, 2, ...PALETTE.birchLight);
  c.fillRect(2, 17, 60, 2, ...PALETTE.birchDark);
  c.fillRect(4, 19, 4, 12, ...PALETTE.mahoganyMid);
  c.fillRect(44, 19, 16, 12, ...PALETTE.mahoganyMid);
  c.fillRect(46, 21, 12, 4, ...PALETTE.mahoganyDark);
  c.fillRect(50, 22, 4, 2, ...PALETTE.brassLight);
  c.fillRect(46, 26, 12, 4, ...PALETTE.mahoganyDark);
  c.fillRect(50, 27, 4, 2, ...PALETTE.brassLight);

  // Monitor 1: Primary Cyber Analyst Display (Curved Ultrawide)
  c.fillRect(12, 0, 22, 13, ...PALETTE.darkEspresso);
  c.fillRect(13, 1, 20, 10, ...PALETTE.black);
  c.fillRect(14, 2, 18, 8, ...PALETTE.slateDark);
  // Terminal code lines in Cyan & Green
  c.fillRect(15, 3, 10, 1, ...PALETTE.cyberCyan);
  c.fillRect(15, 5, 14, 1, ...PALETTE.cyberCyanLight);
  c.fillRect(15, 7, 7, 1, ...PALETTE.neonGreen);
  c.fillRect(21, 13, 4, 2, ...PALETTE.brassMid); // Brushed brass stand

  // Monitor 2: Threat Topology Screen (Right)
  c.fillRect(36, 1, 16, 11, ...PALETTE.darkEspresso);
  c.fillRect(37, 2, 14, 9, ...PALETTE.black);
  c.fillRect(38, 3, 12, 7, ...PALETTE.twilightPurple);
  // Multi-colored incident graph nodes
  c.setPixel(40, 5, ...PALETTE.neonCoral);
  c.setPixel(44, 7, ...PALETTE.neonAmber);
  c.setPixel(47, 5, ...PALETTE.neonGreen);
  c.fillRect(41, 6, 3, 1, ...PALETTE.white);
  c.fillRect(43, 12, 3, 2, ...PALETTE.brassMid);

  // RGB Mechanical Keyboard & Mouse
  c.fillRect(15, 13, 15, 4, ...PALETTE.obsidian);
  c.fillRect(16, 14, 13, 2, ...PALETTE.cyberCyan);
  c.fillRect(32, 14, 3, 3, ...PALETTE.darkEspresso); // Mouse

  // Clutter: Yellow Post-it Note & Ceramic Coffee Mug
  c.fillRect(8, 12, 4, 4, ...PALETTE.postItYellow);
  c.fillRect(54, 10, 4, 5, ...PALETTE.terracottaLight); // Ceramic Mug
  c.fillRect(58, 11, 1, 3, ...PALETTE.terracottaLight); // Handle
  c.fillRect(55, 11, 2, 2, ...PALETTE.coffeeBrown);     // Coffee

  saveAsset('objects/desk_with_pc.png', c);
}

// Ergonomic Contemporary Mesh Office Chair (Slate & Teal)
function generateOfficeChair() {
  const c = new PixelCanvas(32, 32);

  // Wheels / 5-star base in brushed aluminum
  c.fillRect(10, 26, 12, 4, ...PALETTE.obsidian);
  c.fillRect(15, 23, 2, 5, ...PALETTE.brassMid);

  // Mesh seat cushion
  c.fillRect(7, 15, 18, 8, ...PALETTE.clothTeal);
  c.fillRect(8, 16, 16, 6, ...PALETTE.slateDark);

  // Armrests
  c.fillRect(5, 14, 3, 8, ...PALETTE.brassMid);
  c.fillRect(24, 14, 3, 8, ...PALETTE.brassMid);

  // Ergonomic curved backrest with breathable mesh
  c.fillRect(8, 5, 16, 11, ...PALETTE.clothTeal);
  c.fillRect(9, 6, 14, 9, ...PALETTE.slateDark);
  c.fillRect(10, 7, 12, 2, ...PALETTE.cyberCyan); // Lumbar support

  saveAsset('objects/chair.png', c);
}

// Enterprise Datacenter Server Rack with Rainbow Activity LEDs
function generateServerRack() {
  const c = new PixelCanvas(32, 64);
  c.fillRect(2, 2, 28, 60, ...PALETTE.obsidian);
  c.strokeRect(2, 2, 28, 60, ...PALETTE.slateDark);

  // 4 high-density server rack chassis
  for (let unit = 0; unit < 4; unit++) {
    const y = 6 + unit * 14;
    c.fillRect(5, y, 22, 12, ...PALETTE.darkEspresso);
    c.strokeRect(5, y, 22, 12, ...PALETTE.slateMid);

    // Intake ventilation louvers
    c.fillRect(7, y + 2, 10, 1, ...PALETTE.black);
    c.fillRect(7, y + 5, 10, 1, ...PALETTE.black);
    c.fillRect(7, y + 8, 10, 1, ...PALETTE.black);

    // Multi-colored activity LEDs in columns
    c.fillRect(19, y + 2, 2, 2, ...PALETTE.neonGreen);
    c.fillRect(23, y + 2, 2, 2, unit === 1 ? PALETTE.neonAmber : PALETTE.cyberCyan);
    c.fillRect(19, y + 6, 2, 2, unit === 2 ? PALETTE.hotPink : PALETTE.neonGreen);
    c.fillRect(23, y + 6, 2, 2, ...PALETTE.cyberCyanLight);
  }

  // Tinted tempered glass reflection strip
  c.fillRect(3, 3, 3, 58, ...PALETTE.cyberCyan);

  saveAsset('objects/server_rack.png', c);
}

// Lush Tropical Monstera in Terracotta & Brass Planter
function generatePlant() {
  const c = new PixelCanvas(32, 48);

  // Terracotta ceramic pot with brass rim
  c.fillRect(7, 32, 18, 14, ...PALETTE.potTerracotta);
  c.fillRect(8, 33, 16, 12, ...PALETTE.potTerracottaShadow);
  c.fillRect(6, 30, 20, 3, ...PALETTE.brassMid);
  c.fillRect(7, 31, 18, 1, ...PALETTE.brassLight);
  c.fillRect(8, 32, 16, 2, ...PALETTE.darkEspresso); // Potting soil

  // Stems
  c.fillRect(15, 16, 2, 15, ...PALETTE.leafDark);
  c.fillRect(10, 20, 2, 12, ...PALETTE.leafDark);
  c.fillRect(20, 18, 2, 13, ...PALETTE.leafDark);

  // Large lush monstera leaves with distinctive fenestrations
  c.fillRect(3, 10, 12, 10, ...PALETTE.leafDark);
  c.fillRect(4, 11, 10, 8, ...PALETTE.leafMid);
  c.fillRect(6, 12, 7, 5, ...PALETTE.leafLight);
  c.fillRect(8, 13, 3, 2, ...PALETTE.leafHighlight);

  c.fillRect(17, 8, 12, 11, ...PALETTE.leafDark);
  c.fillRect(18, 9, 10, 9, ...PALETTE.leafMid);
  c.fillRect(20, 10, 7, 6, ...PALETTE.leafLight);

  c.fillRect(9, 2, 14, 13, ...PALETTE.leafDark);
  c.fillRect(10, 3, 12, 11, ...PALETTE.leafMid);
  c.fillRect(12, 5, 8, 8, ...PALETTE.leafHighlight);

  saveAsset('objects/plant.png', c);
}

// Contemporary Office Water Cooler with Aqua Bubbles
function generateWaterDispenser() {
  const c = new PixelCanvas(32, 48);

  // Clear inverted aqua water carboy with reflection
  c.fillRect(10, 4, 12, 14, ...PALETTE.glassClearBlue);
  c.fillRect(12, 6, 8, 10, ...PALETTE.cyberCyan);
  c.setPixel(14, 8, ...PALETTE.white); // Air bubble
  c.setPixel(16, 12, ...PALETTE.white);
  c.fillRect(13, 18, 6, 2, ...PALETTE.slateLight);

  // Clean architectural white & wood cabinet
  c.fillRect(8, 20, 16, 26, ...PALETTE.wallCream);
  c.strokeRect(8, 20, 16, 26, ...PALETTE.wallShadow);

  // Dispenser alcove
  c.fillRect(10, 24, 12, 8, ...PALETTE.obsidian);
  c.fillRect(11, 25, 3, 2, ...PALETTE.cyberCyan);  // Cold
  c.fillRect(18, 25, 3, 2, ...PALETTE.neonCoral);   // Hot
  c.fillRect(11, 31, 10, 1, ...PALETTE.brassMid);   // Drip tray

  saveAsset('objects/water_dispenser.png', c);
}

// Executive Cybersecurity Briefing Whiteboard with Colorful Diagrams
function generateWhiteboard() {
  const c = new PixelCanvas(64, 32);

  // Aluminum & brass architectural frame
  c.fillRect(2, 2, 60, 28, ...PALETTE.slateDark);
  c.strokeRect(2, 2, 60, 28, ...PALETTE.brassMid);
  c.fillRect(4, 4, 56, 24, ...PALETTE.white);

  // Colorful Dry-Erase Network Topology Diagram
  // Firewall box in Royal Blue
  c.fillRect(8, 7, 10, 6, ...PALETTE.cyberBlue);
  c.fillRect(9, 8, 8, 4, ...PALETTE.wallCream);

  // Threat vector arrow in Vivid Crimson
  c.fillRect(18, 10, 8, 1, ...PALETTE.neonCoral);
  c.fillRect(24, 9, 2, 3, ...PALETTE.neonCoral);

  // Compromised server node with Red X
  c.fillRect(26, 7, 8, 8, ...PALETTE.neonCoral);
  c.setPixel(28, 9, ...PALETTE.white);
  c.setPixel(31, 12, ...PALETTE.white);

  // Protected Enterprise Core in Emerald Green
  c.fillRect(8, 18, 18, 8, ...PALETTE.leafLight);
  c.fillRect(9, 19, 16, 6, ...PALETTE.wallCream);
  c.fillRect(11, 21, 12, 2, ...PALETTE.leafDark); // "SECURE"

  // Colorful sticky notes pinned on whiteboard
  c.fillRect(38, 7, 6, 6, ...PALETTE.postItYellow);
  c.fillRect(46, 7, 6, 6, ...PALETTE.postItPink);
  c.fillRect(38, 15, 6, 6, ...PALETTE.postItMint);

  // Marker tray with colorful markers (Red, Blue, Green)
  c.fillRect(10, 27, 44, 2, ...PALETTE.darkEspresso);
  c.fillRect(12, 26, 4, 1, ...PALETTE.neonCoral);
  c.fillRect(18, 26, 4, 1, ...PALETTE.cyberBlue);
  c.fillRect(24, 26, 4, 1, ...PALETTE.leafMid);

  saveAsset('objects/whiteboard.png', c);
}

// Warm Contemporary Wood Filing Credenza
function generateFilingCabinet() {
  const c = new PixelCanvas(32, 48);
  c.fillRect(4, 6, 24, 40, ...PALETTE.honeyOakMid);
  c.strokeRect(4, 6, 24, 40, ...PALETTE.honeyOakDark);

  // 3 drawers with brass bar handles
  for (let i = 0; i < 3; i++) {
    const y = 8 + i * 13;
    c.strokeRect(6, y, 20, 11, ...PALETTE.honeyOakLight);
    c.fillRect(7, y + 1, 18, 9, ...PALETTE.honeyOakMid);
    c.fillRect(10, y + 4, 4, 3, ...PALETTE.white); // Card label
    c.fillRect(16, y + 4, 6, 2, ...PALETTE.brassMid); // Brass pull
  }

  saveAsset('objects/filing_cabinet.png', c);
}

// Sleek Dome Security Camera with Blue Lens & Ruby LED
function generateSecurityCamera() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(10, 4, 12, 4, ...PALETTE.brassDark);
  c.fillRect(12, 8, 8, 4, ...PALETTE.obsidian);
  c.fillRect(8, 12, 16, 10, ...PALETTE.wallCream);
  c.fillRect(10, 16, 12, 6, ...PALETTE.darkEspresso);
  c.fillRect(13, 17, 6, 4, ...PALETTE.cyberCyan); // Glass sensor
  c.fillRect(20, 13, 2, 2, ...PALETTE.neonCoral);  // Active red LED

  saveAsset('objects/security_camera.png', c);
}

// ============================================================================
// 3. UI BADGES (High-Value Polished Enamel & Gold)
// ============================================================================

function generateBadge(subPath, bgFill, borderFill, symbolDrawer) {
  const c = new PixelCanvas(32, 32);

  // Circular octagonal enamel medallion
  c.fillRect(4, 2, 24, 28, ...borderFill);
  c.fillRect(2, 4, 28, 24, ...borderFill);
  c.fillRect(5, 3, 22, 26, ...bgFill);
  c.fillRect(3, 5, 26, 22, ...bgFill);

  // Inner gold ring
  c.strokeRect(6, 6, 20, 20, ...PALETTE.brassLight);

  // Custom symbol drawn in center
  symbolDrawer(c);

  saveAsset(subPath, c);
}

function generateAllBadges() {
  // Risk Badge (Flame / Shield in Coral)
  generateBadge('ui/badge_risk.png', PALETTE.darkEspresso, PALETTE.neonCoral, (c) => {
    c.fillRect(14, 10, 4, 12, ...PALETTE.neonCoral);
    c.fillRect(12, 14, 8, 6, ...PALETTE.sunsetOrange);
    c.fillRect(15, 12, 2, 4, ...PALETTE.sunGlare);
  });

  // Awareness Badge (Open Eye / Star in Cyan & Emerald)
  generateBadge('ui/badge_awareness.png', PALETTE.darkEspresso, PALETTE.cyberCyan, (c) => {
    c.fillRect(11, 14, 10, 4, ...PALETTE.cyberCyanLight);
    c.fillRect(14, 13, 4, 6, ...PALETTE.neonGreen);
    c.setPixel(15, 15, ...PALETTE.white);
  });

  // Clue Badge (Magnifying Glass in Gold)
  generateBadge('ui/badge_clue.png', PALETTE.darkEspresso, PALETTE.sunsetGold, (c) => {
    c.strokeRect(10, 9, 8, 8, ...PALETTE.sunsetGold);
    c.fillRect(16, 15, 5, 5, ...PALETTE.brassLight);
    c.setPixel(12, 11, ...PALETTE.white);
  });

  // MFA Badge (Dual-Key Security in Emerald)
  generateBadge('ui/badge_mfa.png', PALETTE.darkEspresso, PALETTE.neonGreen, (c) => {
    c.fillRect(13, 9, 6, 6, ...PALETTE.neonGreen);
    c.fillRect(15, 14, 2, 8, ...PALETTE.neonGreen);
    c.fillRect(17, 18, 3, 2, ...PALETTE.neonGreen);
    c.setPixel(15, 11, ...PALETTE.white);
  });

  // Password Badge (Padlock & Key in Amber)
  generateBadge('ui/badge_password.png', PALETTE.darkEspresso, PALETTE.sunsetOrange, (c) => {
    c.fillRect(11, 14, 10, 8, ...PALETTE.sunsetOrange);
    c.strokeRect(13, 9, 6, 6, ...PALETTE.sunsetGold);
    c.fillRect(15, 17, 2, 3, ...PALETTE.white);
  });

  // Website / Web Sentinel Badge (Holographic Globe in Cyan)
  generateBadge('ui/badge_website.png', PALETTE.darkEspresso, PALETTE.cyberCyan, (c) => {
    c.fillRect(11, 11, 10, 10, ...PALETTE.cyberCyan);
    c.fillRect(12, 12, 8, 8, ...PALETTE.cyberBlue);
    c.setPixel(14, 13, ...PALETTE.neonGreen);
    c.setPixel(17, 15, ...PALETTE.neonGreen);
    c.setPixel(13, 17, ...PALETTE.neonGreen);
    c.fillRect(9, 15, 14, 2, ...PALETTE.cyberCyanLight); // Ring
  });
}

// Glowing Interaction Prompt [E] in Golden Brass
function generatePromptE() {
  const c = new PixelCanvas(24, 24);
  c.fillRect(2, 2, 20, 20, ...PALETTE.obsidian);
  c.strokeRect(2, 2, 20, 20, ...PALETTE.brassMid);
  c.strokeRect(4, 4, 16, 16, ...PALETTE.brassLight);

  // Letter 'E' in glowing white
  c.fillRect(8, 7, 8, 2, ...PALETTE.white);
  c.fillRect(8, 9, 3, 6, ...PALETTE.white);
  c.fillRect(8, 11, 6, 2, ...PALETTE.white);
  c.fillRect(8, 15, 8, 2, ...PALETTE.white);

  saveAsset('ui/prompt_e.png', c);
}

// ============================================================================
// 4. CHARACTERS & ANIMATED SPRITESHEETS (96 x 192 px, 32x48 per frame)
// ============================================================================

function drawCharacterFrame(canvas, frameX, frameY, direction, walkCycle, charConfig) {
  const ox = frameX * 32;
  const oy = frameY * 48;
  const { skin, skinShadow, hair, hairHighlight, jacket, shirt, pants, shoes, isPlayer, isManager, isReceptionist } = charConfig;

  // Natural walking bob & limb swing
  const legOffset1 = walkCycle === 1 ? -3 : walkCycle === 2 ? 3 : 0;
  const legOffset2 = walkCycle === 1 ? 3 : walkCycle === 2 ? -3 : 0;
  const armOffset1 = walkCycle === 1 ? 2 : walkCycle === 2 ? -2 : 0;
  const armOffset2 = walkCycle === 1 ? -2 : walkCycle === 2 ? 2 : 0;

  if (direction === 'down') {
    // FRONT VIEW
    // Legs & Pants
    canvas.fillRect(ox + 9, oy + 32 + legOffset1, 5, 11 - legOffset1, ...pants);
    canvas.fillRect(ox + 18, oy + 32 + legOffset2, 5, 11 - legOffset2, ...pants);

    // Stylish Shoes with white soles
    canvas.fillRect(ox + 8, oy + 42, 6, 4, ...shoes);
    canvas.fillRect(ox + 18, oy + 42, 6, 4, ...shoes);
    canvas.fillRect(ox + 8, oy + 45, 6, 1, ...PALETTE.white);
    canvas.fillRect(ox + 18, oy + 45, 6, 1, ...PALETTE.white);

    // Torso / Jacket
    canvas.fillRect(ox + 7, oy + 17, 18, 16, ...jacket);
    // Inner shirt / collar
    canvas.fillRect(ox + 13, oy + 17, 6, 8, ...shirt);

    if (isPlayer) {
      // Golden Cyber Badge Lanyard + ID card
      canvas.fillRect(ox + 14, oy + 18, 4, 8, ...PALETTE.cyberCyan);
      canvas.fillRect(ox + 13, oy + 26, 6, 4, ...PALETTE.white);
      canvas.setPixel(ox + 14, oy + 27, ...PALETTE.sunsetOrange);
    } else if (isManager) {
      // Crimson silk tie with gold tie clip
      canvas.fillRect(ox + 15, oy + 19, 2, 9, ...PALETTE.clothCrimson);
      canvas.fillRect(ox + 14, oy + 23, 4, 1, ...PALETTE.brassLight);
    } else if (isReceptionist) {
      // Elegant gold chain necklace
      canvas.fillRect(ox + 13, oy + 21, 6, 1, ...PALETTE.brassLight);
    }

    // Arms
    canvas.fillRect(ox + 4, oy + 18 + armOffset1, 4, 11, ...jacket);
    canvas.fillRect(ox + 4, oy + 28 + armOffset1, 4, 3, ...skin); // Hand
    canvas.fillRect(ox + 24, oy + 18 + armOffset2, 4, 11, ...jacket);
    canvas.fillRect(ox + 24, oy + 28 + armOffset2, 4, 3, ...skin);

    // Head & Neck
    canvas.fillRect(ox + 13, oy + 15, 6, 3, ...skinShadow);
    canvas.fillRect(ox + 10, oy + 5, 12, 11, ...skin);

    // Expressive Eyes with specular highlights
    canvas.fillRect(ox + 11, oy + 10, 3, 2, ...PALETTE.obsidian);
    canvas.fillRect(ox + 18, oy + 10, 3, 2, ...PALETTE.obsidian);
    canvas.setPixel(ox + 12, oy + 10, ...PALETTE.white);
    canvas.setPixel(ox + 19, oy + 10, ...PALETTE.white);

    // Hair with volumized crown & highlights
    canvas.fillRect(ox + 8, oy + 3, 16, 5, ...hair);
    canvas.fillRect(ox + 9, oy + 4, 14, 2, ...hairHighlight);
    canvas.fillRect(ox + 8, oy + 6, 3, 5, ...hair);
    canvas.fillRect(ox + 21, oy + 6, 3, 5, ...hair);

    if (isReceptionist) {
      // Blonde side bangs & gold hoop earrings
      canvas.fillRect(ox + 7, oy + 11, 2, 2, ...PALETTE.brassLight);
      canvas.fillRect(ox + 23, oy + 11, 2, 2, ...PALETTE.brassLight);
    }
  } else if (direction === 'up') {
    // BACK VIEW
    canvas.fillRect(ox + 9, oy + 32 + legOffset1, 5, 11 - legOffset1, ...pants);
    canvas.fillRect(ox + 18, oy + 32 + legOffset2, 5, 11 - legOffset2, ...pants);
    canvas.fillRect(ox + 8, oy + 42, 6, 4, ...shoes);
    canvas.fillRect(ox + 18, oy + 42, 6, 4, ...shoes);

    // Jacket Back
    canvas.fillRect(ox + 7, oy + 17, 18, 16, ...jacket);
    if (isPlayer) {
      // Tech messenger backpack with glowing cyan buckle
      canvas.fillRect(ox + 9, oy + 19, 14, 12, ...PALETTE.slateDark);
      canvas.strokeRect(ox + 9, oy + 19, 14, 12, ...PALETTE.honeyOakMid);
      canvas.fillRect(ox + 15, oy + 23, 2, 3, ...PALETTE.cyberCyan);
    }

    // Arms
    canvas.fillRect(ox + 4, oy + 18 + armOffset1, 4, 11, ...jacket);
    canvas.fillRect(ox + 4, oy + 28 + armOffset1, 4, 3, ...skin);
    canvas.fillRect(ox + 24, oy + 18 + armOffset2, 4, 11, ...jacket);
    canvas.fillRect(ox + 24, oy + 28 + armOffset2, 4, 3, ...skin);

    // Hair from back
    canvas.fillRect(ox + 8, oy + 3, 16, 14, ...hair);
    canvas.fillRect(ox + 9, oy + 4, 14, 3, ...hairHighlight);
    if (isReceptionist) {
      // High ponytail cascading down
      canvas.fillRect(ox + 14, oy + 15, 4, 8, ...hair);
      canvas.fillRect(ox + 15, oy + 16, 2, 6, ...hairHighlight);
    }
  } else if (direction === 'left') {
    // LEFT VIEW
    canvas.fillRect(ox + 12 + legOffset1, oy + 32, 5, 11, ...pants);
    canvas.fillRect(ox + 15 + legOffset2, oy + 32, 5, 11, ...PALETTE.obsidian);
    canvas.fillRect(ox + 10 + legOffset1, oy + 42, 7, 4, ...shoes);

    // Torso profile
    canvas.fillRect(ox + 10, oy + 17, 12, 16, ...jacket);
    if (isPlayer) {
      canvas.fillRect(ox + 18, oy + 19, 4, 11, ...PALETTE.slateDark); // Backpack side
    }

    // Arm
    canvas.fillRect(ox + 12 + armOffset1, oy + 18, 5, 11, ...jacket);
    canvas.fillRect(ox + 12 + armOffset1, oy + 28, 4, 3, ...skin);

    // Head profile
    canvas.fillRect(ox + 9, oy + 5, 12, 11, ...skin);
    canvas.fillRect(ox + 10, oy + 10, 2, 2, ...PALETTE.obsidian);
    canvas.setPixel(ox + 10, oy + 10, ...PALETTE.white);

    // Hair profile
    canvas.fillRect(ox + 9, oy + 3, 14, 5, ...hair);
    canvas.fillRect(ox + 16, oy + 5, 7, 11, ...hair);
    canvas.fillRect(ox + 10, oy + 4, 10, 2, ...hairHighlight);
  } else if (direction === 'right') {
    // RIGHT VIEW
    canvas.fillRect(ox + 12 + legOffset1, oy + 32, 5, 11, ...pants);
    canvas.fillRect(ox + 15 + legOffset2, oy + 32, 5, 11, ...PALETTE.obsidian);
    canvas.fillRect(ox + 15 + legOffset1, oy + 42, 7, 4, ...shoes);

    // Torso profile
    canvas.fillRect(ox + 10, oy + 17, 12, 16, ...jacket);
    if (isPlayer) {
      canvas.fillRect(ox + 10, oy + 19, 4, 11, ...PALETTE.slateDark);
    }

    // Arm
    canvas.fillRect(ox + 15 + armOffset2, oy + 18, 5, 11, ...jacket);
    canvas.fillRect(ox + 16 + armOffset2, oy + 28, 4, 3, ...skin);

    // Head profile
    canvas.fillRect(ox + 11, oy + 5, 12, 11, ...skin);
    canvas.fillRect(ox + 20, oy + 10, 2, 2, ...PALETTE.obsidian);
    canvas.setPixel(ox + 21, oy + 10, ...PALETTE.white);

    // Hair profile
    canvas.fillRect(ox + 9, oy + 3, 14, 5, ...hair);
    canvas.fillRect(ox + 9, oy + 5, 7, 11, ...hair);
    canvas.fillRect(ox + 12, oy + 4, 10, 2, ...hairHighlight);
  }
}

function generateCharacterSpritesheet(subPath, charConfig) {
  const c = new PixelCanvas(96, 192);
  const dirs = ['down', 'left', 'right', 'up'];

  for (let row = 0; row < 4; row++) {
    const dir = dirs[row];
    for (let col = 0; col < 3; col++) {
      drawCharacterFrame(c, col, row, dir, col, charConfig);
    }
  }

  saveAsset(subPath, c);
}

function generateAllCharacters() {
  // 1. Player: Junior Cybersecurity Analyst (Stylish Teal jacket, white shirt, obsidian runner pants)
  generateCharacterSpritesheet('characters/player.png', {
    skin: PALETTE.skinLight,
    skinShadow: PALETTE.skinLightShadow,
    hair: PALETTE.hairDarkBrown,
    hairHighlight: PALETTE.honeyOakMid,
    jacket: PALETTE.clothTeal,
    shirt: PALETTE.clothWhite,
    pants: PALETTE.clothCharcoal,
    shoes: PALETTE.honeyOakDark,
    isPlayer: true
  });

  // 2. Marcus Vance: Executive Manager (Tailored Navy suit, silk crimson tie)
  generateCharacterSpritesheet('characters/manager.png', {
    skin: PALETTE.skinMid,
    skinShadow: PALETTE.skinMidShadow,
    hair: PALETTE.hairAuburn,
    hairHighlight: PALETTE.honeyOakLight,
    jacket: PALETTE.clothExecutiveNavy,
    shirt: PALETTE.clothWhite,
    pants: PALETTE.clothExecutiveNavy,
    shoes: PALETTE.darkEspresso,
    isManager: true
  });

  // 3. Elena Rostova: Friendly Receptionist (Warm Coral blouse, blonde ponytail, gold jewelry)
  generateCharacterSpritesheet('characters/receptionist.png', {
    skin: PALETTE.skinLight,
    skinShadow: PALETTE.skinLightShadow,
    hair: PALETTE.hairGoldenBlonde,
    hairHighlight: PALETTE.sunsetWarmYellow,
    jacket: PALETTE.terracottaLight,
    shirt: PALETTE.clothWhite,
    pants: PALETTE.wallGreige,
    shoes: PALETTE.potTerracotta,
    isReceptionist: true
  });

  // 4. Devon Reed: IT Specialist (Tech Mustard/Olive polo, dark skin, glasses)
  generateCharacterSpritesheet('characters/it_tech.png', {
    skin: PALETTE.skinDark,
    skinShadow: PALETTE.skinDarkShadow,
    hair: PALETTE.hairJetBlack,
    hairHighlight: PALETTE.slateMid,
    jacket: PALETTE.clothMustard,
    shirt: PALETTE.darkEspresso,
    pants: PALETTE.slateDark,
    shoes: PALETTE.black,
    isPlayer: false
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
function run() {
  console.log('--- Generating "Neo-Tokyo Golden Hour & Warm Tech" Master Asset Pipeline ---');

  // Tiles
  generateFloorOffice();
  generateFloorMarble();
  generateFloorCarpet();
  generateFloorDark();
  generateWallOffice();
  generateWallWindow();
  generateDoorOffice();

  // Exterior
  generateExteriorSidewalk();
  generateExteriorRoad();
  generateExteriorRoadLine();
  generateExteriorGrass();
  generateExteriorWall();
  generateBuildingEntrance();
  generateExteriorSign();
  generateExteriorStreetLamp();
  generateExteriorTree();
  generateCyberCab();
  generateContactShadow();

  // Office Furniture & Props
  generateDesk();
  generateDeskWithPC();
  generateOfficeChair();
  generateServerRack();
  generatePlant();
  generateWaterDispenser();
  generateWhiteboard();
  generateFilingCabinet();
  generateSecurityCamera();

  // UI & Badges
  generateAllBadges();
  generatePromptE();

  // Character Spritesheets
  generateAllCharacters();

  // Portraits (64x64 Dialogue Busts)
  generatePortraits();

  console.log('--- All Master Assets Generated Successfully! ---');
}

// ============================================================================
// 7. DIALOGUE PORTRAITS (64x64 Dedicated Character Busts)
// ============================================================================

function generateManagerPortrait() {
  const c = new PixelCanvas(64, 64);
  // Executive backdrop with sunset ambient light from top-right
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const t = (x + (64 - y)) / 128;
      const r = Math.round(18 + t * 45);
      const g = Math.round(22 + t * 20);
      const b = Math.round(38 + t * 15);
      c.setPixel(x, y, r, g, b, 255);
    }
  }
  // Subtle vertical executive blinds / window lines in background
  for (let y = 0; y < 64; y++) {
    c.setPixel(14, y, 16, 18, 30, 255);
    c.setPixel(26, y, 16, 18, 30, 255);
    c.setPixel(50, y, 28, 22, 36, 255);
  }
  c.strokeRect(0, 0, 64, 64, 34, 42, 64, 255);

  // --- SHOULDERS & SUIT ---
  c.fillRect(10, 44, 44, 20, ...PALETTE.clothExecutiveNavy);
  c.fillRect(12, 42, 40, 2, ...PALETTE.clothExecutiveNavy);
  c.fillRect(16, 40, 32, 2, ...PALETTE.clothExecutiveNavy);
  c.fillRect(10, 48, 6, 16, 16, 26, 48, 255);
  c.fillRect(48, 48, 6, 16, 16, 26, 48, 255);
  c.fillRect(18, 44, 4, 18, 44, 68, 110, 255);
  c.fillRect(42, 44, 4, 18, 44, 68, 110, 255);

  // White dress shirt collar
  c.fillRect(24, 38, 16, 12, ...PALETTE.clothWhite);
  c.fillRect(26, 36, 12, 2, ...PALETTE.clothWhite);
  c.fillRect(23, 40, 3, 6, 210, 220, 235, 255);
  c.fillRect(38, 40, 3, 6, 210, 220, 235, 255);

  // Crimson silk tie
  c.fillRect(29, 41, 6, 5, ...PALETTE.clothCrimson);
  c.fillRect(29, 41, 6, 1, 140, 24, 38, 255);
  c.fillRect(28, 46, 8, 18, ...PALETTE.clothCrimson);
  c.fillRect(28, 46, 2, 18, 160, 28, 44, 255);
  c.fillRect(34, 46, 2, 18, 225, 58, 78, 255);

  // Golden tie clip
  c.fillRect(27, 52, 10, 2, ...PALETTE.sunsetGold);
  c.setPixel(31, 52, ...PALETTE.sunGlare);
  c.fillRect(27, 53, 10, 1, ...PALETTE.honeyOakShadow);

  // Pocket square on chest
  c.fillRect(14, 52, 5, 2, ...PALETTE.clothWhite);
  c.setPixel(16, 51, ...PALETTE.clothWhite);

  // --- NECK & JAW ---
  c.fillRect(26, 31, 12, 10, ...PALETTE.skinMid);
  c.fillRect(26, 31, 12, 4, ...PALETTE.skinMidShadow);
  c.fillRect(24, 31, 16, 5, ...PALETTE.skinMid);
  c.fillRect(26, 35, 12, 3, ...PALETTE.skinMid);
  c.fillRect(28, 37, 8, 2, ...PALETTE.skinMid);

  // Stubble
  for (let sy = 33; sy <= 37; sy++) {
    for (let sx = 26; sx <= 37; sx += 2) {
      if ((sx + sy) % 2 === 0) {
        c.setPixel(sx, sy, 175, 130, 100, 255);
      }
    }
  }

  // --- FACE ---
  c.fillRect(20, 16, 24, 16, ...PALETTE.skinMid);
  c.fillRect(18, 21, 2, 8, ...PALETTE.skinMidShadow);
  c.fillRect(44, 21, 2, 8, ...PALETTE.skinLight);
  c.fillRect(42, 18, 2, 14, ...PALETTE.skinLight);
  c.fillRect(43, 20, 1, 10, ...PALETTE.sunGlare);

  // Mouth
  c.fillRect(28, 33, 8, 2, 150, 92, 78, 255);
  c.setPixel(28, 34, 130, 75, 65, 255);
  c.setPixel(35, 34, 130, 75, 65, 255);

  // Nose
  c.fillRect(31, 22, 2, 9, ...PALETTE.skinLight);
  c.fillRect(33, 27, 2, 4, ...PALETTE.skinMidShadow);
  c.fillRect(30, 30, 4, 1, 170, 118, 88, 255);

  // Eyebrows
  c.fillRect(22, 20, 7, 2, 110, 42, 22, 255);
  c.fillRect(35, 20, 7, 2, 110, 42, 22, 255);
  c.setPixel(21, 21, 110, 42, 22, 255);
  c.setPixel(42, 21, 110, 42, 22, 255);

  // Eyes
  c.fillRect(23, 23, 5, 3, ...PALETTE.white);
  c.fillRect(25, 23, 2, 3, 72, 118, 168, 255);
  c.fillRect(26, 23, 1, 2, 20, 30, 45, 255);
  c.setPixel(25, 23, ...PALETTE.white);
  c.fillRect(22, 22, 7, 1, 40, 24, 18, 255);

  c.fillRect(36, 23, 5, 3, ...PALETTE.white);
  c.fillRect(37, 23, 2, 3, 72, 118, 168, 255);
  c.fillRect(38, 23, 1, 2, 20, 30, 45, 255);
  c.setPixel(37, 23, ...PALETTE.white);
  c.fillRect(35, 22, 7, 1, 40, 24, 18, 255);

  // --- HAIR ---
  c.fillRect(19, 10, 26, 7, ...PALETTE.hairAuburn);
  c.fillRect(21, 7, 22, 4, ...PALETTE.hairAuburn);
  c.fillRect(24, 5, 16, 3, ...PALETTE.hairAuburn);
  c.fillRect(17, 13, 4, 9, ...PALETTE.hairAuburn);
  c.fillRect(43, 13, 4, 9, ...PALETTE.hairAuburn);

  c.fillRect(19, 12, 4, 6, 105, 38, 20, 255);
  c.fillRect(23, 15, 6, 2, 105, 38, 20, 255);
  c.fillRect(26, 8, 14, 3, 218, 105, 52, 255);
  c.fillRect(28, 6, 10, 2, ...PALETTE.sunsetGold);
  c.fillRect(38, 10, 6, 5, ...PALETTE.sunsetGold);

  c.setPixel(18, 20, 180, 185, 198, 255);
  c.setPixel(19, 21, 180, 185, 198, 255);
  c.setPixel(18, 22, 180, 185, 198, 255);
  c.setPixel(44, 20, 220, 215, 228, 255);
  c.setPixel(45, 21, 220, 215, 228, 255);

  saveAsset('portraits/manager.png', c);
}

function generateReceptionistPortrait() {
  const c = new PixelCanvas(64, 64);
  // Twilight plum background
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const t = (x + y) / 128;
      const r = Math.round(36 + t * 40);
      const g = Math.round(20 + t * 15);
      const b = Math.round(40 + t * 25);
      c.setPixel(x, y, r, g, b, 255);
    }
  }
  const drawBokeh = (cx, cy, radius, r, g, b, a) => {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          c.setPixel(cx + dx, cy + dy, r, g, b, a);
        }
      }
    }
  };
  drawBokeh(12, 16, 7, 65, 32, 68, 255);
  drawBokeh(52, 12, 9, 78, 38, 72, 255);
  drawBokeh(50, 36, 6, 72, 34, 64, 255);
  c.strokeRect(0, 0, 64, 64, 68, 38, 72, 255);

  // Ponytail sweeping down
  c.fillRect(9, 16, 8, 32, ...PALETTE.hairGoldenBlonde);
  c.fillRect(8, 22, 6, 24, 186, 140, 52, 255);
  c.fillRect(11, 20, 4, 26, ...PALETTE.sunsetWarmYellow);
  c.fillRect(10, 44, 5, 8, ...PALETTE.hairGoldenBlonde);
  c.fillRect(14, 14, 6, 5, ...PALETTE.terracottaLight);
  c.fillRect(15, 15, 4, 3, ...PALETTE.terracottaDark);

  // Shoulders & Coral Blouse
  c.fillRect(14, 44, 36, 20, ...PALETTE.terracottaLight);
  c.fillRect(16, 42, 32, 2, ...PALETTE.terracottaLight);
  c.fillRect(19, 40, 26, 2, ...PALETTE.terracottaLight);
  c.fillRect(14, 48, 6, 16, ...PALETTE.terracottaMid);
  c.fillRect(44, 48, 6, 16, ...PALETTE.terracottaMid);
  c.fillRect(22, 46, 2, 18, ...PALETTE.terracottaDark);
  c.fillRect(40, 46, 2, 18, ...PALETTE.terracottaDark);

  // Collar & Neck
  c.fillRect(27, 40, 10, 6, ...PALETTE.skinLight);
  c.fillRect(29, 46, 6, 4, ...PALETTE.skinLight);
  c.fillRect(31, 50, 2, 2, ...PALETTE.skinLightShadow);

  // Gold pendant necklace
  c.fillRect(29, 43, 6, 1, ...PALETTE.sunsetGold);
  c.fillRect(30, 44, 4, 1, ...PALETTE.sunsetGold);
  c.setPixel(31, 48, ...PALETTE.sunsetGold);
  c.setPixel(32, 48, ...PALETTE.sunGlare);

  // Neck & Jaw
  c.fillRect(27, 31, 10, 10, ...PALETTE.skinLight);
  c.fillRect(27, 31, 10, 3, ...PALETTE.skinLightShadow);
  c.fillRect(24, 30, 16, 4, ...PALETTE.skinLight);
  c.fillRect(26, 34, 12, 3, ...PALETTE.skinLight);
  c.fillRect(28, 36, 8, 2, ...PALETTE.skinLight);

  // Face
  c.fillRect(21, 16, 22, 15, ...PALETTE.skinLight);
  c.fillRect(22, 27, 4, 3, 255, 185, 178, 255);
  c.fillRect(38, 27, 4, 3, 255, 185, 178, 255);

  // Smile
  c.fillRect(28, 33, 8, 2, 225, 110, 124, 255);
  c.setPixel(27, 32, 210, 95, 110, 255);
  c.setPixel(36, 32, 210, 95, 110, 255);
  c.fillRect(30, 33, 4, 1, ...PALETTE.white);

  // Nose
  c.setPixel(31, 29, 230, 170, 140, 255);
  c.setPixel(32, 29, 230, 170, 140, 255);
  c.setPixel(31, 30, 215, 150, 125, 255);

  // Eyebrows
  c.fillRect(23, 20, 6, 1, 190, 145, 60, 255);
  c.fillRect(35, 20, 6, 1, 190, 145, 60, 255);
  c.setPixel(28, 21, 190, 145, 60, 255);
  c.setPixel(35, 21, 190, 145, 60, 255);

  // Eyes
  c.fillRect(23, 23, 5, 3, ...PALETTE.white);
  c.fillRect(25, 23, 2, 3, 68, 164, 112, 255);
  c.fillRect(26, 23, 1, 2, 20, 45, 30, 255);
  c.setPixel(25, 23, ...PALETTE.white);
  c.fillRect(22, 22, 6, 1, 60, 36, 28, 255);

  c.fillRect(36, 23, 5, 3, ...PALETTE.white);
  c.fillRect(37, 23, 2, 3, 68, 164, 112, 255);
  c.fillRect(38, 23, 1, 2, 20, 45, 30, 255);
  c.setPixel(37, 23, ...PALETTE.white);
  c.fillRect(36, 22, 6, 1, 60, 36, 28, 255);

  // Hair
  c.fillRect(18, 8, 28, 8, ...PALETTE.hairGoldenBlonde);
  c.fillRect(21, 5, 22, 4, ...PALETTE.hairGoldenBlonde);
  c.fillRect(18, 14, 4, 12, ...PALETTE.hairGoldenBlonde);
  c.fillRect(42, 14, 4, 12, ...PALETTE.hairGoldenBlonde);
  c.fillRect(22, 15, 12, 4, ...PALETTE.hairGoldenBlonde);
  c.fillRect(33, 15, 8, 2, ...PALETTE.hairGoldenBlonde);
  c.fillRect(24, 18, 8, 2, ...PALETTE.hairGoldenBlonde);
  c.fillRect(24, 6, 16, 2, ...PALETTE.sunsetWarmYellow);
  c.fillRect(22, 10, 18, 2, ...PALETTE.sunsetWarmYellow);
  c.fillRect(23, 16, 8, 1, ...PALETTE.sunGlare);

  // Headset & mic
  c.fillRect(27, 5, 16, 1, ...PALETTE.obsidian);
  c.fillRect(42, 6, 2, 14, ...PALETTE.obsidian);
  c.fillRect(43, 20, 3, 6, ...PALETTE.obsidian);
  c.fillRect(44, 21, 2, 4, ...PALETTE.slateMid);
  c.fillRect(42, 27, 2, 3, ...PALETTE.sunsetGold);
  c.setPixel(43, 28, ...PALETTE.sunGlare);
  c.fillRect(42, 26, 2, 2, ...PALETTE.obsidian);
  c.fillRect(39, 29, 3, 2, ...PALETTE.obsidian);
  c.fillRect(36, 32, 3, 2, ...PALETTE.obsidian);
  c.fillRect(33, 34, 3, 2, ...PALETTE.obsidian);
  c.setPixel(32, 34, ...PALETTE.cyberCyan);
  c.setPixel(32, 35, ...PALETTE.cyberCyanLight);

  saveAsset('portraits/receptionist.png', c);
}

function generateITTechPortrait() {
  const c = new PixelCanvas(64, 64);
  c.fillRect(0, 0, 64, 64, 16, 20, 30, 255);
  c.fillRect(4, 4, 10, 56, 24, 30, 44, 255);
  c.fillRect(50, 4, 10, 56, 24, 30, 44, 255);

  const drawLed = (x, y, color) => {
    c.fillRect(x, y, 2, 1, ...color);
  };
  drawLed(7, 10, PALETTE.cyberCyan);
  drawLed(7, 18, PALETTE.neonGreen);
  drawLed(7, 26, PALETTE.neonAmber);
  drawLed(7, 34, PALETTE.cyberCyan);
  drawLed(10, 14, PALETTE.neonGreen);
  drawLed(10, 22, PALETTE.neonGreen);
  drawLed(53, 10, PALETTE.neonGreen);
  drawLed(53, 18, PALETTE.cyberCyan);
  drawLed(53, 28, PALETTE.neonAmber);
  drawLed(56, 14, PALETTE.cyberCyan);
  drawLed(56, 24, PALETTE.neonGreen);
  c.strokeRect(0, 0, 64, 64, 30, 40, 60, 255);

  // Shoulders & Mustard Polo
  c.fillRect(10, 44, 44, 20, ...PALETTE.clothMustard);
  c.fillRect(12, 42, 40, 2, ...PALETTE.clothMustard);
  c.fillRect(16, 40, 32, 2, ...PALETTE.clothMustard);
  c.fillRect(10, 48, 6, 16, 162, 110, 18, 255);
  c.fillRect(48, 48, 6, 16, 162, 110, 18, 255);

  c.fillRect(22, 38, 20, 5, ...PALETTE.darkEspresso);
  c.fillRect(20, 41, 5, 6, ...PALETTE.darkEspresso);
  c.fillRect(39, 41, 5, 6, ...PALETTE.darkEspresso);
  c.fillRect(30, 43, 4, 12, ...PALETTE.darkEspresso);
  c.setPixel(31, 46, ...PALETTE.clothWhite);
  c.setPixel(31, 51, ...PALETTE.clothWhite);

  // Lanyard & Badge
  c.fillRect(26, 40, 2, 16, 18, 18, 24, 255);
  c.fillRect(36, 40, 2, 16, 18, 18, 24, 255);
  c.fillRect(29, 54, 6, 2, ...PALETTE.slateHighlight);
  c.fillRect(28, 56, 8, 8, ...PALETTE.obsidian);
  c.fillRect(29, 57, 6, 3, ...PALETTE.cyberCyan);
  c.fillRect(30, 61, 4, 2, ...PALETTE.clothWhite);

  // Neck & Jaw
  c.fillRect(26, 31, 12, 10, ...PALETTE.skinDark);
  c.fillRect(26, 31, 12, 4, ...PALETTE.skinDarkShadow);
  c.fillRect(23, 30, 18, 5, ...PALETTE.skinDark);
  c.fillRect(25, 34, 14, 3, ...PALETTE.skinDark);
  c.fillRect(27, 36, 10, 2, ...PALETTE.skinDark);

  // Beard
  c.fillRect(24, 33, 3, 4, ...PALETTE.hairJetBlack);
  c.fillRect(37, 33, 3, 4, ...PALETTE.hairJetBlack);
  c.fillRect(26, 35, 12, 3, ...PALETTE.hairJetBlack);
  c.fillRect(28, 37, 8, 2, ...PALETTE.hairJetBlack);
  c.fillRect(29, 34, 6, 1, ...PALETTE.hairJetBlack);

  // Face
  c.fillRect(20, 17, 24, 14, ...PALETTE.skinDark);
  c.fillRect(18, 22, 2, 7, ...PALETTE.skinDarkShadow);
  c.fillRect(44, 22, 2, 7, ...PALETTE.skinDark);
  c.fillRect(44, 23, 2, 3, ...PALETTE.obsidian);
  c.setPixel(45, 24, ...PALETTE.neonGreen);

  // Nose
  c.fillRect(30, 25, 4, 5, ...PALETTE.skinDarkShadow);
  c.fillRect(31, 26, 2, 4, ...PALETTE.skinDark);
  c.fillRect(29, 29, 6, 1, 118, 75, 52, 255);

  // Mouth
  c.fillRect(29, 32, 6, 1, 110, 65, 48, 255);
  c.setPixel(35, 31, 110, 65, 48, 255);

  // Glasses & Eyes
  c.strokeRect(21, 21, 9, 6, ...PALETTE.obsidian);
  c.strokeRect(34, 21, 9, 6, ...PALETTE.obsidian);
  c.fillRect(30, 22, 4, 1, ...PALETTE.obsidian);

  c.fillRect(23, 23, 5, 2, ...PALETTE.white);
  c.fillRect(25, 23, 2, 2, ...PALETTE.hairJetBlack);
  c.setPixel(24, 23, ...PALETTE.white);

  c.fillRect(36, 23, 5, 2, ...PALETTE.white);
  c.fillRect(37, 23, 2, 2, ...PALETTE.hairJetBlack);
  c.setPixel(36, 23, ...PALETTE.white);

  // Monitor Glint Reflection
  c.setPixel(22, 24, 140, 235, 255, 220);
  c.setPixel(23, 25, 140, 235, 255, 220);
  c.setPixel(24, 26, 140, 235, 255, 220);
  c.setPixel(35, 24, 140, 235, 255, 220);
  c.setPixel(36, 25, 140, 235, 255, 220);
  c.setPixel(37, 26, 140, 235, 255, 220);

  // Hair
  c.fillRect(20, 8, 24, 10, ...PALETTE.hairJetBlack);
  c.fillRect(22, 6, 20, 3, ...PALETTE.hairJetBlack);
  c.fillRect(22, 16, 20, 2, ...PALETTE.hairJetBlack);
  c.fillRect(19, 13, 2, 5, ...PALETTE.slateDark);
  c.fillRect(43, 13, 2, 5, ...PALETTE.slateDark);

  for (let hy = 7; hy <= 14; hy += 2) {
    for (let hx = 22; hx <= 40; hx += 3) {
      c.setPixel(hx, hy, ...PALETTE.slateMid);
    }
  }

  saveAsset('portraits/it_tech.png', c);
}

function generatePlayerPortrait() {
  const c = new PixelCanvas(64, 64);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const t = (x + y) / 128;
      const r = Math.round(18 + t * 20);
      const g = Math.round(24 + t * 30);
      const b = Math.round(40 + t * 45);
      c.setPixel(x, y, r, g, b, 255);
    }
  }
  for (let i = 0; i < 64; i += 16) {
    c.fillRect(0, i, 64, 1, 28, 48, 72, 255);
    c.fillRect(i, 0, 1, 64, 28, 48, 72, 255);
  }
  c.strokeRect(0, 0, 64, 64, 36, 72, 108, 255);

  // Shoulders & Teal Hoodie
  c.fillRect(10, 44, 44, 20, ...PALETTE.clothTeal);
  c.fillRect(12, 42, 40, 2, ...PALETTE.clothTeal);
  c.fillRect(16, 40, 32, 2, ...PALETTE.clothTeal);
  c.fillRect(14, 44, 4, 18, 36, 178, 196, 255);
  c.fillRect(46, 44, 4, 18, 36, 178, 196, 255);
  c.fillRect(10, 48, 4, 16, 10, 74, 84, 255);
  c.fillRect(50, 48, 4, 16, 10, 74, 84, 255);

  // Undershirt & Collar
  c.fillRect(26, 38, 12, 8, ...PALETTE.clothWhite);
  c.fillRect(21, 39, 6, 8, ...PALETTE.clothTeal);
  c.fillRect(37, 39, 6, 8, ...PALETTE.clothTeal);

  // Drawstrings
  c.fillRect(25, 46, 1, 9, ...PALETTE.clothWhite);
  c.fillRect(38, 46, 1, 9, ...PALETTE.clothWhite);

  // Badge
  c.fillRect(28, 42, 2, 14, ...PALETTE.cyberCyan);
  c.fillRect(34, 42, 2, 14, ...PALETTE.cyberCyan);
  c.fillRect(28, 54, 8, 10, ...PALETTE.sunsetGold);
  c.fillRect(29, 55, 6, 4, ...PALETTE.clothCharcoal);
  c.fillRect(30, 60, 4, 2, ...PALETTE.cyberCyanLight);

  // Neck & Jaw
  c.fillRect(26, 31, 12, 10, ...PALETTE.skinLight);
  c.fillRect(26, 31, 12, 3, ...PALETTE.skinLightShadow);
  c.fillRect(23, 30, 18, 5, ...PALETTE.skinLight);
  c.fillRect(25, 34, 14, 3, ...PALETTE.skinLight);
  c.fillRect(27, 36, 10, 2, ...PALETTE.skinLight);

  // Face
  c.fillRect(20, 16, 24, 15, ...PALETTE.skinLight);
  c.fillRect(18, 21, 2, 7, ...PALETTE.skinLightShadow);
  c.fillRect(44, 21, 2, 7, ...PALETTE.skinLight);
  c.fillRect(18, 23, 2, 3, ...PALETTE.cyberCyan);
  c.setPixel(17, 24, ...PALETTE.cyberCyanLight);

  // Nose
  c.fillRect(31, 24, 2, 6, ...PALETTE.skinLight);
  c.setPixel(32, 29, 218, 160, 130, 255);
  c.setPixel(31, 30, 195, 140, 110, 255);

  // Mouth
  c.fillRect(28, 33, 8, 1, 185, 110, 95, 255);
  c.setPixel(35, 32, 185, 110, 95, 255);

  // Eyebrows
  c.fillRect(22, 20, 7, 2, ...PALETTE.hairDarkBrown);
  c.fillRect(35, 20, 7, 2, ...PALETTE.hairDarkBrown);
  c.setPixel(21, 21, ...PALETTE.hairDarkBrown);
  c.setPixel(42, 21, ...PALETTE.hairDarkBrown);

  // Eyes
  c.fillRect(23, 23, 5, 3, ...PALETTE.white);
  c.fillRect(25, 23, 2, 3, ...PALETTE.hairDarkBrown);
  c.fillRect(26, 23, 1, 2, 15, 10, 8, 255);
  c.setPixel(25, 23, ...PALETTE.white);
  c.fillRect(22, 22, 6, 1, 35, 22, 16, 255);

  c.fillRect(36, 23, 5, 3, ...PALETTE.white);
  c.fillRect(37, 23, 2, 3, ...PALETTE.hairDarkBrown);
  c.fillRect(38, 23, 1, 2, 15, 10, 8, 255);
  c.setPixel(37, 23, ...PALETTE.white);
  c.fillRect(36, 22, 6, 1, 35, 22, 16, 255);

  // Hair
  c.fillRect(19, 9, 26, 8, ...PALETTE.hairDarkBrown);
  c.fillRect(21, 6, 22, 4, ...PALETTE.hairDarkBrown);
  c.fillRect(17, 13, 4, 10, ...PALETTE.hairDarkBrown);
  c.fillRect(43, 13, 4, 10, ...PALETTE.hairDarkBrown);

  c.fillRect(21, 15, 8, 4, ...PALETTE.hairDarkBrown);
  c.fillRect(28, 14, 10, 5, ...PALETTE.hairDarkBrown);
  c.fillRect(36, 15, 7, 4, ...PALETTE.hairDarkBrown);
  c.fillRect(24, 18, 5, 2, ...PALETTE.hairDarkBrown);
  c.fillRect(32, 18, 4, 2, ...PALETTE.hairDarkBrown);

  c.fillRect(24, 7, 16, 2, ...PALETTE.honeyOakMid);
  c.fillRect(26, 9, 12, 2, ...PALETTE.honeyOakLight);
  c.setPixel(22, 8, ...PALETTE.honeyOakLight);
  c.setPixel(39, 8, ...PALETTE.honeyOakLight);
  c.setPixel(29, 15, ...PALETTE.honeyOakMid);
  c.setPixel(34, 16, ...PALETTE.honeyOakMid);

  saveAsset('portraits/player.png', c);
}

function generatePortraits() {
  generateManagerPortrait();
  generateReceptionistPortrait();
  generateITTechPortrait();
  generatePlayerPortrait();
}

run();
