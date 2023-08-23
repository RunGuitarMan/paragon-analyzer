import {defineStore} from "pinia";
import axios from "axios";
import {IChampion} from "../interfaces/IChampion";
import jimp from "jimp";
import Tesseract from "tesseract.js";
import electron from "electron";

interface ITesseractStore {
    worker: Worker
}

const tesseractStore = defineStore('tesseract-store', {
    state: (): ITesseractStore => ({
        worker: null
    }),
    actions: {
        async getImage() {
            return await electron.ipcRenderer.invoke('get-images');
        },
        async getLevel(imageData: any) {
            var decoder = new TextDecoder('utf8');

            const encondedImageBuffer = new Buffer(imageData.image);

            const height = imageData.height;
            const width = imageData.width;
            const distanceX = imageData.x;
            const distanceY = imageData.y;

            console.log(imageData, distanceY, distanceY)

            if (this.worker === null) {
                this.worker = await Tesseract.createWorker({ logger: m => console.log(m) });
                await this.worker.load();
                await this.worker.loadLanguage('eng');
                await this.worker.initialize('eng');
                await this.worker.setParameters({
                    tessedit_char_whitelist: '0123456789'
                });

                console.log(this.worker);
            }

            return new Promise<any>((resolve) => {
                jimp.read(encondedImageBuffer, (err, image) => {
                    if (err)
                        throw err;

                    image.scale(10)
                    .crop(distanceX, distanceY, width, height)
                        // Get data in base64 and show in img tag
                        .getBase64('image/jpeg', (err,base64data) => {
                            this.worker.recognize(
                                base64data,
                                'eng'
                            ).then(({ data: { text } }) => {
                                console.log(1)
                                return resolve({text, base64data});
                            })
                        });
                });
            })
        }
    }
});

const createTesseractStore = () => tesseractStore();

export default createTesseractStore;