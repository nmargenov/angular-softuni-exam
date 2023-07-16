const multer = require('multer');
const { promisify } = require('util');

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/profilePictures');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const profileUpload = multer({ storage: profilePictureStorage, fileFilter: fileFilter }).single('profilePicture');


exports.editPublicProfileData = async (req, res) => {
        const uploadPromise = promisify(profileUpload);
        await uploadPromise(req, res);

        if(req.file){
            return { image: req.file.path, bio: req.body.bio, username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName };
        }else{
            return { bio: req.body.bio, username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName };
        }

};
