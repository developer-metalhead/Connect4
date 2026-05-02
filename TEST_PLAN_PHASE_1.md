# Phase 1: Game Core Test Plan

Use this checklist to verify the newly decoupled core engine.

## 1. Core Gameplay (2-Player Local)
- [ ] **Horizontal Win:** Connect 4 horizontally. Does the game stop?
- [ ] **Vertical Win:** Connect 4 vertically.
- [ ] **Diagonal Win:** Connect 4 diagonally (both \ and / directions).
- [ ] **Draw Condition:** Fill the entire board without a win. Does it show a Draw?
- [ ] **Reset:** Does the board clear completely and reset the turn to Red?
- [ ] **Illegal Moves:** Can you click a full column? (Should do nothing).

## 2. CPU Intelligence (VS CPU)
- [ ] **Expert Mode:** Play against the Expert. Does it block you effectively?
- [ ] **Novice "Blindness":** Play against Novice. Does it "ignore" your 3-in-a-row setups as configured?
- [ ] **CPU Thinking Visuals:** Do you see the yellow highlight and preview disc before the CPU drops?
- [ ] **CPU Drop Timing:** Is the delay between targeting and dropping (450ms) feeling right?

## 3. Edge Cases & Polish
- [ ] **Mid-Move Reset:** Reset the game while a CPU piece is "thinking" or "dropping." Does it clear cleanly without crashing?
- [ ] **Difficulty Swap:** Change difficulty mid-game. Does the board reset as expected?
- [ ] **Score Persistence:** Do the scores in the scoreboard remain correct after multiple resets?

---
*If all checks pass, we are ready for **Phase 2: The Pattern Registry**.*
