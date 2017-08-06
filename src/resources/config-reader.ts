 module Lemmings {

    /** read the config.json file */
    export class ConfigReader {

        private configs: Promise<GameConfig[]>;
        private error : ErrorHandler = new ErrorHandler("ConfigReader");


        constructor(configFile: Promise<string>) {

            this.configs = new Promise<GameConfig[]>((resolve, reject)=> {

                configFile.then((jsonString) => {

                    let configJson:GameConfig[] = this.parseConfig(jsonString);

                        resolve(configJson);
                    }
                );
            });

        }


        /** return the game config for a given GameType */
        public getConfig(gameType : GameTypes) : Promise<GameConfig> {

            return new Promise<GameConfig>((resolve, reject)=> {

                this.configs.then((configs:GameConfig[]) => {


                    let config:GameConfig = configs.find((type) => type.gametype == gameType)

                    if (config == null) {
                        this.error.log("config for GameTypes:"+ GameTypes.toString(gameType) +" not found!");
                        reject();
                        return;
                    }

                    resolve(config);

                });
            });
        }


        /** pars the config file */
        private parseConfig(jsonData:string):GameConfig[] {

            let gameConfigs:GameConfig[] = []

            try {

                var config = <any[]>JSON.parse(jsonData);

            } catch(e) {

                this.error.log("Unable to parse config", e);
                return gameConfigs;
            }

            /// for all game types
            for(let c = 0; c < config.length; c++) {
                let newConfig = new GameConfig();
                let configData:{[key:string]:string} = config[c];

                newConfig.name = configData["name"];
                newConfig.path = configData["path"];
                newConfig.gametype = GameTypes.fromString(configData["gametype"]);

                if (configData["useoddtable"] != null){
                    newConfig.level.useOddTable = (!!(<any>configData["useoddtable"]));
                }
                newConfig.level.order = <any>configData["level.order"];
                newConfig.level.filePrefix = <any>configData["level.filePrefix"];
                newConfig.level.groups = <any>configData["level.groups"];

                newConfig.audioConfig.version = <any>configData["audio.version"];
                newConfig.audioConfig.adlibChannelConfigPosition = <any>configData["audio.adlibChannelConfigPosition"];
                newConfig.audioConfig.dataOffset = <any>configData["audio.dataOffset"];
                newConfig.audioConfig.frequenciesOffset = <any>configData["audio.frequenciesOffset"];
                newConfig.audioConfig.octavesOffset = <any>configData["audio.octavesOffset"];
                newConfig.audioConfig.frequenciesCountOffset = <any>configData["audio.frequenciesCountOffset"];
                newConfig.audioConfig.musicInitOffset = <any>configData["audio.musicInitOffset"];

                newConfig.audioConfig.instructionsOffset = <any>configData["audio.instructionsOffset"];
                newConfig.audioConfig.soundIndexTablePosition = <any>configData["audio.soundIndexTablePosition"];
                newConfig.audioConfig.soundDataOffset = <any>configData["audio.soundDataOffset"];
                newConfig.audioConfig.trackCount = <any>configData["audio.trackCount"];

                gameConfigs.push(newConfig);
            }

            return gameConfigs;

        }

    }
 }