from flask import Flask, request, make_response, render_template

app = Flask(__name__)
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/search")
def search():
    return render_template('search.html')

@app.route("/calendar")
def calendar():
    return render_template('calendar.html')

@app.route("/settings")
def settings():
    return render_template('settings.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)