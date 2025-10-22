// Alternative approach: Seed database with test users
const TEST_USERS = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'user@test.com', 
    password: 'user123',
    name: 'Regular User',
    role: 'user'
  },
  {
    email: 'premium@test.com',
    password: 'premium123', 
    name: 'Premium User',
    role: 'premium'
  }
];

// Function to seed database with test users
async function seedTestUsers() {
  // This would connect to your database and create test users
  // Implementation depends on your database setup
  console.log('Seeding database with test users...');
  
  // Example for Firebase/Firestore:
  // const { initializeApp } = require('firebase/app');
  // const { getFirestore, collection, addDoc } = require('firebase/firestore');
  // 
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  // 
  // for (const user of TEST_USERS) {
  //   await addDoc(collection(db, 'users'), user);
  // }
}

module.exports = {
  TEST_USERS,
  seedTestUsers
};
