from app import app, db
from flask_migrate import upgrade, migrate, init

def main():
    with app.app_context():
        # Initialize the database migration repository (if not done yet)
                
        init()
        
        # Apply any pending migrations
        migrate()
        upgrade()

if __name__ == '__main__':
    main()
