from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import psycopg2
from psycopg2 import sql
from psycopg2.errors import UndefinedTable
import hashlib
from connection import select, insert, delete, select_user

app = Flask(__name__)
app.secret_key = '123456'

def register_user(username, password, phone, email_address):
    conn = psycopg2.connect('postgres://ukgghlwe:XXMNFCmwhbl2fXd2dHzg8tCoTUWavZZC@trumpet.db.elephantsql.com/ukgghlwe')
    c = conn.cursor()
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    c.execute('INSERT INTO users (username, password, phone, email_address) VALUES (%s,%s,%s,%s)', (username, hashed_password, phone, email_address))
    conn.commit()
    conn.close()

def authenticate_user(username, password):
    conn = psycopg2.connect('postgres://ukgghlwe:XXMNFCmwhbl2fXd2dHzg8tCoTUWavZZC@trumpet.db.elephantsql.com/ukgghlwe')
    c = conn.cursor()
    c.execute('SELECT password FROM users WHERE username=%s', (username,))
    stored_password = c.fetchone()
    conn.close()
    if stored_password:
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        if hashed_password == stored_password[0]:
            return True
    
    return False

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        phone = request.form['phone']
        email_address = request.form['email_address']
        register_user(username, password, phone, email_address)
        return redirect('/login')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if authenticate_user(username, password):
            session['username'] = username
            return redirect('/')
        else:
            return render_template('login.html', error='invalid username or password')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/login')

@app.route('/')
def home():
    if 'username' in session:
        username = session['username']
        if username == 'admin':
            return render_template('admin_page.html', username=username)
        return render_template('index.html', username=username)
    return redirect('/login')
    
@app.route('/popup_content.html')
def popup_content():
    return render_template('popup_content.html')

@app.route('/data')
def data_page():
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')

    # Use the values as needed

    return render_template('data.html', year=year, month=month, day=day)

@app.route('/retrieve_data', methods=['POST'])
def retrieve_data():
    try:
        # Retrieve data based on the date from the request form
        data = select(request.form['date'])
        
        # Check if the user is logged in and retrieve the username from the session
        username = session.get('username', None)
        
        conn = psycopg2.connect('postgres://ukgghlwe:XXMNFCmwhbl2fXd2dHzg8tCoTUWavZZC@trumpet.db.elephantsql.com/ukgghlwe')
        c = conn.cursor()
        c.execute('SELECT phone FROM users WHERE username=%s', (username,))
        phone = c.fetchone()
        conn.close()    
        
        if data is not None:  
            # Return data and username in JSON format
            return jsonify({'data': data, 'username': username, 'phone': phone})
        else:
            # Return an empty response if the data doesn't exist
            return jsonify({'data': None, 'username': username, 'phone': phone })
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error message with status code 500 if an exception occurs


@app.route('/insert_data', methods=['POST'])
def insert_data():
    try:
        data = request.get_json()

        date = data.get('date')
        customer_name = data.get('customer_name')
        description = data.get('description')
        time = data.get('time')

        insert(date, customer_name, description, time)
        return jsonify({'status': 'success'})
        

    except Exception as e:
        return f'Error processing data: {str(e)}', 500

@app.route('/delete_data', methods=['POST'])
def delete_data():
    try:
        data = request.get_json()
        date = data.get('date')
        time = data.get('time')
        # Assuming delete() function handles deletion and potential errors
        delete(date, time)
        print(date, time)
        return jsonify({'status': 'success'})
    except Exception as e:
        print('Error occurred during deletion:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/clear_calendar')
def clear_calendar():
    drop()
    print('Table deleted')
    
    return jsonify({'message': 'Table deleted'})


if __name__ == '__main__':
    app.run(debug=True)
