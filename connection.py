import psycopg2
from psycopg2 import sql
from psycopg2.errors import UndefinedTable

def create_connection():
        
    return psycopg2.connect('postgres://ukgghlwe:XXMNFCmwhbl2fXd2dHzg8tCoTUWavZZC@trumpet.db.elephantsql.com/ukgghlwe')

def insert(date, customer_name, description, time):

    connection = create_connection()
    cursor = connection.cursor()
    
    try:
        query = f"""
        INSERT INTO day_entries (date, customer_name, description, time)
        VALUES ('{date}', '{customer_name}', '{description}', '{time}')
        ON CONFLICT (date)
        DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        description = EXCLUDED.description,
        time = EXCLUDED.time;
        """
        cursor.execute(query)
        connection.commit()
        print('Data inserted into the database')
    except Exception as e:
        print(f"Error updating data: {e}")
        
    finally:
        cursor.close()
        connection.close()

def select(date):
    connection = create_connection()
    cursor = connection.cursor()

    try:
        # Check if the table exists, and create it if it doesn't
        try:
            cursor.execute(sql.SQL("SELECT 1 FROM {} LIMIT 1").format(sql.Identifier('day_entries')))
        except UndefinedTable:
           
            connection.commit()

        # Your original select query
        query = f"SELECT time, customer_name, description FROM day_entries WHERE date='{date}'ORDER BY time ASC"
        cursor.execute(query)
        result = cursor.fetchall()

        return result if result else None
    finally:
        cursor.close()
        connection.close()

# def delete(date):

#     connection = create_connection()
#     cursor = connection.cursor()

#     try:

#         query = f"DELETE FROM diary_entry WHERE date='{date}'"
#         cursor.execute(query)
#         connection.commit()

#         return 'data deleted'
#     finally:
#         cursor.close()
#         connection.close()

# def drop():
#     connection = create_connection()
#     cursor = connection.cursor()

#     try:

#         query = "DROP TABLE IF EXISTS diary_entry"
#         cursor.execute(query)
#         connection.commit()

#     finally:
#         cursor.close()
#         connection.close()

# def create_table():
    connection = create_connection()
    cursor = connection.cursor()

    try:
        query = """
        CREATE TABLE IF NOT EXISTS diary_entry (
            date DATE PRIMARY KEY,
            text1 TEXT,
            text2 TEXT,
            text3 TEXT
        )
        """
        cursor.execute(query)
        connection.commit()  # Commit the transaction immediately after creating the table
    except Exception as e:
        print(f"Error creating table: {e}")
        connection.rollback()  # Rollback the transaction on failure
    finally:
        cursor.close()
        connection.close()