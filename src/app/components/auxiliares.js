
import sharp from 'sharp';

class AuxiliaresController {

    async resizeBase64({ base64Image, maxHeight = 640, maxWidth = 800 }) {
        const destructImage = base64Image.split(";");
        const mimType = destructImage[0].split(":")[1];
        const imageData = destructImage[1].split(",")[1];

        try {
            let resizedImage = Buffer.from(imageData, "base64")
            resizedImage = await sharp(resizedImage).jpeg({ quality: 100, progressive: true }).resize({ fit: 'contain', width: maxWidth }).withMetadata().toBuffer()
            var newImage = `data:${mimType};base64,${resizedImage.toString("base64")}`;
            return newImage;
        } catch (error) {
            return ''
        }
    }

}

export default new AuxiliaresController()