from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from main.data import database
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)

# Route: GET /get_users
# Purpose: Retrieves all users from the database
# Input: None
# Output: JSON array containing all user records
@app.route('/get_users', methods=['GET'])
def getUsers():
    result = database.usersGet()
    return jsonify(dumps(result))

# Route: GET /get_equipment
# Purpose: Retrieves all available equipment from the database
# Input: None
# Output: JSON array containing all equipment records
@app.route('/get_equipment', methods=['GET'])
def getEquipment():
    result = database.equipmentGet()
    return jsonify(dumps(result))

# Route: GET /get_timetable
# Purpose: Retrieves the current room allocation timetable
# Input: None
# Output: JSON object containing room assignments for each day
@app.route('/get_timetable', methods=['GET'])
def getTimetable():
    result = database.timetableGet()
    return jsonify(dumps(result))

# Route: PUT /put_unavailability
# Purpose: Updates a user's unavailability schedule
# Input: JSON object containing:
#   - userId: User identifier
#   - unavailability: Object with boolean values for each weekday
# Output: Updated unavailability object on success, 404 if user not found
@app.route('/put_unavailability', methods=['PUT'])
def putUserUnavailability():
    userId = request.json['userId']
    unavailability = request.json['unavailability']

    result = database.changeUnavailability(userId, unavailability)
    if result:
        return jsonify(result)
    else:
        abort(404)

# Route: PUT /put_room_preference
# Purpose: Updates a user's room requirements and preferences
# Input: JSON object containing:
#   - userId: User identifier
#   - capacity: Required room capacity
#   - chemicalUse: Boolean indicating if chemicals are needed
#   - equipment: Array of required equipment objects
# Output: Success message on update, 400 for invalid data, 404 if user not found
@app.route('/put_room_preference', methods=['PUT'])
def putUserRoomPreference():
    data = request.json
    userId = data.get("userId")
    capacity = data.get("capacity")
    chemicalUse = data.get("chemicalUse")
    equipment = data.get("equipment")

    if not (userId and capacity is not None and chemicalUse is not None and isinstance(equipment, list)):
        abort(400, description = "Invalid input data")

    result = database.setRoomPreference(userId, capacity, chemicalUse, equipment)
    if result:
        return jsonify({"message": "Room preference updated successfully"}), 200
    else:
        abort(404, description = "User not found")

# Route: PUT /put_timetable
# Purpose: Updates the room allocation timetable
# Input: JSON array of user objects to be allocated rooms
# Output: Success message on update, 404 if update fails
@app.route('/put_timetable', methods=['PUT'])
def putTimetable():
    data = request.json
    result = database.changeTimetable(data)
    if result:
        return jsonify({"message": "Timetable updated successfully"}), 200
    else:
        abort(404, description = "Timetable could not be updated")

# Route: GET /get_user_requestroom/<userId>
# Purpose: Retrieves room request details for a specific user
# Input: userId as URL parameter
# Output: JSON object with room request details, 404 if not found
@app.route('/get_user_requestroom/<userId>', methods=['GET'])
def getUserRequestRoom(userId):
    userIdInt = int(userId)
    result = database.getUserRequestedRoom(userIdInt)
    
    if result is None:
        return jsonify({
            "message": "No room request found or user does not exist"
        }), 404
        
    return jsonify(result), 200

# Route: GET /get_room/<room_id>
# Purpose: Retrieves details of a specific room
# Input: room_id as URL parameter
# Output: JSON object with room details, 404 if room not found
@app.route('/get_room/<room_id>', methods=['GET'])
def getRoomById(room_id):
    result = database.getRoomWithId(room_id)
    
    if result is None:
        return jsonify({
            "message": "Room not found"
        }), 404
        
    return jsonify(dumps(result)), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
