const sqlite3 = require('sqlite3').verbose();
const fs = require('fs-extra');
const path = require('path');

// Create database and tables
const db = new sqlite3.Database('artwork.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

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

  // Create tables
  db.run(createArtworksTable, (err) => {
    if (err) {
      console.error('Error creating artworks table:', err.message);
    } else {
      console.log('✓ Artworks table created');
    }
  });

  db.run(createArtistsTable, (err) => {
    if (err) {
      console.error('Error creating artists table:', err.message);
    } else {
      console.log('✓ Artists table created');
    }
  });

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Sample artworks
  const sampleArtworks = [
    {
      title: "Nature's Beauty",
      description: "A beautiful painting capturing the essence of nature",
      price: 58000,
      artist_name: "Swati Kale",
      artist_email: "swatikale@gmail.com",
      image_url: "/assets/images/ap1.jpg"
    },
    {
      title: "Painting of a Lady",
      description: "Elegant portrait showcasing artistic mastery",
      price: 1500,
      artist_name: "Etienne Quesnay",
      artist_email: "etiennequesnay@gmail.com",
      image_url: "/assets/images/ap2.jpg"
    },
    {
      title: "Painting of Buddha",
      description: "Spiritual artwork representing peace and tranquility",
      price: 60000,
      artist_name: "Monica Ghule",
      artist_email: "monicagule@gmail.com",
      image_url: "/assets/images/ap3.jpg"
    }
  ];

  // Sample artists
  const sampleArtists = [
    {
      name: "Swati Kale",
      email: "swatikale@gmail.com",
      bio: "Swati Kale's paintings are an indication of the best form of sublimation. Her obsession with flowers came about after the untimely death of her daughter, Disha, or as the artist says the 'loss of a flower that was of my own creation.'"
    },
    {
      name: "Etienne Quesnay",
      email: "etiennequesnay@gmail.com",
      bio: "Born in 1995 in Dieppe, Etienne Quesnay grew up in the countryside in Normandy where his father passed on his passion for drawing. Self-taught, he began to paint at an early age to express himself through his sketches and brushstrokes."
    },
    {
      name: "Monica Ghule",
      email: "monicagule@gmail.com",
      bio: "Monica Ghule (b. 1989) is an artist from Mumbai, India. She received her MFA from Nagpur University in 2013 (first in class), and since 2008 has exhibited her work in 10 group exhibitions to date across India."
    }
  ];

  // Insert sample artworks
  const insertArtwork = `INSERT OR IGNORE INTO artworks (title, description, price, artist_name, artist_email, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
  
  sampleArtworks.forEach(artwork => {
    db.run(insertArtwork, [
      artwork.title,
      artwork.description,
      artwork.price,
      artwork.artist_name,
      artwork.artist_email,
      artwork.image_url
    ], (err) => {
      if (err) {
        console.error('Error inserting artwork:', err.message);
      } else {
        console.log(`✓ Inserted artwork: ${artwork.title}`);
      }
    });
  });

  // Insert sample artists
  const insertArtist = `INSERT OR IGNORE INTO artists (name, email, bio) VALUES (?, ?, ?)`;
  
  sampleArtists.forEach(artist => {
    db.run(insertArtist, [
      artist.name,
      artist.email,
      artist.bio
    ], (err) => {
      if (err) {
        console.error('Error inserting artist:', err.message);
      } else {
        console.log(`✓ Inserted artist: ${artist.name}`);
      }
    });
  });

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  fs.ensureDirSync(uploadsDir);
  console.log('✓ Uploads directory created');

  console.log('\nDatabase initialization completed!');
  console.log('You can now start the server with: npm start');
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}
