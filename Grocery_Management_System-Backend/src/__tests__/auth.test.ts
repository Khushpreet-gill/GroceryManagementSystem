import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import User from '../models/userModel';
import Blacklist from '../models/blacklistModel';
import { generateToken } from '../utils/jwtUtils';

describe('AuthController', () => {
  describe('POST /signup', () => {
    it('should sign up a new user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
    },10000);

    it('should not sign up an existing user', async () => {
      await new User({ username: 'testuser', email: 'test@example.com', password: 'password123' }).save();

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Sign Up Error: User already exists');
    });
  });

  describe('POST /signin', () => {
    it('should sign in an existing user and return a token', async () => {
      const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();

      const response = await request(app)
        .post('/api/auth/signin')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should not sign in with invalid credentials', async () => {
      const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();

      const response = await request(app)
        .post('/api/auth/signin')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Sign In Error: Invalid credentials');
    });
  });

  describe('POST /signout', () => {
    it('should sign out a user and blacklist the token', async () => {
      const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();

      const token = generateToken(user._id as string);

      const response = await request(app)
        .post('/api/auth/signout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sign out successful');

      const blacklistedToken = await Blacklist.findOne({ token });
      expect(blacklistedToken).toBeDefined();
    });

    it('should not sign out without a token', async () => {
      const response = await request(app).post('/api/auth/signout');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No token provided');
    });
  });
});
