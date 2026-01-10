# BriTunes Deployment Guide

## Production Deployment Checklist

### Pre-Deployment Steps

1. **Security**
   - [ ] Generate a strong JWT secret (use a random string generator)
   - [ ] Never commit `.env` file to version control
   - [ ] Review and update CORS settings for production domain
   - [ ] Enable HTTPS for production

2. **Environment Variables**
   - [ ] Set `NODE_ENV=production`
   - [ ] Update `CLIENT_URL` to production frontend URL
   - [ ] Use production MongoDB URI (MongoDB Atlas recommended)
   - [ ] Verify Spotify API credentials

3. **Database**
   - [ ] Set up MongoDB Atlas cluster
   - [ ] Configure database user and password
   - [ ] Whitelist server IP address
   - [ ] Enable database backups

4. **Code Optimization**
   - [ ] Remove console.log statements from production code
   - [ ] Build React app (`npm run build`)
   - [ ] Optimize images and assets
   - [ ] Enable compression middleware

## Deployment Options

### Option 1: Heroku

#### Backend Deployment

1. Install Heroku CLI:
```bash
npm install -g heroku
```

2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create britunes-api
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set SPOTIFY_CLIENT_ID=your_client_id
heroku config:set SPOTIFY_CLIENT_SECRET=your_client_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set CLIENT_URL=https://your-frontend-url.com
```

5. Create Procfile:
```bash
echo "web: node server/index.js" > Procfile
```

6. Deploy:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Frontend Deployment (Netlify/Vercel)

**Netlify:**

1. Build the client:
```bash
cd client
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=client/build
```

4. Update environment variables in Netlify dashboard:
   - `REACT_APP_API_URL=https://your-heroku-api-url.herokuapp.com`

**Vercel:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel --prod
```

### Option 2: AWS (EC2)

1. Launch an EC2 instance (Ubuntu recommended)

2. Connect to your instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. Install Node.js and MongoDB:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone your repository:
```bash
git clone your-repository-url
cd BriTunes
```

5. Install dependencies:
```bash
npm run install-all
```

6. Set up environment variables:
```bash
nano .env
# Add your production environment variables
```

7. Install PM2 for process management:
```bash
sudo npm install -g pm2
```

8. Start the application:
```bash
pm2 start server/index.js --name britunes-api
pm2 startup
pm2 save
```

9. Set up Nginx as reverse proxy:
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/britunes
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/britunes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. Install SSL with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: DigitalOcean

1. Create a Droplet (Ubuntu)
2. Follow similar steps as AWS EC2
3. Use DigitalOcean App Platform for easier deployment

### Option 4: Docker Deployment

1. Create `Dockerfile` in root:
```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
      - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

3. Build and run:
```bash
docker-compose up -d
```

## Post-Deployment

### Monitoring

1. **Application Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Track user analytics

2. **Server Monitoring**
   - CPU and memory usage
   - Disk space
   - Network traffic

3. **Database Monitoring**
   - Query performance
   - Connection pool
   - Storage usage

### Maintenance

1. **Regular Updates**
   ```bash
   # Update dependencies
   npm update
   npm audit fix
   ```

2. **Database Backups**
   - Set up automated backups
   - Test restore procedures
   - Keep backups for at least 30 days

3. **Logs Management**
   ```bash
   # View PM2 logs
   pm2 logs britunes-api
   
   # Clear old logs
   pm2 flush
   ```

### Scaling

1. **Horizontal Scaling**
   - Add more server instances
   - Use load balancer
   - Implement Redis for session management

2. **Vertical Scaling**
   - Upgrade server resources
   - Optimize database queries
   - Implement caching strategies

3. **Database Scaling**
   - Enable MongoDB sharding
   - Use read replicas
   - Implement database indexing

## Performance Optimization

### Backend

1. Enable compression:
```javascript
const compression = require('compression');
app.use(compression());
```

2. Implement caching:
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. Rate limiting:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

### Frontend

1. Code splitting
2. Lazy loading
3. Image optimization
4. CDN for static assets
5. Service workers for offline support

## Security Best Practices

1. **API Security**
   - Use HTTPS only
   - Implement rate limiting
   - Sanitize user inputs
   - Use CORS properly
   - Keep dependencies updated

2. **Database Security**
   - Use strong passwords
   - Enable authentication
   - Restrict network access
   - Regular security audits

3. **Environment Variables**
   - Never expose secrets
   - Use secret management tools
   - Rotate credentials regularly

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check network access
   - Verify credentials
   - Check IP whitelist

2. **Spotify API Rate Limiting**
   - Implement caching
   - Use exponential backoff
   - Monitor API usage

3. **Memory Issues**
   - Monitor memory usage
   - Implement garbage collection
   - Optimize queries

## Support

For deployment issues:
- Check application logs
- Review server logs
- Monitor error tracking
- Contact support team

---

Happy deploying! 🚀
