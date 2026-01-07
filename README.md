# BriTunes
BriTunes is a advanced music web platform with millions of songs and artistd with the best updates out there! So Bri prepared to Tune in! ( Bri Pronounciation: "Bree like Bee, but with the R")


## This site is starting its development process on January 7th, 2026 Will be posted with updates every 2 Days on this Repository # BriTunes 🎵

> **🚀 NEW: Now uses 100% FREE APIs - No API keys required!**

A modern, sleek music streaming web application with a blue and black color scheme. BriTunes provides a comprehensive music experience with millions of songs via the free Deezer API - no registration or API keys needed!

## ✨ Quick Start - 3 Steps!

1. **Install:** `npm run install-all`
2. **Configure:** `cp .env.example .env` (just set a JWT secret)
3. **Run:** `npm run dev:full`

**That's it!** Open http://localhost:3000 🎵

👉 **See [EASY_SETUP.md](EASY_SETUP.md) for the simplest guide**

## Features

### 🎶 Core Features
- **Extensive Song Library**: Access to millions of songs via Spotify API integration
- **User Authentication**: Secure registration and login system
- **Artist Pages**: Dedicated pages showcasing artist profiles, discographies, and latest releases
- **Advanced Search**: Search for any song, artist, or album effortlessly
- **Follow System**: Follow your favorite artists and receive notifications for new releases
- **Playlist Management**: Create, edit, and manage custom playlists
- **Song Recommendations**: Get personalized song suggestions based on listening history
- **User Profiles**: Customizable user profiles with listening statistics

### 🎨 Design
- Sleek, modern UI with blue and black color scheme
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Intuitive navigation

## Tech Stack

### Backend
- **Node.js** & **Express**: Server and API
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Axios**: HTTP client for Spotify API

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Axios**: API requests
- **React Icons**: Icon library

### APIs
- **Deezer API**: Music data (100% FREE - no API key required!)
- **AudioDB API**: Artist information (FREE tier available)

## Project Structure

```
BriTunes/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   └── Playlist.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── music.js
│   │   ├── artists.js
│   │   └── playlists.js
│   ├── services/
│   │   └── spotifyService.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── TrackCard.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Search.js
│   │   │   ├── Artist.js
│   │   │   ├── Library.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- **No API keys required!** All music APIs are free and ready to use

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BriTunes
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGDB_URI=mongodb://localhost:27017/britunes
JWT_SECRET=your_secure_jwt_secret_here
# Music APIs - All FREE!
AUDIODB_API_KEY=2
CLIENT_URL=http://localhost:3000
```

**Note:** No API keys required! The app uses free Deezer API which needs no registration.

### 3. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas by updating the `MONGODB_URI` in `.env`

### 5. Run the Application

#### Development Mode (Both server and client)
```bash
npm run dev:full
```

#### Or run separately:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Music
- `GET /api/music/search` - Search for music
- `GET /api/music/track/:id` - Get track details
- `GET /api/music/album/:id` - Get album details
- `GET /api/music/recommendations` - Get recommendations
- `GET /api/music/new-releases` - Get new releases

### Artists
- `GET /api/artists/:id` - Get artist details
- `GET /api/artists/:id/albums` - Get artist albums
- `GET /api/artists/:id/top-tracks` - Get artist top tracks
- `POST /api/artists/:id/follow` - Follow an artist
- `DELETE /api/artists/:id/follow` - Unfollow an artist
- `GET /api/artists/followed/list` - Get followed artists

### Playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track from playlist
- `GET /api/playlists/:id/recommendations` - Get playlist recommendations

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/notifications` - Get notifications
- `PUT /api/users/notifications/:id/read` - Mark notification as read
- `POST /api/users/listening-history` - Add to listening history
- `GET /api/users/listening-history` - Get listening history

## Features in Detail

### User Authentication
- Secure registration with password hashing (bcrypt)
- JWT-based authentication
- Protected routes and API endpoints

### Artist Following & Notifications
- Follow/unfollow artists
- Automatic notifications for new releases (backend infrastructure ready)
- View followed artists list

### Playlist Management
- Create custom playlists
- Add/remove songs
- Edit playlist details
- Get song recommendations based on playlist content

### Search Functionality
- Search across tracks, artists, and albums
- Tabbed results interface
- Real-time search with Spotify API

### Recommendations
- Personalized song suggestions
- Based on listening history and playlist content
- Powered by Spotify's recommendation engine

## Future Enhancements

- [ ] Audio playback integration
- [ ] Social features (share playlists, follow users)
- [ ] Real-time notifications using WebSockets
- [ ] Lyrics integration
- [ ] Queue management
- [ ] Offline mode with service workers
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Deezer API](https://developers.deezer.com/) for free music data
- [AudioDB](https://www.theaudiodb.com/) for artist information
- React community for excellent documentation
- All contributors and supporters

## Support

For support, email support@britunes.com or open an issue in the repository.

---

Built with ❤️ by the BriTunes Team file! Planning to push out the finished site on Febuary 20th, 2026.
