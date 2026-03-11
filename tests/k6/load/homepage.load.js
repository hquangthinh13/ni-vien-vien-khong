/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  scenarios: {
    homepage_load: {
      executor: 'constant-vus',
      vus: 100,        // 100 users
      duration: '30s', // chạy trong 30 giây
    },
  },
}

export default function () {
  const res = http.get('http://localhost:3000/')

  check(res, {
    'status is 200': (r) => r.status === 200,
  })

  sleep(1)
}