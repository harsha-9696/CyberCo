import fs from 'node:fs';
import path from 'node:path';
import { PixelCanvas } from './pixel-canvas.js';

const PUBLIC_ASSETS = path.resolve('public/assets');
const SRC_ASSETS = path.resolve('src/assets');

// Helper to save to both locations
function saveAsset(subPath, canvas) {
  const p1 = path.join(PUBLIC_ASSETS, subPath);
  const p2 = path.join(SRC_ASSETS, subPath);
  canvas.save(p1);
  canvas.save(p2);
  console.log(`Generated: ${subPath} (${canvas.width}x${canvas.height})`);
}

// Color Palette Definition (Cyberpunk 16-bit Office Theme)
const PALETTE = {
  // Transparents & Darks
  trans: [0, 0, 0, 0],
  black: [10, 14, 22, 255],
  darkBg: [16, 22, 34, 255],
  slateDark: [24, 32, 48, 255],
  slateMid: [38, 50, 72, 255],
  slateLight: [58, 76, 106, 255],
  slateHighlight: [90, 115, 155, 255],

  // Cyber Accents
  cyanDark: [0, 140, 170, 255],
  cyanMid: [0, 210, 230, 255],
  cyanBright: [120, 245, 255, 255],
  blueGlow: [30, 90, 200, 255],
  neonGreen: [40, 230, 120, 255],
  neonRed: [240, 60, 80, 255],
  neonAmber: [245, 170, 40, 255],

  // Environment & Materials
  floorOffice: [32, 40, 58, 255],
  floorOfficeGrid: [42, 53, 76, 255],
  floorDark: [20, 25, 38, 255],
  floorCarpet: [26, 44, 68, 255],
  wallOffice: [28, 36, 52, 255],
  wallTrim: [0, 180, 210, 255],
  woodDark: [55, 38, 28, 255],
  woodMid: [85, 60, 42, 255],
  woodLight: [120, 88, 62, 255],
  glassBlue: [60, 130, 180, 160],
  glassBright: [140, 210, 250, 200],

  // Exterior
  asphalt: [22, 26, 32, 255],
  asphaltLine: [180, 170, 80, 255],
  sidewalk: [65, 75, 90, 255],
  sidewalkLine: [85, 98, 118, 255],
  grassDark: [18, 48, 32, 255],
  grassMid: [28, 72, 46, 255],
  treeFoliageDark: [20, 65, 40, 255],
  treeFoliageMid: [35, 95, 60, 255],
  treeFoliageLight: [60, 135, 85, 255],

  // Characters
  skinToneLight: [240, 195, 165, 255],
  skinToneMid: [215, 165, 135, 255],
  skinToneDark: [160, 110, 85, 255],
  hairDark: [25, 28, 38, 255],
  hairBrown: [60, 40, 30, 255],
  hairBlonde: [190, 160, 90, 255],
  white: [240, 245, 255, 255],
  clothDark: [30, 35, 48, 255],
  clothCyan: [0, 170, 190, 255],
  clothNavy: [25, 38, 65, 255],
  clothRed: [180, 40, 55, 255],
  clothTeal: [20, 110, 115, 255]
};

// ==========================================
// 1. GENERATE TILES (32x32)
// ==========================================

function generateFloorOffice() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.floorOffice);
  // Grid line accents
  c.strokeRect(0, 0, 32, 32, ...PALETTE.floorOfficeGrid);
  // Tech corner bevels
  c.setPixel(1, 1, ...PALETTE.slateHighlight);
  c.setPixel(30, 1, ...PALETTE.slateLight);
  c.setPixel(1, 30, ...PALETTE.slateLight);
  c.setPixel(30, 30, ...PALETTE.slateDark);
  saveAsset('environment/floor_office.png', c);
}

function generateFloorDark() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.floorDark);
  c.strokeRect(0, 0, 32, 32, ...PALETTE.slateDark);
  // Subtle digital circuit trace
  c.fillRect(8, 0, 1, 12, ...PALETTE.cyanDark);
  c.fillRect(8, 12, 16, 1, ...PALETTE.cyanDark);
  c.fillRect(24, 12, 1, 20, ...PALETTE.cyanDark);
  c.fillRect(7, 0, 3, 2, ...PALETTE.cyanMid);
  saveAsset('environment/floor_dark.png', c);
}

function generateFloorCarpet() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.floorCarpet);
  // Stippled woven pattern
  for (let y = 0; y < 32; y += 4) {
    for (let x = 0; x < 32; x += 4) {
      c.setPixel(x + 1, y + 1, ...PALETTE.slateMid);
      c.setPixel(x + 3, y + 3, ...PALETTE.slateLight);
    }
  }
  c.strokeRect(0, 0, 32, 32, ...PALETTE.slateDark);
  saveAsset('environment/floor_carpet.png', c);
}

function generateWallOffice() {
  const c = new PixelCanvas(32, 32);
  // Wall body
  c.fillRect(0, 0, 32, 32, ...PALETTE.wallOffice);
  // Top bevel / depth
  c.fillRect(0, 0, 32, 4, ...PALETTE.slateLight);
  c.fillRect(0, 4, 32, 2, ...PALETTE.slateMid);
  // Horizontal cyber conduit strip
  c.fillRect(0, 20, 32, 3, ...PALETTE.slateDark);
  c.fillRect(0, 21, 32, 1, ...PALETTE.cyanMid);
  // Baseboard trim
  c.fillRect(0, 28, 32, 4, ...PALETTE.slateDark);
  c.fillRect(0, 28, 32, 1, ...PALETTE.slateMid);
  // Vertical seam
  c.fillRect(16, 4, 1, 24, ...PALETTE.slateDark);
  saveAsset('environment/wall_office.png', c);
}

function generateWallWindow() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.wallOffice);
  // Glass frame
  c.fillRect(2, 4, 28, 22, ...PALETTE.black);
  c.fillRect(3, 5, 26, 20, ...PALETTE.darkBg);
  // Night skyline inside window
  c.fillRect(5, 12, 6, 12, ...PALETTE.slateDark);
  c.fillRect(13, 8, 7, 16, ...PALETTE.slateMid);
  c.fillRect(22, 14, 5, 10, ...PALETTE.slateDark);
  // Distant glowing window specks in city
  c.setPixel(7, 14, ...PALETTE.neonAmber);
  c.setPixel(8, 18, ...PALETTE.cyanBright);
  c.setPixel(15, 10, ...PALETTE.neonAmber);
  c.setPixel(17, 13, ...PALETTE.cyanMid);
  c.setPixel(16, 17, ...PALETTE.white);
  // Diagonal reflection on glass
  for (let i = 0; i < 16; i++) {
    c.setPixel(6 + i, 6 + i, ...PALETTE.glassBright);
  }
  // Baseboard
  c.fillRect(0, 28, 32, 4, ...PALETTE.slateDark);
  saveAsset('environment/wall_window.png', c);
}

function generateDoorOffice() {
  const c = new PixelCanvas(32, 32);
  // Door frame
  c.fillRect(0, 0, 32, 32, ...PALETTE.slateDark);
  c.strokeRect(1, 1, 30, 30, ...PALETTE.slateMid);
  // Double sliding glass panels
  c.fillRect(3, 3, 12, 26, ...PALETTE.floorOffice);
  c.fillRect(17, 3, 12, 26, ...PALETTE.floorOffice);
  // Electronic lock sensor
  c.fillRect(14, 14, 4, 4, ...PALETTE.black);
  c.fillRect(15, 15, 2, 2, ...PALETTE.neonGreen);
  // Cyan LED guide strip at top
  c.fillRect(4, 3, 24, 2, ...PALETTE.cyanMid);
  saveAsset('environment/door_office.png', c);
}

// Exterior Environment
function generateExteriorSidewalk() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.sidewalk);
  c.strokeRect(0, 0, 32, 32, ...PALETTE.sidewalkLine);
  // Concrete texture specks
  c.setPixel(5, 8, ...PALETTE.slateMid);
  c.setPixel(18, 14, ...PALETTE.slateMid);
  c.setPixel(25, 22, ...PALETTE.slateMid);
  c.setPixel(12, 27, ...PALETTE.slateLight);
  saveAsset('environment/exterior_sidewalk.png', c);
}

function generateExteriorRoad() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.asphalt);
  // Center yellow dashed strip
  c.fillRect(0, 14, 32, 4, ...PALETTE.black);
  c.fillRect(4, 15, 24, 2, ...PALETTE.asphaltLine);
  saveAsset('environment/exterior_road.png', c);
}

function generateExteriorGrass() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.grassDark);
  // Pixel grass tufts
  for (let y = 2; y < 30; y += 6) {
    for (let x = 2; x < 30; x += 8) {
      c.fillRect(x, y + 2, 1, 3, ...PALETTE.grassMid);
      c.fillRect(x + 1, y, 1, 5, ...PALETTE.treeFoliageLight);
      c.fillRect(x + 2, y + 1, 1, 4, ...PALETTE.grassMid);
    }
  }
  saveAsset('environment/exterior_grass.png', c);
}

function generateExteriorWall() {
  const c = new PixelCanvas(32, 32);
  c.fillRect(0, 0, 32, 32, ...PALETTE.darkBg);
  c.fillRect(0, 0, 32, 3, ...PALETTE.slateMid);
  // High-tech facade panels
  c.strokeRect(1, 4, 30, 27, ...PALETTE.slateDark);
  c.fillRect(2, 5, 28, 25, ...PALETTE.black);
  // Vertical neon accent pillars
  c.fillRect(2, 5, 2, 25, ...PALETTE.cyanDark);
  c.fillRect(28, 5, 2, 25, ...PALETTE.cyanDark);
  saveAsset('environment/exterior_wall.png', c);
}

function generateExteriorSign() {
  // 96x32 glowing "CYBER CO" sign
  const c = new PixelCanvas(96, 32);
  c.fillRect(0, 0, 96, 32, ...PALETTE.black);
  c.strokeRect(1, 1, 94, 30, ...PALETTE.cyanDark);
  c.strokeRect(3, 3, 90, 26, ...PALETTE.slateDark);

  // Background glow
  c.fillRect(6, 6, 84, 20, ...PALETTE.darkBg);

  // Draw pixel letters: "C Y B E R   C O"
  // Let's draw stylized 5x7 block fonts
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
            // Neon cyan text with white core
            c.fillRect(curX + col * 2, 9 + r * 2, 2, 2, ...PALETTE.cyanBright);
          }
        }
      }
      curX += (glyph[0].length * 2) + 2;
    }
  }

  // Cyan corner LEDs
  c.fillRect(2, 2, 3, 3, ...PALETTE.cyanBright);
  c.fillRect(91, 2, 3, 3, ...PALETTE.cyanBright);
  c.fillRect(2, 27, 3, 3, ...PALETTE.cyanBright);
  c.fillRect(91, 27, 3, 3, ...PALETTE.cyanBright);

  saveAsset('environment/exterior_sign.png', c);
}

function generateExteriorStreetLamp() {
  // 32x64 tall street lamp with volumetric light
  const c = new PixelCanvas(32, 64);
  // Pole
  c.fillRect(15, 12, 3, 52, ...PALETTE.slateDark);
  c.fillRect(14, 60, 5, 4, ...PALETTE.black); // Base
  // Lamp fixture head
  c.fillRect(8, 8, 16, 5, ...PALETTE.slateMid);
  c.fillRect(10, 13, 12, 3, ...PALETTE.neonAmber);
  c.fillRect(12, 14, 8, 2, ...PALETTE.white);
  // Subtle amber cone glow downward
  for (let y = 16; y < 58; y += 2) {
    const w = Math.floor((y - 14) * 0.4);
    c.fillRect(16 - w, y, w * 2, 1, 245, 180, 50, 20);
  }
  saveAsset('environment/exterior_lamp.png', c);
}

function generateExteriorTree() {
  // 32x48 potted/sidewalk tree
  const c = new PixelCanvas(32, 48);
  // Trunk
  c.fillRect(14, 30, 4, 14, ...PALETTE.woodDark);
  c.fillRect(15, 30, 2, 14, ...PALETTE.woodMid);
  // Planter base
  c.fillRect(10, 42, 12, 6, ...PALETTE.slateDark);
  c.fillRect(9, 41, 14, 2, ...PALETTE.slateMid);
  // Foliage cluster
  c.fillRect(6, 6, 20, 24, ...PALETTE.treeFoliageDark);
  c.fillRect(8, 4, 16, 26, ...PALETTE.treeFoliageDark);
  c.fillRect(8, 8, 16, 18, ...PALETTE.treeFoliageMid);
  c.fillRect(10, 10, 12, 12, ...PALETTE.treeFoliageLight);
  c.setPixel(12, 12, ...PALETTE.white);
  saveAsset('environment/exterior_tree.png', c);
}

function generateBuildingEntrance() {
  // 64x48 double entrance doors with illuminated arch
  const c = new PixelCanvas(64, 48);
  c.fillRect(0, 0, 64, 48, ...PALETTE.darkBg);
  // Outer frame
  c.fillRect(2, 2, 60, 46, ...PALETTE.slateDark);
  c.fillRect(4, 4, 56, 44, ...PALETTE.black);
  // Overhead neon header
  c.fillRect(8, 6, 48, 6, ...PALETTE.cyanDark);
  c.fillRect(12, 7, 40, 4, ...PALETTE.cyanBright);
  // Double glass doors
  c.fillRect(6, 14, 24, 34, ...PALETTE.slateMid);
  c.fillRect(34, 14, 24, 34, ...PALETTE.slateMid);
  c.fillRect(8, 16, 20, 30, ...PALETTE.glassBlue);
  c.fillRect(36, 16, 20, 30, ...PALETTE.glassBlue);
  // Handles
  c.fillRect(26, 26, 2, 8, ...PALETTE.cyanBright);
  c.fillRect(36, 26, 2, 8, ...PALETTE.cyanBright);
  // Welcome mat
  c.fillRect(12, 45, 40, 3, ...PALETTE.slateLight);
  saveAsset('environment/building_entrance.png', c);
}

// ==========================================
// 2. GENERATE OFFICE OBJECTS
// ==========================================

function generateDesk() {
  // 64x32 office workstation desk
  const c = new PixelCanvas(64, 32);
  // Desk top surface
  c.fillRect(2, 4, 60, 14, ...PALETTE.woodMid);
  c.fillRect(2, 4, 60, 2, ...PALETTE.woodLight); // Bevel
  c.fillRect(2, 17, 60, 2, ...PALETTE.woodDark); // Shadow rim
  // Desk legs and drawer pedestal
  c.fillRect(4, 19, 4, 12, ...PALETTE.slateDark);
  c.fillRect(46, 19, 14, 12, ...PALETTE.woodMid);
  // Drawers
  c.fillRect(47, 21, 12, 4, ...PALETTE.woodDark);
  c.fillRect(52, 22, 2, 2, ...PALETTE.slateHighlight); // handle
  c.fillRect(47, 26, 12, 4, ...PALETTE.woodDark);
  c.fillRect(52, 27, 2, 2, ...PALETTE.slateHighlight);
  saveAsset('objects/desk.png', c);
}

function generateDeskWithPC() {
  // 64x32 desk with glowing workstation computer, keyboard, mouse
  const c = new PixelCanvas(64, 32);
  // Base desk
  c.fillRect(2, 4, 60, 14, ...PALETTE.woodMid);
  c.fillRect(2, 4, 60, 2, ...PALETTE.woodLight);
  c.fillRect(2, 17, 60, 2, ...PALETTE.woodDark);
  c.fillRect(4, 19, 4, 12, ...PALETTE.slateDark);
  c.fillRect(46, 19, 14, 12, ...PALETTE.woodMid);
  // Drawers
  c.fillRect(47, 21, 12, 4, ...PALETTE.woodDark);
  c.fillRect(52, 22, 2, 2, ...PALETTE.slateHighlight);
  c.fillRect(47, 26, 12, 4, ...PALETTE.woodDark);
  c.fillRect(52, 27, 2, 2, ...PALETTE.slateHighlight);

  // Dual CRT / LCD Monitors
  // Main Monitor (Center-left)
  c.fillRect(14, 1, 20, 12, ...PALETTE.slateDark);
  c.fillRect(15, 2, 18, 9, ...PALETTE.black);
  c.fillRect(16, 3, 16, 7, ...PALETTE.cyanDark); // Screen active
  // Terminal text lines on screen
  c.fillRect(17, 4, 8, 1, ...PALETTE.cyanBright);
  c.fillRect(17, 6, 12, 1, ...PALETTE.cyanBright);
  c.fillRect(17, 8, 5, 1, ...PALETTE.neonGreen);
  c.fillRect(22, 13, 4, 2, ...PALETTE.slateLight); // Stand

  // Second Monitor / Terminal (Right)
  c.fillRect(36, 2, 14, 10, ...PALETTE.slateDark);
  c.fillRect(37, 3, 12, 8, ...PALETTE.black);
  c.fillRect(38, 4, 10, 6, ...PALETTE.darkBg);
  c.fillRect(39, 5, 8, 1, ...PALETTE.neonAmber);
  c.fillRect(42, 12, 2, 2, ...PALETTE.slateLight);

  // Keyboard & Mouse
  c.fillRect(17, 13, 14, 4, ...PALETTE.slateDark);
  c.fillRect(18, 14, 12, 2, ...PALETTE.slateLight); // Key matrix
  c.fillRect(33, 14, 3, 3, ...PALETTE.slateMid); // Mouse
  // Coffee mug with cyber steam
  c.fillRect(8, 12, 4, 4, ...PALETTE.cyanBright);
  c.fillRect(12, 13, 1, 2, ...PALETTE.cyanBright);

  saveAsset('objects/desk_with_pc.png', c);
}

function generateOfficeChair() {
  // 32x32 ergonomic rolling office chair
  const c = new PixelCanvas(32, 32);
  // Wheels / 5-star base
  c.fillRect(10, 26, 12, 4, ...PALETTE.black);
  c.fillRect(15, 24, 2, 4, ...PALETTE.slateMid);
  // Seat cushion
  c.fillRect(8, 16, 16, 8, ...PALETTE.clothNavy);
  c.fillRect(9, 17, 14, 6, ...PALETTE.slateMid);
  // Armrests
  c.fillRect(6, 15, 3, 7, ...PALETTE.slateDark);
  c.fillRect(23, 15, 3, 7, ...PALETTE.slateDark);
  // Backrest
  c.fillRect(9, 6, 14, 11, ...PALETTE.clothNavy);
  c.fillRect(10, 7, 12, 9, ...PALETTE.slateLight);
  c.fillRect(11, 8, 10, 2, ...PALETTE.cyanMid); // Cyber lumbar accent
  saveAsset('objects/chair.png', c);
}

function generateServerRack() {
  // 32x64 tall illuminated enterprise server rack
  const c = new PixelCanvas(32, 64);
  c.fillRect(2, 2, 28, 60, ...PALETTE.black);
  c.strokeRect(2, 2, 28, 60, ...PALETTE.slateDark);

  // 4 rack units
  for (let unit = 0; unit < 4; unit++) {
    const y = 6 + unit * 14;
    c.fillRect(5, y, 22, 12, ...PALETTE.slateDark);
    c.strokeRect(5, y, 22, 12, ...PALETTE.slateMid);
    // Ventilation slots
    c.fillRect(8, y + 2, 10, 1, ...PALETTE.black);
    c.fillRect(8, y + 4, 10, 1, ...PALETTE.black);
    c.fillRect(8, y + 6, 10, 1, ...PALETTE.black);
    c.fillRect(8, y + 8, 10, 1, ...PALETTE.black);
    // LED blinkers
    c.fillRect(20, y + 2, 2, 2, ...PALETTE.neonGreen);
    c.fillRect(23, y + 2, 2, 2, unit === 1 ? PALETTE.neonAmber : PALETTE.cyanBright);
    c.fillRect(20, y + 6, 2, 2, ...PALETTE.cyanBright);
    c.fillRect(23, y + 6, 2, 2, unit === 2 ? PALETTE.neonRed : PALETTE.neonGreen);
  }
  // Glass tint door reflection
  c.fillRect(3, 3, 3, 58, ...PALETTE.cyanDark);
  saveAsset('objects/server_rack.png', c);
}

function generatePlant() {
  // 32x48 potted office palm/fern
  const c = new PixelCanvas(32, 48);
  // Pot
  c.fillRect(8, 32, 16, 14, ...PALETTE.slateDark);
  c.fillRect(9, 33, 14, 12, ...PALETTE.slateMid);
  c.fillRect(7, 30, 18, 3, ...PALETTE.slateLight);
  c.fillRect(9, 31, 14, 1, ...PALETTE.black); // Soil
  // Stems & Leaves
  c.fillRect(15, 20, 2, 11, ...PALETTE.woodDark);
  // Large tropical leaves
  c.fillRect(4, 14, 10, 6, ...PALETTE.treeFoliageDark);
  c.fillRect(5, 15, 8, 4, ...PALETTE.treeFoliageMid);
  c.fillRect(18, 12, 11, 7, ...PALETTE.treeFoliageMid);
  c.fillRect(19, 13, 9, 5, ...PALETTE.treeFoliageLight);
  c.fillRect(10, 6, 12, 12, ...PALETTE.treeFoliageDark);
  c.fillRect(12, 8, 8, 8, ...PALETTE.treeFoliageLight);
  saveAsset('objects/plant.png', c);
}

function generateWaterDispenser() {
  // 32x48 office water cooler
  const c = new PixelCanvas(32, 48);
  // Water bottle (inverted blue barrel)
  c.fillRect(10, 4, 12, 14, ...PALETTE.glassBright);
  c.fillRect(12, 6, 8, 10, ...PALETTE.cyanMid);
  c.fillRect(13, 18, 6, 2, ...PALETTE.slateLight);
  // Body cabinet
  c.fillRect(8, 20, 16, 26, ...PALETTE.white);
  c.strokeRect(8, 20, 16, 26, ...PALETTE.slateLight);
  // Dispenser alcove
  c.fillRect(11, 24, 10, 8, ...PALETTE.slateDark);
  // Cold & hot taps
  c.fillRect(12, 25, 2, 2, ...PALETTE.cyanBright);
  c.fillRect(17, 25, 2, 2, ...PALETTE.clothRed);
  // Cup tray
  c.fillRect(11, 31, 10, 1, ...PALETTE.slateMid);
  saveAsset('objects/water_dispenser.png', c);
}

function generateWhiteboard() {
  // 64x32 cybersecurity briefing whiteboard
  const c = new PixelCanvas(64, 32);
  // Aluminum frame
  c.fillRect(2, 2, 60, 28, ...PALETTE.slateMid);
  c.fillRect(4, 4, 56, 24, ...PALETTE.white);
  // Marker tray
  c.fillRect(10, 27, 44, 2, ...PALETTE.slateDark);
  c.fillRect(12, 26, 4, 1, ...PALETTE.clothRed);
  c.fillRect(18, 26, 4, 1, ...PALETTE.cyanDark);
  // Drawn network topology & alert diagrams
  c.fillRect(8, 8, 10, 6, ...PALETTE.slateDark); // Firewall box
  c.fillRect(18, 11, 8, 1, ...PALETTE.clothRed); // Attack line
  c.fillRect(26, 8, 8, 8, ...PALETTE.clothRed); // Compromised host (Red X)
  c.setPixel(28, 10, ...PALETTE.white);
  c.setPixel(31, 13, ...PALETTE.white);
  // Notes & bullet points
  c.fillRect(38, 7, 18, 2, ...PALETTE.clothNavy);
  c.fillRect(38, 11, 14, 1, ...PALETTE.slateMid);
  c.fillRect(38, 14, 16, 1, ...PALETTE.slateMid);
  c.fillRect(38, 17, 12, 1, ...PALETTE.slateMid);
  c.fillRect(8, 20, 24, 2, ...PALETTE.clothRed); // "ALERT: PHISHING"
  saveAsset('objects/whiteboard.png', c);
}

function generateFilingCabinet() {
  // 32x48 metal filing cabinet
  const c = new PixelCanvas(32, 48);
  c.fillRect(4, 6, 24, 40, ...PALETTE.slateDark);
  c.strokeRect(4, 6, 24, 40, ...PALETTE.slateMid);
  // 3 drawers
  for (let i = 0; i < 3; i++) {
    const y = 8 + i * 13;
    c.strokeRect(6, y, 20, 11, ...PALETTE.slateLight);
    c.fillRect(7, y + 1, 18, 9, ...PALETTE.slateDark);
    // Label card & handle
    c.fillRect(10, y + 4, 4, 3, ...PALETTE.white);
    c.fillRect(16, y + 4, 6, 2, ...PALETTE.slateHighlight);
  }
  saveAsset('objects/filing_cabinet.png', c);
}

function generateSecurityCamera() {
  // 32x32 ceiling security camera
  const c = new PixelCanvas(32, 32);
  c.fillRect(10, 4, 12, 4, ...PALETTE.slateMid); // Mount
  c.fillRect(12, 8, 8, 4, ...PALETTE.slateDark);
  // Dome / camera lens body
  c.fillRect(8, 12, 16, 10, ...PALETTE.white);
  c.fillRect(10, 16, 12, 6, ...PALETTE.black);
  c.fillRect(13, 17, 6, 4, ...PALETTE.cyanBright); // Blue glass lens
  // Red recording LED
  c.fillRect(20, 13, 2, 2, ...PALETTE.neonRed);
  saveAsset('objects/security_camera.png', c);
}

// ==========================================
// 3. GENERATE SPRITESHEETS (32x48 per frame)
// 12 frames: 4 rows (Down, Left, Right, Up), 3 cols (Idle, Walk1, Walk2)
// Total dimensions: 96 x 192 px
// ==========================================

function drawCharacterFrame(canvas, frameX, frameY, direction, walkCycle, charConfig) {
  const ox = frameX * 32;
  const oy = frameY * 48;
  const { skin, hair, clothes, accent, isPlayer, hairStyle } = charConfig;

  // walkCycle: 0 = idle, 1 = walk leg A, 2 = walk leg B
  const legOffset1 = walkCycle === 1 ? -2 : walkCycle === 2 ? 2 : 0;
  const legOffset2 = walkCycle === 1 ? 2 : walkCycle === 2 ? -2 : 0;
  const armOffset1 = walkCycle === 1 ? 2 : walkCycle === 2 ? -2 : 0;
  const armOffset2 = walkCycle === 1 ? -2 : walkCycle === 2 ? 2 : 0;

  if (direction === 'down') {
    // FRONT-FACING
    // Legs
    canvas.fillRect(ox + 10, oy + 34 + legOffset1, 4, 10 - legOffset1, ...PALETTE.clothDark);
    canvas.fillRect(ox + 18, oy + 34 + legOffset2, 4, 10 - legOffset2, ...PALETTE.clothDark);
    // Shoes
    canvas.fillRect(ox + 9, oy + 42, 5, 4, ...PALETTE.black);
    canvas.fillRect(ox + 18, oy + 42, 5, 4, ...PALETTE.black);

    // Torso / Jacket
    canvas.fillRect(ox + 8, oy + 18, 16, 16, ...clothes);
    // Collar / Shirt inside
    canvas.fillRect(ox + 14, oy + 18, 4, 8, ...PALETTE.white);
    if (isPlayer) {
      // Tech lanyard + ID badge with cyan accent
      canvas.fillRect(ox + 15, oy + 21, 2, 7, ...PALETTE.cyanBright);
      canvas.fillRect(ox + 14, oy + 27, 4, 3, ...PALETTE.white);
      canvas.setPixel(ox + 15, oy + 28, ...PALETTE.cyanMid);
    } else if (accent) {
      // Tie or badge
      canvas.fillRect(ox + 15, oy + 22, 2, 7, ...accent);
    }

    // Arms
    canvas.fillRect(ox + 5, oy + 19 + armOffset1, 3, 11, ...clothes);
    canvas.fillRect(ox + 5, oy + 29 + armOffset1, 3, 3, ...skin); // Hand
    canvas.fillRect(ox + 24, oy + 19 + armOffset2, 3, 11, ...clothes);
    canvas.fillRect(ox + 24, oy + 29 + armOffset2, 3, 3, ...skin);

    // Head
    canvas.fillRect(ox + 10, oy + 6, 12, 12, ...skin);
    // Eyes
    canvas.fillRect(ox + 12, oy + 11, 2, 2, ...PALETTE.black);
    canvas.fillRect(ox + 18, oy + 11, 2, 2, ...PALETTE.black);
    canvas.setPixel(ox + 12, oy + 11, ...PALETTE.white);
    canvas.setPixel(ox + 18, oy + 11, ...PALETTE.white);

    // Hair
    canvas.fillRect(ox + 9, oy + 4, 14, 5, ...hair);
    canvas.fillRect(ox + 8, oy + 6, 3, 6, ...hair);
    canvas.fillRect(ox + 21, oy + 6, 3, 6, ...hair);
    if (hairStyle === 'long') {
      canvas.fillRect(ox + 8, oy + 12, 3, 5, ...hair);
      canvas.fillRect(ox + 21, oy + 12, 3, 5, ...hair);
    }
  } else if (direction === 'up') {
    // BACK-FACING
    // Legs
    canvas.fillRect(ox + 10, oy + 34 + legOffset1, 4, 10 - legOffset1, ...PALETTE.clothDark);
    canvas.fillRect(ox + 18, oy + 34 + legOffset2, 4, 10 - legOffset2, ...PALETTE.clothDark);
    canvas.fillRect(ox + 9, oy + 42, 5, 4, ...PALETTE.black);
    canvas.fillRect(ox + 18, oy + 42, 5, 4, ...PALETTE.black);

    // Torso / Back
    canvas.fillRect(ox + 8, oy + 18, 16, 16, ...clothes);
    if (isPlayer) {
      // Tech backpack on back
      canvas.fillRect(ox + 10, oy + 20, 12, 12, ...PALETTE.slateDark);
      canvas.strokeRect(10 + ox, 20 + oy, 12, 12, ...PALETTE.cyanDark);
      canvas.fillRect(ox + 14, oy + 23, 4, 2, ...PALETTE.cyanBright);
    }

    // Arms
    canvas.fillRect(ox + 5, oy + 19 + armOffset1, 3, 11, ...clothes);
    canvas.fillRect(ox + 5, oy + 29 + armOffset1, 3, 3, ...skin);
    canvas.fillRect(ox + 24, oy + 19 + armOffset2, 3, 11, ...clothes);
    canvas.fillRect(ox + 24, oy + 29 + armOffset2, 3, 3, ...skin);

    // Head / Hair from back
    canvas.fillRect(ox + 9, oy + 4, 14, 14, ...hair);
    if (hairStyle === 'long') {
      canvas.fillRect(ox + 10, oy + 16, 12, 6, ...hair);
    }
  } else if (direction === 'left') {
    // LEFT-FACING
    // Legs
    canvas.fillRect(ox + 13 + legOffset1, oy + 34, 4, 10, ...PALETTE.clothDark);
    canvas.fillRect(ox + 15 + legOffset2, oy + 34, 4, 10, ...PALETTE.slateDark);
    canvas.fillRect(ox + 11 + legOffset1, oy + 42, 6, 4, ...PALETTE.black);

    // Torso
    canvas.fillRect(ox + 11, oy + 18, 10, 16, ...clothes);
    if (isPlayer) {
      // Side strap / bag
      canvas.fillRect(ox + 18, oy + 20, 4, 10, ...PALETTE.slateDark);
      canvas.fillRect(ox + 12, oy + 22, 1, 8, ...PALETTE.cyanBright);
    }

    // Arm (front)
    canvas.fillRect(ox + 13 + armOffset1, oy + 19, 4, 11, ...clothes);
    canvas.fillRect(ox + 13 + armOffset1, oy + 29, 3, 3, ...skin);

    // Head
    canvas.fillRect(ox + 10, oy + 6, 11, 12, ...skin);
    // Profile eye
    canvas.fillRect(ox + 11, oy + 11, 2, 2, ...PALETTE.black);
    canvas.setPixel(ox + 11, oy + 11, ...PALETTE.white);

    // Hair
    canvas.fillRect(ox + 10, oy + 4, 12, 5, ...hair);
    canvas.fillRect(ox + 16, oy + 6, 6, 10, ...hair);
    if (hairStyle === 'long') {
      canvas.fillRect(ox + 18, oy + 14, 4, 6, ...hair);
    }
  } else if (direction === 'right') {
    // RIGHT-FACING
    // Legs
    canvas.fillRect(ox + 13 + legOffset1, oy + 34, 4, 10, ...PALETTE.clothDark);
    canvas.fillRect(ox + 15 + legOffset2, oy + 34, 4, 10, ...PALETTE.slateDark);
    canvas.fillRect(ox + 15 + legOffset1, oy + 42, 6, 4, ...PALETTE.black);

    // Torso
    canvas.fillRect(ox + 11, oy + 18, 10, 16, ...clothes);
    if (isPlayer) {
      // Side strap / bag
      canvas.fillRect(ox + 10, oy + 20, 4, 10, ...PALETTE.slateDark);
      canvas.fillRect(ox + 19, oy + 22, 1, 8, ...PALETTE.cyanBright);
    }

    // Arm
    canvas.fillRect(ox + 15 + armOffset2, oy + 19, 4, 11, ...clothes);
    canvas.fillRect(ox + 16 + armOffset2, oy + 29, 3, 3, ...skin);

    // Head
    canvas.fillRect(ox + 11, oy + 6, 11, 12, ...skin);
    // Profile eye
    canvas.fillRect(ox + 19, oy + 11, 2, 2, ...PALETTE.black);
    canvas.setPixel(ox + 20, oy + 11, ...PALETTE.white);

    // Hair
    canvas.fillRect(ox + 10, oy + 4, 12, 5, ...hair);
    canvas.fillRect(ox + 10, oy + 6, 6, 10, ...hair);
    if (hairStyle === 'long') {
      canvas.fillRect(ox + 10, oy + 14, 4, 6, ...hair);
    }
  }
}

function generateCharacterSpritesheet(subPath, charConfig) {
  // 3 cols x 4 rows = 96 x 192 px
  // Rows: 0 = Down, 1 = Left, 2 = Right, 3 = Up
  // Cols: 0 = Idle, 1 = Walk 1, 2 = Walk 2
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

// Generate the 4 characters
function generateAllCharacters() {
  // Player: young cybersecurity analyst, dark casual hoodie/jacket, cyan lanyard/backpack, dark hair
  generateCharacterSpritesheet('characters/player.png', {
    skin: PALETTE.skinToneLight,
    hair: PALETTE.hairDark,
    clothes: PALETTE.clothDark,
    accent: PALETTE.cyanBright,
    isPlayer: true,
    hairStyle: 'short'
  });

  // Manager: neat suit, red tie/badge, brown hair
  generateCharacterSpritesheet('characters/manager.png', {
    skin: PALETTE.skinToneMid,
    hair: PALETTE.hairBrown,
    clothes: PALETTE.clothNavy,
    accent: PALETTE.clothRed,
    isPlayer: false,
    hairStyle: 'short'
  });

  // Receptionist: friendly blouse, blonde ponytail, headset
  generateCharacterSpritesheet('characters/receptionist.png', {
    skin: PALETTE.skinToneLight,
    hair: PALETTE.hairBlonde,
    clothes: PALETTE.clothTeal,
    accent: PALETTE.white,
    isPlayer: false,
    hairStyle: 'long'
  });

  // IT Technician: teal/navy polo, dark skin tone, glasses
  generateCharacterSpritesheet('characters/it_tech.png', {
    skin: PALETTE.skinToneDark,
    hair: PALETTE.black,
    clothes: PALETTE.slateMid,
    accent: PALETTE.neonGreen,
    isPlayer: false,
    hairStyle: 'short'
  });
}

// ==========================================
// 4. GENERATE UI & CYBERSECURITY BADGES
// ==========================================

function generateUIAssets() {
  // 1. Interaction prompt bubble [E] (32x32)
  const prompt = new PixelCanvas(32, 32);
  prompt.fillRect(4, 4, 24, 20, ...PALETTE.darkBg);
  prompt.strokeRect(4, 4, 24, 20, ...PALETTE.cyanBright);
  // Pointer notch
  prompt.fillRect(14, 24, 4, 3, ...PALETTE.darkBg);
  prompt.setPixel(14, 24, ...PALETTE.cyanBright);
  prompt.setPixel(17, 24, ...PALETTE.cyanBright);
  prompt.setPixel(15, 26, ...PALETTE.cyanBright);
  prompt.setPixel(16, 26, ...PALETTE.cyanBright);
  // "E" in center
  prompt.fillRect(12, 8, 8, 2, ...PALETTE.cyanBright);
  prompt.fillRect(12, 10, 3, 8, ...PALETTE.cyanBright);
  prompt.fillRect(12, 13, 6, 2, ...PALETTE.cyanBright);
  prompt.fillRect(12, 18, 8, 2, ...PALETTE.cyanBright);
  saveAsset('ui/prompt_e.png', prompt);

  // 2. Risk Badge (32x32)
  const risk = new PixelCanvas(32, 32);
  risk.fillRect(2, 2, 28, 28, ...PALETTE.darkBg);
  risk.strokeRect(2, 2, 28, 28, ...PALETTE.neonRed);
  // Warning triangle
  risk.fillRect(15, 6, 2, 3, ...PALETTE.neonRed);
  risk.fillRect(13, 9, 6, 3, ...PALETTE.neonRed);
  risk.fillRect(11, 12, 10, 4, ...PALETTE.neonRed);
  risk.fillRect(9, 16, 14, 4, ...PALETTE.neonRed);
  risk.fillRect(7, 20, 18, 4, ...PALETTE.neonRed);
  // Exclamation point
  risk.fillRect(15, 10, 2, 7, ...PALETTE.white);
  risk.fillRect(15, 19, 2, 2, ...PALETTE.white);
  saveAsset('ui/badge_risk.png', risk);

  // 3. Awareness Badge (32x32)
  const aware = new PixelCanvas(32, 32);
  aware.fillRect(2, 2, 28, 28, ...PALETTE.darkBg);
  aware.strokeRect(2, 2, 28, 28, ...PALETTE.cyanBright);
  // Cyber Eye / Shield
  aware.fillRect(6, 14, 20, 4, ...PALETTE.cyanDark);
  aware.fillRect(10, 10, 12, 12, ...PALETTE.cyanMid);
  aware.fillRect(13, 13, 6, 6, ...PALETTE.black);
  aware.fillRect(15, 15, 2, 2, ...PALETTE.cyanBright); // Pupil
  saveAsset('ui/badge_awareness.png', aware);

  // 4. Evidence Clue Badge (32x32)
  const clue = new PixelCanvas(32, 32);
  clue.fillRect(2, 2, 28, 28, ...PALETTE.darkBg);
  clue.strokeRect(2, 2, 28, 28, ...PALETTE.neonAmber);
  // Magnifying glass over digital envelope
  clue.strokeRect(8, 8, 12, 12, ...PALETTE.neonAmber);
  clue.strokeRect(9, 9, 10, 10, ...PALETTE.cyanMid);
  clue.fillRect(18, 18, 6, 6, ...PALETTE.neonAmber);
  clue.fillRect(22, 22, 5, 5, ...PALETTE.woodLight);
  saveAsset('ui/badge_clue.png', clue);

  // 5. MFA Authenticator Token Badge (32x32)
  const mfa = new PixelCanvas(32, 32);
  mfa.fillRect(2, 2, 28, 28, ...PALETTE.darkBg);
  mfa.strokeRect(2, 2, 28, 28, ...PALETTE.cyanBright);
  // Mobile / Hardware Token shape
  mfa.fillRect(8, 5, 16, 22, ...PALETTE.slateDark);
  mfa.strokeRect(8, 5, 16, 22, ...PALETTE.cyanMid);
  // Display Screen with 6-digit TOTP dashes
  mfa.fillRect(11, 9, 10, 6, ...PALETTE.black);
  mfa.fillRect(12, 11, 2, 2, ...PALETTE.neonGreen);
  mfa.fillRect(15, 11, 2, 2, ...PALETTE.neonGreen);
  mfa.fillRect(18, 11, 2, 2, ...PALETTE.neonGreen);
  // Key / Shield icon at bottom
  mfa.fillRect(14, 18, 4, 6, ...PALETTE.cyanBright);
  mfa.fillRect(15, 20, 2, 2, ...PALETTE.white);
  saveAsset('ui/badge_mfa.png', mfa);

  // 6. Password Lock Badge (32x32)
  const pwd = new PixelCanvas(32, 32);
  pwd.fillRect(2, 2, 28, 28, ...PALETTE.darkBg);
  pwd.strokeRect(2, 2, 28, 28, ...PALETTE.neonAmber);
  // Padlock body
  pwd.fillRect(9, 14, 14, 12, ...PALETTE.neonAmber);
  pwd.strokeRect(9, 14, 14, 12, ...PALETTE.slateDark);
  // Shackle
  pwd.strokeRect(11, 7, 10, 8, ...PALETTE.slateLight);
  pwd.fillRect(15, 18, 2, 4, ...PALETTE.black); // Keyhole
  pwd.fillRect(14, 21, 4, 2, ...PALETTE.black);
  saveAsset('ui/badge_password.png', pwd);
}

// Master Generation Runner
function main() {
  console.log('=== STARTING CYBER CO PIXEL ART ASSET GENERATION ===');

  // Environment
  generateFloorOffice();
  generateFloorDark();
  generateFloorCarpet();
  generateWallOffice();
  generateWallWindow();
  generateDoorOffice();
  generateExteriorSidewalk();
  generateExteriorRoad();
  generateExteriorGrass();
  generateExteriorWall();
  generateExteriorSign();
  generateExteriorStreetLamp();
  generateExteriorTree();
  generateBuildingEntrance();

  // Objects
  generateDesk();
  generateDeskWithPC();
  generateOfficeChair();
  generateServerRack();
  generatePlant();
  generateWaterDispenser();
  generateWhiteboard();
  generateFilingCabinet();
  generateSecurityCamera();

  // Characters
  generateAllCharacters();

  // UI
  generateUIAssets();

  console.log('=== ASSET GENERATION COMPLETE ===');
}

main();
