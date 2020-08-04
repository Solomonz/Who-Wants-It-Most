#! /usr/bin/env python3

from copy import deepcopy as cp
from flask import Flask
from flask_restful import Api, Resource, reqparse
from json import dumps
from random import choice
import string
import threading
from time import sleep  # for testing

LETTERS = string.ascii_uppercase

app = Flask(__name__)
api = Api(app)

rooms = {}
lock = threading.Lock()

ROOM_STATES = {'open': 0, 'closed': 1, 'tie': 2, 'revealed': 3}
for s, e in list(ROOM_STATES.items()):
    ROOM_STATES[e] = s


def generate_random_room_code():
    return ''.join(choice(LETTERS) for _ in range(4))


class RoomVIP(Resource):
    def post(self):
        with lock:
            global rooms
            code = generate_random_room_code()
            while code in rooms.keys():
                code = generate_random_room_code()
            rooms[code] = {
                "state": ROOM_STATES['open'],
                "votes": {},
            }

            return code, 201
    
    def put(self, room_code):
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is None:
                return 'Unknown Room Code', 404
            if room['state'] not in {ROOM_STATES['open'], ROOM_STATES['closed']}:
                return 'Invalid action for room in "{}" state'.format(ROOM_STATES[room['state']]), 403
            room['state'] = 1 - room['state']
            return '', 200
    
    def delete(self, room_code):
        with lock:
            global rooms
            if room_code in rooms and rooms[room_code]['state'] not in {ROOM_STATES['tie'], ROOM_STATES['revealed']}:
                del rooms[room_code]
            return '', 200
    

class RoomAttendance(Resource):
    def post(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True)
        params = parser.parse_args()
        name = params.name
        if name == '':
            return 'Invalid name', 409
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is None:
                return 'Unknown Room Code', 404
            if name in room['votes']:
                return 'Someone with that name has already joined this room', 409
            if room['state'] != ROOM_STATES['open']:
                return 'This room has been closed', 403
            
            room['votes'][name] = None
            return '', 201
    
    def delete(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True)
        params = parser.parse_args()
        name = params.name
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is not None and name in room['votes'] and room['state'] not in {ROOM_STATES['tie'], ROOM_STATES['revealed']}:
                del room['votes'][name]
            return '', 200


class RoomVoting(Resource):
    def post(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True)
        parser.add_argument("selection", type=float, required=True)
        params = parser.parse_args()
        name = params.name
        selection = params.selection
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is None:
                return 'Unknown Room Code', 404
            if room['state'] == ROOM_STATES['revealed']:
                return 'Room has been revealed, voting has ended', 403
            if name not in room['votes']:
                return 'Unknown Name', 403

            # This isn't really the best validation I could do, but most of the validation happens clientside anyways
            # so I'm not too cut up about it
            if not ((1 <= selection <= 10) if (room['state'] != ROOM_STATES['tie']) else (0.75 <= selection <= 10.25)):
                return 'Invalid Selection', 403
            room['votes'][name] = selection
            return '', 201

    def get(self, room_code):
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is None:
                return 'Unknown Room Code', 404
            
            if room['state'] == ROOM_STATES['revealed']:
                room['remaining_unseen'] -= 1
                if room['remaining_unseen'] == 0:
                    room = cp(room)
                    del rooms[room_code]
            return dumps(room), 200
    
    def delete(self, room_code):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True)
        params = parser.parse_args()
        name = params.name
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is not None and room['state'] not in {ROOM_STATES['tie'], ROOM_STATES['revealed']}:
                room['votes'][name] = None
            return '', 200


class RoomReveal(Resource):
    def post(self, room_code):
        with lock:
            global rooms
            room = rooms.get(room_code, None)
            if room is None:
                return 'Unknown Room Code', 404
            if any(filter(lambda t: t[1] is None, room['votes'].items())):
                return 'Not everyone has voted', 403
            highest = max(room['votes'].values())
            if len(list(filter(lambda t: t[1] == highest, room['votes'].items()))) > 1:
                room['state'] = ROOM_STATES['tie']
                for name in room['votes'].keys():
                    room['votes'][name] = None
            else:
                room['state'] = ROOM_STATES['revealed']
                room['remaining_unseen'] = len(room['votes'])

            return '', 201


class RoomDebug(Resource):
    def get(self):
        with lock:
            global rooms
            return dumps(rooms), 200


api.add_resource(RoomVIP, "/room", "/room/", "/room/<string:room_code>", "/room/<string:room_code>/")
api.add_resource(RoomAttendance, "/room/<string:room_code>/attend", "/room/<string:room_code>/attend/")
api.add_resource(RoomVoting, "/room/<string:room_code>/vote", "/room/<string:room_code>/vote/")
api.add_resource(RoomReveal, "/room/<string:room_code>/reveal", "/room/<string:room_code>/reveal/")
api.add_resource(RoomDebug, "/room/debug/", "/room/debug/")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
