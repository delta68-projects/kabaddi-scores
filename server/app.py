from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api, Resource, fields
from flask_migrate import Migrate
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)
CORS(app, origins="*")  # Allow all origins

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@db/statsdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app, version='1.0', title='Stats API', description='A simple CRUD API for managing stats')

ns = api.namespace('stats', description='Stats operations')

stats_model = api.model('Stats', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a stat record'),
    'round1': fields.Raw(description='Round 1 data'),
    'round2': fields.Raw(description='Round 2 data'),
    'round3': fields.Raw(description='Round 3 data'),
    'round4': fields.Raw(description='Round 4 data'),
    'title': fields.String(required=True, description='The title of the stat record'),
    'scores': fields.Raw(description='Scores data')
})

class Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    round1 = db.Column(db.JSON, nullable=True)
    round2 = db.Column(db.JSON, nullable=True)
    round3 = db.Column(db.JSON, nullable=True)
    round4 = db.Column(db.JSON, nullable=True)
    title = db.Column(db.String(100), nullable=False)
    scores = db.Column(db.JSON, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'round1': self.round1,
            'round2': self.round2,
            'round3': self.round3,
            'round4': self.round4,
            'title': self.title,
            'scores': self.scores
        }

@app.route('/')
def index():
    return redirect(url_for('list_stats'))

@app.route('/stats', methods=['GET'])
def list_stats():
    stats = Stats.query.all()
    return render_template('stats_list.html', stats=stats)

@app.route('/stats/<int:id>/edit', methods=['GET', 'POST'])
def edit_stat(id):
    stat = Stats.query.get_or_404(id)
    if request.method == 'POST':
        # convert round1, round2, round3, round4 to JSON
        
        print(request.form)
        
        stat.round1 = {
            "home1": request.form.get('home1', stat.round1['home1']),
            "visitor1": request.form.get('visitor1', stat.round1['visitor1']),
            "home2": request.form.get('home2', stat.round1['home2']),
            "visitor2": request.form.get('visitor2', stat.round1['visitor2']),
            "home3": request.form.get('home3', stat.round1['home3']),
            "visitor3": request.form.get('visitor3', stat.round1['visitor3']),
            "home4": request.form.get('home4', stat.round1['home4']),
            "visitor4": request.form.get('visitor4', stat.round1['visitor4'])
        }
        stat.round2 = {
            "home1": request.form.get('home1', stat.round2['home1']),
            "visitor1": request.form.get('visitor1', stat.round2['visitor1']),
            "home2": request.form.get('home2', stat.round2['home2']),
            "visitor2": request.form.get('visitor2', stat.round2['visitor2'])
        }
        stat.round3 = {
            "home1": request.form.get('home1', stat.round3['home1']),
            "visitor1": request.form.get('visitor1', stat.round3['visitor1'])
        }
        stat.round4 = {
            "winner": request.form.get('winner', stat.round4['winner'])
        }
        # convert scores to JSON
        stat.scores = {
            "hs1_1": request.form.get('hs1_1', stat.scores),
            "vs1_1": request.form.get('vs1_1', stat.scores),
            "hs1_2": request.form.get('hs1_2', stat.scores),
            "vs1_2": request.form.get('vs1_2', stat.scores),
            "hs1_3": request.form.get('hs1_3', stat.scores),
            "vs1_3": request.form.get('vs1_3', stat.scores),
            "hs1_4": request.form.get('hs1_4', stat.scores),
            "vs1_4": request.form.get('vs1_4', stat.scores),
            "hs2_1": request.form.get('hs2_1', stat.scores),
            "vs2_1": request.form.get('vs2_1', stat.scores),
            "hs2_2": request.form.get('hs2_2', stat.scores),
            "vs2_2": request.form.get('vs2_2', stat.scores),
            "hs3_1": request.form.get('hs3_1', stat.scores),
            "vs3_1": request.form.get('vs3_1', stat.scores)
        }
        
        
        stat.title = request.form.get('title', stat.title)
        # print object
        print(stat.to_dict())
       
        # db.session.commit()
        return redirect(url_for('list_stats'))
    return render_template('edit_stat.html', stat=stat)

@ns.route('/')
class StatsList(Resource):
    @ns.doc('list_stats')
    @ns.marshal_list_with(stats_model)
    def get(self):
        stats = Stats.query.all()
        return [stat.to_dict() for stat in stats]

    @ns.doc('create_stat')
    @ns.expect(stats_model)
    @ns.marshal_with(stats_model, code=201)
    def post(self):
        data = {            
                "id": 0,
                "round1": {
                    "home1": "",
                    "visitor1": "",
                    "home2": "",
                    "visitor2": "",
                    "home3": "",
                    "visitor3": "",
                    "home4": "",
                    "visitor4": "",
                    },
                "round2": {
                    "home1": "",
                    "visitor1": "",
                    "home2": "",
                    "visitor2": "",
                    },
                "round3": {
                     "home1": "",
                     "visitor1": ""
                    },
                "round4": {
                     "winner":""
                    },
                "title": "EU Khabaddi Tournament",
                "scores": {
                    "hs1_1": "",
                    "vs1_1": "",
                    "hs1_2": "",
                    "vs1_2": "",
                    "hs1_3": "",
                    "vs1_3": "",
                    "hs1_4": "",
                    "vs1_4": "",

                    "hs2_1": "",
                    "vs2_1": "",
                    "hs2_2": "",
                    "vs2_2": "",

                    "hs3_1": "",
                    "vs3_1": "",
                }
                
        }
        new_stat = Stats(
            round1=data.get('round1'),
            round2=data.get('round2'),
            round3=data.get('round3'),
            round4=data.get('round4'),
            title=data.get("title"),
            scores=data.get('scores')
        )
        db.session.add(new_stat)
        db.session.commit()
        return new_stat.to_dict(), 201

@ns.route('/<int:id>')
@ns.response(404, 'Stat not found')
@ns.param('id', 'The stat identifier')
class StatsResource(Resource):
    @ns.doc('get_stat')
    @ns.marshal_with(stats_model)
    def get(self, id):
        stat = Stats.query.get_or_404(id)
        return stat.to_dict()

    @ns.doc('delete_stat')
    @ns.response(204, 'Stat deleted')
    def delete(self, id):
        stat = Stats.query.get_or_404(id)
        db.session.delete(stat)
        db.session.commit()
        return '', 204

    @ns.expect(stats_model)
    @ns.marshal_with(stats_model)
    def put(self, id):
        "test"
        stat = Stats.query.get_or_404(id)
        data = request.get_json()
        print(data)
        stat.round1 = data.get('round1', stat.round1)
        stat.round2 = data.get('round2', stat.round2)
        stat.round3 = data.get('round3', stat.round3)
        stat.round4 = data.get('round4', stat.round4)
        stat.title = data.get('title', stat.title)
        stat.scores = data.get('scores', stat.scores)
        db.session.commit()
        # success message 200
        return stat.to_dict()
    
# new route for sending data to server 
@app.route('/update', methods=['GET'])
def update():
    # return html page
    stat = Stats.query.get_or_404(1)
    return render_template('update.html', stat=stat)
    
@app.before_first_request 
def startup_task():
    data = {            
                "id": 0,
                "round1": {
                    "home1": "",
                    "visitor1": "",
                    "home2": "",
                    "visitor2": "",
                    "home3": "",
                    "visitor3": "",
                    "home4": "",
                    "visitor4": "",
                    },
                "round2": {
                    "home1": "",
                    "visitor1": "",
                    "home2": "",
                    "visitor2": "",
                    },
                "round3": {
                     "home1": "",
                     "visitor1": ""
                    },
                "round4": {
                     "winner":""
                    },
                "title": "EU Khabaddi Tournament",
                "scores": {
                    "hs1_1": "",
                    "vs1_1": "",
                    "hs1_2": "",
                    "vs1_2": "",
                    "hs1_3": "",
                    "vs1_3": "",
                    "hs1_4": "",
                    "vs1_4": "",

                    "hs2_1": "",
                    "vs2_1": "",
                    "hs2_2": "",
                    "vs2_2": "",

                    "hs3_1": "",
                    "vs3_1": "",
                }
                
        }
    new_stat = Stats(
        round1=data.get('round1'),
        round2=data.get('round2'),
        round3=data.get('round3'),
        round4=data.get('round4'),
        title=data.get("title"),
        scores=data.get('scores')
    )
    db.session.add(new_stat)
    db.session.commit()

if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port="5000", debug=True)
