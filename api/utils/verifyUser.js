import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'no token provided'));
  }
  jwt.verify(token, "093c5675ee26081b9b86a85f1c070e05c3fe3b4bd95dd2b54f662b9c1c56b2cb51b9eb988fc340e225a65db398e647f51b868eec847598e97c96ae830cc48c744d8bb44f5e0e7de2c5c7b639c74663c0a421e6ccd95e11e9d5e3fa1be52e983c813e04f6f2bbcbda75243db0cdc64429d7c97ff0147b0805a788b2f5211ea559856ae83eb28eac27656a7bd5caad68be1ede50aa23586061947e192a79752d940bcd6e2e2660b5e0100c6399d3f79dc0185d9efcc384c5707301602a2809afc23984f92a1d2950c13eaa65fc9eaa87e75104022bcc3fdeb72365f881f53e3126fbb50adfb6954ad9e4d91af07a8588df9f13927b78fba2e45e47e97205e23765", (err, user) => {
    if (err) {
      return next(errorHandler(401, 'you are not authorized to access'));
    }
    req.user = user;
    next();
  });
};
