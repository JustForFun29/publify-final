import { body } from "express-validator";

export const registerValidation = [
  body("email", 'Incorrect email format').isEmail(),
  body("password", 'Password must be at least 5 symbols').isLength({ min: 5 }),
  body("fullName", 'Write down your name (at least 3 symbols)').isLength({ min: 3 }),
  body("avatarUrl",'Incorrect image URL').optional().isURL(),
];

export const loginValidation = [
  body("email", 'Incorrect email format').isEmail(),
  body("password", 'Password must be at least 5 symbols').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body("title", 'Enter title of the post').isLength({ min: 3}).isString(),
  body("text", 'Enter text of the post').isLength({ min: 10 }).isString(),
  body("tags", 'Incorrect tag format').optional().isString(),
  body("imageUrl",'Incorrect image URL').optional().isString(),
];