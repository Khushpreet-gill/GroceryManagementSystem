import { body, validationResult } from 'express-validator';

export const validateSignUp = [
  body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateSignIn = [
  body('username').not().isEmpty().withMessage('Username is required'),
  body('password').not().isEmpty().withMessage('Password is required'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
