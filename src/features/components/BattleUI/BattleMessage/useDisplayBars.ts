import { useContext, useEffect, useRef, useState } from 'react';
import { BattleContext } from '../../../../context/BattleContext';
import { Unit } from '../../../../types';
import {
  calculatePhysicalAttack,
  calculateRainOfFirePower,
  calculateIceSpearDamage,
  calculateRetaliationStrike,
} from '../../../../helpers/combat/damageCalculations';

const getUnitMaxHealth = (u?: Unit) => {
  if (!u) return 1;
  if (u.type === 'Hero') return u.maxHealth || u.health || 1;
  return u.maxHealth || (u.health * (u.maxStack || u.stack || 1)) || 1;
};

export const useDisplayBars = () => {
  const {
    magicUsedInTurn,
    playingUnit,
    targetUnit,
    battleMessageText,
    actionImage,
    isDamaging,
  } = useContext(BattleContext);

  const targetHealth = targetUnit?.updatedHealth || 0;
  const targetMaxHealth = getUnitMaxHealth(targetUnit);
  const attackerHealth = playingUnit?.updatedHealth || 0;
  const attackerMaxHealth = getUnitMaxHealth(playingUnit);

  let attackerDamage = 0;
  let casualtiesLost = 0;
  let isCursed = Boolean(playingUnit?.cursed);
  let vampiricHealAmount = 0;
  let retaliationDamage = 0;
  let retaliationCasualties = 0;
  let canRetaliate = false;

  if (playingUnit && targetUnit) {
    if (actionImage?.name === 'Combat: Attack' || !actionImage?.name) {
      const result = calculatePhysicalAttack(playingUnit, targetUnit);
      attackerDamage = result.actualDamage;
      casualtiesLost = result.stacksLost;
      isCursed = result.isCursed;
      vampiricHealAmount = result.vampiricHealAmount;

      if (!result.isTargetDead && !targetUnit.hasRetaliated) {
        const dummyDefender = {
          ...targetUnit,
          updatedHealth: result.newTargetHealth,
          updatedDamage: result.newTargetDamage,
          stack: result.newTargetStack,
        };
        const ret = calculateRetaliationStrike(dummyDefender, playingUnit);
        canRetaliate = ret.canRetaliate;
        retaliationDamage = ret.actualDamage;
        retaliationCasualties = ret.stacksLost;
      }
    } else if (actionImage.name === 'Destruction: Rain of Fire') {
      attackerDamage = calculateRainOfFirePower(playingUnit);
      casualtiesLost = Math.floor(attackerDamage / targetUnit.health);
    } else if (actionImage.name === 'Destruction: Ice Spear') {
      attackerDamage = calculateIceSpearDamage(targetUnit);
      casualtiesLost = Math.floor(attackerDamage / targetUnit.health);
    }
  }

  const isReanimate = actionImage?.name === 'Necromancy: Reanimate';
  const isMagicUsed = magicUsedInTurn > 0;

  const [updateHealth, setUpdateHealth] = useState(targetHealth);
  const [updateAttackerHealth, setUpdateAttackerHealth] = useState(attackerHealth);
  const [updateMagic, setUpdateMagic] = useState(playingUnit?.magic || 0);

  const barInterval = useRef<any>(null);
  const msUpdate = 25;
  const totalTicks = 70;

  const targetEndHealth = isReanimate
    ? targetMaxHealth
    : Math.max(0, targetHealth - attackerDamage);
  const baseAttackerHealth = Math.min(
    attackerMaxHealth,
    attackerHealth + vampiricHealAmount
  );
  const attackerEndHealth =
    canRetaliate && retaliationDamage > 0
      ? Math.max(0, baseAttackerHealth - retaliationDamage)
      : baseAttackerHealth;
  const endMagic = Math.max(0, (playingUnit?.magic || 0) - magicUsedInTurn);

  useEffect(() => {
    setUpdateHealth(targetHealth);
    setUpdateAttackerHealth(attackerHealth);
    setUpdateMagic(playingUnit?.magic || 0);

    if (isReanimate) {
      const healthDelta = targetMaxHealth - targetHealth;
      barInterval.current = setInterval(() => {
        setUpdateHealth((curr) => {
          const next = curr + healthDelta / totalTicks;
          return next >= targetMaxHealth ? targetMaxHealth : next;
        });

        if (isMagicUsed) {
          setUpdateMagic((curr) => {
            const next = curr - magicUsedInTurn / totalTicks;
            return next <= endMagic ? endMagic : next;
          });
        }
      }, msUpdate);
    } else if (isDamaging) {
      barInterval.current = setInterval(() => {
        if (!isCursed && attackerDamage > 0) {
          setUpdateHealth((curr) => {
            const next = curr - attackerDamage / totalTicks;
            return next <= targetEndHealth ? targetEndHealth : next;
          });
        }

        if (vampiricHealAmount > 0 || (canRetaliate && retaliationDamage > 0)) {
          const netHealthDelta = attackerEndHealth - attackerHealth;
          setUpdateAttackerHealth((curr) => {
            const next = curr + netHealthDelta / totalTicks;
            if (netHealthDelta >= 0) {
              return next >= attackerEndHealth ? attackerEndHealth : next;
            } else {
              return next <= attackerEndHealth ? attackerEndHealth : next;
            }
          });
        }

        if (isMagicUsed) {
          setUpdateMagic((curr) => {
            const next = curr - magicUsedInTurn / totalTicks;
            return next <= endMagic ? endMagic : next;
          });
        }
      }, msUpdate);
    } else if (isMagicUsed) {
      barInterval.current = setInterval(() => {
        setUpdateMagic((curr) => {
          const next = curr - magicUsedInTurn / totalTicks;
          return next <= endMagic ? endMagic : next;
        });
      }, msUpdate);
    }

    return () => {
      if (barInterval.current) clearInterval(barInterval.current);
    };
  }, [
    playingUnit,
    targetUnit,
    isDamaging,
    isReanimate,
    isCursed,
    attackerDamage,
    isMagicUsed,
    magicUsedInTurn,
    canRetaliate,
    retaliationDamage,
    vampiricHealAmount,
    targetHealth,
    targetMaxHealth,
    attackerHealth,
    targetEndHealth,
    attackerEndHealth,
    endMagic,
  ]);

  return {
    playingUnit,
    targetUnit,
    battleMessageText,
    actionImage,
    isDamaging,
    isReanimate,
    isMagicUsed,
    updateMagic,
    attackerIsCursed: isCursed,
    updateHealth,
    targetMaxHealth,
    updateAttackerHealth,
    attackerMaxHealth,
    attackerDamage,
    casualtiesLost,
    vampiricHealAmount,
    canRetaliate,
    retaliationDamage,
    retaliationCasualties,
  };
};
