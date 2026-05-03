# Connect 4: Passion Project Master Roadmap (Phases 9-16)

This roadmap focuses on transforming the core engine into a feature-rich, sustainable, and highly engaging commercial-grade gaming product.

---

## 🎲 Phase 9: Multi-Board & Custom Game Modes (High Priority)
**Objective:** Expand gameplay variety by breaking the 7x6 grid constraint.

### 🛠️ Core Concepts
- **Dynamic Grid Engine:** Support for 8x8 (Large), 10x10 (Giant), and non-rectangular boards (e.g., Cross or Diamond shapes).
- **Game Mode Registry:**
  - **Blitz:** 10-second turn timer.
  - **Chaos:** All modular features enabled by default.
  - **Zen:** Classic rules, no features, relaxing music/visuals.
  - **Custom:** Let the player choose board size and win-length (Connect 3 to 6).

### ✅ Action Items
1. Generalize the `Board` component to render any grid configuration.
2. Update `checkWin` to handle variable lengths.
3. Create a "Mode Selector" in the main menu.

---

## 👤 Phase 10: Player Profiles & Progression (Engagement)
**Objective:** Give players a reason to come back and grow.

### 🛠️ Core Concepts
- **Profile System:** Local storage-based profiles with avatars, names, and total stats.
- **XP & Leveling:** Earn experience for every game played/won. Unlock "Titles" and "Badges".
- **Stat Dashboard:** Track "Longest Win Streak", "Most Used Feature", and "Total Removal Count".

### ✅ Action Items
1. Build a `ProfileProvider` to manage global player data.
2. Implement an "End-of-Match" XP gain animation.
3. Design a "Profile View" page.

---

## 🎨 Phase 11: Skin System (Cosmetics: Board & Coins)
**Objective:** Personalization and visual variety.

### 🛠️ Core Concepts
- **Board Skins:** Neon, Industrial, Wooden, Underwater.
- **Coin Skins:** Replace discs with Gems, Pizzas, Skulls, or Planets.
- **Impact Effects:** Custom animations for when a coin hits the bottom.

### ✅ Action Items
1. Extend the `ThemeManager` to support "Skin Packs".
2. Create a "Shop Preview" where players can test skins before buying/unlocking.
3. Implement `SVG/Image` support for discs instead of just Emojis.

---

## 🏆 Phase 12: Meta-Game & Challenges
**Objective:** Short-term goals to drive daily retention.

### 🛠️ Core Concepts
- **Daily Quests:** "Win 2 games with the Monkey", "Block 5 columns with the Chicken".
- **Trophy Room:** Rare achievements for legendary plays (e.g., "Win with an inverted board").

### ✅ Action Items
1. Create a `QuestManager` that tracks game events.
2. Implement a "Daily Quest" UI popup on the home screen.

---

## 💰 Phase 13: Store & Monetization (Sustainability)
**Objective:** Create a viable economic model for the project.

### 🛠️ Core Concepts
- **Virtual Currency:** "Connect Coins" earned via play or purchased.
- **Premium Pass:** One-time purchase to unlock all current and future characters/skins.
- **In-Game Store:** A beautifully designed hub for purchasing skins and feature packs.

### ✅ Action Items
1. Implement a secure `StoreLogic` (even for virtual currency).
2. Design a premium "Shop" UI with 3D-style card previews.

---

## 🌐 Phase 14: Social & Online Ranking
**Objective:** Competitive community building.

### 🛠️ Core Concepts
- **Elo Ranking:** Global leaderboards based on skill.
- **Friends List:** Invite friends directly to a private room.
- **Emote System:** Interactive "Trash Talk" emojis during matches.

### ✅ Action Items
1. Integrate a backend (Firebase/Supabase) for global leaderboards.
2. Implement a "Friends" UI panel.

---

## 📱 Phase 15: PWA & Mobile Optimization
**Objective:** Make the game feel like a native app.

### 🛠️ Core Concepts
- **PWA Support:** Installable on iOS/Android home screens.
- **Offline Mode:** Play vs CPU without an internet connection.
- **Haptic Feedback:** Vibrations on drops and wins.

---

## 🛡️ Priority Summary
1. **Phase 9 (Game Modes):** Foundational variety.
2. **Phase 10 (Profiles):** Core engagement.
3. **Phase 11 (Skins):** Visual depth.
4. **Phase 12 (Quests):** Daily retention.
5. **Phase 13 (Monetization):** Sustainability.
6. **Phase 14+:** Social and Platform polish.
