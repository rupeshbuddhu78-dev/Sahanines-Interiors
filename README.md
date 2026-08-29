# Sahanines Interiors - Deployment Guide

## Render pe Deploy Karna

### Step 1: MongoDB Atlas Setup (Free)

1. **MongoDB Atlas** pe jaao: https://www.mongodb.com/cloud/atlas/register
2. **Free cluster** create karo (M0 tier)
3. **Database user** banao:
   - Username: `sahanines_admin`
   - Password: (koi strong password)
4. **Network access** mein "Allow Access from Anywhere" (0.0.0.0/0) add karo
5. **Connect** pe click karo → "Connect your application" → Connection string copy karo
6. Connection string kuch aisa hoga:
   ```
   mongodb+srv://sahanines_admin:<password>@cluster0.xxxxx.mongodb.net/sahanines-interiors?retryWrites=true&w=majority
   ```

### Step 2: GitHub pe Push karo

```bash
# Agar git initialize nahi hai
git init
git add .
git commit -m "Initial commit"

# GitHub pe repository banao aur push karo
git remote add origin https://github.com/YOUR_USERNAME/sahanines-interiors.git
git branch -M main
git push -u origin main
```

### Step 3: Render pe Deploy

1. **Render Dashboard** pe jaao: https://dashboard.render.com/
2. **New +** → **Web Service**
3. **Connect a repository** → Apna GitHub repo select karo
4. **Settings** fill karo:
   - **Name**: `sahanines-interiors`
   - **Region**: Singapore (ya jo closest ho)
   - **Branch**: `main`
   - **Root Directory**: (khali chhod do)
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**: 
     ```
     cd server && node app.js
     ```
   - **Instance Type**: `Free`

5. **Environment Variables** add karo (Advanced section mein):
   ```
   MONGODB_URI=mongodb+srv://sahanines_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sahanines-interiors?retryWrites=true&w=majority
   JWT_SECRET=koi-bhi-lamba-random-string-yahan-dalo-minimum-32-characters
   NODE_ENV=production
   PORT=3000
   SITE_URL=https://sahanines-interiors.onrender.com
   ```

6. **Create Web Service** pe click karo

### Step 4: Wait for Deployment

- Build complete hone mein 3-5 minutes lagenge
- Deployment successful hone ke baad URL milega: `https://sahanines-interiors.onrender.com`

### Step 5: Admin Login

- URL: `https://sahanines-interiors.onrender.com/admin/login`
- Email: `admin@sahanines.com`
- Password: `admin123`

**IMPORTANT**: Login karne ke baad turant password change karo!

---

## Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas connection string (ya local MongoDB)

### Setup

```bash
# Server setup
cd server
npm install

# Client setup
cd ../client
npm install

# Client build
npm run build
```

### Run Locally

```bash
# Terminal 1 - Server
cd server
node app.js

# Server will run on http://localhost:3000
```

### Environment Variables (Local)

`server/.env` file banao:
```
MONGODB_URI=mongodb+srv://sahanines_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sahanines-interiors
JWT_SECRET=your-local-secret-key
NODE_ENV=development
PORT=3000
```

---

## Folder Structure

```
sahanines-interiors/
├── server/
│   ├── app.js              ← Main server file
│   ├── models/             ← MongoDB models
│   ├── routes/             ← API routes (MongoDB version)
│   ├── middleware/         ← Auth & upload middleware
│   ├── uploads/            ← Image uploads
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/                ← React source code
│   ├── dist/               ← Production build
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Important Notes

1. **MongoDB Atlas Free Tier**: 512MB storage, sufficient for this project
2. **Render Free Tier**: 
   - Service spins down after 15 minutes of inactivity
   - First request after idle time takes 30-60 seconds to wake up
   - 750 hours/month free
3. **Image Uploads**: Render pe ephemeral storage hai. Production mein Cloudinary ya AWS S3 use karo
4. **Custom Domain**: Render pe free custom domain add kar sakte ho
5. **SSL**: Automatic HTTPS/SSL provided by Render

---

## Troubleshooting

### Build fails
- Check if all dependencies are in package.json
- Verify Node.js version compatibility

### MongoDB connection error
- Check MONGODB_URI environment variable
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check database user credentials

### Admin login not working
- First time pe MongoDB seed automatically hota hai
- Check browser console for errors
- Verify JWT_SECRET is set

### Images not showing
- Check uploads folder permissions
- Verify image URLs in database

---

## Support

For any issues, contact: 076360 08047
