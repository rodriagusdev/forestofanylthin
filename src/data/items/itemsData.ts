import { InventoryItem } from '../../types';
import crownOfSilornIcon from '../../assets/images/items/crown_of_silorn.jpg';
import bandOfElisithIcon from '../../assets/images/items/band_of_elisith.jpg';

export const INITIAL_ITEMS: Record<string, InventoryItem> = {
  // === HELMS ===
  diadem_sylvan_embers: {
    id: 'diadem_sylvan_embers',
    name: 'Diadem of Sylvan Embers',
    slot: 'helm',
    rarity: 'Epic',
    description: 'Forged from petrified ash imbued with destructive elder fire.',
    lore: 'Worn by Atro destruction sorceresses when communion with primeval flames is sought.',
    stats: {
      spellpower: 2,
      magic: 4,
      health: 20,
    },
  },
  crown_of_silorn: {
    id: 'crown_of_silorn',
    name: 'Iron Crown of Silorn',
    slot: 'helm',
    rarity: 'Epic',
    icon: crownOfSilornIcon,
    description: 'A heavy, spiked diadem bound in dark worn silver.',
    lore: 'This crown was hand-made by Nicolai when first he established himself in Silorn. The weight of his guilt, the weight of his crown.',
    stats: {
      armor: 2,
      spellpower: 0,
      health: 50,
    },
  },
  visage_of_the_glade: {
    id: 'visage_of_the_glade',
    name: 'Visage of the Old Glade',
    slot: 'helm',
    rarity: 'Rare',
    description: 'A helm crafted from hardened ironwood and bramble sinew.',
    stats: {
      armor: 1,
      health: 15,
      initiative: 1,
    },
  },

  // === ARMOR ===
  cuirass_deathless_prince: {
    id: 'cuirass_deathless_prince',
    name: 'Cuirass of the Deathless Prince',
    slot: 'armor',
    rarity: 'Relic',
    description: 'Blackened breastplate forged with cursed steel that deflects both blades and incantations.',
    lore: 'Imbued with the unyielding vitality of royal bloodlines that refused to pass beyond the veil.',
    stats: {
      armor: 4,
      health: 50,
      damage: 10,
    },
  },
  vestments_gloom_queen: {
    id: 'vestments_gloom_queen',
    name: 'Vestments of the Gloom Queen',
    slot: 'armor',
    rarity: 'Relic',
    description: 'Flowing ceremonial robes woven with shadow-silk and charred elven gold.',
    lore: 'Channels destruction sorceries with lethal efficiency while shielding the caster from magical backfire.',
    stats: {
      armor: 2,
      spellpower: 3,
      magic: 6,
      health: 35,
      magicResistance: 2,
    },
  },
  mail_of_eldare: {
    id: 'mail_of_eldare',
    name: 'Corrupted Mail of Eldare',
    slot: 'armor',
    rarity: 'Epic',
    description: 'The reinforced dark mail worn by the dread knight guarding Sacrelthar.',
    lore: 'Once white and shining, before the Captain of Hithair Eldare Payne was slain in battle.',
    stats: {
      armor: 3,
      health: 40,
      magicResistance: 3,
    },
  },

  // === RINGS ===
  band_of_elisith: {
    id: 'band_elisith',
    name: 'Band of Elisith',
    slot: 'ring',
    rarity: 'Epic',
    icon: bandOfElisithIcon,
    description: 'A glowing ring of dark yellow and green, with a scaled facet.',
    lore: 'The ring passed to Elisith in the land of Atro where she had become the Shadow Lady. A queenly gift.',
    stats: {
      spellpower: 2,
      magic: 4,
    },
  },
  ring_crimson_thirst: {
    id: 'ring_crimson_thirst',
    name: 'Ring of Crimson Thirst',
    slot: 'ring',
    rarity: 'Epic',
    description: 'Encrusted with a bleeding ruby that hungers for vital essence.',
    stats: {
      damage: 12,
      health: 20,
    },
  },
  signet_bone_monarch: {
    id: 'signet_bone_monarch',
    name: 'Signet of the Bone Monarch',
    slot: 'ring',
    rarity: 'Rare',
    description: 'Carved from the calcified fingertip of an ancient crypt sovereign.',
    stats: {
      armor: 1,
      health: 25,
    },
  },
  band_forest_warden: {
    id: 'band_forest_warden',
    name: 'Band of the Forest Warden',
    slot: 'ring',
    rarity: 'Rare',
    description: 'A woven ring of green gold that sharpens reflex and battle instincts.',
    stats: {
      initiative: 2,
      damage: 6,
      magicResistance: 1,
    },
  },
};

/**
 * Default starting equipment by faction
 */
export const STARTING_EQUIPMENT_BY_RACE: Record<
  string,
  {
    equipped: {
      helm: InventoryItem | null;
      armor: InventoryItem | null;
      ring1: InventoryItem | null;
      ring2: InventoryItem | null;
    };
    inventory: InventoryItem[];
  }
> = {
  dryeldar: {
    equipped: {
      helm: null,
      armor: null,
      ring1: INITIAL_ITEMS.band_of_elisith,
      ring2: null,
    },
    inventory: [],
  },
  undead: {
    equipped: {
      helm: INITIAL_ITEMS.crown_of_silorn,
      armor: null,
      ring1: null,
      ring2: null,
    },
    inventory: [],
  },
};
