# BriTunes - Quick Reference

## Starting the Application

### Development
```bash
# Start both server and client
npm run dev:full

# Or separately:
npm run dev        # Backend only
npm run client     # Frontend only
```

### Production
```bash
npm start
```

## Key URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Default Credentials

Create your own account at the registration page. There are no default credentials.

## Common Commands

### Install Dependencies
```bash
npm run install-all
```

### Build Client
```bash
npm run build
```

### Clear Cache
```bash
npm cache clean --force
rm -rf node_modules client/node_modules
npm run install-all
```

## File Structure Quick Reference

```
BriTunes/
├── server/              # Backend code
│   ├── config/         # Database config
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Auth, etc.
│   └── index.js        # Server entry
├── client/             # Frontend code
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   └── App.js      # Main app component
│   └── public/         # Static files
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Environment Variables

Required in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/britunes
JWT_SECRET=your_secret_here
# Optional - Free APIs
AUDIODB_API_KEY=2
CLIENT_URL=http://localhost:3000
```

**Note:** No API keys required! Uses free Deezer API.

## API Quick Reference

### Authentication
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Music
- GET `/api/music/search?q=query` - Search
- GET `/api/music/track/:id` - Get track
- GET `/api/music/recommendations` - Get recommendations

### Artists
- GET `/api/artists/:id` - Get artist
- POST `/api/artists/:id/follow` - Follow artist
- GET `/api/artists/followed/list` - Get followed

### Playlists
- POST `/api/playlists` - Create playlist
- GET `/api/playlists` - Get user playlists
- POST `/api/playlists/:id/tracks` - Add track

## Color Scheme

### Primary Colors
- Primary Blue: `#2563eb`
- Dark Blue: `#1d4ed8`
- Purple Accent: `#7c3aed`
- Black Background: `#000000`
- Dark Navy: `#0a1929`

### UI Elements
- Card Background: `rgba(255, 255, 255, 0.05)`
- Border: `rgba(255, 255, 255, 0.1)`
- Text: `#ffffff`
- Secondary Text: `rgba(255, 255, 255, 0.6)`

## React Router Paths

- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/search` - Search page
- `/artist/:id` - Artist page
- `/library` - User's library
- `/profile` - User profile

## MongoDB Setup

### Local MongoDB
```bash
mongod
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Troubleshooting

### Port in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB not connecting
```bash
# Check if MongoDB is running
ps aux | grep mongod
```

### Music API errors
- Deezer API is free and requires no authentication
- Check internet connection
- No API quotas to worry about!

## Features Checklist

✅ User authentication
✅ Search functionality
✅ Artist pages
✅ Follow artists
✅ Create playlists
✅ Add songs to playlists
✅ Song recommendations
✅ User profiles
✅ Responsive design
✅ Modern UI/UX

## Tech Stack Summary

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT
**Frontend:** React 18, React Router, Axios
**APIs:** Deezer API (Free), AudioDB (Free)
**Styling:** Custom CSS with blue/black theme

## Getting Help

1. Check documentation files:
   - README.md - Overview
   - SETUP.md - Setup guide
   - API.md - API documentation
   - DEPLOYMENT.md - Deployment guide

2. Common issues:
   - MongoDB connection
   - Spotify API credentials
   - Port conflicts
   - Missing dependencies

3. Resources:
   - Deezer API Docs: https://developers.deezer.com/api
   - React Docs: https://react.dev/
   - Express Docs: https://expressjs.com/
   - MongoDB Docs: https://docs.mongodb.com/

## Version Info

- Node.js: 14+
- React: 18.2.0
- MongoDB: Latest
- Spotify API: v1

---

For detailed documentation, see README.md and other docs files.
