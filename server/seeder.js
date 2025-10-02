const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load Mongoose Models
const User = require('./models/User');
const Community = require('./models/Community');
const Post = require('./models/Post');

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// --- DATA TO BE SEEDED ---

// ... (imports)

// --- DATA TO BE SEEDED (CORRECTED) ---

const sampleImages = [
  { publicId: 'samples/landscapes/beach-boat.jpg', resourceType: 'image' },
  { publicId: 'samples/animals/cat.jpg', resourceType: 'image' },
  { publicId: 'samples/ecommerce/car-interior-design.jpg', resourceType: 'image' },
  { publicId: 'samples/landscapes/girl-urban-view.jpg', resourceType: 'image' },
];

const sampleVideos = [
  { publicId: 'samples/cld-sample-video.mp4', resourceType: 'video' },
  { publicId: 'samples/sea-turtle.mp4', resourceType: 'video' },
  { publicId: 'samples/elephants.mp4', resourceType: 'video' },
];

// ... (the rest of the seeder file is the same)


// --- IMPORT DATA FUNCTION ---
const importData = async () => {
  try {
    // Clear existing data first
    await Post.deleteMany();
    await Community.deleteMany();
    await User.deleteMany();

    // --- Create Users ---
    const createdUsers = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // New Syntax
    for (let i = 0; i < 5; i++) {
    const user = await User.create({
        username: faker.person.lastName().toLowerCase() + faker.number.int({min: 10, max: 99}), // Use person.lastName and add a number
        email: faker.internet.email().toLowerCase(), 
        password: hashedPassword,
    });
    createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users created.`);

    // --- Create Communities ---
    const createdCommunities = [];
    const communityNames = ['TechTalk', 'FunnyFails', 'GamingGurus', 'Foodies', 'TravelVibes'];
    
    for (const name of communityNames) {
      const community = await Community.create({
        name,
        creator: createdUsers[0]._id, // First user creates all communities
        members: createdUsers.map(u => u._id), // All users are members
      });
      createdCommunities.push(community);
    }
    console.log(`${createdCommunities.length} communities created.`);

    // --- Create Posts ---
    const createdPosts = [];
    for (let i = 0; i < 20; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomCommunity = createdCommunities[Math.floor(Math.random() * createdCommunities.length)];
      
      let postData = {
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(2),
        author: randomUser._id,
        community: randomCommunity._id,
      };
      
      // Randomly add an image or video to some posts
      if (Math.random() > 0.6) { // ~40% of posts will have media
        if (Math.random() > 0.3) { // Image is more likely
          const media = sampleImages[Math.floor(Math.random() * sampleImages.length)];
          // --- VERIFY THESE PROPERTY NAMES ---
          postData.mediaPublicId = media.publicId;
          postData.mediaType = media.resourceType;
        } else {
          const media = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
          // --- VERIFY THESE PROPERTY NAMES ---
          postData.mediaPublicId = media.publicId;
          postData.mediaType = media.resourceType;
        }
      }

      createdPosts.push(postData);
    }
    await Post.insertMany(createdPosts);
    console.log(`${createdPosts.length} posts created.`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};


// --- DESTROY DATA FUNCTION ---
const destroyData = async () => {
  try {
    await Post.deleteMany();
    await Community.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

// --- SCRIPT EXECUTION LOGIC ---
const runSeeder = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
};

runSeeder();