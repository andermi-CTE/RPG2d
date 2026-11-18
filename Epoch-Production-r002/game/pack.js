// EPOCH r002: editable town, identity and guide dialogue.
// Search for "Welcome to Epoch." to change the first greeting.
// Keep IDs and punctuation unchanged. Outdoor RPG rules are in epoch-rpg.js.
registerStudentPack({
  "schemaVersion": 1,
  "manifest": {
    "id": "epoch_teacher",
    "name": "Epoch: The Arkavian Tower",
    "author": "Epoch teacher demo",
    "description": "NES-inspired top-down RPG starter: explore, fight turn-based encounters, defeat the Tower Sentinel and return to town.",
    "iconColor": "green",
    "position": {
      "x": 448,
      "y": 256
    },
    "width": 32,
    "height": 32,
    "levelId": "epoch_teacher_level",
    "rewardId": "key_epoch_teacher"
  },
  "home": {
    "tileSize": 32,
    "width": 28,
    "height": 18,
    "spawnTile": {
      "x": 13,
      "y": 9
    },
    "interactables": [
      {
        "type": "portal",
        "id": "north_gate",
        "name": "north road",
        "levelId": "epoch_teacher_level",
        "tileX": 13,
        "tileY": 1
      },
      {
        "type": "portal",
        "id": "south_gate",
        "name": "south road",
        "levelId": "epoch_teacher_level",
        "tileX": 13,
        "tileY": 16
      },
      {
        "type": "portal",
        "id": "west_gate",
        "name": "west road",
        "levelId": "epoch_teacher_level",
        "tileX": 1,
        "tileY": 8
      },
      {
        "type": "portal",
        "id": "east_gate",
        "name": "east road",
        "levelId": "epoch_teacher_level",
        "tileX": 26,
        "tileY": 8
      },
      {
        "type": "npc",
        "id": "elder",
        "name": "Town hall",
        "dialogueKey": "mission",
        "tileX": 7,
        "tileY": 5
      },
      {
        "type": "npc",
        "id": "inn",
        "name": "Inn",
        "dialogueKey": "mission",
        "tileX": 18,
        "tileY": 5
      },
      {
        "type": "npc",
        "id": "shop",
        "name": "Shop",
        "dialogueKey": "mission",
        "tileX": 7,
        "tileY": 12
      },
      {
        "type": "savePoint",
        "id": "town_save",
        "name": "Save progress",
        "tileX": 18,
        "tileY": 12
      },
      {
        "type": "exit",
        "id": "class_exit",
        "name": "Class Overworld / menu",
        "tileX": 13,
        "tileY": 12
      }
    ]
  },
  "dialogue": {
    "mission": {
      "speaker": "Town guide",
      "lines": [
        "Welcome to Epoch. The Tower Sentinel waits northeast of town.",
        "Use WASD or arrows to walk. Press E at a road to explore.",
        "In battle: 1 attacks, 2 uses a healing herb, 3 escapes ordinary enemies.",
        "The inn restores HP for 3 gold; the shop sells herbs for 3 gold.",
        "Defeat the sentinel, then return to town. Use the save station to save RPG stats."
      ]
    }
  },
  "level": {
    "id": "epoch_teacher_level",
    "mode": "topdown",
    "name": "Arkavian countryside — blockout",
    "width": 960,
    "height": 640,
    "spawn": {
      "x": 440,
      "y": 450
    },
    "solids": [
      {
        "x": 0,
        "y": 0,
        "width": 960,
        "height": 32
      },
      {
        "x": 0,
        "y": 608,
        "width": 960,
        "height": 32
      },
      {
        "x": 0,
        "y": 32,
        "width": 32,
        "height": 576
      },
      {
        "x": 928,
        "y": 32,
        "width": 32,
        "height": 576
      },
      {
        "x": 160,
        "y": 160,
        "width": 128,
        "height": 96
      },
      {
        "x": 640,
        "y": 320,
        "width": 128,
        "height": 96
      }
    ],
    "hazards": [],
    "collectibles": [
      {
        "id": "tower_marker",
        "label": "Arkavian Tower marker",
        "x": 816,
        "y": 96,
        "width": 32,
        "height": 48
      }
    ],
    "objectives": [
      {
        "id": "discover_tower",
        "label": "Discover the Arkavian Tower marker",
        "collect": [
          "tower_marker"
        ]
      }
    ],
    "doors": [],
    "goal": {
      "x": 432,
      "y": 496,
      "width": 96,
      "height": 48,
      "requires": [
        "discover_tower"
      ]
    }
  }
});
