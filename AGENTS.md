# Forest of An-Ylthin — Architecture & Combat Reference

Welcome to the **Forest of An-Ylthin** codebase. This document serves as the ground-truth technical guide for developers and AI pair programmers (Antigravity).

---

## 1. Project Overview & Stack

- **Framework**: React 18 (TypeScript) with Vite 6
- **Styling**: Tailwind CSS 3.4 (with custom `@font-family` Cinzel & Outfit, dark-fantasy glassmorphic tokens)
- **Audio Engine**: Howler.js & use-sound
- **Testing**: Vitest (`npm test`)
- **Module Resolution**: Bundler mode with `@/*` path alias mapped to `src/*`

---

## 2. Core Game Loop & State Flow

```
[ Hero / Faction Selection ]
          │
          ▼
[ Campaign Expedition Map ] ──(Scout Domain)──► [ Zone Preview Modal ]
          │ (Assault Domain)
          ▼
[ Active Turn-Based Battle ] ──(Cast / Attack / Reanimate)──► [ Combat Log & Animations ]
          │
     ┌────┴──────────────────────────┐
     ▼                               ▼
[ Win Condition ]             [ Loss Condition ]
(All 4 Zones Cleared)        (Player Stack Reaches 0)
```

1. **Faction Selection** (`src/components/HeroSelection`):
   - Player selects either **The Dryeldar Covenant** (led by *Elisith*) or **The Necropolis of Silorn** (led by *Nicolai of Silorn*).
   - Initializes starting battalion stack and sets `isPlaying = true`.
2. **Campaign Map** (`src/components/Map`):
   - Displays the 4 expedition domains: **Desolate Cemetery**, **The Lost Glade**, **The Gloomy Forest**, and **Sacrelthar Citadel**.
   - Player can scout enemy stacks or assault to initiate combat.
3. **Battlefield System** (`src/components/BattleUI` & `src/features/components/BattleUI`):
   - Turn queue determined by unit speed (`initiative`).
   - Units take actions: physical attacks or memorized spells (Dark Magic, Destruction, Necromancy).
   - Victory cleanses the zone, grants unit reinforcements (e.g. +50 Skeletons, +14 Dryexa Rangers), and returns the player to the map.

---

## 3. Combat System & Damage Formulas

Combat mechanics and damage calculations are centralized as pure functions in `src/helpers/combat/damageCalculations.ts` with test coverage in `src/helpers/combat/__tests__/damageCalculations.test.ts`.

### 3.1 Physical Attacks

$$\text{Mitigation Ratio} = \max\left(0,\, 1 - \frac{\text{target.armor}}{10}\right)$$

$$\text{Raw Damage} = \lceil \text{attacker.updatedDamage} \rceil$$

$$\text{Actual Damage} = \begin{cases} 0 & \text{if attacker is Cursed} \\ \text{round}(\text{Raw Damage} \times \text{Mitigation Ratio}) & \text{otherwise} \end{cases}$$

- **Curse Consumption**: If the attacker is cursed, actual damage is 0 and the curse is consumed.
- **Armor Scaling**: Each point of armor provides 10% physical damage mitigation (e.g., 5 armor = 50% mitigation, 10 armor = 100% mitigation).
- **Vampiric Drain**: If `attacker.vampiricHeal == true`, the attacker heals for:
  $$\text{Heal Amount} = \min(\text{maxHealth} - \text{currentHealth},\, \text{round}(\text{Actual Damage} \times 0.6))$$

### 3.2 Stack Depletion & Casualty Scaling

When a unit stack sustains damage, its troop count and damage output deplete proportionally:

$$\text{Stacks Lost} = \left\lfloor \frac{\text{Damage Sustained}}{\text{unit.health}} \right\rfloor$$

$$\text{New Damage} = \max\left(1,\, \text{unit.updatedDamage} - (\text{unit.damage} \times \text{Stacks Lost} \times \text{unit.weaknessDamage})\right)$$

$$\text{New Stack Count} = \max\left(0,\, \text{unit.stack} - \frac{\text{Damage Sustained}}{\text{unit.health}}\right)$$

---

## 4. Spells & Incantations Reference

| Spell | School | Cost | Target | Power / Damage Formula | Effect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Attack** | Combat | 0 MP | Single | Physical Attack formula above | Deals physical damage with armor mitigation |
| **Shatter Armor** | Dark Magic | 3 MP | Single | **Hero**: $1 + 1 \times \text{spellpower}$<br>**Non-Hero**: $1 + 0.7 \times \text{stack} + \frac{\text{level}}{2}$ | Permanently reduces target's `armor` by power |
| **Weakness** | Dark Magic | 2 MP | Single | **Hero**: $\max(0.1, 0.7 - 0.07 \times \text{spellpower})$<br>**Non-Hero**: $\max(0.1, 0.8 - 0.03 \times \text{stack} - 0.05 \times \text{level})$ | Applies `weaknessDamage` multiplier to target's attack output |
| **Curse** | Dark Magic | 4 MP | Single | N/A | Sets `target.cursed = true`, causing its next attack to deal 0 damage |
| **Breach Resistances** | Dark Magic | 3 MP | Single | Flat 4 | Reduces `target.magicResistance` by 4 (increases magic damage taken) |
| **Ice Spear** | Destruction | 7 MP | Single | $95 \times \left(1 - \frac{\text{target.magicResistance}}{10}\right)$ | Single-target frost burst. If resistance was breached (-4), deals $95 \times 1.4 = 133$ DMG |
| **Rain of Fire** | Destruction | 10 MP | AoE (All Enemies) | **Hero**: $30 + 5 \times \text{spellpower}$<br>**Non-Hero**: $10 + 3 \times \text{stack} + 3 \times \text{level}$ | Deals flat magic damage to **every** enemy division simultaneously |
| **Reanimate** | Necromancy | 6 MP | Friendly Unit | Full Stack & Health Restoration | Restores target allied stack to `maxHealth` and `maxStack` |
| **Vampiric Lust** | Necromancy | 6 MP | Friendly Unit | 60% Life Drain | Permanently grants `vampiricHeal = true` on physical hits for the encounter |

---

## 5. Factions & Starting Battalion Units

### 5.1 The Dryeldar Covenant (Shadow & Fire)
- **Hero**: **Elisith** (145 HP, 56 DMG, 5 Armor, 18 Mana, 5 Spellpower, 9 Speed)
- **Starting Battalion**:
  - `1x Elisith` (Commander)
  - `13x Enslaved Roynis` (Tier 1: 8 HP, 7 DMG, 1 Armor)
  - `6x Twisted Jin` (Tier 4: 25 HP, 21 DMG, 2 Armor, 4 Mana)
  - `3x Dark Matron` (Tier 6: 50 HP, 29 DMG, 5 Armor, 6 Mana)

### 5.2 The Necropolis of Silorn (Death & Drain)
- **Hero**: **Nicolai of Silorn** (210 HP, 71 DMG, 6 Armor, 12 Mana, 4 Spellpower, 8 Speed)
- **Starting Battalion**:
  - `1x Nicolai of Silorn` (Commander)
  - `12x Skeleton` (Tier 1: 6 HP, 3 DMG, 0 Armor)
  - `4x Undead Warlock` (Tier 3: 16 HP, 12 DMG, 1 Armor, 4 Mana)
  - `2x Lich` (Tier 5: 33 HP, 27 DMG, 4 Armor, 8 Mana)

---

## 6. Project Structure

```
forestofanylthin/
├── src/
│   ├── assets/              # Audio files (.mp3) and portraits/maps/stats images
│   ├── components/          # Visual UI components
│   │   ├── BattleUI/        # Combat arena and board
│   │   ├── HeroSelection/   # Fullscreen Elden Ring faction selection
│   │   ├── Map/             # Fullscreen Elden Ring expedition war map
│   │   ├── PlayerUI/        # HUD, army dock, and dialog boxes
│   │   ├── SkillPreview/    # Spell & skill tooltips
│   │   └── ZonePreview/     # Territory reconnaissance modal
│   ├── context/             # BattleContext (React state container)
│   ├── data/
│   │   ├── enemyStacks.tsx  # Level encounters (Cemetery, Lost Glade, Gloomy Forest, Sacre)
│   │   ├── playerInitialStack/ # Starting stacks for Dryeldar and Undead
│   │   ├── Skills/          # Combat, Dark Magic, Destruction, Necromancy skills
│   │   ├── unitstats/       # Base unit stats (Dryeldar, Undead, Dryexa)
│   │   └── zones/           # Centralized zone registry (ZONES config)
│   ├── features/            # Feature-specific hooks and action handlers
│   ├── helpers/
│   │   └── combat/          # Pure damage formulas & Vitest test suites
│   ├── types.d.ts           # Core TypeScript definitions (UnitStats, Unit, Army, Skill)
│   ├── App.tsx              # Root game routing and modal orchestration
│   ├── index.css            # Tailwind directives, fonts, and dark-fantasy utilities
│   └── main.tsx             # React DOM root entrypoint
├── AGENTS.md                # This reference guide
├── vite.config.ts           # Vite bundler, path aliases, Vitest config
└── tsconfig.json            # TypeScript bundler compiler configuration
```

---

## 7. Developer & AI Guidelines

1. **Pure Calculations**: Keep mathematical formulas in `src/helpers/combat/` as pure, exported functions so they can be unit-tested without mounting React components.
2. **Path Aliases**: Always use `@/` for imports when referencing cross-module files (e.g. `@/helpers/combat/damageCalculations`).
3. **Audio Playback**: Use Howler / sound hooks instead of raw `new Audio()` calls in render loops or event triggers.
4. **Testing**: Run `npm test` after modifying any combat mechanics or status effect behaviors.
