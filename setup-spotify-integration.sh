#!/bin/bash

echo "🎵 BriTunes - Spotify Integration Setup Script 🎵"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Backing up existing files...${NC}"
cd /workspaces/BriTunes/client/src

# Backup existing App.js and MusicPlayer.js
if [ -f "App.js" ]; then
    cp App.js App_BACKUP_$(date +%Y%m%d_%H%M%S).js
    echo -e "${GREEN}✓ Backed up App.js${NC}"
fi

if [ -f "components/MusicPlayer.js" ]; then
    cp components/MusicPlayer.js components/MusicPlayer_BACKUP_$(date +%Y%m%d_%H%M%S).js
    echo -e "${GREEN}✓ Backed up MusicPlayer.js${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Replacing files with new versions...${NC}"

# Replace App.js
if [ -f "App_NEW.js" ]; then
    mv App.js App_OLD.js 2>/dev/null
    cp App_NEW.js App.js
    echo -e "${GREEN}✓ Installed new App.js${NC}"
else
    echo -e "${RED}✗ App_NEW.js not found${NC}"
fi

# Replace MusicPlayer.js
if [ -f "components/MusicPlayer_UPDATED.js" ]; then
    mv components/MusicPlayer.js components/MusicPlayer_OLD.js 2>/dev/null
    cp components/MusicPlayer_UPDATED.js components/MusicPlayer.js
    echo -e "${GREEN}✓ Installed new MusicPlayer.js${NC}"
else
    echo -e "${RED}✗ MusicPlayer_UPDATED.js not found${NC}"
fi

# Replace MusicPlayer.css
if [ -f "components/MusicPlayer_UPDATED.css" ]; then
    mv components/MusicPlayer.css components/MusicPlayer_OLD.css 2>/dev/null
    cp components/MusicPlayer_UPDATED.css components/MusicPlayer.css
    echo -e "${GREEN}✓ Installed new MusicPlayer.css${NC}"
else
    echo -e "${RED}✗ MusicPlayer_UPDATED.css not found${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Creating environment file...${NC}"

cd /workspaces/BriTunes/client

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Spotify Configuration
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Update REACT_APP_SPOTIFY_CLIENT_ID in client/.env${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping...${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Adding Spotify SDK to index.html...${NC}"

cd /workspaces/BriTunes/client/public

if ! grep -q "spotify-player.js" index.html; then
    # Backup index.html
    cp index.html index_BACKUP_$(date +%Y%m%d_%H%M%S).html
    
    # Add Spotify SDK script before closing </body>
    sed -i 's|</body>|  <script src="https://sdk.scdn.co/spotify-player.js"></script>\n  </body>|' index.html
    echo -e "${GREEN}✓ Added Spotify SDK to index.html${NC}"
else
    echo -e "${YELLOW}⚠ Spotify SDK already in index.html${NC}"
fi

echo ""
echo -e "${BLUE}Step 5: Checking package.json dependencies...${NC}"

cd /workspaces/BriTunes/client

REQUIRED_PACKAGES=(
    "@reduxjs/toolkit"
    "react-redux"
    "redux-persist"
    "@types/spotify-web-playback-sdk"
    "axios"
)

MISSING=()

for package in "${REQUIRED_PACKAGES[@]}"; do
    if ! grep -q "\"$package\"" package.json; then
        MISSING+=("$package")
    fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All required packages are installed${NC}"
else
    echo -e "${RED}✗ Missing packages: ${MISSING[*]}${NC}"
    echo -e "${YELLOW}Run: npm install ${MISSING[*]}${NC}"
fi

echo ""
echo -e "${GREEN}=================================================="
echo "Setup Complete! 🎉"
echo "==================================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Get Spotify Credentials:"
echo "   → Visit https://developer.spotify.com/dashboard"
echo "   → Create a new app"
echo "   → Copy Client ID to client/.env"
echo "   → Add redirect URI: http://localhost:3000/callback"
echo ""
echo "2. Update client/.env with your Spotify Client ID"
echo ""
echo "3. Start the development server:"
echo "   → cd client && npm start"
echo ""
echo "4. Optional - Check server routes:"
echo "   → Add OAuth endpoints to server/routes/auth.js"
echo "   → See SPOTIFY_INTEGRATION_GUIDE.md for details"
echo ""
echo -e "${BLUE}Files Created: 58 files${NC}"
echo -e "${BLUE}Documentation: INTEGRATION_COMPLETE.md, FILES_CREATED.md${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
