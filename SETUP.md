# BriTunes Setup Guide

## Quick Start

Follow these steps to get BriTunes running on your local machine.

### Step 1: Install Dependencies

```bash
# Install all dependencies (server + client)
npm run install-all
```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Get your Spotify API credentials:
   - Visit https://developer.spotify.com/dashboard
   - Log in with your Spotify account
   - Click "Create an App"
   - Fill in the app name and description
   - Copy your Client ID and Client Secret

3. Update your `.env` file:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
JWT_SECRET=generate_a_random_secret_key
MONGODB_URI=mongodb://localhost:27017/britunes
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

### Step 4: Run the Application

**Development mode (both server and client):**
```bash
npm run dev:full
```

**Or run separately:**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 5: Create an Account

1. Open http://localhost:3000 in your browser
2. Click "Register" 
3. Fill in your details
4. Start exploring!

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGODB_URI in .env
- Verify MongoDB is accessible on the specified port

### Spotify API Errors
- Verify your Client ID and Client Secret are correct
- Make sure there are no extra spaces in .env file
- Check that your Spotify app is not in development mode restrictions

### Port Already in Use
```bash
# Change the PORT in .env to a different number
PORT=5001
```

### Dependencies Installation Failed
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules client/node_modules
npm run install-all
```

## Development Tips

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Formatting
- Use consistent indentation (2 spaces)
- Follow React best practices
- Keep components modular and reusable

### Database Management
```bash
# Access MongoDB shell
mongosh

# Use britunes database
use britunes

# View collections
show collections

# Query users
db.users.find()
```

## Next Steps

After setup:
1. Explore the search functionality
2. Follow some artists
3. Create your first playlist
4. Customize your profile

Enjoy BriTunes! 🎵
