import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Music, Sparkles, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Wind } from 'lucide-react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ROAD_WIDTH = 250;
const MAX_POWER = 100;
const POWER_DEPLETION_RATE = 3; 
const GOBLIN_DAMAGE = 20;
const INSTRUMENT_HEAL = 15;
const MAX_SPEED = 600; 
const ACCELERATION = 300;
const DECELERATION = 150;
const LATERAL_SPEED = 400;
const GOBLIN_FORWARD_SPEED = 450;

type GameState = 'intro' | 'playing' | 'gameover' | 'victory';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-sans selection:bg-pink-500/30">
      {gameState === 'intro' && <IntroScreen onStart={() => setGameState('playing')} />}
      {gameState === 'playing' && <Game onGameOver={() => setGameState('gameover')} onVictory={() => setGameState('victory')} />}
      {gameState === 'gameover' && <GameOverScreen onRestart={() => setGameState('playing')} onMenu={() => setGameState('intro')} />}
      {gameState === 'victory' && <VictoryScreen onRestart={() => setGameState('playing')} onMenu={() => setGameState('intro')} />}
    </div>
  );
}

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="relative w-full min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950 py-10 px-4">
    {/* Background Decorations */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <img src="/Assets/arbol.svg" className="absolute -bottom-10 -left-20 w-40 md:w-80 opacity-20 blur-sm" alt="" />
      <img src="/Assets/arbol2.svg" className="absolute -bottom-20 -right-20 w-48 md:w-96 opacity-20 blur-sm" alt="" />
      <img src="/Assets/arbol3.svg" className="absolute top-10 -left-10 w-20 md:w-40 opacity-10 rotate-12" alt="" />
      
      {/* Floating Instruments */}
      <div className="absolute top-1/4 left-1/4 animate-bounce-slow opacity-30 hidden sm:block">
        <img src="/Assets/guitarra.svg" className="w-12 md:w-16 rotate-12" alt="" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-bounce-slow opacity-30 [animation-delay:1s] hidden sm:block">
        <img src="/Assets/bombo.svg" className="w-16 md:w-20 -rotate-12" alt="" />
      </div>
    </div>

    <div className="relative z-20 w-full max-w-2xl p-6 md:p-10 bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border-2 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center transform transition-all flex flex-col items-center">
      <div className="flex justify-center mb-4 md:mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full group-hover:bg-pink-500/50 transition-all duration-700" />
          <img 
            src="/Assets/girl.png" 
            alt="Niña Música" 
            className="max-w-[120px] md:max-w-[180px] w-auto h-auto object-contain relative z-10 animate-float drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-fantasy font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-b from-pink-200 via-pink-400 to-purple-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tight">
        El Hechizo de las Notas Perdidas
      </h1>
      
      <div className="relative mb-6 md:mb-8">
        <div className="absolute -left-2 md:-left-4 top-0 text-2xl md:text-4xl text-pink-500/40 font-serif">"</div>
        <p className="text-base md:text-xl font-hand text-neutral-200 px-4 md:px-6 leading-relaxed italic">
          En el corazón del Bosque de los Ecos, una joven virtuosa debe emprender un viaje místico para rescatar la Sinfonía Ancestral. 
          El Cofre de la Armonía ha sido sellado, y solo tú puedes romper el hechizo mientras evitas las sombras de un duende que anhela silenciar tu música para siempre.
        </p>
        <div className="absolute -right-2 md:-right-4 bottom-0 text-2xl md:text-4xl text-pink-500/40 font-serif">"</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8 text-left border border-purple-500/20 shadow-inner w-full">
        <div className="space-y-1 md:space-y-2">
          <p className="font-hand text-sm md:text-base flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_5px_#ec4899]" /> <strong className="text-pink-400 font-fantasy text-[10px] md:text-xs uppercase tracking-wider">W / S:</strong> Ritmo y Pausa</p>
          <p className="font-hand text-sm md:text-base flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_5px_#ec4899]" /> <strong className="text-pink-400 font-fantasy text-[10px] md:text-xs uppercase tracking-wider">A / D:</strong> Danza Lateral</p>
        </div>
        <div className="space-y-1 md:space-y-2">
          <p className="font-hand text-sm md:text-base flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" /> <strong className="text-blue-400 font-fantasy text-[10px] md:text-xs uppercase tracking-wider">Espacio:</strong> Vuelo Místico</p>
          <p className="font-hand text-sm md:text-base flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_#eab308]" /> <strong className="text-yellow-400 font-fantasy text-[10px] md:text-xs uppercase tracking-wider">Notas:</strong> Esencia Vital</p>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center gap-3 md:gap-4 px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-pink-600 to-purple-800 text-white font-fantasy text-xl md:text-2xl rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.5)] cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Play className="w-6 h-6 md:w-8 md:h-8 fill-current relative z-10" />
        <span className="relative z-10">Despertar la Magia</span>
      </button>
    </div>
  </div>
);

const GameOverScreen = ({ onRestart, onMenu }: { onRestart: () => void, onMenu: () => void }) => (
  <div className="relative w-full min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-sm py-10 px-4 overflow-y-auto">
    <div className="w-full max-w-md p-8 md:p-10 bg-neutral-900/95 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] border-2 border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.2)] text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
      
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-red-900/40 blur-2xl rounded-full animate-pulse" />
          <img 
            src="/Assets/girl.png" 
            alt="Niña Asustada" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 grayscale brightness-75 contrast-125"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-fantasy font-bold text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          La melodía se ha apagado...
        </h2>
      </div>

      <p className="text-neutral-400 font-hand text-lg md:text-xl mb-8 md:mb-10 italic leading-relaxed">
        El duende ha robado tu esencia musical y el bosque ha quedado en un silencio sepulcral.
      </p>

      <div className="flex flex-col gap-3 md:gap-4">
        <button 
          onClick={onRestart}
          className="group inline-flex items-center justify-center gap-3 px-6 py-4 md:px-8 md:py-5 bg-red-600 hover:bg-red-500 text-white font-fantasy text-lg md:text-xl rounded-2xl transition-all shadow-lg shadow-red-900/40 transform hover:-translate-y-1 active:translate-y-0"
        >
          <RotateCcw className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" />
          Recuperar el Ritmo
        </button>
        <button 
          onClick={onMenu}
          className="inline-flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-transparent hover:bg-white/5 text-neutral-500 hover:text-neutral-300 font-hand text-base md:text-lg rounded-2xl transition-all"
        >
          Refugiarse en el Menú
        </button>
      </div>
    </div>
  </div>
);

const VictoryScreen = ({ onRestart, onMenu }: { onRestart: () => void, onMenu: () => void }) => (
  <div className="relative w-full min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm py-10 px-4 overflow-y-auto">
    <div className="w-full max-w-md p-8 md:p-10 bg-neutral-900/95 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] border-2 border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.2)] text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
          <Sparkles className="w-20 h-20 md:w-24 md:h-24 text-yellow-400 relative z-10 animate-float drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl font-fantasy font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        ¡Melodía Restaurada!
      </h2>

      <p className="text-neutral-200 font-hand text-lg md:text-xl mb-8 md:mb-10 italic leading-relaxed">
        ¡La Sinfonía Ancestral vuelve a sonar! Has recuperado las notas sagradas y liberado al bosque de su silencio eterno.
      </p>

      <div className="flex flex-col gap-3 md:gap-4">
        <button 
          onClick={onRestart}
          className="group inline-flex items-center justify-center gap-3 md:gap-4 px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-fantasy text-lg md:text-xl rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-yellow-900/40 cursor-pointer border-b-4 border-orange-900 active:translate-y-1 active:border-b-0"
        >
          <Play className="w-6 h-6 md:w-7 md:h-7 fill-current" />
          Nueva Sinfonía
        </button>
        <button 
          onClick={onMenu}
          className="inline-flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-neutral-200 font-hand text-base md:text-lg rounded-2xl transition-all"
        >
          Regresar al Templo
        </button>
      </div>
    </div>
  </div>
);

// Pre-load images globally
const playerImg = new Image();
playerImg.src = '/Assets/girl.png';
let playerImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };

const goblinImg = new Image();
goblinImg.src = '/Assets/goblin.png';
let goblinImgLoaded = false;
goblinImg.onload = () => { 
  goblinImgLoaded = true; 
  console.log('Goblin image loaded');
};
goblinImg.onerror = () => {
  console.error('Failed to load goblin image');
};

const instrumentImages: Record<string, HTMLImageElement> = {};
const instrumentLoaded: Record<string, boolean> = {};
['bombo', 'guitarra', 'kena', 'zampoña'].forEach(name => {
  const img = new Image();
  img.src = `/Assets/${name}.svg`;
  instrumentImages[name] = img;
  instrumentLoaded[name] = false;
  img.onload = () => { instrumentLoaded[name] = true; };
});

const treeImages: HTMLImageElement[] = [];
const treeLoaded: boolean[] = [];
['arbol', 'arbol2', 'arbol3', 'arbol4'].forEach((name, i) => {
  const img = new Image();
  img.src = `/Assets/${name}.svg`;
  treeImages[i] = img;
  treeLoaded[i] = false;
  img.onload = () => { 
    treeLoaded[i] = true; 
    console.log(`Tree ${name} loaded`);
  };
  img.onerror = () => {
    console.error(`Failed to load tree ${name}`);
  };
});

const obstacleImages: Record<string, HTMLImageElement> = {};
const obstacleLoaded: Record<string, boolean> = {};
['lago tran', 'tesoro'].forEach(name => {
  const img = new Image();
  img.src = `/Assets/${name}.svg`;
  obstacleImages[name] = img;
  obstacleLoaded[name] = false;
  img.onload = () => { 
    obstacleLoaded[name] = true; 
    console.log(`Obstacle ${name} loaded`);
  };
  img.onerror = () => {
    console.error(`Failed to load obstacle ${name}`);
  };
});

const Game = ({ onGameOver, onVictory }: { onGameOver: () => void, onVictory: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    distance: 0,
    speed: 300,
    harmonicPower: 50,
    player: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      radius: 16,
      isFlying: false,
      flyHeight: 0
    },
    goblin: {
      x: CANVAS_WIDTH / 2,
      y: -100,
      radius: 20,
      stunned: false,
      stunTimer: 0
    },
    instruments: [] as { distanceOnTrack: number, offsetX: number, id: number, type: string }[],
    obstacles: [] as { distanceOnTrack: number, offsetX: number, id: number, type: 'lake' | 'fake_chest' }[],
    chest: null as { distanceOnTrack: number } | null,
    keys: {} as Record<string, boolean>,
    instrumentIdCounter: 0,
    obstacleIdCounter: 0,
    spawnTimer: 0,
    obstacleSpawnTimer: 2.0
  });

  const [uiState, setUiState] = useState({
    power: 50,
    speed: 300,
    isStunned: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let uiUpdateTimer = 0;

    const state = stateRef.current;

    const handleKeyDown = (e: KeyboardEvent) => { 
      state.keys[e.key.toLowerCase()] = true; 
      state.keys[e.key] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      state.keys[e.key.toLowerCase()] = false; 
      state.keys[e.key] = false; 
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const getRoadCenterX = (d: number) => {
      const SEGMENT_LENGTH = 2000;
      const TRANSITION_LENGTH = 400;
      
      const getXForIndex = (index: number) => {
        // Deterministic random offset based on segment index
        const seed = Math.sin(index * 45.67) * 10000;
        const rand = (seed - Math.floor(seed));
        // Keep the road within safe bounds (centered-ish)
        return CANVAS_WIDTH / 2 + (rand - 0.5) * 350;
      };

      const segmentIndex = Math.floor(d / SEGMENT_LENGTH);
      const progress = d % SEGMENT_LENGTH;
      
      const currentX = getXForIndex(segmentIndex);
      
      if (progress > SEGMENT_LENGTH - TRANSITION_LENGTH) {
        const nextX = getXForIndex(segmentIndex + 1);
        const t = (progress - (SEGMENT_LENGTH - TRANSITION_LENGTH)) / TRANSITION_LENGTH;
        // Smooth but straight-ish transition
        return currentX + (nextX - currentX) * t;
      }
      
      return currentX;
    };

    const update = (dt: number) => {
      // Controls
      const isAcc = state.keys.w || state.keys.ArrowUp;
      const isBrk = state.keys.s || state.keys.ArrowDown;
      const isLft = state.keys.a || state.keys.ArrowLeft;
      const isRgt = state.keys.d || state.keys.ArrowRight;

      if (isAcc) state.speed = Math.min(MAX_SPEED, state.speed + ACCELERATION * dt);
      else if (isBrk) state.speed = Math.max(100, state.speed - DECELERATION * 2 * dt);
      else {
        if (state.speed > 300) state.speed -= DECELERATION * dt;
        if (state.speed < 300) state.speed += ACCELERATION * dt;
      }

      state.distance += state.speed * dt;

      // Flying logic
      const isSpacePressed = state.keys[' '] || state.keys['spacebar'];
      state.player.isFlying = isSpacePressed && state.harmonicPower > 5;
      
      if (state.player.isFlying) {
        state.player.flyHeight = Math.min(1, state.player.flyHeight + 4 * dt);
        state.harmonicPower -= 8 * dt; // Flying consumes power
      } else {
        state.player.flyHeight = Math.max(0, state.player.flyHeight - 4 * dt);
      }

      if (isLft) state.player.x -= LATERAL_SPEED * dt;
      if (isRgt) state.player.x += LATERAL_SPEED * dt;

      // Road boundaries
      const roadCenterX = getRoadCenterX(state.distance + state.player.y - state.player.y); // distance at player.y
      const leftBound = roadCenterX - ROAD_WIDTH / 2 + state.player.radius + 10;
      const rightBound = roadCenterX + ROAD_WIDTH / 2 - state.player.radius - 10;

      if (state.player.x <= leftBound || state.player.x >= rightBound) {
        state.speed = Math.max(100, state.speed - DECELERATION * 4 * dt);
      }
      state.player.x = Math.max(leftBound, Math.min(rightBound, state.player.x));

      // Power depletion
      state.harmonicPower -= POWER_DEPLETION_RATE * dt;

      // Goblin
      if (state.goblin.stunned) {
        state.goblin.stunTimer -= dt;
        state.goblin.y -= 200 * dt;
        if (state.goblin.stunTimer <= 0) {
          state.goblin.stunned = false;
          state.harmonicPower = 50;
          state.chest = null;
        }
      } else {
        state.goblin.x += (state.player.x - state.goblin.x) * 3 * dt;
        
        // Constrain goblin to road
        const goblinDist = state.distance + state.player.y - state.goblin.y;
        const gRoadCenterX = getRoadCenterX(goblinDist);
        const gLeftBound = gRoadCenterX - ROAD_WIDTH / 2 + state.goblin.radius + 5;
        const gRightBound = gRoadCenterX + ROAD_WIDTH / 2 - state.goblin.radius - 5;
        state.goblin.x = Math.max(gLeftBound, Math.min(gRightBound, state.goblin.x));

        const relativeSpeed = GOBLIN_FORWARD_SPEED - state.speed;
        state.goblin.y += relativeSpeed * dt;

        if (state.goblin.y < -100) state.goblin.y = -100;

        if (state.goblin.y > CANVAS_HEIGHT + 50) {
          state.goblin.y = -100;
        }

        if (Math.hypot(state.player.x - state.goblin.x, state.player.y - state.goblin.y) < state.player.radius + state.goblin.radius) {
          state.harmonicPower -= GOBLIN_DAMAGE;
          state.goblin.y = -100;
          state.speed = Math.max(100, state.speed - 200); // slow down on hit
        }
      }

      // Spawning helpers
      const isPositionSafe = (dist: number, offset: number, minVertical: number = 250, minHorizontal: number = 120) => {
        const nearInst = state.instruments.some(inst => 
          Math.abs(inst.distanceOnTrack - dist) < minVertical && Math.abs(inst.offsetX - offset) < minHorizontal
        );
        const nearObs = state.obstacles.some(obs => 
          Math.abs(obs.distanceOnTrack - dist) < minVertical && Math.abs(obs.offsetX - offset) < minHorizontal + 50
        );
        return !nearInst && !nearObs;
      };

      // Spawning
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0 && !state.goblin.stunned) {
        state.spawnTimer = 1.0 + Math.random() * 1.5;
        const dist = state.distance + state.player.y + 1000;
        const offset = (Math.random() - 0.5) * (ROAD_WIDTH - 80);
        
        if (isPositionSafe(dist, offset)) {
          const INSTRUMENT_TYPES = ['bombo', 'guitarra', 'kena', 'zampoña'];
          state.instruments.push({
            distanceOnTrack: dist,
            offsetX: offset,
            id: state.instrumentIdCounter++,
            type: INSTRUMENT_TYPES[Math.floor(Math.random() * INSTRUMENT_TYPES.length)]
          });
        }
      }

      // Obstacle spawning
      state.obstacleSpawnTimer -= dt;
      if (state.obstacleSpawnTimer <= 0 && !state.goblin.stunned) {
        const pattern = Math.random();
        const dist = state.distance + state.player.y + 1200;
        
        if (pattern > 0.7) {
          // Double obstacle gate
          const type1 = Math.random() > 0.5 ? 'lake' : 'fake_chest';
          const type2 = Math.random() > 0.5 ? 'lake' : 'fake_chest';
          const offset1 = -ROAD_WIDTH / 3;
          const offset2 = ROAD_WIDTH / 3;
          
          if (isPositionSafe(dist, offset1, 300, 150) && isPositionSafe(dist, offset2, 300, 150)) {
            state.obstacles.push({
              distanceOnTrack: dist,
              offsetX: offset1,
              id: state.obstacleIdCounter++,
              type: type1
            });
            state.obstacles.push({
              distanceOnTrack: dist,
              offsetX: offset2,
              id: state.obstacleIdCounter++,
              type: type2
            });
            state.obstacleSpawnTimer = 4.0 + Math.random() * 3.0;
          }
        } else {
          // Single obstacle
          const type = Math.random() > 0.5 ? 'lake' : 'fake_chest';
          const offset = (Math.random() - 0.5) * (ROAD_WIDTH - 100);
          
          if (isPositionSafe(dist, offset, 300, 150)) {
            state.obstacles.push({
              distanceOnTrack: dist,
              offsetX: offset,
              id: state.obstacleIdCounter++,
              type: type as 'lake' | 'fake_chest'
            });
            state.obstacleSpawnTimer = 2.5 + Math.random() * 3.0;
          }
        }
      }

      // Instruments update
      for (let i = state.instruments.length - 1; i >= 0; i--) {
        const inst = state.instruments[i];
        const instY = state.distance + state.player.y - inst.distanceOnTrack;
        const instRoadX = getRoadCenterX(inst.distanceOnTrack);
        const instX = instRoadX + inst.offsetX;

        if (Math.hypot(state.player.x - instX, state.player.y - instY) < state.player.radius + 15) {
          state.harmonicPower = Math.min(MAX_POWER, state.harmonicPower + INSTRUMENT_HEAL);
          state.instruments.splice(i, 1);
          
          if (state.harmonicPower >= MAX_POWER && !state.goblin.stunned) {
            state.goblin.stunned = true;
            state.goblin.stunTimer = 10.0;
            state.chest = {
              distanceOnTrack: state.distance + state.player.y + 1200
            };
          }
        } else if (instY > CANVAS_HEIGHT + 50) {
          state.instruments.splice(i, 1);
        }
      }

      // Obstacles update
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        const obsY = state.distance + state.player.y - obs.distanceOnTrack;
        const obsRoadX = getRoadCenterX(obs.distanceOnTrack);
        const obsX = obsRoadX + obs.offsetX;

        const hitDist = obs.type === 'lake' ? 80 : 50;
        // Only collide if not flying high enough
        if (state.player.flyHeight < 0.6 && Math.hypot(state.player.x - obsX, state.player.y - obsY) < state.player.radius + hitDist) {
          if (obs.type === 'lake') {
            // Lake slows down the player
            state.speed = Math.max(50, state.speed - 400 * dt);
          } else {
            // Fake chest reduces power and slows down briefly
            state.harmonicPower = Math.max(0, state.harmonicPower - 10 * dt);
            state.speed = Math.max(100, state.speed - 100 * dt);
          }
        }
        
        if (obsY > CANVAS_HEIGHT + 100) {
          state.obstacles.splice(i, 1);
        }
      }

      // Chest update
      if (state.chest) {
        const chestY = state.distance + state.player.y - state.chest.distanceOnTrack;
        const chestX = getRoadCenterX(state.chest.distanceOnTrack);
        
        if (Math.hypot(state.player.x - chestX, state.player.y - chestY) < state.player.radius + 30) {
          return 'victory';
        }
        if (chestY > CANVAS_HEIGHT + 100) {
          state.chest = null;
        }
      }

      if (state.harmonicPower <= 0) return 'gameover';
      return 'playing';
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      // Enable high quality image smoothing for the player sprite
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, '#0f0a1c');
      bgGradient.addColorStop(1, '#1a0b2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw some magical stars/particles in the background (parallax)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * CANVAS_WIDTH;
        const sy = (state.distance * 0.1 + i * 87.65) % CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.sin(i) * 1.5 + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Road
      ctx.fillStyle = 'rgba(42, 22, 66, 0.8)';
      ctx.beginPath();
      for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
        const d = state.distance + state.player.y - y;
        const cx = getRoadCenterX(d);
        if (y === 0) ctx.moveTo(cx - ROAD_WIDTH / 2, y);
        else ctx.lineTo(cx - ROAD_WIDTH / 2, y);
      }
      for (let y = CANVAS_HEIGHT; y >= 0; y -= 20) {
        const d = state.distance + state.player.y - y;
        const cx = getRoadCenterX(d);
        ctx.lineTo(cx + ROAD_WIDTH / 2, y);
      }
      ctx.fill();

      // Stones on the road
      const stoneSeed = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      for (let y = 0; y <= CANVAS_HEIGHT; y += 40) {
        const d = state.distance + state.player.y - y;
        const cx = getRoadCenterX(d);
        const numStones = 3;
        for (let i = 0; i < numStones; i++) {
          const sX = cx + (stoneSeed(d + i) - 0.5) * (ROAD_WIDTH - 40);
          const sSize = 2 + stoneSeed(d + i + 10) * 4;
          ctx.fillStyle = 'rgba(120, 113, 108, 0.4)';
          ctx.beginPath();
          ctx.arc(sX, y, sSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Road borders with glow
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#d8b4fe';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Road lines (magical dashes)
      ctx.strokeStyle = 'rgba(216, 180, 254, 0.3)';
      ctx.lineWidth = 6;
      ctx.setLineDash([40, 60]);
      ctx.beginPath();
      for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
        const d = state.distance + state.player.y - y;
        const cx = getRoadCenterX(d);
        if (y === 0) ctx.moveTo(cx, y);
        else ctx.lineTo(cx, y);
      }
      ctx.lineDashOffset = -(state.distance % 100);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Magical Runes on the road near obstacles
      state.obstacles.forEach(obs => {
        const y = state.distance + state.player.y - obs.distanceOnTrack;
        const cx = getRoadCenterX(obs.distanceOnTrack);
        
        if (y > -100 && y < CANVAS_HEIGHT + 200) {
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = obs.type === 'lake' ? '#60a5fa' : '#a855f7';
          ctx.font = 'bold 20px "Cinzel Decorative"';
          ctx.textAlign = 'center';
          
          // Draw some runes around the obstacle area
          for(let i=0; i<3; i++) {
            const rx = cx + (Math.sin(obs.id + i) * (ROAD_WIDTH / 2 - 20));
            const ry = y + (Math.cos(obs.id + i) * 40);
            const rune = String.fromCharCode(65 + ( (obs.id + i) % 26 ));
            ctx.fillText(rune, rx, ry);
          }
          ctx.restore();
        }
      });

      // Magical Forest
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed + 1.123) * 10000;
        return x - Math.floor(x);
      };

      const drawTree = (x: number, y: number, rand: number) => {
        ctx.save();
        ctx.translate(x, y);
        const scale = 0.8 + rand * 0.7;
        ctx.scale(scale, scale);
        
        const treeIndex = Math.floor(rand * 4);
        if (treeLoaded[treeIndex]) {
          const img = treeImages[treeIndex];
          // Maintain aesthetic with a subtle glow
          ctx.shadowColor = rand > 0.5 ? '#a855f7' : '#0ea5e9';
          ctx.shadowBlur = 10;
          
          // Draw image centered horizontally and sitting on the y coordinate
          const width = 80;
          const height = 100;
          ctx.drawImage(img, -width / 2, -height, width, height);
          ctx.shadowBlur = 0;
        } else {
          // Fallback to original drawing if not loaded
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(-8, 0, 16, 40);
          const isPurple = rand > 0.5;
          ctx.shadowColor = isPurple ? '#a855f7' : '#0ea5e9';
          ctx.shadowBlur = 15;
          ctx.fillStyle = isPurple ? '#6b21a8' : '#0369a1'; 
          ctx.beginPath();
          ctx.arc(0, -20, 30, 0, Math.PI * 2);
          ctx.arc(-20, -5, 25, 0, Math.PI * 2);
          ctx.arc(20, -5, 25, 0, Math.PI * 2);
          ctx.arc(0, -40, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          if (rand > 0.3) {
            ctx.fillStyle = isPurple ? '#fbcfe8' : '#bae6fd';
            ctx.beginPath();
            ctx.arc(-15, -25, 3, 0, Math.PI * 2);
            ctx.arc(10, -35, 4, 0, Math.PI * 2);
            ctx.arc(15, -10, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();
      };

      const treeStartDist = Math.floor((state.distance - CANVAS_HEIGHT) / 100) * 100;
      for (let d = treeStartDist + CANVAS_HEIGHT + 800; d >= treeStartDist; d -= 100) {
        const y = state.distance + state.player.y - d;
        if (y >= -150 && y <= CANVAS_HEIGHT + 150) {
          const cx = getRoadCenterX(d);
          
          // Left side trees
          const leftSeed = d * 1.5;
          const numLeft = Math.floor(seededRandom(leftSeed) * 2) + 1;
          for(let i=0; i<numLeft; i++) {
             let treeX = cx - ROAD_WIDTH/2 - 40 - seededRandom(leftSeed + i) * 100;
             // Ensure trees don't go off screen
             treeX = Math.max(30, Math.min(CANVAS_WIDTH - 30, treeX));
             drawTree(treeX, y + seededRandom(leftSeed + i + 10)*80, seededRandom(leftSeed + i + 20));
          }

          // Right side trees
          const rightSeed = d * 2.5;
          const numRight = Math.floor(seededRandom(rightSeed) * 2) + 1;
          for(let i=0; i<numRight; i++) {
             let treeX = cx + ROAD_WIDTH/2 + 40 + seededRandom(rightSeed + i) * 100;
             // Ensure trees don't go off screen
             treeX = Math.max(30, Math.min(CANVAS_WIDTH - 30, treeX));
             drawTree(treeX, y + seededRandom(rightSeed + i + 10)*80, seededRandom(rightSeed + i + 20));
          }
        }
      }

      // Instruments
      state.instruments.forEach(inst => {
        const y = state.distance + state.player.y - inst.distanceOnTrack;
        const cx = getRoadCenterX(inst.distanceOnTrack);
        const x = cx + inst.offsetX;

        if (y > -50 && y < CANVAS_HEIGHT + 50) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
          gradient.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
          gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 25, 0, Math.PI * 2);
          ctx.fill();

          if (instrumentLoaded[inst.type]) {
            const img = instrumentImages[inst.type];
            const size = 40;
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
          } else {
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Fallback to first letter if image not loaded
            ctx.fillText(inst.type[0].toUpperCase(), x, y + 2);
          }
        }
      });

      // Obstacles
      state.obstacles.forEach(obs => {
        const y = state.distance + state.player.y - obs.distanceOnTrack;
        const cx = getRoadCenterX(obs.distanceOnTrack);
        const x = cx + obs.offsetX;

        if (y > -200 && y < CANVAS_HEIGHT + 200) {
          ctx.save();
          
          // Magical aura/grounding
          const time = performance.now() / 1000;
          const pulse = Math.sin(time * 2) * 0.2 + 0.8;
          
          if (obs.type === 'lake') {
            // Enchanted Void/Lake
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            ctx.shadowBlur = 20 * pulse;
            
            const imgName = 'lago tran';
            if (obstacleLoaded[imgName]) {
              const img = obstacleImages[imgName];
              const width = 240;
              const height = 160;
              ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
            } else {
              // Fallback: Deep magical pool
              const grad = ctx.createRadialGradient(x, y, 0, x, y, 100);
              grad.addColorStop(0, '#1e3a8a');
              grad.addColorStop(0.7, '#1e40af');
              grad.addColorStop(1, 'rgba(30, 64, 175, 0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.ellipse(x, y, 100, 60, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Magical ripples
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
            ctx.lineWidth = 2;
            for(let i=1; i<=3; i++) {
              const rScale = ( (time * 0.5 + i/3) % 1 );
              ctx.beginPath();
              ctx.ellipse(x, y, 100 * rScale, 60 * rScale, 0, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Magical mist
            ctx.globalAlpha = 0.2 * pulse;
            const mistGrad = ctx.createRadialGradient(x, y, 0, x, y, 120);
            mistGrad.addColorStop(0, '#93c5fd');
            mistGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = mistGrad;
            ctx.beginPath();
            ctx.arc(x, y, 120, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else {
            // Cursed Chest (Goblin's Trap)
            ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
            ctx.shadowBlur = 25 * pulse;
            
            const imgName = 'tesoro';
            if (obstacleLoaded[imgName]) {
              const img = obstacleImages[imgName];
              const width = 120;
              const height = 100;
              
              // Draw dark aura behind
              const auraGrad = ctx.createRadialGradient(x, y, 0, x, y, 70);
              auraGrad.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
              auraGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
              ctx.fillStyle = auraGrad;
              ctx.beginPath();
              ctx.arc(x, y, 70, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
            } else {
              // Fallback: Cursed object
              ctx.fillStyle = '#4c1d95';
              ctx.beginPath();
              ctx.roundRect(x - 40, y - 30, 80, 60, 10);
              ctx.fill();
              ctx.strokeStyle = '#a855f7';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
            
            // Dark particles/smoke
            ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
            for(let i=0; i<5; i++) {
              const px = x + Math.sin(time * 3 + i) * 40;
              const py = y + Math.cos(time * 2 + i) * 20 - 20;
              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          ctx.restore();
        }
      });

      // Chest
      if (state.chest) {
        const y = state.distance + state.player.y - state.chest.distanceOnTrack;
        const cx = getRoadCenterX(state.chest.distanceOnTrack);
        
        if (y > -100 && y < CANVAS_HEIGHT + 100) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 30;
          
          // Chest body
          ctx.fillStyle = '#854d0e';
          ctx.beginPath();
          ctx.roundRect(cx - 40, y - 20, 80, 50, 8);
          ctx.fill();
          
          // Chest lid
          ctx.fillStyle = '#a16207';
          ctx.beginPath();
          ctx.roundRect(cx - 42, y - 35, 84, 25, 10);
          ctx.fill();

          // Gold trims
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(cx - 30, y - 35, 10, 65);
          ctx.fillRect(cx + 20, y - 35, 10, 65);
          
          // Lock
          ctx.fillStyle = '#fcd34d';
          ctx.beginPath();
          ctx.arc(cx, y - 10, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Musical notes floating
          ctx.fillStyle = '#fff';
          ctx.font = '24px Arial';
          const timeOffset = performance.now() / 200;
          ctx.fillText('🎵', cx - 25, y - 45 + Math.sin(timeOffset) * 5);
          ctx.fillText('🎶', cx + 25, y - 55 + Math.cos(timeOffset) * 5);
          ctx.fillText('✨', cx, y - 65 + Math.sin(timeOffset * 0.8) * 5);
        }
      }

      // Goblin
      if (state.goblin.y > -50) {
        ctx.save();
        ctx.shadowColor = state.goblin.stunned ? '#a855f7' : '#22c55e';
        ctx.shadowBlur = 20;

        if (goblinImgLoaded) {
          const aspectRatio = goblinImg.width / goblinImg.height;
          const targetHeight = state.goblin.radius * 2.5; 
          const targetWidth = targetHeight * aspectRatio;

          if (state.goblin.stunned) {
            ctx.translate(state.goblin.x, state.goblin.y);
            ctx.rotate(Math.sin(Date.now() / 100) * 0.2);
            ctx.globalAlpha = 0.7;
            ctx.drawImage(goblinImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
          } else {
            ctx.drawImage(goblinImg, state.goblin.x - targetWidth / 2, state.goblin.y - targetHeight / 2, targetWidth, targetHeight);
          }
        } else {
          // Fallback to a simple circle if image not loaded yet
          ctx.fillStyle = state.goblin.stunned ? '#9333ea' : '#16a34a';
          ctx.beginPath();
          ctx.arc(state.goblin.x, state.goblin.y, state.goblin.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Player
      if (playerImgLoaded) {
        ctx.save();
        
        // Visual feedback for flying
        const flyOffset = state.player.flyHeight * 40;
        const scale = 1 + state.player.flyHeight * 0.3;
        
        // Shadow when flying
        if (state.player.flyHeight > 0) {
          ctx.save();
          ctx.globalAlpha = 0.3 * state.player.flyHeight;
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.ellipse(state.player.x, state.player.y + 10, state.player.radius * scale, state.player.radius * 0.5 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Add a magical glow around the character to blend with the style
        ctx.shadowColor = state.player.isFlying ? '#60a5fa' : '#ec4899';
        ctx.shadowBlur = 20 + state.player.flyHeight * 20;
        
        // Draw the image respecting its original aspect ratio to avoid "crushed" look
        const aspectRatio = playerImg.width / playerImg.height;
        const targetHeight = state.player.radius * 3.5 * scale;
        const targetWidth = targetHeight * aspectRatio;
        
        ctx.drawImage(
          playerImg, 
          state.player.x - targetWidth / 2, 
          state.player.y - targetHeight / 2 - flyOffset, 
          targetWidth, 
          targetHeight
        );
        
        // Add a subtle inner glow/sparkle effect
        if (state.harmonicPower > 80 || state.player.isFlying) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = state.player.isFlying ? '#60a5fa' : '#fff';
          ctx.beginPath();
          ctx.arc(state.player.x, state.player.y - flyOffset, state.player.radius * 1.2 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
        
        ctx.restore();
      } else {
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, state.player.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👧', state.player.x, state.player.y + 2);
        ctx.shadowBlur = 0;
      }

      // UI Background
      // UI removed from canvas and moved to React for better responsiveness
    };

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt to prevent huge jumps
      lastTime = time;

      const result = update(dt);
      draw(ctx);

      // Update UI state less frequently for performance
      uiUpdateTimer += dt;
      if (uiUpdateTimer > 0.05) {
        setUiState({
          power: state.harmonicPower,
          speed: state.speed,
          isStunned: state.goblin.stunned
        });
        uiUpdateTimer = 0;
      }

      if (result === 'gameover') {
        onGameOver();
        return;
      } else if (result === 'victory') {
        onVictory();
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onGameOver, onVictory]);

  const setKey = (key: string, value: boolean) => {
    stateRef.current.keys[key] = value;
  };

  return (
    <div className="relative w-full max-w-full flex flex-col justify-center items-center p-2 md:p-4">
      <div className="relative group w-full max-w-[800px]">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="bg-black rounded-xl shadow-2xl border border-white/10 w-full h-auto max-h-[85vh] md:max-h-[90vh] object-contain" 
        />
        
        {/* React Game UI */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
          <div className="bg-neutral-950/80 backdrop-blur-md border border-purple-500/30 p-3 rounded-2xl shadow-xl min-w-[180px] md:min-w-[240px]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-pink-200 uppercase">Poder Armónico</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-100 ${uiState.power > 80 ? 'bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_10px_#ec4899]' : 'bg-gradient-to-r from-pink-600 to-pink-400'}`}
                style={{ width: `${Math.max(0, Math.min(100, uiState.power))}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] md:text-xs font-mono text-neutral-400">
              Velocidad: <span className="text-white font-bold">{Math.floor(uiState.speed)}</span> km/h
            </div>
          </div>
        </div>

        {/* Stunned Message */}
        {uiState.isStunned && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none text-center animate-bounce">
            <div className="bg-purple-600/90 backdrop-blur-md px-4 py-2 rounded-full border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <p className="text-xs md:text-sm font-bold text-white uppercase tracking-tighter">¡Hechizo Activado!</p>
              <p className="text-[10px] md:text-xs text-purple-100 italic">¡Busca el cofre sagrado!</p>
            </div>
          </div>
        )}
        
        {/* Mobile Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 md:p-8">
          <div className="flex justify-between items-end w-full pointer-events-auto">
            {/* Left side: Movement (D-pad style) */}
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              <div />
              <ControlButton 
                icon={<ChevronUp />} 
                onStart={() => setKey('w', true)} 
                onEnd={() => setKey('w', false)} 
              />
              <div />
              <ControlButton 
                icon={<ChevronLeft />} 
                onStart={() => setKey('a', true)} 
                onEnd={() => setKey('a', false)} 
              />
              <ControlButton 
                icon={<ChevronDown />} 
                onStart={() => setKey('s', true)} 
                onEnd={() => setKey('s', false)} 
              />
              <ControlButton 
                icon={<ChevronRight />} 
                onStart={() => setKey('d', true)} 
                onEnd={() => setKey('d', false)} 
              />
            </div>

            {/* Right side: Fly action */}
            <div className="flex flex-col items-center gap-4">
              <ControlButton 
                icon={<Wind className="w-6 h-6 md:w-8 md:h-8" />} 
                onStart={() => setKey(' ', true)} 
                onEnd={() => setKey(' ', false)}
                className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/40 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ 
  icon, 
  onStart, 
  onEnd, 
  className = "" 
}: { 
  icon: React.ReactNode, 
  onStart: () => void, 
  onEnd: () => void,
  className?: string
}) => (
  <button
    onMouseDown={onStart}
    onMouseUp={onEnd}
    onMouseLeave={onEnd}
    onTouchStart={(e) => { e.preventDefault(); onStart(); }}
    onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 active:bg-white/20 transition-all select-none touch-none ${className}`}
  >
    {icon}
  </button>
);
