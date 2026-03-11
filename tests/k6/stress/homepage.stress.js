/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // 100 users
    { duration: '1m', target: 300 },  // 300 users
    { duration: '1m', target: 500 },  // 500 users
    { duration: '1m', target: 1000 }, // 1000 users
    { duration: '1m', target: 0 },    // ramp down
  ],
}

export default function () {
  http.get('http://localhost:3000/')
  sleep(1)
}