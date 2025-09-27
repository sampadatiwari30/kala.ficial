const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root directory
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Initialize SQLite database
const db = new sqlite3.Database('artwork.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const createArtworksTable = `
    CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      artist_name TEXT NOT NULL,
      artist_email TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createArtistsTable = `
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createArtworksTable, (err) => {
    if (err) {
      console.error('Error creating artworks table:', err.message);
    } else {
      console.log('Artworks table ready');
    }
  });

  db.run(createArtistsTable, (err) => {
    if (err) {
      console.error('Error creating artists table:', err.message);
    } else {
      console.log('Artists table ready');
    }
  });
}

// API Routes

// Get all artworks
app.get('/api/artworks', (req, res) => {
  const sql = 'SELECT * FROM artworks ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get artwork by ID
app.get('/api/artworks/:id', (req, res) => {
  const sql = 'SELECT * FROM artworks WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Artwork not found' });
      return;
    }
    res.json(row);
  });
});

// Upload new artwork
app.post('/api/artworks', upload.single('image'), (req, res) => {
  const { title, description, price, artist_name, artist_email } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const image_url = `/uploads/${req.file.filename}`;
  
  const sql = `
    INSERT INTO artworks (title, description, price, artist_name, artist_email, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [title, description, price, artist_name, artist_email, image_url], function(err) {
    if (err) {
      // Delete uploaded file if database insert fails
      fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id: this.lastID,
      title,
      description,
      price,
      artist_name,
      artist_email,
      image_url,
      message: 'Artwork uploaded successfully'
    });
  });
});

// Update artwork
app.put('/api/artworks/:id', upload.single('image'), (req, res) => {
  const { title, description, price, artist_name, artist_email } = req.body;
  const artworkId = req.params.id;
  
  let sql, params;
  
  if (req.file) {
    // New image provided
    const image_url = `/uploads/${req.file.filename}`;
    sql = `
      UPDATE artworks 
      SET title = ?, description = ?, price = ?, artist_name = ?, artist_email = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [title, description, price, artist_name, artist_email, image_url, artworkId];
  } else {
    // No new image
    sql = `
      UPDATE artworks 
      SET title = ?, description = ?, price = ?, artist_name = ?, artist_email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [title, description, price, artist_name, artist_email, artworkId];
  }
  
  db.run(sql, params, function(err) {
    if (err) {
      if (req.file) {
        // Delete uploaded file if database update fails
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      }
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Artwork not found' });
      return;
    }
    
    res.json({ message: 'Artwork updated successfully' });
  });
});

// Delete artwork
app.delete('/api/artworks/:id', (req, res) => {
  const sql = 'SELECT image_url FROM artworks WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Artwork not found' });
      return;
    }
    
    // Delete the artwork record
    const deleteSql = 'DELETE FROM artworks WHERE id = ?';
    db.run(deleteSql, [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Delete the image file
      const imagePath = path.join(__dirname, row.image_url);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting image file:', err);
        }
      });
      
      res.json({ message: 'Artwork deleted successfully' });
    });
  });
});

// Get all artists
app.get('/api/artists', (req, res) => {
  const sql = 'SELECT * FROM artists ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new artist
app.post('/api/artists', (req, res) => {
  const { name, email, bio } = req.body;
  
  const sql = 'INSERT INTO artists (name, email, bio) VALUES (?, ?, ?)';
  db.run(sql, [name, email, bio], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id: this.lastID,
      name,
      email,
      bio,
      message: 'Artist added successfully'
    });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
