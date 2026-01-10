#!/bin/bash

echo "🎵 SPOTIFY API SETUP - SUPER EASY MODE 🎵"
echo "=========================================="
echo ""
echo "I'll help you get your Spotify API credentials in 2 minutes!"
echo ""

# Step 1
echo "📋 STEP 1: Open Spotify Developer Dashboard"
echo ""
echo "I'll open the Spotify Developer Dashboard in your browser..."
echo "Press ENTER to continue..."
read

# Open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "https://developer.spotify.com/dashboard" 2>/dev/null
elif command -v open &> /dev/null; then
    open "https://developer.spotify.com/dashboard"
else
    echo "Please open this URL in your browser:"
    echo "https://developer.spotify.com/dashboard"
fi

echo ""
echo "✅ In the browser that just opened:"
echo "   1. Log in with your Spotify account (or create one - it's free!)"
echo "   2. Click the green 'Create App' button"
echo ""
echo "Press ENTER when you're ready for the next step..."
read

# Step 2
echo ""
echo "📝 STEP 2: Fill in App Details"
echo ""
echo "Copy and paste these into the form:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "App name:        BriTunes"
echo "App description: My awesome music player"
echo "Redirect URI:    http://localhost:3000/callback"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ After filling in the form:"
echo "   1. Check the 'Web API' checkbox"
echo "   2. Accept the terms"
echo "   3. Click 'Save'"
echo ""
echo "Press ENTER when you've created the app..."
read

# Step 3
echo ""
echo "🔑 STEP 3: Get Your Client ID"
echo ""
echo "✅ On the app page you should see:"
echo "   - Client ID (a long string of letters and numbers)"
echo "   - Click 'Show Client Secret' if you need it later"
echo ""
echo "Now I'll help you save it to your .env file..."
echo ""
echo "Please paste your Client ID here and press ENTER:"
read CLIENT_ID

# Create .env file
cd /workspaces/BriTunes/client

if [ -z "$CLIENT_ID" ]; then
    echo ""
    echo "⚠️  No Client ID entered. I'll create the .env template for you."
    echo "   You can paste it in later."
    echo ""
    CLIENT_ID="YOUR_CLIENT_ID_HERE"
fi

cat > .env << EOF
# Spotify Configuration
REACT_APP_SPOTIFY_CLIENT_ID=$CLIENT_ID
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
EOF

echo ""
echo "✅ Created .env file at: /workspaces/BriTunes/client/.env"
echo ""

if [ "$CLIENT_ID" = "YOUR_CLIENT_ID_HERE" ]; then
    echo "⚠️  Don't forget to update REACT_APP_SPOTIFY_CLIENT_ID in the .env file!"
    echo ""
else
    echo "🎉 All set! Your Client ID has been saved!"
    echo ""
fi

# Step 4
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 YOU'RE DONE! Here's what to do next:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start the app:"
echo "   cd client && npm start"
echo ""
echo "2. The app will open at http://localhost:3000"
echo ""
echo "3. Click 'Login with Spotify' and you're ready to jam! 🎵"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 TIP: You need a Spotify Premium account for full playback."
echo "    (Free accounts can browse and search, but not play music)"
echo ""

# Optional: Run setup script
echo "Do you want me to run the full setup script now? (y/n)"
read RUN_SETUP

if [ "$RUN_SETUP" = "y" ] || [ "$RUN_SETUP" = "Y" ]; then
    echo ""
    echo "Running setup script..."
    /workspaces/BriTunes/setup-spotify-integration.sh
fi

echo ""
echo "✅ Setup complete! Enjoy BriTunes! 🎵"
