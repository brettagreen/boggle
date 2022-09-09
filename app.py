from boggle import Boggle
from flask import Flask, render_template, session, redirect, jsonify, request

app = Flask(__name__)
app.config['SECRET_KEY'] = "bush-did-911"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True

boggle_game = Boggle()
all_words = boggle_game.read_dict('words.txt')
dupes = []


@app.route('/')
def start():
    """initiates session variables and renders form.html"""
    if session.get('games_played') is None:
        session['games_played'] = 0
    if session.get('score') is None:
        session['score'] = 0
    return render_template('form.html', session=session)

@app.route('/game', methods=['POST'])
def game():
    """creates gameboard and returns it to main page. also passes session object."""
    size = request.form['board_size']
    session['game'] = boggle_game.make_board(int(size))
    return render_template('game_board.html', board=session['game'], session=session)


@app.route('/word', methods=['POST'])
def check_word():
    """checks guessed words to see if they exixt, both in the words.txt file but on the gameboard
        config as well. Also checks for duplicate guesses. returns result to html"""
    passed_json = request.json
    form_word = passed_json['word']
    
    if form_word in all_words:
        result = boggle_game.check_valid_word(session['game'], form_word)
        if result == 'ok':
            if form_word in dupes:
                return jsonify ({"result": "you already guessed that one!"})
            dupes.append(form_word)
        msg = jsonify({"result": result})
        return msg
    return jsonify({"result": "that's not a word. try again."})

@app.route('/stats', methods=['POST'])
def stats():
    """keeps track of high scores and num games played. passes results back to html"""
    passed_json = request.json
    score = passed_json['score']
    score = int(score)
    hi_score = session['score']
    if score > hi_score:
        session['score'] = score

    games_played = session['games_played'] + 1
    session['games_played'] = games_played

    return jsonify({"high_score": session['score'], "games_played": session['games_played']})

@app.route('/clear_dupes', methods=['POST'])
def clear():
    """clears duplicate list so that it is fresh for the next game. redirect to / i.e. form.html"""
    dupes.clear()
    return "I shat a quart of whiskey in a bottle!"
