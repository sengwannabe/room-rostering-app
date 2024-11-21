#!/bin/bash
# sleep to ensure that command connects to mongoDB successfully
sleep 2
mongosh data --host mongodb --eval "db.dropDatabase()"

# sleep to ensure that commands connects to cleared mongoDB
sleep 2
# Adds rooms, users, and equipment in that order.
mongoimport --host mongodb --db data --collection rooms --type json --file /rooms.json --jsonArray
mongoimport --host mongodb --db data --collection users --type json --file /users.json --jsonArray
mongoimport --host mongodb --db data --collection equipment --type json --file /equipment.json --jsonArray
mongoimport --host mongodb --db data --collection timetable --type json --file /timetable.json --jsonArrays