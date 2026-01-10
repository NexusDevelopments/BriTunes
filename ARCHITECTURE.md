# BriTunes Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BRITUNES APPLICATION                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────── UI LAYER ────────────────────────────────────┐
│                                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   TopNav        │  │  LibrarySidebar │  │    Queue        │                 │
│  │  (Navigation)   │  │  (Playlists,    │  │  (Track List)   │                 │
│  └─────────────────┘  │   Albums,       │  └─────────────────┘                 │
│                       │   Artists)      │                                       │
│  ┌─────────────────┐  └─────────────────┘  ┌─────────────────┐                 │
│  │   MainLayout    │                       │  NowPlaying     │                 │
│  │  (Container)    │  ┌─────────────────┐  │  (Full View)    │                 │
│  └─────────────────┘  │  MusicPlayer    │  └─────────────────┘                 │
│                       │  (Bottom Bar)   │                                       │
│  ┌─────────────────┐  └─────────────────┘  ┌─────────────────┐                 │
│  │   HomePage      │                       │ DeviceSelector  │                 │
│  │  (Feed)         │  ┌─────────────────┐  │ (Devices)       │                 │
│  └─────────────────┘  │ PlaybackControls│  └─────────────────┘                 │
│                       │ ProgressBar     │                                       │
│  ┌─────────────────┐  │ VolumeControl   │  ┌─────────────────┐                 │
│  │  SearchPage     │  └─────────────────┘  │  TrackList      │                 │
│  │  (Search)       │                       │  (Reusable)     │                 │
│  └─────────────────┘  ┌─────────────────┐  └─────────────────┘                 │
│                       │   MediaCard     │                                       │
│  ┌─────────────────┐  │   (Reusable)    │  ┌─────────────────┐                 │
│  │   Browse        │  └─────────────────┘  │ LoadingSpinner  │                 │
│  │  (Categories)   │                       │ ErrorMessage    │                 │
│  └─────────────────┘  ┌─────────────────┐  └─────────────────┘                 │
│                       │  AlbumDetail    │                                       │
│  ┌─────────────────┐  │  ArtistDetail   │                                       │
│  │   Library       │  │  PlaylistDetail │                                       │
│  │  (Collections)  │  └─────────────────┘                                       │
│  └─────────────────┘                                                            │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── STATE MANAGEMENT (Redux) ──────────────────────────┐
│                                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth       │  │   Spotify    │  │   Player     │  │   Queue      │        │
│  │  Slice       │  │   Slice      │  │   Slice      │  │   Slice      │        │
│  │              │  │              │  │              │  │              │        │
│  │ - user       │  │ - state      │  │ - isPlaying  │  │ - queue[]    │        │
│  │ - token      │  │ - devices    │  │ - volume     │  │ - current    │        │
│  │ - loading    │  │ - active     │  │ - shuffle    │  └──────────────┘        │
│  │ - error      │  │ - liked      │  │ - repeat     │                          │
│  └──────────────┘  │ - current    │  └──────────────┘  ┌──────────────┐        │
│                    └──────────────┘                    │   Library    │        │
│  ┌──────────────┐                    ┌──────────────┐  │   Slice      │        │
│  │     UI       │                    │ Redux Store  │  │              │        │
│  │   Slice      │                    │   + Persist  │  │ - playlists  │        │
│  │              │                    └──────────────┘  │ - albums     │        │
│  │ - sidebar    │                                      │ - artists    │        │
│  │ - queue      │                                      │ - liked      │        │
│  │ - nowPlaying │                                      └──────────────┘        │
│  │ - devices    │                                                               │
│  │ - fullscreen │                                                               │
│  └──────────────┘                                                               │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── SERVICES LAYER ───────────────────────────────────┐
│                                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │   spotifyAPI.js      │  │  playerService.js    │  │  searchService.js    │  │
│  │                      │  │                      │  │                      │  │
│  │ - search()           │  │ - initializePlayer() │  │ - searchAll()        │  │
│  │ - getPlaylists()     │  │ - play()             │  │ - searchTracks()     │  │
│  │ - getAlbum()         │  │ - pause()            │  │ - searchAlbums()     │  │
│  │ - getArtist()        │  │ - togglePlay()       │  │ - searchArtists()    │  │
│  │ - getTracks()        │  │ - nextTrack()        │  │ - searchPlaylists()  │  │
│  │ - saveTracks()       │  │ - previousTrack()    │  └──────────────────────┘  │
│  │ - getUserTop()       │  │ - seek()             │                             │
│  │ - getRecommended()   │  │ - setVolume()        │                             │
│  │ - getFeatured()      │  │ - getCurrentState()  │                             │
│  │ - getCategories()    │  │ - disconnect()       │                             │
│  │ - getDevices()       │  └──────────────────────┘                             │
│  │ - transferPlayback() │                                                        │
│  │ - addToQueue()       │                                                        │
│  └──────────────────────┘                                                        │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────── HOOKS & UTILS ───────────────────────────────────┐
│                                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │ useSpotifyAuth() │  │   usePlayer()    │  │        helpers.js            │  │
│  │                  │  │                  │  │                              │  │
│  │ - token          │  │ - currentTime    │  │ - formatDuration()           │  │
│  │ - login()        │  │ - duration       │  │ - formatTime()               │  │
│  │ - logout()       │  │ - isPlaying      │  │ - formatNumber()             │  │
│  └──────────────────┘  │ - volume         │  │ - formatDate()               │  │
│                        │ - play()         │  │ - getGreeting()              │  │
│  ┌──────────────────┐  │ - pause()        │  │ - shuffleArray()             │  │
│  │  constants.js    │  │ - togglePlay()   │  │ - debounce()                 │  │
│  │                  │  │ - next()         │  └──────────────────────────────┘  │
│  │ - COLORS         │  │ - previous()     │                                     │
│  │ - BREAKPOINTS    │  │ - seek()         │                                     │
│  │ - SCOPES         │  │ - setVolume()    │                                     │
│  │ - REPEAT_MODES   │  └──────────────────┘                                     │
│  └──────────────────┘                                                            │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── EXTERNAL SERVICES ─────────────────────────────────┐
│                                                                                   │
│  ┌──────────────────────────┐          ┌──────────────────────────────┐         │
│  │   Spotify Web API        │          │ Spotify Web Playback SDK     │         │
│  │   api.spotify.com/v1     │◄────────►│  (Browser-based playback)    │         │
│  │                          │          │                              │         │
│  │ - Authentication         │          │ - Player initialization      │         │
│  │ - Search                 │          │ - Playback control           │         │
│  │ - Library management     │          │ - State updates              │         │
│  │ - Playlist CRUD          │          │ - Device management          │         │
│  │ - User data              │          └──────────────────────────────┘         │
│  │ - Recommendations        │                                                    │
│  └──────────────────────────┘                                                    │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────── DATA FLOW ───────────────────────────────────────┐
│                                                                                   │
│  1. User Action (Click Play)                                                     │
│      ↓                                                                            │
│  2. Component dispatches Redux action                                            │
│      ↓                                                                            │
│  3. Service makes API call                                                       │
│      ↓                                                                            │
│  4. Spotify API/SDK responds                                                     │
│      ↓                                                                            │
│  5. Redux state updated                                                          │
│      ↓                                                                            │
│  6. Components re-render with new state                                          │
│                                                                                   │
│  Example: Play Track Flow                                                        │
│  ┌──────────┐   dispatch    ┌──────────┐   call      ┌──────────┐              │
│  │Component │──────────────►│  Redux   │────────────►│ Service  │              │
│  │(TrackList│               │  Store   │             │(Player)  │              │
│  └──────────┘               └──────────┘             └──────────┘              │
│       ▲                           ▲                        │                     │
│       │                           │                        │ API call            │
│       │ re-render                 │ update                 ↓                     │
│       │                           │                  ┌──────────┐                │
│       └───────────────────────────┴──────────────────│ Spotify  │                │
│                                                      │   SDK    │                │
│                                                      └──────────┘                │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── THEME COLORS ──────────────────────────────────────┐
│                                                                                   │
│  Primary Blue:    ██████  #3b82f6                                                │
│  Hover Blue:      ██████  #60a5fa                                                │
│  Black:           ██████  #000000                                                │
│  Dark Gray 1:     ██████  #121212                                                │
│  Dark Gray 2:     ██████  #181818                                                │
│  Dark Gray 3:     ██████  #282828                                                │
│  White:           ██████  #ffffff                                                │
│  Light Gray:      ██████  #b3b3b3                                                │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```
