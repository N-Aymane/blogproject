import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      // process.env.JWT_SECRET
      "093c5675ee26081b9b86a85f1c070e05c3fe3b4bd95dd2b54f662b9c1c56b2cb51b9eb988fc340e225a65db398e647f51b868eec847598e97c96ae830cc48c744d8bb44f5e0e7de2c5c7b639c74663c0a421e6ccd95e11e9d5e3fa1be52e983c813e04f6f2bbcbda75243db0cdc64429d7c97ff0147b0805a788b2f5211ea559856ae83eb28eac27656a7bd5caad68be1ede50aa23586061947e192a79752d940bcd6e2e2660b5e0100c6399d3f79dc0185d9efcc384c5707301602a2809afc23984f92a1d2950c13eaa65fc9eaa87e75104022bcc3fdeb72365f881f53e3126fbb50adfb6954ad9e4d91af07a8588df9f13927b78fba2e45e47e97205e23765"
    );


    // const token ="1234567890";
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        // process.env.JWT_SECRET
        "093c5675ee26081b9b86a85f1c070e05c3fe3b4bd95dd2b54f662b9c1c56b2cb51b9eb988fc340e225a65db398e647f51b868eec847598e97c96ae830cc48c744d8bb44f5e0e7de2c5c7b639c74663c0a421e6ccd95e11e9d5e3fa1be52e983c813e04f6f2bbcbda75243db0cdc64429d7c97ff0147b0805a788b2f5211ea559856ae83eb28eac27656a7bd5caad68be1ede50aa23586061947e192a79752d940bcd6e2e2660b5e0100c6399d3f79dc0185d9efcc384c5707301602a2809afc23984f92a1d2950c13eaa65fc9eaa87e75104022bcc3fdeb72365f881f53e3126fbb50adfb6954ad9e4d91af07a8588df9f13927b78fba2e45e47e97205e23765"
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
