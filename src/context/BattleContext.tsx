import { createContext, useState, useCallback, ReactNode } from 'react';
import { Skill, Unit, Army, ActionName, CombatLogEntry, FloatingCombatTextEvent } from '../types';
import { useActionSound } from '../hooks/useActionSound';

interface ProviderProps {
  children: ReactNode;
}

export interface BattleContextProps {
  heroStats: Unit | null;
  setHeroStats: React.Dispatch<React.SetStateAction<Unit | null>>;
  playerRace: string;
  setPlayerRace: React.Dispatch<React.SetStateAction<string>>;
  turn: string;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  action: ActionName;
  setAction: React.Dispatch<React.SetStateAction<ActionName>>;
  playerArmy: Army;
  setPlayerArmy: React.Dispatch<React.SetStateAction<Army>>;
  enemyArmy: Army;
  setEnemyArmy: React.Dispatch<React.SetStateAction<Army>>;
  unitsInBoard: Army;
  setUnitsInBoard: React.Dispatch<React.SetStateAction<Army>>;
  unitPosition: number;
  setUnitPosition: React.Dispatch<React.SetStateAction<number>>;
  isInFight: boolean;
  setIsInFight: React.Dispatch<React.SetStateAction<boolean>>;
  playingUnit: Unit | null;
  setPlayingUnit: React.Dispatch<React.SetStateAction<Unit | null>>;
  targetUnit: Unit | null;
  setTargetUnit: React.Dispatch<React.SetStateAction<Unit | null>>;
  deadUnit: Unit | null;
  setDeadUnit: React.Dispatch<React.SetStateAction<Unit | null>>;
  showBattleMessage: boolean;
  setShowBattleMessage: React.Dispatch<React.SetStateAction<boolean>>;
  battleMessageText: string;
  setBattleMessageText: React.Dispatch<React.SetStateAction<string>>;
  actionImage: Skill | null;
  setActionImage: React.Dispatch<React.SetStateAction<Skill | null>>;
  addedDryexaRanger: boolean;
  setAddedDryexaRanger: React.Dispatch<React.SetStateAction<boolean>>;
  addedSkeletons: boolean;
  setAddedSkeletons: React.Dispatch<React.SetStateAction<boolean>>;
  isDamaging: boolean;
  setIsDamaging: React.Dispatch<React.SetStateAction<boolean>>;
  magicUsedInTurn: number;
  setMagicUsedInTurn: React.Dispatch<React.SetStateAction<number>>;
  currentZone: string;
  setCurrentZone: React.Dispatch<React.SetStateAction<string>>;
  currentZoneImage: string;
  setCurrentZoneImage: React.Dispatch<React.SetStateAction<string>>;
  combatLogs: CombatLogEntry[];
  setCombatLogs: React.Dispatch<React.SetStateAction<CombatLogEntry[]>>;
  addCombatLog: (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;
  clearCombatLogs: () => void;
  fallenAllies: Unit[];
  setFallenAllies: React.Dispatch<React.SetStateAction<Unit[]>>;
  previewUnit: Unit | null;
  setPreviewUnit: React.Dispatch<React.SetStateAction<Unit | null>>;
  handleUnitPreview: (unit: Unit) => void;
  handleExitUnitPreview: () => void;
  hoveredUnitId: string | null;
  setHoveredUnitId: React.Dispatch<React.SetStateAction<string | null>>;
  activeScreenShake: boolean | 'light' | 'heavy' | 'apocalyptic';
  setActiveScreenShake: React.Dispatch<React.SetStateAction<boolean | 'light' | 'heavy' | 'apocalyptic'>>;
  activeScreenFlash: 'ruby' | 'fire' | 'ice' | 'arcane' | 'emerald' | 'dark-magic' | 'curse' | null;
  setActiveScreenFlash: React.Dispatch<React.SetStateAction<'ruby' | 'fire' | 'ice' | 'arcane' | 'emerald' | 'dark-magic' | 'curse' | null>>;
  floatingTexts: FloatingCombatTextEvent[];
  triggerFloatingText: (event: Omit<FloatingCombatTextEvent, 'id'>) => void;
}

export const BattleContext = createContext({} as BattleContextProps);

export const BattleContextProvider = ({ children }: ProviderProps) => {
  const { playPreviewSound } = useActionSound();
  const [heroStats, setHeroStats] = useState<Unit | null>(null);
  const [playerRace, setPlayerRace] = useState('');

  const [playerArmy, setPlayerArmy] = useState<Army>([]);
  const [enemyArmy, setEnemyArmy] = useState<Army>([]);

  const [previewUnit, setPreviewUnit] = useState<Unit | null>(null);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [activeScreenShake, setActiveScreenShake] = useState<boolean | 'light' | 'heavy' | 'apocalyptic'>(false);
  const [activeScreenFlash, setActiveScreenFlash] = useState<'ruby' | 'fire' | 'ice' | 'arcane' | 'emerald' | 'dark-magic' | 'curse' | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingCombatTextEvent[]>([]);

  const triggerFloatingText = useCallback((event: Omit<FloatingCombatTextEvent, 'id'>) => {
    const id = `fct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: FloatingCombatTextEvent = { ...event, id };
    setFloatingTexts((prev) => [...prev, newEvent]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  }, []);

  const handleUnitPreview = useCallback(
    (unit: Unit) => {
      playPreviewSound();
      setPreviewUnit(unit);
    },
    [playPreviewSound]
  );

  const handleExitUnitPreview = useCallback(() => {
    setPreviewUnit(null);
  }, []);

  const [addedDryexaRanger, setAddedDryexaRanger] = useState(false);
  const [addedSkeletons, setAddedSkeletons] = useState(false);

  const [currentZone, setCurrentZone] = useState<string>('Cemetery');
  const [currentZoneImage, setCurrentZoneImage] = useState<string>('');

  const [isInFight, setIsInFight] = useState<boolean>(false);
  const [action, setAction] = useState<ActionName>('Combat: Clear Action');
  const [turn, setTurn] = useState('');
  const [playingUnit, setPlayingUnit] = useState<Unit | null>(null);
  const [targetUnit, setTargetUnit] = useState<Unit | null>(null);
  const [deadUnit, setDeadUnit] = useState<Unit | null>(null);

  const [actionImage, setActionImage] = useState<Skill | null>(null);
  const [battleMessageText, setBattleMessageText] = useState('');
  const [showBattleMessage, setShowBattleMessage] = useState(false);
  const [isDamaging, setIsDamaging] = useState(false);
  const [magicUsedInTurn, setMagicUsedInTurn] = useState(0);

  const [unitsInBoard, setUnitsInBoard] = useState<Army>([]);
  const [unitPosition, setUnitPosition] = useState(0);
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([]);
  const [fallenAllies, setFallenAllies] = useState<Unit[]>([]);

  const addCombatLog = useCallback(
    (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const newEntry: CombatLogEntry = {
        ...entry,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp,
      };
      setCombatLogs((prev) => [newEntry, ...prev]);
    },
    []
  );

  const clearCombatLogs = useCallback(() => {
    setCombatLogs([]);
  }, []);

  return (
    <BattleContext.Provider
      value={{
        heroStats,
        setHeroStats,
        playerRace,
        setPlayerRace,
        turn,
        setTurn,
        action,
        setAction,
        playerArmy,
        setPlayerArmy,
        enemyArmy,
        setEnemyArmy,
        unitsInBoard,
        setUnitsInBoard,
        unitPosition,
        setUnitPosition,
        isInFight,
        setIsInFight,
        showBattleMessage,
        setShowBattleMessage,
        battleMessageText,
        setBattleMessageText,
        playingUnit,
        setPlayingUnit,
        targetUnit,
        setTargetUnit,
        deadUnit,
        setDeadUnit,
        actionImage,
        setActionImage,
        addedDryexaRanger,
        setAddedDryexaRanger,
        addedSkeletons,
        setAddedSkeletons,
        isDamaging,
        setIsDamaging,
        magicUsedInTurn,
        setMagicUsedInTurn,
        currentZone,
        setCurrentZone,
        currentZoneImage,
        setCurrentZoneImage,
        combatLogs,
        setCombatLogs,
        addCombatLog,
        clearCombatLogs,
        fallenAllies,
        setFallenAllies,
        previewUnit,
        setPreviewUnit,
        handleUnitPreview,
        handleExitUnitPreview,
        hoveredUnitId,
        setHoveredUnitId,
        activeScreenShake,
        setActiveScreenShake,
        activeScreenFlash,
        setActiveScreenFlash,
        floatingTexts,
        triggerFloatingText,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};
