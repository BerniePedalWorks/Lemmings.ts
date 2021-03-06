/// <reference path="../file/binary-reader.ts" />
/// <reference path="../file/file-container.ts" />

module Lemmings {

    /** read the VGASPECx.DAT file : it is a image used for the ground */
    export class VgaspecReader {
        private log = new LogHandler("VgaspecReader");
        public img:Frame;

        public width:number = 0;
        public height:number = 0;

        /** the color palette stored in this file */
        public groundPalette: ColorPalette = new ColorPalette();

        constructor(vgaspecFile: BinaryReader, width:number, height:number) {
            this.width = width;
            this.height = height;
            this.read(vgaspecFile);
        }

        /** read the file */
        private read(fr: BinaryReader) {
            fr.setOffset(0);

            let fc = new FileContainer(fr);
            if (fc.count() != 1){
                this.log.log("No FileContainer found!");
                return;
            }

            /// we only need the first part
            fr = fc.getPart(0);

            /// read palette
            this.readPalettes(fr, 0);

            /// process the image
            this.readImage(fr, 40);
        }

        /** read image from file */
        private readImage(fr: BinaryReader, offset:number) {

            fr.setOffset(offset);

            let width = 960;
            let chunkHeight = 40;
            let groundImagePositionX = 304;

            this.img = new Frame(this.width, this.height);

            let startScanLine = 0;

            let pixelCount = width * chunkHeight;
            let bitBuffer = new Uint8Array(pixelCount);
            let bitBufferPos:number = 0;

            while(!fr.eof()) {
                let curByte = fr.readByte();

                if (curByte == 128){
                    /// end of chunk

                    /// unpack image data to image-buffer
                    let fileReader = new BinaryReader(bitBuffer);
                    let bitImage = new PaletteImage(width, chunkHeight);
                    bitImage.processImage(fileReader, 3, 0);
                    bitImage.processTransparentByColorIndex(0);

                    this.img.drawPaletteImage(bitImage.getImageBuffer(), width, chunkHeight, this.groundPalette, groundImagePositionX, startScanLine);

                    startScanLine +=40;
                    if (startScanLine >= this.img.height) return;

                    bitBufferPos = 0;
                }
                else if (curByte <= 127) {
                    let copyByteCount = curByte + 1;

                    /// copy copyByteCount to the bitImage
                    while(!fr.eof()) {

                        /// write the next Byte
                        if (bitBufferPos >= bitBuffer.length) return;
                        bitBuffer[bitBufferPos] = fr.readByte();
                        bitBufferPos++;

                        copyByteCount--;
                        if (copyByteCount <= 0) break;
                    }
                }
                else {
                    /// copy n times the same value
                    let repeatByte = fr.readByte();
                    for(let repeatByteCount = 257 - curByte; repeatByteCount>0; repeatByteCount--){

                        /// write the next Byte
                        if (bitBufferPos >= bitBuffer.length) return;
                        bitBuffer[bitBufferPos] = repeatByte;
                        bitBufferPos++;

                    } 
                }
            }

            
        }



        /** load the palettes  */
        private readPalettes(fr: BinaryReader, offset: number): void {

            /// read the VGA palette index 0..8
            for (let i = 0; i < 8; i++) {
                let r = fr.readByte() << 2;
                let g = fr.readByte() << 2;
                let b = fr.readByte() << 2;
                this.groundPalette.setColorRGB(i, r, g, b);
            }

            if (fr.eof()) {
                this.log.log("readPalettes() : unexpected end of file!: " + fr.filename);
                return;
            }

        }

    }
}