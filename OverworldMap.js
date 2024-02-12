class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
              { type: "textMessage", text: "Go away!"},
              { who: "hero", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "/images/characters/people/npc2.png",
        // behaviorLoop: [
        //   { type: "walk",  direction: "left" },
        //   { type: "stand",  direction: "up", time: 800 },
        //   { type: "walk",  direction: "up" },
        //   { type: "walk",  direction: "right" },
        //   { type: "walk",  direction: "down" },
        // ]
      }),
    },
    walls: {
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true,

      [utils.asGridCoord(1,10)] : true,
      [utils.asGridCoord(2,10)] : true,
      [utils.asGridCoord(3,10)] : true,
      [utils.asGridCoord(4,10)] : true,
      [utils.asGridCoord(6,10)] : true,
      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(9,10)] : true,
      [utils.asGridCoord(10,10)] : true,

      [utils.asGridCoord(11,1)] : true,
      [utils.asGridCoord(11,2)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(11,4)] : true,
      [utils.asGridCoord(11,5)] : true,
      [utils.asGridCoord(11,6)] : true,
      [utils.asGridCoord(11,7)] : true,
      [utils.asGridCoord(11,8)] : true,
      [utils.asGridCoord(11,9)] : true,

      [utils.asGridCoord(0,1)] : true,
      [utils.asGridCoord(0,2)] : true,
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(0,5)] : true,
      [utils.asGridCoord(0,6)] : true,
      [utils.asGridCoord(0,7)] : true,
      [utils.asGridCoord(0,8)] : true,
      [utils.asGridCoord(0,9)] : true,

      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,4)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,

    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "stand",  direction: "up", time: 500 },
            { type: "textMessage", text:"You can't be in there!"},
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { type: "changeMap", map: "Kitchen" }
          ]
        }
      ]
    }
    
  },
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "/images/characters/people/npc3.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "You made it! This video is going to be such a good time!", faceHero:"npcB" },
            ]
          }
        ]
      }),

      oak: new Person({
        x: utils.withGrid(1),
        y: utils.withGrid(8),
        src: "/images/characters/people/oak.png",
        behaviorLoop: [
          { type: "stand",  direction: "up", time: 800 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Right on!", faceHero:"oak" },
            ]
          }
        ]
      })
    },
    walls: {
      [utils.asGridCoord(1,9)] : true,
      [utils.asGridCoord(2,9)] : true,
      [utils.asGridCoord(3,10)] : true,
      [utils.asGridCoord(4,10)] : true,
      [utils.asGridCoord(6,10)] : true,
      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(9,9)] : true,
      [utils.asGridCoord(10,9)] : true,
      [utils.asGridCoord(11,10)] : true,
      [utils.asGridCoord(12,10)] : true,

      [utils.asGridCoord(6,7)] : true,
      [utils.asGridCoord(7,7)] : true,

      [utils.asGridCoord(9,7)] : true,
      [utils.asGridCoord(10,7)] : true,

      [utils.asGridCoord(13,1)] : true,
      [utils.asGridCoord(13,2)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(13,4)] : true,
      [utils.asGridCoord(13,5)] : true,
      [utils.asGridCoord(13,6)] : true,
      [utils.asGridCoord(13,7)] : true,
      [utils.asGridCoord(13,8)] : true,
      [utils.asGridCoord(13,9)] : true,

      [utils.asGridCoord(1,2)] : true,
      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(1,6)] : true,
      [utils.asGridCoord(1,7)] : true,
      [utils.asGridCoord(0,8)] : true,

      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,4)] : true,
      [utils.asGridCoord(12,4)] : true,

    },
    cutsceneSpaces: {
      [utils.asGridCoord(2,5)]: [
        {
          events: [
            { who: "oak", type: "walk",  direction: "right" },
            { who: "oak", type: "walk",  direction: "up" },
            { who: "oak", type: "walk",  direction: "up" },
            { type: "textMessage", text:"Professor Oak: Oh, you've come to choose a Pokémon!"},
            { type: "textMessage", text:"Professor Oak: You have three choices. Pick wisely!"},
            { type: "textMessage", text:"Professor Oak: Not one of these though! Go talk to Alex!"},
            { who: "oak", type: "walk",  direction: "down" },  
            { who: "oak", type: "walk",  direction: "down" },
            { who: "oak", type: "walk",  direction: "left" },
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "right" }

          ]
        }
      ],
      [utils.asGridCoord(2,6)]: [
        {
          events: [
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "up" },
            { who: "hero", type: "stand",  direction: "left", time: 500 }
          ]
        }
      ],
      [utils.asGridCoord(2,7)]: [
        {
          events: [
            { who: "hero", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "up" },
            { who: "hero", type: "walk",  direction: "up" },
            { who: "hero", type: "stand",  direction: "left", time: 500 }
          ]
        }
      ],
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "down" },
            { type: "textMessage", text:"Alex: You can't be in there!"},
            { who: "npcB", type: "walk",  direction: "up" },
            { who: "hero", type: "walk",  direction: "up" },
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "npcB", type: "stand",  direction: "down", time: 500 }
          ]
        }
      ],
      [utils.asGridCoord(9,8)]: [
        {
          events: [
            { who: "npcB", type: "stand",  direction: "left", time: 500 },
            { type: "textMessage", text:"Alex: Hiya! You've come for a Pokémon?"},
            { type: "textMessage", text:"Alex: Follow me right this way!"},
            { who: "hero", type: "walk",  direction: "left" },
            { who: "hero", type: "walk",  direction: "left" },
            { who: "hero", type: "stand",  direction: "right", time: 5 },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "walk",  direction: "up" },
            { who: "hero", type: "stand",  direction: "up", time: 5 },
            { who: "npcB", type: "walk",  direction: "up" },
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "stand",  direction: "down", time: 1000 },
            { type: "textMessage", text:"Alex: Alright, time to get your Pokémon!"},
            { who: "npcB", type: "stand",  direction: "down", time: 1000 },
            // Switch npcB sprite to eyebrow raise
            { type: "textMessage", text:"Alex: . . ."},
            { type: "textMessage", text:"Alex: This isn't a starter Pokémon ..."},
            { who: "npcB", type: "stand",  direction: "down", time: 1000 },
            //Spawn in a goodra
            //{ type: "spawnGoodra" },
            { who: "npcB", type: "stand",  direction: "down", time: 1000 },
            { type: "textMessage", text:"You: Aweeee a goodra!"},
            { who: "npcB", type: "stand",  direction: "down", time: 1000 },
            // Switch to other website page (goodra catch)
            //{ type: "executeFunction", functionName: "spawnGoodra" }
            { type: "transitionPage" }
    
          ]
        }
      ]
    }
    
  },
}