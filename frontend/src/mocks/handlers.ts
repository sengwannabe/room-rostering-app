// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import config from '../config.json';
import sampleUsers from './testData/usersTest.json';
import sampleEquipment from './testData/equipmentTest.json';
import sampleTimetable from './testData/timetableTest.json';
import sampleRoom from './testData/clancyTest.json'
import sampleUserRoomRequest from './testData/userRoomRequestTest.json';

export const handlers = [
  // Intercept "GET https://localhost:5001/get_users" requests...
  http.get(`http://localhost:${config.BACKEND_PORT}/get_users`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify(sampleUsers))
  }),
  // Intercept "GET https://localhost:5001/get_equipment" requests...
  http.get(`http://localhost:${config.BACKEND_PORT}/get_equipment`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify(sampleEquipment))
  }),
  // Intercept "GET https://localhost:5001/get_timetable" requests...
  http.get(`http://localhost:${config.BACKEND_PORT}/get_timetable`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify(sampleTimetable))
  }),
  // Intercept "GET https://localhost:5001/get_room" requests...
  http.get(`http://localhost:${config.BACKEND_PORT}/get_room/:id`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify(sampleRoom))
  }),
  // Intercept "GET https://localhost:5001/get_user_requestroom" requests...
  http.get(`http://localhost:${config.BACKEND_PORT}/get_user_requestroom/:id`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify(sampleUserRoomRequest))
  }),
  // Intercept "PUT https://localhost:5001/put_timetable" requests...
  http.put(`http://localhost:${config.BACKEND_PORT}/put_timetable`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify({message: 'Success'}))
  }),
  // Intercept "PUT https://localhost:5001/put_room_preference" requests...
  http.put(`http://localhost:${config.BACKEND_PORT}/put_room_preference`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(JSON.stringify({message: 'Success'}))
  }),
  // Intercept "PUT https://localhost:5001/put_unavailability" requests...
  http.put(`http://localhost:${config.BACKEND_PORT}/put_unavailability`, () => {
    return HttpResponse.json(JSON.stringify({message: 'Success' }));
  })
]