# Define the path to the logs directory relative to the script's location
LOGS_DIR="$(dirname "$0")./../logs"
SQL_DIR="$(dirname "$0")./sql"

# Load environment variables from .env file
if [ -f ../../.env ]; then
    export $(grep -v '^#' ../../.env | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

# MySQL Credentials
MYSQL_USER="$ROOT_DATABASE_USER"
MYSQL_PASSWORD="$ROOT_DATABASE_PASSWORD"

# Database and User Details
NEW_DB_NAME="$DATABASE_NAME"
NEW_USER="$DATABASE_USER"
NEW_USER_PASSWORD="$DATABASE_PASSWORD"

# MySQL Commands
MYSQL_COMMAND="mysql -h$DATABASE_HOST -P$DATABASE_PORT -u$MYSQL_USER -p$MYSQL_PASSWORD -e"

# Drop database if exists
$MYSQL_COMMAND "DROP DATABASE IF EXISTS $NEW_DB_NAME;"

# Create a new database
$MYSQL_COMMAND "CREATE DATABASE IF NOT EXISTS $NEW_DB_NAME;"

# Create a new MySQL user
$MYSQL_COMMAND "CREATE USER IF NOT EXISTS '$NEW_USER'@'localhost' IDENTIFIED BY '$NEW_USER_PASSWORD';"

# Grant privileges to the new user on the new database
$MYSQL_COMMAND "GRANT ALL PRIVILEGES ON $NEW_DB_NAME.* TO '$NEW_USER'@'localhost';"

# Flush privileges
$MYSQL_COMMAND "FLUSH PRIVILEGES;"

echo "Database '$NEW_DB_NAME' created."
echo "User '$NEW_USER' created and granted privileges on '$NEW_DB_NAME' database."

# Change directory to SQL migrations folder
cd "$SQL_DIR/migrations" || exit

for file in *.sql; do 
  echo "To create: $file"
  mysql -h "$DATABASE_HOST" \
        -u "$DATABASE_USER" \
        -p"$DATABASE_PASSWORD" \
        -P "$DATABASE_PORT" \
        "$DATABASE_NAME" < "$file" 2>&1 | tee -a "$LOGS_DIR/error.log"
  if [ $? != 0 ]; then
    echo "Error creating $file. See error.log for details."
  fi
done

# Change directory to SQL insertions folder
cd "../insertions" || exit

for file in *.sql; do 
  echo "To insert: $file"
  mysql -h "$DATABASE_HOST" \
        -u "$DATABASE_USER" \
        -p"$DATABASE_PASSWORD" \
        -P "$DATABASE_PORT" \
        "$DATABASE_NAME" < "$file" 2>&1 | tee -a "$LOGS_DIR/error.log"
  if [ $? != 0 ]; then
    echo "Error creating $file. See error.log for details."
  fi
done