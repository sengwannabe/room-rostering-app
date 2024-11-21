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
        with open('src/test/testData/bigdata/equipmentBigTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['equipment'].insert_one(d)
        with open('src/test/testData/bigdata/roomsBigTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['rooms'].insert_one(d)
        with open('src/test/testData/bigdata/usersBigTest.json') as file:
            data = json.load(file)
            for d in data:
                database.db['users'].insert_one(d)
        yield
        database.db['equipment'].drop()
        database.db['rooms'].drop()
        database.db['users'].drop()

# Tests one user avaiable for all days
def test_algorithmOneUser(mockData):
    client = app.test_client()

    # Get user/s to be inserted into algorithm
    res = client.get('/get_users')
    users = json.loads(res.json)
    inputData = [users[0]]

    # Generate timetable using algorithm from flask endpoint
    res = client.put(
        '/put_timetable',
        json=inputData
    )

    assert res.status_code == 200

    # Retrieve timetable from flask endpoint
    res = client.get('/get_timetable')
    actual = json.loads(res.json)

    expected = [{
        '_id': 1,
        'timetable': {
            'Monday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Tuesday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Wednesday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Thursday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Friday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
        }
    }]

    assert res.status_code == 200
    assert actual == expected

# Tests user is unavailable all days
def test_algorithmUserUnavailable(mockData):
    client = app.test_client()

    # Get user/s to be inserted into algorithm
    res = client.get('/get_users')
    users = json.loads(res.json)
    inputData = [users[1]]

    # Generate timetable using algorithm from flask endpoint
    res = client.put(
        '/put_timetable',
        json=inputData
    )

    assert res.status_code == 200

    # Retrieve timetable from flask endpoint
    res = client.get('/get_timetable')
    actual = json.loads(res.json)

    expected = [{
        '_id': 1,
        'timetable': {
            'Monday': [],
            'Tuesday': [],
            'Wednesday': [],
            'Thursday': [],
            'Friday': [],
        }
    }]

    assert res.status_code == 200
    assert actual == expected

# Tests multiple users
def test_algorithmMultipleUsers(mockData):
    client = app.test_client()

    # Get user/s to be inserted into algorithm
    res = client.get('/get_users')
    users = json.loads(res.json)
    inputData = users

    # Generate timetable using algorithm from flask endpoint
    res = client.put(
        '/put_timetable',
        json=inputData
    )

    assert res.status_code == 200

    # Retrieve timetable from flask endpoint
    res = client.get('/get_timetable')
    actual = json.loads(res.json)

    expected = [{
        '_id': 1,
        'timetable': {
            'Monday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                },
                {
                    'user_id': 4,
                    'user_name': 'I need a workbench and Monday',
                    'room_id': 2,
                    'room_name': 'WorkbenchOnlyRoom'
                }
            ],
            'Tuesday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Wednesday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Thursday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                }
            ],
            'Friday': [
                {
                    'user_id': 1,
                    'user_name': 'I Work Everday',
                    'room_id': 1,
                    'room_name': 'EverythingButPipettes'
                },
                {
                    'user_id': 3,
                    'user_name': 'I Require Pipettes and Fridays',
                    'room_id': 4,
                    'room_name': 'PipetteRoomOnly'
                }
            ],
        }
    }]

    assert res.status_code == 200
    assert actual == expected

# Tests users only available for one day
def test_algorithmUsersOneDay(mockData):
    client = app.test_client()

    # Get user/s to be inserted into algorithm
    res = client.get('/get_users')
    users = json.loads(res.json)
    inputData = [users[2], users[3]]

    # Generate timetable using algorithm from flask endpoint
    res = client.put(
        '/put_timetable',
        json=inputData
    )

    assert res.status_code == 200

    # Retrieve timetable from flask endpoint
    res = client.get('/get_timetable')
    actual = json.loads(res.json)

    expected = [{
        '_id': 1,
        'timetable': {
            'Monday': [
                {
                    'user_id': 4,
                    'user_name': 'I need a workbench and Monday',
                    'room_id': 2,
                    'room_name': 'WorkbenchOnlyRoom'
                }
            ],
            'Tuesday': [],
            'Wednesday': [],
            'Thursday': [],
            'Friday': [
                {
                    'user_id': 3,
                    'user_name': 'I Require Pipettes and Fridays',
                    'room_id': 4,
                    'room_name': 'PipetteRoomOnly'
                }
            ],
        }
    }]

    assert res.status_code == 200
    assert actual == expected