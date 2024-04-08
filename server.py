from flask import Flask, render_template, request, redirect, url_for, jsonify

from connection import select, insert, delete

app = Flask(__name__)

@app.route('/')
def home():
    print('Flask app running')
    return render_template('index.html')

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
        data = select(request.form['date'])
        
        if data is not None:  # Check if data is not None (i.e., row exists)
            
            return jsonify(data)
        else:
            
            return jsonify('')  # Return an empty string if the row doesn't exist
    except Exception as e:
        return f'Error retrieving data: {e}'

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
        print(data)
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
