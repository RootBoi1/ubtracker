from flask import Flask, render_template, send_from_directory

# set the project root directory as the static folder
app = Flask(__name__, template_folder='.')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/', methods=['GET'])
def get_data():
    # return available seats data
    return [1, 2, 3, 4, 5]

if __name__ == "__main__":
    app.run()
