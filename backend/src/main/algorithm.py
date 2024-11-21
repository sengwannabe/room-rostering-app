def calculateRoomScore(user, room):
    """
    Calculate compatibility score between user and room with strict chemical preference
    Returns score between 0 and 1, or None if room is incompatible
    Time Complexity: O(E) where E is number of equipment items
    """
    # Strict chemical safety check - immediate disqualification if mismatch
    if user['roomPreference']['chemicalUse'] != room['attributes']['chemicalUse']:
        return None

    # Scoring weights for different criteria
    weights = {
        'capacity': 0.3,  # 30% weight for capacity match
        'equipment': 0.7  # 70% weight for equipment match
    }

    # Capacity scoring (0.2 to 1.0):
    # - If room is too small: 0.2 score
    # - Otherwise: ratio of required/available + 0.2, capped at 1.0
    requiredCapacity = user['roomPreference']['capacity']
    roomCapacity = room['attributes']['capacity']

    if roomCapacity < requiredCapacity:
        capacityScore = 0.2  # Penalty for undersized rooms
    else:
        capacityRatio = requiredCapacity / roomCapacity
        capacityScore = min(1.0, capacityRatio + 0.2)  # Bonus for right-sized rooms

    # Equipment scoring (0 to 1.0):
    # Convert equipment lists to dictionaries for O(1) lookup
    equipmentScore = 0
    userEquipment = {eq['_id']: eq['quantity'] for eq in user['roomPreference']['equipment']}
    roomEquipment = {eq['_id']: eq['quantity'] for eq in room['attributes']['equipment']}

    if userEquipment:
        matches = 0
        totalItems = len(userEquipment)

        # Calculate partial matches for each equipment
        for eqId, requiredQty in userEquipment.items():
            availableQty = roomEquipment.get(eqId, 0)
            if availableQty >= requiredQty:
                matches += 1  # Full match
            elif availableQty > 0:
                matches += (availableQty / requiredQty)  # Partial match

        equipmentScore = matches / totalItems
    else:
        equipmentScore = 1.0  # No equipment requirements means perfect match

    # Calculate weighted final score
    finalScore = (
        capacityScore * weights['capacity'] +
        equipmentScore * weights['equipment']
    )

    return finalScore

def assignRoomsToUsers(users, rooms):
    """
    Assign rooms to users for the week, ensuring chemical preferences are strictly followed
    
    Time Complexity: O(U * R * E) where:
    - U is number of users
    - R is number of rooms
    - E is max number of equipment items
    
    Space Complexity: O(U + R) for assignments and timetable storage
    """
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    # Remove users unavailable for entire week
    availableUsers = [
        user for user in users
        if not all(user['unavailability'][day] for day in days)
    ]

    def getUserPriority(user):
        priority = 0
        # More equipment needs = higher priority (x10 weight)
        priority += len(user['roomPreference']['equipment']) * 10
        # Higher capacity needs = higher priority
        priority += user['roomPreference']['capacity']
        return priority

    # Sort users by priority (most demanding first)
    sortedUsers = sorted(availableUsers, key=getUserPriority, reverse=True)
    availableRooms = rooms.copy()
    userRoomAssignments = {}

    # Phase 1: Assign best matching rooms to users
    for user in sortedUsers:
        bestRoom = None
        bestScore = 0
        bestRoomIdx = -1

        # Filter for chemical compatibility first
        compatibleRooms = [
            (i, room) for i, room in enumerate(availableRooms)
            if room['attributes']['chemicalUse'] == user['roomPreference']['chemicalUse']
        ]

        # Find best matching room among compatible ones
        for i, room in compatibleRooms:
            score = calculateRoomScore(user, room)
            if score is not None and score > bestScore:
                bestScore = score
                bestRoom = room
                bestRoomIdx = i

        # Only assign if match is good enough (>60% compatibility)
        if bestRoom and bestScore > 0.6:
            userRoomAssignments[user['_id']] = {
                'room_id': bestRoom['_id'],
                'room_name': bestRoom['name'],
                'score': bestScore
            }
            availableRooms.pop(bestRoomIdx)

    # Phase 2: Create weekly timetable
    timetable = {day: [] for day in days}

    # Fill each day's schedule ensuring no double-booking
    for day in days:
        assignedRoomsToday = set()
        assignedUsersToday = set()

        for user in sortedUsers:
            # Skip if user is unavailable, already assigned, or has no room
            if (user['unavailability'][day] or
                user['_id'] in assignedUsersToday or
                user['_id'] not in userRoomAssignments):
                continue

            roomId = userRoomAssignments[user['_id']]['room_id']
            roomName = userRoomAssignments[user['_id']]['room_name']

            # Skip if room already assigned today
            if roomId in assignedRoomsToday:
                continue

            # Add assignment to timetable
            timetable[day].append({
                'user_id': user['_id'],
                'user_name': user['name'],
                'room_id': roomId,
                'room_name': roomName,
            })

            assignedRoomsToday.add(roomId)
            assignedUsersToday.add(user['_id'])

    return timetable