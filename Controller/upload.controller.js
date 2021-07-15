const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class UploadController {
    async uploadImage(req, res) {
        try {
            const file = req.files.file;
            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'toho',
                },
                (err, result) => {
                    if (err) throw err;
                    removeTempFile(file.tempFilePath); // xoa file trong folder tmp
                    return res.json({
                        avatar: {
                            public_id: result.public_id,
                            url: result.secure_url,
                        },
                    });
                },
            );
        } catch (err) {
            if (err) return res.status(500).json({ msg: err.message });
        }
    }

    async destroyImage(req, res) {
        try {
            const { public_id } = req.body;
            if (!public_id)
                res.status(400).json({ err: 'Image not found' });
            cloudinary.v2.uploader.destroy(public_id, (err) => {
                if (err) throw err;
                return res.json({ msg: 'Delete Image successfully' });

            })
        } catch (err) {
            return res.json({ msg: 'Delete Image fail' });
        }
    }
}

const removeTempFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) throw err;
    });
};

module.exports = new UploadController();