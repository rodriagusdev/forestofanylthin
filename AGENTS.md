# Forest of An-Ylthin — Architecture & Combat Reference

Welcome to the **Forest of An-Ylthin** codebase. This document serves as the ground-truth technical guide for developers and AI pair programmers (Antigravity).

---

## 1. Project Overview & Stack

- **Framework**: React 18 (TypeScript) with Vite 6
- **Styling**: Tailwind CSS 3.4 (with custom `@font-family` Cinzel & Outfit, dark-fantasy glassmorphic tokens)
- **Audio Engine**: Howler.js (Singleton SoundEngine with adaptive spatial tracks)
- **State Architecture**: Zustand (`useCampaignStore` for persistent progress, `useBattleStore` for combat & ephemeral turns) + typed `BattleContext` bridge
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
   - Units take actions: physical attacks, tactical maneuvers (Defend, Wait), or memorized spells.
   - Victory cleanses the zone, grants unit reinforcements, and returns the player to the map.

---

## 3. Combat System & Damage Formulas

Combat mechanics and damage calculations are centralized as pure functions in `src/helpers/combat/damageCalculations.ts` with test coverage in `src/helpers/combat/__tests__/damageCalculations.test.ts`.

### 3.1 Physical Attacks

$$\text{Mitigation Ratio} = \max\left(0,\, 1 - \frac{\text{target.armor}}{10}\right)$$

$$\text{Raw Damage} = \lceil \text{attacker.updatedDamage} \rceil$$

$$\text{Actual Damage} = \begin{cases} 0 & \text{if attacker is Cursed} \\ \text{round}(\text{Raw Damage} \times \text{Mitigation Ratio}) & \text{otherwise} \end{cases}$$

- **Curse Consumption**: If the attacker is cursed, actual damage is 0 and the curse is consumed.
- **Armor Scaling**: Each point of armor provides physical damage mitigation (e.g., 5 armor = 50% mitigation, 10 armor = 100% mitigation).
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
| **Defend** | Combat | 0 MP | Self | +3 Armor | Fortifies unit, increasing physical mitigation until next turn |
| **Wait** | Combat | 0 MP | Self | Turn Delay | Moves unit action to the end of current initiative round |
| **Shatter Armor** | Dark Magic | 3 MP | Single | **Hero**: $1 + 1 \times \text{spellpower}$<br>**Non-Hero**: $1 + 0.7 \times \text{stack} + \frac{\text{level}}{2}$ | Permanently reduces target's `armor` by power |
| **Weakness** | Dark Magic | 2 MP | Single | **Hero**: $\max(0.1, 0.7 - 0.07 \times \text{spellpower})$<br>**Non-Hero**: $\max(0.1, 0.8 - 0.03 \times \text{stack} - 0.05 \times \text{level})$ | Applies `weaknessDamage` multiplier to target's attack output |
| **Curse** | Dark Magic | 4 MP | Single | N/A | Sets `target.cursed = true`, causing its next attack to deal 0 damage |
| **Breach Resistances** | Dark Magic | 3 MP | Single | Flat 4 | Reduces `target.magicResistance` by 4 (increases magic damage taken) |
| **Ice Spear** | Destruction | 7 MP | Single | **Hero**: $(95 + 8 \times \text{spellpower}) \times \left(1 - \frac{\text{target.magicResistance}}{10}\right)$<br>**Non-Hero**: $(40 + 5 \times \text{stack} + 5 \times \text{level}) \times \left(1 - \frac{\text{target.magicResistance}}{10}\right)$ | Single-target frost burst scaling with Spellpower. If resistance was breached (-4), amplifies by 1.4x |
| **Rain of Fire** | Destruction | 10 MP | AoE (All Enemies) | **Hero**: $30 + 5 \times \text{spellpower}$<br>**Non-Hero**: $10 + 3 \times \text{stack} + 3 \times \text{level}$ | Deals flat magic damage to **every** enemy division simultaneously |
| **Reanimate** | Necromancy | 6 MP | Friendly Unit | Full Stack & Health Restoration | Restores target allied stack to `maxHealth` and `maxStack` |
| **Vampiric Lust** | Necromancy | 6 MP | Friendly Unit | 60% Life Drain | Permanently grants `vampiricHeal = true` on physical hits for the encounter |

---

## 5. Future Mechanics & Extensibility Specifications

### 5.1 Morale & Momentum System (Turn Retention on Kill)
The combat architecture in [`useBattleStore.ts`](file:///c:/dev/Personal/forestofanylthin/src/store/useBattleStore.ts) is wired with morale tracking state (`MoraleState`):
- **Kill Trigger**: When a unit lands a fatal blow on an enemy division, `useBattleStore.getState().recordUnitKill(killerUnit, targetUnit)` is dispatched.
- **Turn Retention Hook**: Under Morale rule configurations, a unit that destroys a stack can retain its turn (`moraleRetainedTurn = true`), allowing a momentum action or triggering a **Morale Surge** banner.
- **Multi-Kill Streaks**: `consecutiveKills` counts kills within a single encounter round for escalating buffs or combat ratings.

### 5.2 Magic Schools Registry & Spell Expansion
The engine supports extensible magic schools (`MagicSchoolType`):
- **Implemented Schools**:
  1. `Combat` (Attack, Defend, Wait)
  2. `Dark Magic` (Curse, Weakness, Shatter Armor, Breach Resistances)
  3. `Destruction` (Ice Spear, Rain of Fire)
  4. `Necromancy` (Reanimate, Vampiric Lust)
- **Planned / Extensible Schools**:
  5. `Primal Magic` (Nature summons, barkskin buffs, thorn retaliations)
  6. `Light / Restoration Magic` (Divine ward, mass cleanse, holy burst)
  7. `Void Magic` (Mana drain, spacetime displacement, reality tear)
  8. `Blood Magic` (Sacrificial surge, life-for-mana conversion)

New spells are registered by defining their metadata (`Skill`), MP cost in `CommandDeck`, and damage/effect formula in `src/helpers/combat/damageCalculations.ts`.

---

## 6. Factions & Starting Battalion Units

### 6.1 The Dryeldar Covenant (Shadow & Fire)
- **Hero**: **Elisith** (145 HP, 56 DMG, 5 Armor, 18 Mana, 5 Spellpower, 9 Speed)
- **Starting Battalion**:
  - `1x Elisith` (Commander)
  - `13x Enslaved Roynis` (Tier 1: 8 HP, 7 DMG, 1 Armor)
  - `6x Twisted Jin` (Tier 4: 25 HP, 21 DMG, 2 Armor, 4 Mana)
  - `3x Dark Matron` (Tier 6: 50 HP, 29 DMG, 5 Armor, 6 Mana)

### 6.2 The Necropolis of Silorn (Death & Drain)
- **Hero**: **Nicolai of Silorn** (210 HP, 71 DMG, 6 Armor, 12 Mana, 4 Spellpower, 8 Speed)
- **Starting Battalion**:
  - `1x Nicolai of Silorn` (Commander)
  - `12x Skeleton` (Tier 1: 6 HP, 3 DMG, 0 Armor)
  - `4x Undead Warlock` (Tier 3: 16 HP, 12 DMG, 1 Armor, 4 Mana)
  - `2x Lich` (Tier 5: 33 HP, 27 DMG, 4 Armor, 8 Mana)

### 6.3 Equipment & Inventory System (Armory)
- **Equipment Slots**: 4 distinct slots per Commander:
  1. **Helm** (`helm`): Headgear granting Spellpower, Vitality, and Armor.
  2. **Armor** (`armor`): Heavy chestplates and ceremonial robes granting Armor, Magic Resistance, and HP.
  3. **Ring I** (`ring1`): Arcane rings granting Attack power, Spellpower, or Mana.
  4. **Ring II** (`ring2`): Secondary ring slot.
- **Backpack / Stash**: Dynamic inventory storing unequipped relics and domain spoils.
- **Live Stat Calculation**: `src/helpers/inventory/inventoryCalculations.ts` dynamically aggregates bonuses and applies them to the Commander division in `playerArmy` for combat.

---

## 7. Project Structure

```
forestofanylthin/
├── src/
│   ├── assets/              # Audio files (.mp3) and portraits/maps/stats images
│   ├── components/          # Visual UI components
│   │   ├── BattleUI/        # Combat arena, board, stacks, logs, and dialogs
│   │   ├── Dialogue/        # Story dialogue cutscene & choice modal
│   │   ├── HeroSelection/   # Fullscreen Elden Ring faction selection
│   │   ├── Map/             # Fullscreen Elden Ring expedition war map
│   │   ├── PlayerUI/        # HUD, army dock, and dialog boxes
│   │   ├── SkillPreview/    # Spell & skill tooltips
│   │   └── ZonePreview/     # Territory reconnaissance modal
│   ├── context/             # BattleContext (Typed bridge to combat state & sound triggers)
│   ├── data/
│   │   ├── enemyStacks.tsx  # Level encounters (Cemetery, Lost Glade, Gloomy Forest, Sacre)
│   │   ├── levels/          # Declarative Levels & Locations registry (LevelConfig, LocationConfig)
│   │   ├── playerInitialStack/ # Starting stacks for Dryeldar and Undead
│   │   ├── Skills/          # Combat, Dark Magic, Destruction, Necromancy skills
│   │   ├── unitstats/       # Base unit stats (Dryeldar, Undead, Dryexa)
│   │   └── zones/           # Backward-compatible zone exports
│   ├── features/            # Feature-specific hooks (BattleUI hooks, App hooks)
│   ├── helpers/
│   │   ├── campaign/        # Pure campaign progression & dynamic reward functions
│   │   └── combat/          # Pure damage formulas & Vitest test suites
│   ├── store/               # Zustand Stores (useCampaignStore for persistence, useBattleStore for combat)
│   ├── types.d.ts           # Core TypeScript definitions (UnitStats, Unit, Army, Skill)
│   ├── App.tsx              # Root game routing and modal orchestration
│   ├── index.css            # Tailwind directives, fonts, and dark-fantasy utilities
│   └── main.tsx             # React DOM root entrypoint
├── AGENTS.md                # This reference guide
├── vite.config.ts           # Vite bundler, path aliases, Vitest config
└── tsconfig.json            # TypeScript bundler compiler configuration
```

---

## 8. Developer & AI Guidelines

1. **Pure Calculations**: Keep mathematical formulas in `src/helpers/combat/` as pure, exported functions so they can be unit-tested without mounting React components.
2. **Path Aliases**: Always use `@/` for imports when referencing cross-module files (e.g. `@/helpers/combat/damageCalculations`).
3. **Audio Playback**: Use Howler / sound hooks instead of raw `new Audio()` calls in render loops or event triggers.
4. **State Management**: Ephemeral turn and combat data goes through `useBattleStore` / `BattleContext`, whereas progression and inventory persistence goes through `useCampaignStore`.
5. **Testing**: Run `npm test` after modifying any combat mechanics or status effect behaviors.

---

## 9. UI / UX Philosophy — Anti-"Ubisoft Bloat" Rules

The project strictly follows a **minimalist, atmospheric dark-fantasy aesthetic** (*Elden Ring* / *Darkest Dungeon* philosophy). Avoid what the user terms **"Ubisoft bloating"** — unnecessary UI clutter, over-explaining, and hand-holding elements.

### Rules to strictly avoid UI Bloat:
1. **No Over-Explaining Headers/Banners**: Avoid generic, redundant titles like `TACTICAL EXPEDITION MAP` or forced prefixes like `EXPEDITION THEATRE • Subtitle`. Keep titles direct and atmospheric (`A favor for the Dryexa`, `Forest of An-Ylthin`).
2. **No Redundant Progress Meters/Percentages**: Avoid forced progress bars, completion meters (`CLEANSED DOMAINS: 2 / 4 (50%)`), or checklist counters unless explicitly requested. Let the visual state of the world map and territory icons communicate progress.
3. **No Hand-Holding Legends & Helper Text**: Do not add legend footers explaining color dots (`Purified Territory`, `Active Front`) or obvious tutorial instructions (`"Click any landmark pin to view dossier & deploy army"`).
4. **Minimalist, Confident Interface**:
   - Let the map artwork, ambient lighting, and landmarks speak for themselves.
   - Keep interactive controls clean, subtle, and unobtrusive.
   - Avoid visual noise, decorative clutter, and gratuitous badges that restate obvious information.
