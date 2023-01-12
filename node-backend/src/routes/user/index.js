/* eslint-disable prettier/prettier */
const { Router } = require('express');
const authController = require('../../controllers/auth');
const auth = require('../../middlewares/authMiddleware');

const multer = require('multer');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an image! Please upload only images', 400), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.patch(
  '/update-user',
  auth,
  upload.single('profile_pic'),
  authController.updateUserProfile
);
// router.post('/forgetpassword', authController.forgetpassword_post);
//router.patch('/resetpassword', authController.resetpassword_patch);

module.exports = router;
