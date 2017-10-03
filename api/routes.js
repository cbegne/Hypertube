import * as user from './controllers/user';
import * as movie from './controllers/movie';
import * as connect from './controllers/connect'; // signup signin
import * as picture from './controllers/picture';
import * as search from './controllers/search';
import getStream from './controllers/stream/streamer';

const routes = async (app, passport, upload) => {
  /**
   * Primary app routes.
   */

  app.post('/api/signin', connect.postSignin);
  app.post('/api/signup/info', connect.postSignup);
  app.post('/api/signup/upload', upload.single('imageUploaded'), picture.postSignupPicture);
  app.post('/api/forgot', user.postForgot); // not implemented front-end
  app.post('/api/reset/:token', user.postReset); // not implemented front-end

  app.get('/api/movie/stream/:hash', getStream);

  // Logged part  ====================
  app.use(passport.authenticate('jwt', { session: false }));

  app.get('/api/me', user.getMyAccount);
  app.post('/api/me', user.postUpdateProfile);
  app.delete('/api/me', user.deleteDeleteAccount);
  app.post('/api/me/password', user.postUpdatePassword);
  app.post('/api/profile_pic', upload.single('imageUploaded'), picture.newPicture);
  app.get('/api/profile/:id', user.getAccount);
  app.get('/api/movie/info/:idImdb', movie.getInfos);

  // not implemented
  app.get('/api/gallery/search', search.getSearch);

  /**
   * OAuth authentication routes. (Sign in)
   */
  app.get('/api/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });
};

export default routes;