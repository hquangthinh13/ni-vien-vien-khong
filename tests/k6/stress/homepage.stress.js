/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http"
import { sleep } from "k6"

export const options = {
  stages: [
    { duration: "2m", target: 50 },
    { duration: "2m", target: 100 },
    { duration: "2m", target: 200 },
    { duration: "2m", target: 400 },
    
  ],
}

export default function () {
  http.get("https://staging.vienkhongni.com/")
  sleep(1)
}