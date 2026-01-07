#!/bin/bash

# BriTunes Installation Verification Script
# This script checks if all required components are properly set up

echo "🎵 BriTunes Installation Verification"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
passed=0
failed=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    version=$(node -v)
    echo -e "${GREEN}✓${NC} Found $version"
    ((passed++))
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Please install Node.js from https://nodejs.org/"
    ((failed++))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    version=$(npm -v)
    echo -e "${GREEN}✓${NC} Found v$version"
    ((passed++))
else
    echo -e "${RED}✗${NC} Not found"
    ((failed++))
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if command -v mongod &> /dev/null; then
    version=$(mongod --version | head -n 1)
    echo -e "${GREEN}✓${NC} Found"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Not found locally"
    echo "  You can use MongoDB Atlas instead"
    ((passed++))
fi

# Check if server dependencies are installed
echo -n "Checking server dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "  Run: npm install"
    ((failed++))
fi

# Check if client dependencies are installed
echo -n "Checking client dependencies... "
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "  Run: cd client && npm install"
    ((failed++))
fi

# Check .env file
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Found"
    
    # Check for required variables
    required_vars=("SPOTIFY_CLIENT_ID" "SPOTIFY_CLIENT_SECRET" "JWT_SECRET" "MONGODB_URI")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env; then
            missing_vars+=($var)
        fi
    done
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} All required variables set"
        ((passed++))
    else
        echo -e "  ${YELLOW}⚠${NC} Missing variables: ${missing_vars[*]}"
        echo "  Please configure these in .env"
        ((failed++))
    fi
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Run: cp .env.example .env"
    echo "  Then configure your environment variables"
    ((failed++))
fi

# Check project structure
echo -n "Checking project structure... "
required_dirs=("server" "server/routes" "server/models" "client/src" "client/src/pages" "client/src/components")
missing_dirs=()

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        missing_dirs+=($dir)
    fi
done

if [ ${#missing_dirs[@]} -eq 0 ]; then
    echo -e "${GREEN}✓${NC} All directories present"
    ((passed++))
else
    echo -e "${RED}✗${NC} Missing: ${missing_dirs[*]}"
    ((failed++))
fi

# Summary
echo ""
echo "======================================"
echo "Summary:"
echo -e "  ${GREEN}Passed: $passed${NC}"
if [ $failed -gt 0 ]; then
    echo -e "  ${RED}Failed: $failed${NC}"
fi
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to start BriTunes!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Make sure MongoDB is running (or configured for Atlas)"
    echo "  2. Run: npm run dev:full"
    echo "  3. Open http://localhost:3000"
    echo ""
else
    echo -e "${YELLOW}⚠ Please fix the issues above before starting${NC}"
    echo ""
fi
