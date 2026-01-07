# 🚀 BriTunes - Super Simple Setup

## ✨ **NO API KEYS REQUIRED!**

BriTunes now uses **100% FREE APIs** that require no registration or API keys!

- ✅ **Deezer API** - Millions of songs, completely free
- ✅ **AudioDB** - Artist information, free tier
- ✅ **No signup needed** - Just run and go!

---

## Quick Start (3 Steps!)

### 1️⃣ Install Dependencies
```bash
npm run install-all
```

### 2️⃣ Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and set your JWT secret (any random string):
```env
JWT_SECRET=mySecretKey123
MONGODB_URI=mongodb://localhost:27017/britunes
```

**That's it! No API keys needed!**

### 3️⃣ Run the App
```bash
# Make sure MongoDB is running first
mongod

# In another terminal, run:
npm run dev:full
```

Open **http://localhost:3000** 🎵

---

## What Changed?

### ❌ Before (Required Spotify API)
- Had to register for Spotify Developer account
- Wait for approval
- Get Client ID and Secret
- Configure API keys

### ✅ Now (100% Free APIs)
- **No registration needed**
- **No API keys required**
- **No waiting or approval**
- **Just install and run!**

---

## Music APIs Used

### 🎵 Deezer API
- **Free:** ✅ Yes, completely free
- **Registration:** ❌ Not required
- **API Key:** ❌ Not required
- **Catalog:** 90+ million tracks
- **Features:** Search, albums, artists, recommendations

### 🎤 AudioDB (Optional)
- **Free:** ✅ Yes, free tier available
- **API Key:** Uses public test key by default
- **Features:** Enhanced artist information

---

## Full Feature List

✅ Search millions of songs, artists, and albums
✅ View artist pages with discography
✅ Create and manage playlists
✅ Get personalized recommendations
✅ Follow your favorite artists
✅ User authentication and profiles
✅ Beautiful blue/black modern UI
✅ Fully responsive design

---

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### "Port 5000 already in use"
```bash
# Kill the process
lsof -ti:5000 | xargs kill -9
```

### "No music showing up"
- Check your internet connection
- The Deezer API is free and has no quotas
- No API keys are needed!

---

## What You Can Do

### 🔍 Search
Search for any song, artist, or album from Deezer's massive catalog

### 👤 Artists
- View artist profiles
- See their top tracks
- Browse their albums
- Follow/unfollow artists

### 📚 Playlists
- Create unlimited playlists
- Add/remove songs
- Get smart recommendations

### 🎲 Discover
- Browse new releases
- Get personalized recommendations
- Explore trending music

---

## Next Steps

1. **Customize** - Make it your own!
2. **Deploy** - Check DEPLOYMENT.md for production setup
3. **Extend** - Add more features!

---

## Why This Is Better

### Free Forever
- No subscription fees
- No API quotas
- No rate limiting for basic use
- No credit card required

### Easy Setup
- 3 steps to get running
- No external account creation
- No API key management
- Just code and go!

### Full Features
- Complete music catalog
- All features work
- High-quality data
- Regular updates

---

## Support

Need help? Check these files:
- **README.md** - Full documentation
- **QUICKSTART.md** - Quick reference
- **DEPLOYMENT.md** - Deploy to production

---

**Ready to start streaming! 🎵**

No API keys. No hassle. Just music.

---

Built with ❤️ using free and open APIs
