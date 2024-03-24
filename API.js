import { getComments } from "./main.js";

export function get() {
    return fetch("https://wedev-api.sky.pro/api/v1/evgeniia-lomakina/comments", {
  method: "GET",
  }).then((response) => {
    if (response.status === 500) {
      throw new Error('Сервер сломался');
    } else {
      return response.json();
    }
  })
};

export function post({name, text}) {
    return fetch("https://wedev-api.sky.pro/api/v1/evgeniia-lomakina/comments", 
    {method: "POST",
      body: JSON.stringify({
      name: name,
      text: text,
    //   forceError: true,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Некорректный запрос');
    } else if (response.status === 500) {
      throw new Error('Сервер сломался');
    } else {
      return getComments();
    }
    });
};