# API Documentation

## Base URL
```
http://localhost:5000/api
```

All API requests require authentication except for `/auth/register` and `/auth/login`.

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "token": "jwt_token_here"
}
```

### Login
**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "token": "jwt_token_here"
}
```

### Get Current User
**GET** `/auth/me`

Get currently authenticated user information.

**Response:**
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "followedArtists": [],
  "notifications": []
}
```

## Music

### Search
**GET** `/music/search`

Search for tracks, artists, and albums.

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): `track,artist,album` (default: all)
- `limit` (optional): Number of results (default: 20)

**Example:**
```
GET /music/search?q=taylor%20swift&type=track&limit=10
```

**Response:**
```json
{
  "tracks": {
    "items": [...]
  },
  "artists": {
    "items": [...]
  },
  "albums": {
    "items": [...]
  }
}
```

### Get Track
**GET** `/music/track/:id`

Get detailed information about a track.

**Response:**
```json
{
  "id": "track_id",
  "name": "Track Name",
  "artists": [...],
  "album": {...},
  "duration_ms": 240000
}
```

### Get Recommendations
**GET** `/music/recommendations`

Get song recommendations.

**Query Parameters:**
- `seed_tracks`: Comma-separated track IDs
- `seed_artists`: Comma-separated artist IDs
- `limit`: Number of recommendations

**Example:**
```
GET /music/recommendations?seed_tracks=track1,track2&limit=20
```

### Get New Releases
**GET** `/music/new-releases`

Get latest album releases.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)

## Artists

### Get Artist
**GET** `/artists/:id`

Get artist information.

**Response:**
```json
{
  "id": "artist_id",
  "name": "Artist Name",
  "genres": ["pop", "rock"],
  "followers": {
    "total": 1000000
  },
  "images": [...]
}
```

### Get Artist Albums
**GET** `/artists/:id/albums`

Get artist's albums.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)

### Get Artist Top Tracks
**GET** `/artists/:id/top-tracks`

Get artist's most popular tracks.

**Response:**
```json
{
  "tracks": [...]
}
```

### Follow Artist
**POST** `/artists/:id/follow`

Follow an artist.

**Response:**
```json
{
  "message": "Successfully followed artist",
  "artist": {
    "id": "artist_id",
    "name": "Artist Name",
    "image": "image_url"
  }
}
```

### Unfollow Artist
**DELETE** `/artists/:id/follow`

Unfollow an artist.

### Get Followed Artists
**GET** `/artists/followed/list`

Get list of followed artists.

**Response:**
```json
[
  {
    "artistId": "artist_id",
    "artistName": "Artist Name",
    "artistImage": "image_url",
    "followedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Playlists

### Create Playlist
**POST** `/playlists`

Create a new playlist.

**Request Body:**
```json
{
  "name": "My Playlist",
  "description": "My favorite songs",
  "isPublic": true,
  "coverImage": "image_url"
}
```

### Get User Playlists
**GET** `/playlists`

Get all playlists for authenticated user.

### Get Playlist
**GET** `/playlists/:id`

Get specific playlist details.

### Update Playlist
**PUT** `/playlists/:id`

Update playlist information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Playlist
**DELETE** `/playlists/:id`

Delete a playlist.

### Add Track to Playlist
**POST** `/playlists/:id/tracks`

Add a track to playlist.

**Request Body:**
```json
{
  "trackId": "spotify_track_id",
  "trackName": "Track Name",
  "artistName": "Artist Name",
  "albumName": "Album Name",
  "duration": 240000,
  "imageUrl": "image_url"
}
```

### Remove Track from Playlist
**DELETE** `/playlists/:id/tracks/:trackId`

Remove a track from playlist.

### Get Playlist Recommendations
**GET** `/playlists/:id/recommendations`

Get song recommendations based on playlist content.

## Users

### Get Profile
**GET** `/users/profile`

Get user profile.

### Update Profile
**PUT** `/users/profile`

Update user profile.

**Request Body:**
```json
{
  "displayName": "New Display Name",
  "profileImage": "new_image_url"
}
```

### Get Notifications
**GET** `/users/notifications`

Get user notifications.

**Response:**
```json
[
  {
    "_id": "notification_id",
    "type": "new_release",
    "artistId": "artist_id",
    "artistName": "Artist Name",
    "message": "New release from Artist Name",
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Mark Notification as Read
**PUT** `/users/notifications/:id/read`

Mark a notification as read.

### Add to Listening History
**POST** `/users/listening-history`

Add a track to listening history.

**Request Body:**
```json
{
  "trackId": "track_id",
  "trackName": "Track Name",
  "artistName": "Artist Name"
}
```

### Get Listening History
**GET** `/users/listening-history`

Get user's listening history.

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Error message here"
}
```

**401 Unauthorized**
```json
{
  "error": "Not authorized, no token"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Server error message"
}
```
