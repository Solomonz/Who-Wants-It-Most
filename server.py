from flask import Flask
from flask_restful import Api, Resource, reqparse
from json import dumps
from random import choice
import string

LETTERS = string.ascii_uppercase

app = Flask(__name__)
api = Api(app)

rooms = {}

def generate_random_room_code():
    return ''.join(choice(LETTERS) for _ in range(4))


# @app.route('/room', methods=['POST'])
# def create():
#     code = generate_random_room_code()
#     while code in rooms.keys():
#         code = generate_random_room_code()
#     rooms[code] = {
#         "closed": False,
#         "votes": {},
#     }


# @app.route('/room/<string:room_code>/join', methods=['PUT'])
# def join(room_code):
#     parser = reqparse.RequestParser()
#     parser.add_argument('name', type=str)
#     return app.response_class("", 201, mimetype='text/plain')


# @app.route('/room/<string:room_code>/voted', methods=['GET'])
# def voted(room_code):
#     parser = reqparse.RequestParser()
#     parser.add_argument('name')
#     params = parser.parse_args()
#     room = rooms[room_code]
#     return app.response_class(dumps({'voted': room.votes.keys() - {params.name}, 'joined': room.joined - room.votes.keys()}), 200, mimetype='text/plain')


class RoomVIP(Resource):
    def post(self):
        code = generate_random_room_code()
        while code in rooms.keys():
            code = generate_random_room_code()
        rooms[code] = {
            "closed": False,
            "votes": {},
        }

        return code, 201
    
    def put(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("closed", type=bool, required=True)
        params = parser.parse_args()
        closed = params.closed
        room = rooms.get(room_code, None)
        if room is None:
            return 'Unknown Room Code', 404
        if closed == room['closed']:
            return 'Redundant Action, check app logic', 403
        room['closed'] = closed
        return '', 200
    
    def delete(self, room_code):
        del rooms[room_code]  # no reason to make sure that it's there because it's going to be deleted anyways
        return '', 200
    

class RoomAttendance(Resource):
    def post(self, room_code):
        parser = reqparse.RequestParser()
        #   parser.add_argument("action", type=str, help="Should be one of \"join\", \"update_name\", \"vote\", or \"close\"", required=True)
        parser.add_argument("name", type=str, required=True)
        #   parser.add_argument("ranking", type=float)
        params = parser.parse_args()
        name = params.name
        if name == '':
            return 'Invalid name', 409
        room = rooms.get(room_code, None)
        if room is None:
            return 'Unknown Room Code', 404
        if name in room['votes']:
            return 'Someone with that name has already joined this room', 409
        if room['closed']:
            return 'This room has been closed', 403
        
        room['votes'][name] = None
        return '', 201
    
    def delete(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True)
        params = parser.parse_args()
        name = params.name
        room = rooms.get(room_code, None)
        if room is None:
            return '', 200
        del room['votes'][name]
        
        return '', 200


class RoomVoting(Resource):
    def post(self, room_code):
        return '', 201
    
    def delete(self, room_code):
        return '', 200


api.add_resource(RoomVIP, "/room", "/room/", "/room/<string:room_code>/delete", "/room/<string:room_code>/delete/")
api.add_resource(RoomAttendance, "/room/<string:room_code>/attend", "/room/<string:room_code>/attend/")
api.add_resource(RoomVoting, "/room/<string:room_code>/vote", "/room/<string:room_code>/vote/")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)