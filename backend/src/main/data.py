# Logic for database handling
from pymongo import MongoClient
from main.algorithm import assignRoomsToUsers

class Database:
    """
    Database handler class for MongoDB operations.
    Manages CRUD operations for users, equipment, rooms, and timetables.
    """
    
    def __init__(self, uri="mongodb://mongodb:27017/"):
        """Initialize MongoDB connection with default local MongoDB URI"""
        self.client = MongoClient(uri)
        self.db = self.client['data']

    def equipmentGet(self):
        """
        Retrieve all equipment records from database
        Returns: List of equipment documents
        """
        collection = self.db['equipment']
        results = list(collection.find())
        return results

    def usersGet(self):
        """
        Retrieve all users with their room preferences and equipment details
        Enriches equipment data with names from equipment collection
        Returns: List of user documents with complete equipment information
        """
        userCollection = self.db['users']
        userResults = list(userCollection.find())
        # Get equipment for name mapping
        equipmentResults = self.equipmentGet()
        eDict = {}
        # Create equipment lookup dictionary
        for equipment in equipmentResults:
            eDict[equipment['_id']] = equipment['name']
        # Enrich user equipment data with names
        for user in userResults:
            if 'equipment' in user['roomPreference']:
                for index, e in enumerate(user['roomPreference']['equipment']):
                    eId = e['_id']
                    eQuantity = e['quantity']
                    user['roomPreference']['equipment'][index] = {
                        '_id': eId,
                        'name': eDict[eId],
                        'quantity': eQuantity
                    }
        return userResults

    def roomsGet(self):
        """
        Retrieve all room records from database
        Returns: List of room documents
        """
        collection = self.db['rooms']
        results = list(collection.find())
        return results

    def timetableGet(self):
        """
        Retrieve current timetable allocation
        Returns: List of timetable documents
        """
        timetableCollection = self.db['timetable']
        results = list(timetableCollection.find())
        return results

    def setRoomPreference(self, userId, capacity, chemicalUse, equipment):
        """
        Update room preferences for a specific user
        
        Args:
            userId: User identifier
            capacity: Required room capacity
            chemicalUse: Boolean for chemical use requirement
            equipment: List of required equipment
            
        Returns:
            bool: True if update successful, False if user not found
        """
        users = self.db['users']
        userQuery = {"_id": userId}
        user = users.find_one(userQuery)
        if not user:
            return False

        roomPreference = {
            "capacity": capacity,
            "chemicalUse": chemicalUse,
            "equipment": equipment
        }

        updateRoomPreference = {
            "$set": {
                "roomPreference": roomPreference
            }
        }
        users.update_one(userQuery, updateRoomPreference)
        return True

    def changeTimetable(self, users):
        """
        Generate and update the room allocation timetable
        
        Args:
            users: List of users to be allocated rooms
            
        Returns:
            bool: True if update successful
        """
        timetable_result = assignRoomsToUsers(users, self.roomsGet())
        replace_object = {
            "timetable": timetable_result
        }
        timetable_collection = self.db['timetable']
        timetable_collection.replace_one({'_id': 1}, replace_object, upsert=True)
        return True

    def changeUnavailability(self, userId, unavailability):
        """
        Update a user's unavailability schedule
        
        Args:
            userId: User identifier
            unavailability: Dict with boolean values for each weekday
            
        Returns:
            dict: Updated unavailability schedule if successful
            bool: False if user not found
        """
        users = self.db['users']
        userQuery = {'_id': userId}
        user = users.find_one(userQuery)
        if not user:
            return False

        newUnavailability = {
            '$set': {
                'unavailability': unavailability
            }
        }
        users.update_one(userQuery, newUnavailability)
        user = users.find_one(userQuery)
        return user['unavailability']

    def getUserRequestedRoom(self, userId):
        """
        Get room preference details for a specific user
        
        Args:
            userId: User identifier
            
        Returns:
            dict: Room preference details with enriched equipment info
            None: If user not found or no preference set
        """
        users = self.db['users']
        user = users.find_one({"_id": userId})
        
        if not user or 'roomPreference' not in user:
            return None
            
        # Get equipment details for name mapping
        equipmentResults = self.equipmentGet()
        equipmentDict = {eq['_id']: eq['name'] for eq in equipmentResults}
        
        # Format room preference with equipment names
        roomPreference = user['roomPreference']
        if 'equipment' in roomPreference:
            for item in roomPreference['equipment']:
                itemId = item['_id']
                if itemId in equipmentDict:
                    item['name'] = equipmentDict[itemId]
        return {
            "userId": userId,
            "requestDetails": roomPreference
        }
    
    def getRoomWithId(self, room_id):
        """
        Get detailed information about a specific room
        
        Args:
            room_id: Room identifier
            
        Returns:
            dict: Room details with enriched equipment info
            None: If room not found
        """
        rooms = self.db['rooms']
        room = rooms.find_one({"_id": int(room_id)})
        
        if not room:
            return None
            
        # Get equipment details for name mapping
        equipmentResults = self.equipmentGet()
        equipmentDict = {eq['_id']: eq['name'] for eq in equipmentResults}
        
        # Map equipment names in room attributes
        if 'equipment' in room['attributes']:
            for item in room['attributes']['equipment']:
                itemId = item['_id']
                if itemId in equipmentDict:
                    item['name'] = equipmentDict[itemId]

        return room

database = Database()