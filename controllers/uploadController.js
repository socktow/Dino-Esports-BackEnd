const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary using CLOUDINARY_URL
cloudinary.config();

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tournament',
        format: 'webp',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: "auto" }]
    }
});

const upload = multer({ storage: storage });

// Upload image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
};

module.exports = {
    upload,
    uploadImage,
}; 