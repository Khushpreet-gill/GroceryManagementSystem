
import { Router } from 'express';
import { signUpController, signInController, signOutController } from '../controllers/authController';
import { validateSignUp, validateSignIn } from '../utils/validation';

const router = Router();

router.post('/signup', validateSignUp, signUpController);
router.post('/signin', validateSignIn, signInController);
router.post('/signout', signOutController);

export default router;
