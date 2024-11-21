FROM mongo

ADD importDB.sh /

RUN ["chmod", "+x", "importDB.sh"]

# Insert Rooms into MongoDB
COPY rooms.json /rooms.json

# Insert Users into MongoDB
COPY users.json /users.json

# Insert Equipment into MongoDB
COPY equipment.json /equipment.json

# Insert Timetable into MongoDB
COPY timetable.json /timetable.json

CMD ["/importDB.sh"]

# if Dockerfile doesn't see changes try "docker compose up --build mongo-data"