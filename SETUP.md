# Kala.ficial - Dynamic Art Platform Setup

This guide will help you set up the dynamic version of Kala.ficial with backend functionality for artwork upload and management.

## Features Added

✨ **New Dynamic Features:**
- Backend API with Express.js and SQLite database
- Image upload system with `/uploads` folder
- Artist dashboard for uploading and managing artwork
- Dynamic artwork display on the main page
- Role-based access for artists
- RESTful API endpoints for artwork CRUD operations

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This will:
- Create the SQLite database (`artwork.db`)
- Set up the required tables (artworks, artists)
- Insert sample data
- Create the uploads directory

### 3. Start the Server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Project Structure

```
kala.ficial/
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── artwork.db               # SQLite database (created after init)
├── uploads/                 # Directory for uploaded images
├── scripts/
│   └── init-db.js          # Database initialization script
├── artist-dashboard.html    # Artist upload/management interface
├── index.html              # Main page (now dynamic)
├── Artist Portal.html      # Updated with dashboard link
└── assets/                 # Static assets (CSS, JS, images)
```

## API Endpoints

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get specific artwork
- `POST /api/artworks` - Upload new artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork

### Artists
- `GET /api/artists` - Get all artists
- `POST /api/artists` - Add new artist

## Usage

### For Artists

1. **Access Dashboard**: Go to `Artist Portal.html` and click "Artist Dashboard"
2. **Upload Artwork**: 
   - Click "Upload Artwork" button
   - Fill in artwork details (title, description, price, artist info)
   - Upload image file (PNG, JPG, GIF, WEBP up to 10MB)
   - Submit the form
3. **Manage Artwork**: 
   - View all uploaded artworks in the dashboard
   - Edit artwork details
   - Delete artworks
   - View statistics

### For Visitors

1. **Browse Artwork**: Visit the main page to see dynamically loaded artwork
2. **View Details**: Hover over artwork cards to see artist and pricing information
3. **Contact Artists**: Use provided email addresses to contact artists directly

## Database Schema

### Artworks Table
```sql
CREATE TABLE artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  artist_name TEXT NOT NULL,
  artist_email TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Artists Table
```sql
CREATE TABLE artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## File Upload

- Images are stored in the `/uploads` directory
- Supported formats: PNG, JPG, GIF, WEBP
- Maximum file size: 10MB
- Files are renamed with unique timestamps to prevent conflicts

## Development

### Adding New Features

1. **Backend**: Add new routes in `server.js`
2. **Frontend**: Update HTML files and add JavaScript functionality
3. **Database**: Modify schema in `scripts/init-db.js` if needed

### Testing

1. Start the server: `npm start`
2. Open `http://localhost:3000` in your browser
3. Test the artist dashboard functionality
4. Verify artwork uploads appear on the main page

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in `server.js` or kill the process using port 3000
2. **Database errors**: Delete `artwork.db` and run `npm run init-db` again
3. **Upload failures**: Check that the `uploads` directory exists and has write permissions
4. **CORS issues**: The server includes CORS middleware, but check browser console for errors

### Logs

Check the console output when running the server for error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
