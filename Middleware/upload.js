import multer from "multer";

// setting up multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-picture')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now()+'--'+file.originalname)
    }
})

export const upload = multer({ storage: storage })