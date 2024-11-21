from main.server import app, database
from mongomock import MongoClient
from flask import jsonify
import pytest
import json

# Sets up mock mongo instance so that actual mongoDB instance is not required for testing
dummyClient = MongoClient()

# Fixture sets up and tears down mock database before and after each test
@pytest.fixture(autouse=True)
def mockData():
    with app.app_context():
        database.client = dummyClient
        database.db = database.client['data']
        with open('src/test/testData/equipmentTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['equipment'].insert_one(d)
        with open('src/test/testData/roomsTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['rooms'].insert_one(d)
        with open('src/test/testData/usersTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['users'].insert_one(d)
        yield
        database.db['equipment'].drop()
        database.db['rooms'].drop()
        database.db['users'].drop()

# Tests /get_users route
def test_getUsers(mockData):
    client = app.test_client()
    res = client.get('/get_users')

    expected = [{
        '_id': 1,
        'name': 'John Johnson',
        'isManager': True,
        'unavailability': {
            'Monday': True,
            'Tuesday': True,
            'Wednesday': True,
            'Thursday': True,
            'Friday': True
        },
        'roomPreference': {
            'capacity': 1,
            'chemicalUse': True,
            'equipment': [
                {
                '_id': 1,
                'name': 'Chair',
                'quantity': 1
                }
            ]
        }
    }]

    actual = json.loads(res.json)

    assert res.status_code == 200
    assert actual == expected

# Tests /get_equipment route
def test_getEquipment(mockData):
    client = app.test_client()
    res = client.get('/get_equipment')

    expected = [
        {
            '_id': 1,
            'name': 'Chair',
            'dependentId': None
        },
        {
            '_id': 2,
            'name': 'Workbench',
            'dependentId': None
        }
    ]

    actual = json.loads(res.json)

    assert res.status_code == 200
    assert actual == expected

# Tests successful /put_unavailability route
def test_putUserUnavailabilitySuccess(mockData):
    client = app.test_client()
    inputData = {
        'userId': 1,
        'unavailability': {
            'Monday': False,
            'Tuesday': False,
            'Wednesday': False,
            'Thursday': False,
            'Friday': True
        }
    }
    res = client.put(
        '/put_unavailability',
        json=inputData
    )

    expected = {
        'Monday': False,
        'Tuesday': False,
        'Wednesday': False,
        'Thursday': False,
        'Friday': True
    }

    actual = res.json

    assert res.status_code == 200
    assert actual == expected

# Tests unsuccessful /put_unavailability route when user id is invalid
def test_putUserUnavailabilityInvalidId(mockData):
    client = app.test_client()
    inputData = {
        'userId': 3,
        'unavailability': {
            'Monday': False,
            'Tuesday': False,
            'Wednesday': False,
            'Thursday': False,
            'Friday': True
        }
    }
    res = client.put(
        '/put_unavailability',
        json=inputData
    )

    assert res.status_code == 404

# Tests successful /put_room_preference route
def test_putUserRoomPreferenceSuccess(mockData):
    client = app.test_client()

    # Initial room preference
    res = client.get('/get_users')
    expectedInitial = [{
        '_id': 1,
        'name': 'John Johnson',
        'isManager': True,
        'unavailability': {
            'Monday': True,
            'Tuesday': True,
            'Wednesday': True,
            'Thursday': True,
            'Friday': True
        },
        'roomPreference': {
            'capacity': 1,
            'chemicalUse': True,
            'equipment': [
                {
                '_id': 1,
                'name': 'Chair',
                'quantity': 1
                }
            ]
        }
    }]
    actualInitial = json.loads(res.json)
    assert actualInitial == expectedInitial

    # Room preference call
    inputData = {
        'userId': 1,
        'capacity': 25,
        'chemicalUse': False,
        'equipment': [
            {
                '_id': 1,
                'quantity': 10
            },
            {
                '_id': 2,
                'quantity': 25
            } 
        ]
    }
    res = client.put(
        '/put_room_preference',
        json=inputData
    )

    assert res.status_code == 200

    # Final room preference
    res = client.get('/get_users')
    expectedFinal = [{
        '_id': 1,
        'name': 'John Johnson',
        'isManager': True,
        'unavailability': {
            'Monday': True,
            'Tuesday': True,
            'Wednesday': True,
            'Thursday': True,
            'Friday': True
        },
        'roomPreference': {
            'capacity': 25,
            'chemicalUse': False,
            'equipment': [
                {
                    '_id': 1,
                    'name': 'Chair',
                    'quantity': 10
                },
                {
                    '_id': 2,
                    'name': 'Workbench',
                    'quantity': 25
                }
            ]
        }
    }]
    actualFinal = json.loads(res.json)
    assert actualFinal == expectedFinal


# Tests successful /get_user_requestroom route
def test_getUserRequestRoom(mockData):
    client = app.test_client()

    res = client.get(
        '/get_user_requestroom/1',
    )

    expected = {
        'userId': 1,
        'requestDetails': {
            'capacity': 1,
            'chemicalUse': True,
            'equipment': [{
                '_id': 1,
                'name': 'Chair',
                'quantity': 1
            }]
        }
    }

    actual = res.json

    assert res.status_code == 200
    assert actual == expected

# Tests successful /get_room route
def test_getRoom(mockData):
    client = app.test_client()
    res = client.get(
        '/get_room/1',
    )

    expected = {
        '_id': 1,
        'name': 'Clancy',
        'attributes': {
            'capacity': 10,
            'chemicalUse': True,
            'equipment': [
            {
                '_id': 1,
                'name': 'Chair',
                'quantity': 2
            }
            ]
        }
    }

    actual = json.loads(res.json)

    assert res.status_code == 200
    assert actual == expected