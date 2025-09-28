const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database('artwork.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database for migration');
    migrateDatabase();
  }
});

function migrateDatabase() {
  console.log('Starting database migration...');
  
  // Check if user_id column exists
  db.all("PRAGMA table_info(artworks)", [], (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err.message);
      return;
    }
    
    const hasUserIdColumn = columns.some(col => col.name === 'user_id');
    
    if (!hasUserIdColumn) {
      console.log('Adding user_id column to artworks table...');
      
      // Add user_id column with a default value
      db.run("ALTER TABLE artworks ADD COLUMN user_id TEXT DEFAULT 'default_user'", (err) => {
        if (err) {
          console.error('Error adding user_id column:', err.message);
        } else {
          console.log('Successfully added user_id column');
          
          // Update existing records to have a proper user_id
          db.run("UPDATE artworks SET user_id = 'migrated_user' WHERE user_id = 'default_user'", (err) => {
            if (err) {
              console.error('Error updating existing records:', err.message);
            } else {
              console.log('Successfully updated existing records');
            }
            
            // Make user_id NOT NULL
            console.log('Making user_id column NOT NULL...');
            
            // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
            db.serialize(() => {
              // Create new table with proper structure
              db.run(`
                CREATE TABLE artworks_new (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT NOT NULL,
                  description TEXT,
                  price DECIMAL(10,2),
                  artist_name TEXT NOT NULL,
                  artist_email TEXT NOT NULL,
                  image_url TEXT NOT NULL,
                  user_id TEXT NOT NULL,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
              `);
              
              // Copy data from old table
              db.run(`
                INSERT INTO artworks_new 
                SELECT id, title, description, price, artist_name, artist_email, image_url, user_id, created_at, updated_at 
                FROM artworks
              `);
              
              // Drop old table
              db.run("DROP TABLE artworks");
              
              // Rename new table
              db.run("ALTER TABLE artworks_new RENAME TO artworks", (err) => {
                if (err) {
                  console.error('Error renaming table:', err.message);
                } else {
                  console.log('Migration completed successfully!');
                }
                
                db.close();
              });
            });
          });
        }
      });
    } else {
      console.log('user_id column already exists. Migration not needed.');
      db.close();
    }
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down migration...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
