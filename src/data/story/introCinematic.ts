import { DialogueSequence } from "@/store/useCampaignStore";

import elisithFace from "@/assets/images/portraits/dryeldar/elisithface.jpg";
import ydrisFace from "@/assets/images/portraits/dryexa/ydris.webp";
import nicolaiFace from "@/assets/images/portraits/undead/nicolaiface.jpg";
import elisith_intro_1 from "@/assets/sounds/dialog/intro/elisith_intro_1.mp3";
import elisith_intro_2 from "@/assets/sounds/dialog/intro/elisith_intro_2.mp3";
import elisith_intro_3 from "@/assets/sounds/dialog/intro/elisith_intro_3.mp3";
import elisith_intro_4 from "@/assets/sounds/dialog/intro/elisith_intro_4.mp3";
import elisith_intro_5 from "@/assets/sounds/dialog/intro/elisith_intro_5.mp3";
import ydris_intro_1 from "@/assets/sounds/dialog/intro/ydris_intro_1.mp3";
import ydris_intro_2 from "@/assets/sounds/dialog/intro/ydris_intro_2.mp3";
import ydris_intro_3 from "@/assets/sounds/dialog/intro/ydris_intro_3.mp3";
import ydris_intro_4 from "@/assets/sounds/dialog/intro/ydris_intro_4.mp3";

export const INTRO_DIALOGUE_DRYELDAR: DialogueSequence = {
    id: "General_Intro_Dryeldar",
    title: "Introduction",
    startNodeId: "node_1",
    nodes: {
        node_1: {
            id: "node_1",
            speaker: {
                name: "Elisith",
                avatar: elisithFace,
                title: "The Shadow Lady"
            },
            audio: elisith_intro_1,
            text: "Warden Ydris, I did not expect you. Who would have thought you should come here, unaided, seeking my counsel?",
            nextNodeId: "node_2"
        },
        node_2: {
            id: "node_2",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: ydris_intro_1,
            text: "Elisith... I did not come for your counsel. I came for we now share a common enemy, and there is a great reward that you have long been seeking.",
            nextNodeId: "node_3"
        },
        node_3: {
            id: "node_3",
            speaker: {
                name: "Elisith",
                avatar: elisithFace,
                title: "The Shadow Lady"
            },
            audio: elisith_intro_2,
            text: "Oh? And what would that be? I take you did not come here with a trifle for reward.",
            nextNodeId: "node_4"
        },
        node_4: {
            id: "node_4",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: ydris_intro_2,
            text: "I know why your kind left Atro and crossed the sea and into this land: you seek a tale forgotten, a tale of yore that speaks of a specific magic.",
            nextNodeId: "node_5"
        },
        node_5: {
            id: "node_5",
            speaker: {
                name: "Elisith",
                avatar: elisithFace,
                title: "The Shadow Lady"
            },
            audio: elisith_intro_3,
            text: "More of a song than a tale, I'd say. The song of Niendalyn, once sung in this land, from which Gwindolyn was born. Such song has eluded me, and my kin, for many ages.",
            nextNodeId: "node_6"
        },
        node_6: {
            id: "node_6",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: ydris_intro_3,
            text: "A song may be a tale too. But yes, the tome resides in a place that used to be sacred, the city of Sacrelthar, now defiled by a common enemy: Velish Acarys, an undead necromancer lady.",
            nextNodeId: "node_7"
        },
        node_7: {
            id: "node_7",
            speaker: {
                name: "Elisith",
                avatar: elisithFace,
                title: "The Shadow Lady"
            },
            audio: elisith_intro_4,
            text: "And you would have me slay her for the song? That easily?",
            nextNodeId: "node_8"
        },
        node_8: {
            id: "node_8",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: ydris_intro_4,
            text: "Well... that song was never truly unraveled, its language was forgotten. We have tried to translate the song to no avail. And I think it will be the case for you too, so parting with this knowledge does not hurt as much as once may have done so.",
            nextNodeId: "node_9"
        },
        node_9: {
            id: "node_9",
            speaker: {
                name: "Elisith",
                avatar: elisithFace,
                title: "The Shadow Lady"
            },
            audio: elisith_intro_5,
            text: "Ha! You underestimate me. Nonetheless I shall take your request, I will slay that undead thing, and I shall part with the song of Niendalyn.",
            choices: [
                {
                    id: "commence_march",
                    text: "Commence the Expedition",
                    actionType: "close"
                }
            ]
        },
    }
};

export const INTRO_DIALOGUE_UNDEAD: DialogueSequence = {
    id: "General_Intro_Dryeldar",
    title: "Introduction",
    startNodeId: "node_1",
    nodes: {
        node_1: {
            id: "node_1",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: ydris_intro_1,
            text: "Nicolai of Silorn. You know what your standing is: you were to be left alone by a pact from the past, but you are not to believe that you are dutyless.",
            nextNodeId: "node_2"
        },
        node_2: {
            id: "node_2",
            speaker: {
                name: "Nicolai",
                avatar: nicolaiFace,
                title: "Fallen Lord of Silorn"
            },
            audio: "ydris_intro_1",
            text: "Spare me the lecture! Why are my services required, Ydris?",
            nextNodeId: "node_3"
        },
        node_3: {
            id: "node_3",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: elisith_intro_2,
            text: "Not services, obligation. Another foul being such as yourself, Velish Acarys, has passed by and her taint is already visible.",
            nextNodeId: "node_4"
        },
        node_4: {
            id: "node_4",
            speaker: {
                name: "Nicolai",
                avatar: nicolaiFace,
                title: "Fallen Lord of Silorn"
            },
            audio: ydris_intro_2,
            text: "Oh really? Well why! I should think the Dryexa are more than capable of dealing with this... menace.",
            nextNodeId: "node_5"
        },
        node_5: {
            id: "node_5",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: elisith_intro_3,
            text: "Yes, indeed. But why spent our resources when one such as you could serve the Dryexa. It is payment. I shall not risk a single Dryexa life as long as I may use... yours. You are already dead, so comply.",
            nextNodeId: "node_6"
        },
        node_6: {
            id: "node_6",
            speaker: {
                name: "Nicolai",
                avatar: nicolaiFace,
                title: "Fallen Lord of Silorn"
            },
            audio: ydris_intro_3,
            text: "Very well, the covenant of the past shall be respected. I shall put an end to her, but do I get a reward?",
            nextNodeId: "node_7"
        },
        node_7: {
            id: "node_7",
            speaker: {
                name: "Ydris",
                avatar: ydrisFace,
                title: "Warden of the Forest"
            },
            audio: elisith_intro_4,
            text: "Do you require applause? Fulfil your duty, and I shall keep the covenant that allows you and your activities continue unhindered in Silorn.",
            nextNodeId: "node_8"
        },
        node_8: {
            id: "node_8",
            speaker: {
                name: "Nicolai",
                avatar: nicolaiFace,
                title: "Fallen Lord of Silorn"
            },
            audio: ydris_intro_4,
            text: "Well, we shall see... Very well, I shall see to it.",
        },
    }
}; 