/**
 * THE SOUND BRIDGE (PHASE 4: AUDIO DECOUPLING)
 * Listens to the GameBus and triggers sounds automatically.
 */

import { gameBus } from "../core/eventBus";
import { EVENTS, SOUNDS } from "../core/coreConfig";

class SoundBridge {
  constructor() {
    this.soundManager = null;
    this.unsubscribeFuncs = [];
  }

  /**
   * Initialize with a soundManager instance
   */
  init(soundManager) {
    if (this.soundManager) this.cleanup(); // Clean up if re-initializing
    this.soundManager = soundManager;

    console.log("[SoundBridge] 🔊 Audio System Linked to GameBus");

    // Map EVENTS to SOUNDS
    this.subscribe(EVENTS.PIECE_DROPPED, () => {
      this.soundManager.playSound("drop");
    });

    this.subscribe(EVENTS.GAME_WIN, () => {
      this.soundManager.playSound(SOUNDS.WIN);
    });

    this.subscribe(EVENTS.GAME_DRAW, () => {
      this.soundManager.playSound(SOUNDS.DRAW);
    });

    this.subscribe(EVENTS.COLUMN_BLOCKED, () => {
      this.soundManager.playSound("error");
    });

    this.subscribe(EVENTS.GRAVITY_FLIPPED, () => {
      this.soundManager.playSound(SOUNDS.MONKEY_LAUGH);
    });

    this.subscribe(EVENTS.FEATURE_TRIGGERED, (data) => {
      if (data.feature === "CHICKEN") this.soundManager.playSound(SOUNDS.CHICKEN_CLUCK);
      if (data.feature === "BOMB") this.soundManager.playSound(SOUNDS.BOMB_EXPLOSION);
    });
  }

  subscribe(event, callback) {
    const unsub = gameBus.on(event, callback);
    this.unsubscribeFuncs.push(unsub);
  }

  cleanup() {
    this.unsubscribeFuncs.forEach(unsub => unsub());
    this.unsubscribeFuncs = [];
    this.soundManager = null;
  }
}

export const soundBridge = new SoundBridge();
