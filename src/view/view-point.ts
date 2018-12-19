module Lemmings {

    /** Camera Point to display the game */
    export class ViewPoint {
        public x : number;
        public y : number;
        public scale : number;

        constructor(x:number, y:number, scale:number) {
            this.x = x;
            this.y = y;
            this.scale = scale;
        }

        /** transforma a X coordinate from display space to game-world space */
        public getSceneX(x: number) : number {
            return Math.floor(x / this.scale) + Math.floor(this.x);
        }

        /** transforma a Y coordinate from display space to game-world space */
        public getSceneY(y: number) : number {
            return Math.floor(y / this.scale) + Math.floor(this.y);
        }

    }
}