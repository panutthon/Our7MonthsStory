import { create } from "zustand";

export const LANE_WIDTH = 4;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
export const PLAYER_SPEED = 0.35;
export const OBSTACLE_SPEED = 0.6;
export const SPAWN_INTERVAL = 60; // frames between spawns
export const HEART_SPAWN_INTERVAL = 90;

export interface Obstacle {
  id: number;
  lane: number; // -1, 0, 1
  z: number;
  type: "box" | "barrier";
}

export interface Heart {
  id: number;
  lane: number;
  z: number;
  collected: boolean;
}

export type GameStatus = "menu" | "playing" | "gameover" | "reward";

export type RewardType = "netflix" | "question" | "money";

const ROMANTIC_MESSAGES = [
  "You collected my heart ❤️",
  "7 months with you 💕",
  "Thank you for being in my life 💗",
  "Every moment with you is special ✨",
  "You make my heart skip a beat 💓",
  "Forever and always 💞",
  "You are my everything 💖",
  "My heart belongs to you 💝",
];

interface GameState {
  status: GameStatus;
  score: number;
  distance: number;
  heartsCollected: number;
  playerLane: number; // -1, 0, 1
  isJumping: boolean;
  isSliding: boolean;
  jumpProgress: number;
  slideProgress: number;
  obstacles: Obstacle[];
  hearts: Heart[];
  frameCount: number;
  nextObstacleId: number;
  nextHeartId: number;
  speed: number;
  romanticMessage: string;
  showRomanticMessage: boolean;
  romanticMessageTimer: number;
  selectedReward: RewardType | null;
  rewardClaimed: boolean;

  // Actions
  startGame: () => void;
  gameOver: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
  tick: () => void;
  selectReward: (reward: RewardType) => void;
  claimReward: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: "menu",
  score: 0,
  distance: 0,
  heartsCollected: 0,
  playerLane: 0,
  isJumping: false,
  isSliding: false,
  jumpProgress: 0,
  slideProgress: 0,
  obstacles: [],
  hearts: [],
  frameCount: 0,
  nextObstacleId: 0,
  nextHeartId: 0,
  speed: OBSTACLE_SPEED,
  romanticMessage: "",
  showRomanticMessage: false,
  romanticMessageTimer: 0,
  selectedReward: null,
  rewardClaimed: false,

  startGame: () =>
    set({
      status: "playing",
      score: 0,
      distance: 0,
      heartsCollected: 0,
      playerLane: 0,
      isJumping: false,
      isSliding: false,
      jumpProgress: 0,
      slideProgress: 0,
      obstacles: [],
      hearts: [],
      frameCount: 0,
      nextObstacleId: 0,
      nextHeartId: 0,
      speed: OBSTACLE_SPEED,
      romanticMessage: "",
      showRomanticMessage: false,
      romanticMessageTimer: 0,
      selectedReward: null,
      rewardClaimed: false,
    }),

  gameOver: () => set({ status: "gameover" }),

  moveLeft: () => {
    const { playerLane, status } = get();
    if (status !== "playing") return;
    if (playerLane > -1) set({ playerLane: playerLane - 1 });
  },

  moveRight: () => {
    const { playerLane, status } = get();
    if (status !== "playing") return;
    if (playerLane < 1) set({ playerLane: playerLane + 1 });
  },

  jump: () => {
    const { isJumping, isSliding, status } = get();
    if (status !== "playing" || isJumping || isSliding) return;
    set({ isJumping: true, jumpProgress: 0 });
  },

  slide: () => {
    const { isJumping, isSliding, status } = get();
    if (status !== "playing" || isJumping || isSliding) return;
    set({ isSliding: true, slideProgress: 0 });
  },

  tick: () => {
    const state = get();
    if (state.status !== "playing") return;

    const frameCount = state.frameCount + 1;
    const distance = state.distance + state.speed;
    let score = Math.floor(distance / 10);
    let { heartsCollected } = state;

    // Gradually increase speed
    const speed = Math.min(OBSTACLE_SPEED + distance * 0.00003, 1.2);

    // Update jump
    let { isJumping, jumpProgress, isSliding, slideProgress } = state;
    if (isJumping) {
      jumpProgress += 0.04;
      if (jumpProgress >= 1) {
        isJumping = false;
        jumpProgress = 0;
      }
    }

    // Update slide
    if (isSliding) {
      slideProgress += 0.04;
      if (slideProgress >= 1) {
        isSliding = false;
        slideProgress = 0;
      }
    }

    // Spawn obstacles
    let obstacles = [...state.obstacles];
    let nextObstacleId = state.nextObstacleId;
    if (frameCount % SPAWN_INTERVAL === 0) {
      const lane = Math.floor(Math.random() * 3) - 1;
      const type = Math.random() > 0.5 ? "box" : "barrier";
      obstacles.push({
        id: nextObstacleId++,
        lane,
        z: -120,
        type,
      });
    }

    // Spawn hearts
    let hearts = [...state.hearts];
    let nextHeartId = state.nextHeartId;
    if (frameCount % HEART_SPAWN_INTERVAL === 0) {
      const lane = Math.floor(Math.random() * 3) - 1;
      hearts.push({
        id: nextHeartId++,
        lane,
        z: -120,
        collected: false,
      });
    }

    // Move obstacles & hearts
    obstacles = obstacles
      .map((o) => ({ ...o, z: o.z + speed }))
      .filter((o) => o.z < 15);
    hearts = hearts
      .map((h) => ({ ...h, z: h.z + speed }))
      .filter((h) => h.z < 15 && !h.collected);

    // Collision detection
    const playerX = state.playerLane * LANE_WIDTH;
    const playerZ = 0;
    const playerY = isJumping ? Math.sin(jumpProgress * Math.PI) * 3.5 : 0;
    const slidingNow = isSliding;

    for (const obs of obstacles) {
      const obsX = obs.lane * LANE_WIDTH;
      const dx = Math.abs(playerX - obsX);
      const dz = Math.abs(playerZ - obs.z);

      if (dx < 2 && dz < 2) {
        // If jumping over box, skip
        if (obs.type === "box" && playerY > 1.8) continue;
        // If sliding under barrier, skip
        if (obs.type === "barrier" && slidingNow) continue;

        set({ status: "gameover", score: score + heartsCollected * 10 });
        return;
      }
    }

    // Heart collection
    let romanticMessage = state.romanticMessage;
    let showRomanticMessage = state.showRomanticMessage;
    let romanticMessageTimer = state.romanticMessageTimer;

    for (const heart of hearts) {
      if (heart.collected) continue;
      const hx = heart.lane * LANE_WIDTH;
      const dx = Math.abs(playerX - hx);
      const dz = Math.abs(playerZ - heart.z);

      if (dx < 2.5 && dz < 2.5) {
        heart.collected = true;
        heartsCollected++;
        score += 10;

        // Show romantic message every 3 hearts
        if (heartsCollected % 3 === 0) {
          romanticMessage =
            ROMANTIC_MESSAGES[
              Math.floor(Math.random() * ROMANTIC_MESSAGES.length)
            ];
          showRomanticMessage = true;
          romanticMessageTimer = 120; // frames to show
        }
      }
    }

    // Update romantic message timer
    if (showRomanticMessage) {
      romanticMessageTimer--;
      if (romanticMessageTimer <= 0) {
        showRomanticMessage = false;
        romanticMessage = "";
      }
    }

    // Check for 100 hearts achievement
    if (heartsCollected >= 100 && !get().rewardClaimed) {
      set({ status: "reward" });
      return;
    }

    set({
      frameCount,
      distance,
      score: score + heartsCollected * 10,
      heartsCollected,
      isJumping,
      jumpProgress,
      isSliding,
      slideProgress,
      obstacles,
      hearts: hearts.filter((h) => !h.collected),
      nextObstacleId,
      nextHeartId,
      speed,
      romanticMessage,
      showRomanticMessage,
      romanticMessageTimer,
    });
  },

  selectReward: (reward: RewardType) => {
    set({ selectedReward: reward });
  },

  claimReward: () => {
    const { selectedReward } = get();
    if (selectedReward) {
      set({
        rewardClaimed: true,
        status: "gameover",
      });
    }
  },
}));
