// MongoDB initialization script
db = db.getSiblingDB('taskify');

// Create collections
db.createCollection('users');
db.createCollection('todos');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.todos.createIndex({ "userId": 1 });
db.todos.createIndex({ "createdAt": -1 });

print('MongoDB initialized successfully'); 