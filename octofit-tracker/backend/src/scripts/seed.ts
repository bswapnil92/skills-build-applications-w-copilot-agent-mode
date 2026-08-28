import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Alex Johnson', email: 'alex@example.com', fitnessLevel: 'intermediate' },
      { name: 'Jordan Lee', email: 'jordan@example.com', fitnessLevel: 'beginner' },
      { name: 'Taylor Smith', email: 'taylor@example.com', fitnessLevel: 'advanced' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Trail Blazers', memberIds: [users[0]._id, users[1]._id] },
      { name: 'Peak Performers', memberIds: [users[2]._id] },
    ]);

    await Activity.insertMany([
      { userId: users[0]._id, type: 'running', durationMinutes: 30, points: 45 },
      { userId: users[1]._id, type: 'walking', durationMinutes: 45, points: 30 },
      { userId: users[2]._id, type: 'strength training', durationMinutes: 40, points: 55 },
    ]);

    await Leaderboard.insertMany([
      { userId: users[0]._id, teamId: teams[0]._id, points: 245, period: '2026-08' },
      { userId: users[1]._id, teamId: teams[0]._id, points: 180, period: '2026-08' },
      { userId: users[2]._id, teamId: teams[1]._id, points: 320, period: '2026-08' },
    ]);

    await Workout.insertMany([
      {
        title: 'Starter Cardio Circuit',
        description: 'A low-impact circuit to build endurance.',
        fitnessLevel: 'beginner',
        durationMinutes: 20,
      },
      {
        title: 'Strength Builder',
        description: 'A full-body strength session using bodyweight exercises.',
        fitnessLevel: 'intermediate',
        durationMinutes: 35,
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
