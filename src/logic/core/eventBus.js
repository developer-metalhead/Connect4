/**
 * THE GAME BUS (PHASE 4: ARCHITECTURAL NERVOUS SYSTEM)
 * A lightweight Pub/Sub singleton that decouples logic, UI, and Audio.
 */

class GameBus {
  constructor() {
    this.listeners = {};
    this.history = []; // Useful for Phase 17: Replays
    this.isMuted = false;
  }

  /**
   * Subscribe to an event
   * @param {string} event - Name from EVENTS constant
   * @param {function} callback - Function to execute
   * @returns {function} - Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return cleanup function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== callback);
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event - Name from EVENTS constant
   * @param {any} data - Payload
   */
  emit(event, data = {}) {
    if (this.isMuted) return;

    const payload = {
      ...data,
      timestamp: Date.now(),
      eventId: Math.random().toString(36).substr(2, 9)
    };

    // Store in history for debugging and future replays
    this.history.push({ event, payload });
    if (this.history.length > 100) this.history.shift(); // Keep recent buffer

    // console.log(`[GameBus] 🔔 ${event}:`, payload);

    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[GameBus] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Clear all history and listeners
   */
  clear() {
    this.history = [];
    // We usually don't clear listeners unless resetting the whole app
  }

  getHistory() {
    return this.history;
  }
}

export const gameBus = new GameBus();
