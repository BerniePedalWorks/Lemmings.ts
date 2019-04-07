module Lemmings {

    export class GameDisplay {

        private dispaly: DisplayImage = null;

        constructor(
            private game: Game,
            private gameSkills: GameSkills,
            private level: Level,
            private lemmingManager: LemmingManager,
            private objectManager: ObjectManager,
            private triggerManager: TriggerManager) {
        }


        public setGuiDisplay(dispaly: DisplayImage) {
            this.dispaly = dispaly;

            this.dispaly.onMouseUp.on((e) => {
                let lem = this.lemmingManager.getLemmingAt(e.x, e.y);
                if (lem == null) return;

                let selectedSkill = this.gameSkills.getSelectedSkill();

                this.game.triggerLemming(lem, selectedSkill);
            });
        }


        public render() {
            if (this.dispaly == null) return;

            this.level.render(this.dispaly);

            this.objectManager.render(this.dispaly);

            this.lemmingManager.render(this.dispaly);

            this.triggerManager.render(this.dispaly);
        }

    }
}
