#!/usr/bin/python3

from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def index():
	return "Start Page"

@app.route("/contact", methods=['GET', 'POST'])
def contact():
	output = []
	if (request.method == 'POST'):
		text = request.form['text']
		
		output.append("<p>Length: <b>" + str(len(text)) + "</b></p>")
		
		output.append("<p>Reverse: <br /><b>" + text[::-1] + "</b></p>")
		
		return "\n".join(output)
		
		
	else:
		return """<h2>Contact page</h2>
		<form action="/contact" method="post">
		<p><textarea rows="4" cols="50" name="text"></textarea></p>
		<p><input type="submit" value="Submit"></p>
		</form>"""



@app.route("/hello/<name>")
def hello(name):
	return "Good morning <b>" + name + "</b>!"


@app.route("/json")
def jsonExample():
	
	thisdict = {
		"brand": "Ford",
		"model": "Mustang",
		"year": 1964
	}
	
	return thisdict


