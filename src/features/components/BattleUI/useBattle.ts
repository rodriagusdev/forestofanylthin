import { useContext, useRef } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { Skill, Army, Unit } from '../../../types';
import { useSpells, CombatActionResult } from './useSpells';
import {
  breachResistances,
  curse,
  shatterArmor,
  weakness,
} from '../../../data/Skills/DarkMagic';
import { attack } from '../../../data/Skills/Combat';
import { iceSpear, rainOfFire } from '../../../data/Skills/Destruction';
import { reanimate, vampiricLust } from '../../../data/Skills/Necromancy';
import { useActionSound } from '../../../hooks/useActionSound';
import { waitTimer } from '../../../helpers/functions';
import { useBattleStore } from '../../../store/useBattleStore';

export const useBattle = () => {
  const {
    setTurn,
    action,
    setAction,
    unitsInBoard,
    unitPosition,
    setUnitPosition,
    setActionImage,
    setBattleMessageText,
    setPlayingUnit,
    setTargetUnit,
    setUnitsInBoard,
    enemyArmy,
    setEnemyArmy,
    playerArmy,
    setPlayerArmy,
    setDeadUnit,
    setIsDamaging,
    setMagicUsedInTurn,
    addCombatLog,
    fallenAllies,
    setFallenAllies,
    triggerFloatingText,
    setActiveScreenShake,
    setActiveScreenFlash,
  } = useContext(BattleContext);

  const { spellSounds } = useActionSound();

  const {
    attackUnit,
    castShatterArmor,
    castWeakness,
    castCurse,
    castBreachResistances,
    castRainOfFire,
    castIceSpear,
    castReanimate,
    castVampiricLust,
  } = useSpells();

  const isExecutingRef = useRef<boolean>(false);

  const selectUnit = async (selectedUnit: Unit) => {
    if (isExecutingRef.current) return;
    if (!unitsInBoard || unitsInBoard.length === 0) return;
    const playingUnit = unitsInBoard[unitPosition] || unitsInBoard[0];

    if (playingUnit.belongsTo === 'player') {
      if (action === 'Destruction: Rain of Fire') {
        await executeAoEAction();
      } else {
        await executeAction(action, selectedUnit);
      }
    } else {
      // Enemy AI decision logic
      const availableSkills = playingUnit.skills || [];

      if (availableSkills.length > 1) {
        const attackSkills = availableSkills.filter(
          (s) => s.formattedName !== 'Clear Action' && s.type !== 'Necromancy'
        );

        if (attackSkills.length > 0) {
          const chosenSkill =
            attackSkills[Math.floor(Math.random() * attackSkills.length)];

          if (chosenSkill.name === 'Dark Magic: Curse') {
            if (playingUnit.magic >= 4) {
              setMagicUsedInTurn(4);
              await executeAction(chosenSkill.name, selectedUnit);
              return;
            }
          } else if (chosenSkill.name === 'Dark Magic: Weakness') {
            if (playingUnit.magic >= 2) {
              setMagicUsedInTurn(2);
              await executeAction(chosenSkill.name, selectedUnit);
              return;
            }
          }
        }
      }

      // Default fallback: regular attack
      await executeAction('Combat: Attack', selectedUnit);
    }
  };

  const executeAction = async (actionName: string, selectedUnit: Unit) => {
    switch (actionName) {
      case 'Combat: Attack':
        await handleSingleTargetAction('attack', attack, selectedUnit, attackUnit, undefined);
        break;
      case 'Dark Magic: Weakness':
        await handleSingleTargetAction(
          'weakness',
          weakness,
          selectedUnit,
          castWeakness,
          spellSounds.weakness
        );
        break;
      case 'Dark Magic: Shatter Armor':
        await handleSingleTargetAction(
          'shatter armor',
          shatterArmor,
          selectedUnit,
          castShatterArmor,
          spellSounds.shatterArmor
        );
        break;
      case 'Dark Magic: Curse':
        await handleSingleTargetAction('curse', curse, selectedUnit, castCurse, spellSounds.curse);
        break;
      case 'Dark Magic: Breach Resistances':
        await handleSingleTargetAction(
          'breach resistances',
          breachResistances,
          selectedUnit,
          castBreachResistances,
          spellSounds.breachResistances
        );
        break;
      case 'Necromancy: Reanimate':
        await handleSingleTargetAction(
          'reanimate',
          reanimate,
          selectedUnit,
          castReanimate,
          spellSounds.reanimate
        );
        break;
      case 'Necromancy: Vampiric Lust':
        await handleSingleTargetAction(
          'vampiric lust',
          vampiricLust,
          selectedUnit,
          castVampiricLust,
          spellSounds.vampiricLust
        );
        break;
      case 'Destruction: Rain of Fire':
        await executeAoEAction();
        break;
      case 'Destruction: Ice Spear':
        await handleSingleTargetAction(
          'ice spear',
          iceSpear,
          selectedUnit,
          castIceSpear,
          spellSounds.iceSpear
        );
        break;
      default:
        await handleSingleTargetAction('attack', attack, selectedUnit, attackUnit, undefined);
        break;
    }
  };

  const executeAoEAction = async () => {
    if (isExecutingRef.current) return;
    if (!unitsInBoard || unitsInBoard.length === 0) return;
    const playingUnit = unitsInBoard[unitPosition] || unitsInBoard[0];

    if (playingUnit.magic < 10) return;

    isExecutingRef.current = true;
    try {
      setMagicUsedInTurn(10);
      if (spellSounds.rainOfFire) spellSounds.rainOfFire();

      const dummyTarget: Unit = enemyArmy[0] || {
        id: 'dummy_target',
        name: 'Enemy Division',
        type: 'Creature',
        face: playingUnit.face,
        portrait: playingUnit.face,
        belongsTo: 'enemy',
        updatedHealth: 100,
        maxHealth: 100,
        health: 10,
        damage: 10,
        updatedDamage: 10,
        armor: 0,
        initialArmor: 0,
        magicResistance: 0,
        magic: 0,
        maxMagic: 0,
        initiative: '1',
        stack: 10,
        maxStack: 10,
        skills: [],
        weaknessDamage: 1,
        cursed: false,
        soundAttack: () => {},
        soundHitted: () => {},
        soundDeath: () => {},
      };

      setPlayingUnit(playingUnit);
      setTargetUnit(dummyTarget);
      setActionImage(rainOfFire);
      setBattleMessageText(`${playingUnit.name} unleashed a catastrophic Rain of Fire upon the entire enemy host!`);
      setIsDamaging(true);

      const result = castRainOfFire(playingUnit, enemyArmy);

      // Apocalyptic screen bounce, firestorm flash, and cascading meteors for Rain of Fire
      setActiveScreenShake('apocalyptic');
      setActiveScreenFlash('fire');
      setTimeout(() => setActiveScreenShake(false), 1100);
      setTimeout(() => setActiveScreenFlash(null), 1200);

      // Trigger floating damage text for each affected enemy
      (result.updatedEnemyArmy || []).forEach((e) => {
        triggerFloatingText({
          unitId: e.id,
          text: `🔥 -${Math.round(result.damageDealt)} DMG`,
          type: 'damage',
        });
      });

      // Clear pacing timer at 1300ms for comfortable tactical readability
      await waitTimer(1300);

      setIsDamaging(false);
      setMagicUsedInTurn(0);

      // Log combat action
      addCombatLog({
        turnNumber: unitPosition + 1,
        actor: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        actionName: 'Rain of Fire',
        actionType: 'spell',
        description: `${playingUnit.name} rained apocalyptic fire upon all enemy ranks for ${result.damageDealt} DMG each!`,
        damageDealt: result.damageDealt,
      });

      // Handle casualties from AoE
      if (result.deadUnits.length > 0) {
        for (const dead of result.deadUnits) {
          useBattleStore.getState().recordUnitKill(playingUnit, dead);
          if (typeof dead.soundDeath === 'function') dead.soundDeath();
          setDeadUnit(dead);
          addCombatLog({
            turnNumber: unitPosition + 1,
            actor: {
              name: playingUnit.name,
              face: playingUnit.face,
              belongsTo: playingUnit.belongsTo,
            },
            target: {
              name: dead.name,
              face: dead.face,
              belongsTo: dead.belongsTo,
            },
            actionName: 'Rain of Fire',
            actionType: 'death',
            description: `${dead.name} was incinerated by the rain of fire!`,
            isFatal: true,
          });
          await waitTimer(1800);
          setDeadUnit(null);
        }
      }

      // Synchronize surviving enemy army
      const deadIds = new Set(result.deadUnits.map((d) => d.id));
      const survivingEnemies = (result.updatedEnemyArmy || []).filter((u) => !deadIds.has(u.id) && u.updatedHealth > 0);
      setEnemyArmy(survivingEnemies);

      // Synchronize player army with caster mana update
      setPlayerArmy((prev) =>
        prev.map((u) => (u.id === result.updatedCaster.id ? result.updatedCaster : u))
      );

      // Synchronize turn board
      const cleanBoard = unitsInBoard
        .filter((u) => !deadIds.has(u.id))
        .map((u) => {
          if (u.id === result.updatedCaster.id) return result.updatedCaster;
          const updatedEnemy = (result.updatedEnemyArmy || []).find((e) => e.id === u.id);
          if (updatedEnemy) return updatedEnemy;
          return u;
        })
        .filter((u) => u.updatedHealth > 0);

      setUnitsInBoard(cleanBoard);
      checkNextTurn(result.updatedCaster, cleanBoard);
    } finally {
      setAction('Combat: Clear Action');
      isExecutingRef.current = false;
    }
  };

  const getMessageText = (actionType: string, playingUnit: Unit, targetUnit: Unit): string => {
    switch (actionType) {
      case 'attack':
        return playingUnit.cursed
          ? `${playingUnit.name} attacks ${targetUnit.name} but is Cursed!`
          : `${playingUnit.name} attacks ${targetUnit.name}`;
      case 'weakness':
        return `${playingUnit.name} casts Weakness on ${targetUnit.name}`;
      case 'shatter armor':
        return `${playingUnit.name} casts Shatter Armor on ${targetUnit.name}`;
      case 'curse':
        return `${playingUnit.name} casts Curse on ${targetUnit.name}`;
      case 'breach resistances':
        return `${playingUnit.name} casts Breach Resistances on ${targetUnit.name}`;
      case 'reanimate':
        return `${playingUnit.name} casts Reanimate on ${targetUnit.name}`;
      case 'vampiric lust':
        return `${playingUnit.name} casts Vampiric Lust on ${targetUnit.name}`;
      case 'ice spear':
        return `${playingUnit.name} hurls an Ice Spear at ${targetUnit.name}`;
      default:
        return `${playingUnit.name} acts upon ${targetUnit.name}`;
    }
  };

  const handleSingleTargetAction = async (
    actionType: string,
    skillDescription: Skill,
    targetUnit: Unit,
    fn: (attackingUnit: Unit, attackedUnit: Unit) => CombatActionResult,
    actionSound?: () => void
  ) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    try {
      const playingUnit = unitsInBoard[unitPosition] || unitsInBoard[0];
      const message = getMessageText(actionType, playingUnit, targetUnit);

      if (actionType === 'attack') {
        if (typeof playingUnit.soundAttack === 'function') playingUnit.soundAttack();
        if (typeof targetUnit.soundHitted === 'function') targetUnit.soundHitted();
      }

      if (actionSound) actionSound();

      setPlayingUnit(playingUnit);
      setTargetUnit(targetUnit);
      setActionImage(skillDescription);
      setBattleMessageText(message);

      const abilityCausesDamage =
        actionType === 'attack' || actionType === 'ice spear';
      setIsDamaging(abilityCausesDamage);

      const result = fn(playingUnit, targetUnit);

      // Screen Shake & Flash on impact
      const isDarkMagic =
        actionType === 'curse' ||
        actionType === 'weakness' ||
        actionType === 'shatter armor' ||
        actionType === 'breach resistances';

      if (abilityCausesDamage && !playingUnit.cursed) {
        const isHeavyHit = actionType === 'ice spear' || result.damageDealt > 60 || result.isTargetDead;
        setActiveScreenShake(isHeavyHit ? 'heavy' : 'light');
        setActiveScreenFlash(actionType === 'ice spear' ? 'ice' : 'ruby');
        setTimeout(() => setActiveScreenShake(false), isHeavyHit ? 650 : 450);
        setTimeout(() => setActiveScreenFlash(null), 500);
      } else if (isDarkMagic) {
        setActiveScreenFlash('dark-magic');
        setActiveScreenShake('light');
        setTimeout(() => setActiveScreenFlash(null), 850);
        setTimeout(() => setActiveScreenShake(false), 450);
      } else if (actionType === 'reanimate') {
        setActiveScreenFlash('emerald');
        setTimeout(() => setActiveScreenFlash(null), 500);
      }

      // Trigger floating combat feedback texts
      if (actionType === 'attack') {
        if (playingUnit.cursed) {
          triggerFloatingText({
            unitId: targetUnit.id,
            text: '🛡️ CURSE ABSORBED (0 DMG)',
            type: 'curse',
          });
        } else {
          triggerFloatingText({
            unitId: targetUnit.id,
            text: `-${Math.round(result.damageDealt)} DMG`,
            type: 'damage',
            subtext: result.stacksLost > 0 ? `-${result.stacksLost} Troops` : undefined,
          });
          if (result.vampiricHealAmount && result.vampiricHealAmount > 0) {
            triggerFloatingText({
              unitId: playingUnit.id,
              text: `🩸 +${Math.round(result.vampiricHealAmount)} HP (DRAIN)`,
              type: 'heal',
            });
          }
        }
      } else if (actionType === 'ice spear') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: `❄ -${Math.round(result.damageDealt)} DMG`,
          type: 'damage',
          subtext: result.stacksLost > 0 ? `-${result.stacksLost} Troops` : undefined,
        });
      } else if (actionType === 'reanimate') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '✨ REANIMATED!',
          type: 'heal',
          subtext: 'Full Health & Stack',
        });
      } else if (actionType === 'vampiric lust') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '🩸 VAMPIRIC LUST',
          type: 'buff',
          subtext: '60% Life Drain on Hit',
        });
      } else if (actionType === 'curse') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '☠ CURSED!',
          type: 'curse',
          subtext: 'Next strike deals 0 DMG',
        });
      } else if (actionType === 'shatter armor') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '🛡️ SHATTER ARMOR',
          type: 'debuff',
          subtext: 'Armor Reduced',
        });
      } else if (actionType === 'weakness') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '🌀 WEAKENED',
          type: 'debuff',
          subtext: 'Attack Output Reduced',
        });
      } else if (actionType === 'breach resistances') {
        triggerFloatingText({
          unitId: targetUnit.id,
          text: '⚡ RESISTANCE BREACHED (-4)',
          type: 'debuff',
          subtext: '+40% Magic DMG Taken',
        });
      }

      // Retaliation Floating Feedback
      if (result.retaliation?.occurred) {
        if (result.retaliation.isCursed) {
          triggerFloatingText({
            unitId: playingUnit.id,
            text: '🛡️ COUNTER ABSORBED (CURSED)',
            type: 'curse',
          });
        } else {
          triggerFloatingText({
            unitId: playingUnit.id,
            text: `⚔ COUNTER: -${Math.round(result.retaliation.damage)} DMG`,
            type: 'counter',
            subtext: result.retaliation.stacksLost > 0 ? `-${result.retaliation.stacksLost} Troops` : undefined,
          });
        }
      }

      // Clear pacing timer at 1300ms for tactical readability
      await waitTimer(1300);

      setIsDamaging(false);
      setMagicUsedInTurn(0);

      let actionKind: 'attack' | 'spell' | 'status' | 'death' | 'heal' = 'spell';
      if (actionType === 'attack') actionKind = 'attack';
      else if (actionType === 'reanimate') actionKind = 'heal';
      else if (
        actionType === 'curse' ||
        actionType === 'weakness' ||
        actionType === 'shatter armor' ||
        actionType === 'breach resistances' ||
        actionType === 'vampiric lust'
      )
        actionKind = 'status';

      let description = `${playingUnit.name} used ${skillDescription.formattedName} on ${targetUnit.name}.`;
      if (actionType === 'attack') {
        if (playingUnit.cursed) {
          description = `${playingUnit.name} struck ${targetUnit.name}, but the attack was absorbed by Curse (0 DMG)!`;
        } else {
          description = `${playingUnit.name} struck ${targetUnit.name} for ${result.damageDealt} DMG${
            result.stacksLost > 0 ? ` (${result.stacksLost} troops fell)` : ''
          }!`;
        }
      } else if (actionType === 'ice spear') {
        description = `${playingUnit.name} impaled ${targetUnit.name} with an Ice Spear for ${result.damageDealt} DMG!`;
      } else if (actionType === 'reanimate') {
        description = `${playingUnit.name} channelled dark necromancy, restoring ${targetUnit.name} to full glory!`;
      } else if (actionType === 'vampiric lust') {
        description = `${playingUnit.name} bestowed Vampiric Lust upon ${targetUnit.name}, enabling 60% life drain on hit!`;
      } else if (actionType === 'curse') {
        description = `${playingUnit.name} cursed ${targetUnit.name}! Their next strike will deal 0 damage.`;
      } else if (actionType === 'shatter armor') {
        description = `${playingUnit.name} shattered ${targetUnit.name}'s armor!`;
      } else if (actionType === 'weakness') {
        description = `${playingUnit.name} enfeebled ${targetUnit.name}, reducing their offensive power!`;
      } else if (actionType === 'breach resistances') {
        description = `${playingUnit.name} breached ${targetUnit.name}'s magic resistance (-4)!`;
      }

      addCombatLog({
        turnNumber: unitPosition + 1,
        actor: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        target: {
          name: targetUnit.name,
          face: targetUnit.face,
          belongsTo: targetUnit.belongsTo,
        },
        actionName: skillDescription.formattedName,
        actionType: result.isTargetDead ? 'death' : actionKind,
        description,
        damageDealt: result.damageDealt > 0 ? result.damageDealt : undefined,
        stacksLost: result.stacksLost > 0 ? result.stacksLost : undefined,
        isFatal: result.isTargetDead,
      });

      // Retaliation combat log entry
      if (result.retaliation?.occurred) {
        addCombatLog({
          turnNumber: unitPosition + 1,
          actor: {
            name: targetUnit.name,
            face: targetUnit.face,
            belongsTo: targetUnit.belongsTo,
          },
          target: {
            name: playingUnit.name,
            face: playingUnit.face,
            belongsTo: playingUnit.belongsTo,
          },
          actionName: 'Retaliation Strike',
          actionType: result.retaliation.isAttackerDead ? 'death' : 'attack',
          description: result.retaliation.isCursed
            ? `${targetUnit.name} attempted a retaliation strike, but was Cursed (0 DMG)!`
            : `${targetUnit.name} struck back at ${playingUnit.name} in retaliation for ${result.retaliation.damage} DMG${
                result.retaliation.stacksLost > 0 ? ` (${result.retaliation.stacksLost} troops fell)` : ''
              }!`,
          damageDealt: result.retaliation.damage > 0 ? result.retaliation.damage : undefined,
          stacksLost: result.retaliation.stacksLost > 0 ? result.retaliation.stacksLost : undefined,
          isFatal: result.retaliation.isAttackerDead,
        });
      }

      // Handle target death memorial & record kill for Morale system
      if (result.isTargetDead && result.updatedTarget) {
        useBattleStore.getState().recordUnitKill(playingUnit, result.updatedTarget);
        if (typeof result.updatedTarget.soundDeath === 'function') {
          result.updatedTarget.soundDeath();
        }
        addCombatLog({
          turnNumber: unitPosition + 1,
          actor: {
            name: playingUnit.name,
            face: playingUnit.face,
            belongsTo: playingUnit.belongsTo,
          },
          target: {
            name: result.updatedTarget.name,
            face: result.updatedTarget.face,
            belongsTo: result.updatedTarget.belongsTo,
          },
          actionName: 'Fatal Casualty',
          actionType: 'death',
          description: `☠ ${result.updatedTarget.name} was slain in battle!`,
          isFatal: true,
        });
        setDeadUnit(result.updatedTarget);
        await waitTimer(2000);
        setDeadUnit(null);
      }

      // Handle retaliation fatal strike on attacker
      if (result.isAttackerDead) {
        useBattleStore.getState().recordUnitKill(targetUnit, result.updatedCaster);
        if (typeof result.updatedCaster.soundDeath === 'function') {
          result.updatedCaster.soundDeath();
        }
        addCombatLog({
          turnNumber: unitPosition + 1,
          actor: {
            name: targetUnit.name,
            face: targetUnit.face,
            belongsTo: targetUnit.belongsTo,
          },
          target: {
            name: result.updatedCaster.name,
            face: result.updatedCaster.face,
            belongsTo: result.updatedCaster.belongsTo,
          },
          actionName: 'Fatal Counter',
          actionType: 'death',
          description: `☠ ${result.updatedCaster.name} was slain by the retaliation counter-strike!`,
          isFatal: true,
        });
        setDeadUnit(result.updatedCaster);
        await waitTimer(2000);
        setDeadUnit(null);
      }

      const deadIds = new Set(result.deadUnits.map((d) => d.id));

      // Track any newly fallen allied units into Crypt
      const newDeadAllies = result.deadUnits.filter((u) => u.belongsTo === 'player');
      if (newDeadAllies.length > 0) {
        setFallenAllies((prev) => {
          const map = new Map(prev.map((u) => [u.id, u]));
          newDeadAllies.forEach((u) => map.set(u.id, u));
          return Array.from(map.values());
        });
      }

      // If an allied unit was reanimated, remove from Crypt
      if (
        actionType === 'reanimate' &&
        result.updatedTarget?.belongsTo === 'player'
      ) {
        setFallenAllies((prev) =>
          prev.filter((u) => u.id !== result.updatedTarget!.id)
        );
      }

      // Synchronize player army
      setPlayerArmy((prev) => {
        const updated = prev
          .filter((u) => !deadIds.has(u.id))
          .map((u) => {
            if (
              result.updatedTarget &&
              u.id === result.updatedTarget.id &&
              u.id === result.updatedCaster.id
            ) {
              return { ...result.updatedTarget, ...result.updatedCaster };
            }
            if (u.id === result.updatedCaster.id) return result.updatedCaster;
            if (result.updatedTarget && u.id === result.updatedTarget.id)
              return result.updatedTarget;
            return u;
          })
          .filter((u) => u.updatedHealth > 0);

        // If target was revived from the crypt and not currently in living player army, re-admit them!
        if (
          result.updatedTarget &&
          result.updatedTarget.belongsTo === 'player' &&
          result.updatedTarget.updatedHealth > 0 &&
          !updated.some((u) => u.id === result.updatedTarget!.id)
        ) {
          updated.push(result.updatedTarget);
        }
        return updated;
      });

      // Synchronize enemy army
      setEnemyArmy((prev) =>
        prev
          .filter((u) => !deadIds.has(u.id))
          .map((u) => {
            if (
              result.updatedTarget &&
              u.id === result.updatedTarget.id &&
              u.id === result.updatedCaster.id
            ) {
              return { ...result.updatedTarget, ...result.updatedCaster };
            }
            if (u.id === result.updatedCaster.id) return result.updatedCaster;
            if (result.updatedTarget && u.id === result.updatedTarget.id)
              return result.updatedTarget;
            return u;
          })
          .filter((u) => u.updatedHealth > 0)
      );

      // Synchronize turn board
      const cleanBoard = unitsInBoard
        .filter((u) => !deadIds.has(u.id))
        .map((u) => {
          if (
            result.updatedTarget &&
            u.id === result.updatedTarget.id &&
            u.id === result.updatedCaster.id
          ) {
            return { ...result.updatedTarget, ...result.updatedCaster };
          }
          if (u.id === result.updatedCaster.id) return result.updatedCaster;
          if (result.updatedTarget && u.id === result.updatedTarget.id)
            return result.updatedTarget;
          return u;
        })
        .filter((u) => u.updatedHealth > 0);

      // If target was revived from the crypt and not on board, insert into turn board
      if (
        result.updatedTarget &&
        result.updatedTarget.belongsTo === 'player' &&
        result.updatedTarget.updatedHealth > 0 &&
        !cleanBoard.some((u) => u.id === result.updatedTarget!.id)
      ) {
        cleanBoard.push(result.updatedTarget);
      }

      setUnitsInBoard(cleanBoard);
      checkNextTurn(result.updatedCaster, cleanBoard);
    } finally {
      setAction('Combat: Clear Action');
      isExecutingRef.current = false;
    }
  };

  const executeDefend = async () => {
    if (isExecutingRef.current) return;
    if (!unitsInBoard || unitsInBoard.length === 0) return;
    const playingUnit = unitsInBoard[unitPosition] || unitsInBoard[0];

    isExecutingRef.current = true;
    try {
      const updatedUnit: Unit = {
        ...playingUnit,
        defending: true,
        armor: playingUnit.armor + 3,
      };

      const updateList = (list: Unit[]) =>
        list.map((u) => (u.id === playingUnit.id ? updatedUnit : u));

      if (playingUnit.belongsTo === 'player') {
        setPlayerArmy(updateList);
      } else {
        setEnemyArmy(updateList);
      }

      const updatedBoard = updateList(unitsInBoard);
      setUnitsInBoard(updatedBoard);

      triggerFloatingText({
        unitId: playingUnit.id,
        text: '🛡️ DEFEND: +3 ARMOR',
        type: 'buff',
        subtext: '+30% Physical Mitigation',
      });

      addCombatLog({
        turnNumber: unitPosition + 1,
        actor: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        target: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        actionName: 'Defensive Stance',
        actionType: 'status',
        description: `${playingUnit.name} assumed a fortified Defensive Stance (+3 Armor, +30% Physical Mitigation).`,
      });

      checkNextTurn(updatedUnit, updatedBoard);
    } finally {
      setAction('Combat: Clear Action');
      isExecutingRef.current = false;
    }
  };

  const executeWait = async () => {
    if (isExecutingRef.current) return;
    if (!unitsInBoard || unitsInBoard.length === 0) return;
    const playingUnit = unitsInBoard[unitPosition] || unitsInBoard[0];

    if (playingUnit.hasWaited) return; // Cannot wait more than once per round

    isExecutingRef.current = true;
    try {
      const updatedPlayingUnit: Unit = {
        ...playingUnit,
        hasWaited: true,
      };

      // Move playing unit to the end of the board
      const remainingBoard = unitsInBoard.filter((_, idx) => idx !== unitPosition);
      const updatedBoard = [...remainingBoard, updatedPlayingUnit];
      setUnitsInBoard(updatedBoard);

      triggerFloatingText({
        unitId: playingUnit.id,
        text: '⏳ DELAYED TURN',
        type: 'buff',
        subtext: 'Acting at end of round',
      });

      addCombatLog({
        turnNumber: unitPosition + 1,
        actor: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        target: {
          name: playingUnit.name,
          face: playingUnit.face,
          belongsTo: playingUnit.belongsTo,
        },
        actionName: 'Wait / Delay Turn',
        actionType: 'status',
        description: `${playingUnit.name} delayed their action to the end of the initiative round.`,
      });

      // Next unit is now at the current position (or wrapped to 0 if at end)
      const nextPos = unitPosition >= updatedBoard.length ? 0 : unitPosition;
      setUnitPosition(nextPos);
      let nextUnit = updatedBoard[nextPos];

      // Revert defending stance if this unit's turn has arrived
      let cleanedBoard = updatedBoard;
      if (nextUnit?.defending) {
        cleanedBoard = cleanedBoard.map((u, i) =>
          i === nextPos ? { ...u, defending: false, armor: Math.max(0, u.armor - 3) } : u
        );
        nextUnit = cleanedBoard[nextPos];
        setUnitsInBoard(cleanedBoard);
      }

      if (nextUnit?.belongsTo === 'player') {
        setTurn('player');
      } else {
        const enemyTurnToken = `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        setTurn(enemyTurnToken);
      }
    } finally {
      setAction('Combat: Clear Action');
      isExecutingRef.current = false;
    }
  };

  const checkNextTurn = (activeCaster: Unit, updatedBoard?: Army) => {
    let board = updatedBoard || unitsInBoard;
    if (!board || board.length === 0) return;

    const casterIdx = board.findIndex((u) => u.id === activeCaster.id);
    const nextPosition =
      casterIdx !== -1
        ? (casterIdx + 1) % board.length
        : unitPosition % board.length;

    // If wrapping around to start of queue (new round), reset hasWaited and hasRetaliated for all units
    if (nextPosition === 0) {
      board = board.map((u) => ({ ...u, hasWaited: false, hasRetaliated: false }));
    }

    // If the next unit had assumed a defensive stance, conclude the defense on their turn start
    let nextUnit = board[nextPosition];
    if (nextUnit?.defending) {
      board = board.map((u, i) =>
        i === nextPosition ? { ...u, defending: false, armor: Math.max(0, u.armor - 3) } : u
      );
      nextUnit = board[nextPosition];
    }

    setUnitsInBoard(board);
    setUnitPosition(nextPosition);

    if (nextUnit?.belongsTo === 'player') {
      setTurn('player');
    } else {
      // Unique token to trigger useEffect in AI hook reliably
      const enemyTurnToken = `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setTurn(enemyTurnToken);
    }
  };

  return {
    selectUnit,
    executeDefend,
    executeWait,
    executeAoEAction,
  };
};
