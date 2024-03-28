import { getComments } from "./main.js";

const host = 'https://wedev-api.sky.pro/api/v2/evgeniia-lomakina/comments';
const userUrl = 'https://wedev-api.sky.pro/api/user/login';

export let token;

export const setToken = (newToken) => {
  token = newToken;
};

export let user;
export const setUser = (newUser) => {
  user = newUser.trim().replaceAll('>', '&gt;').replaceAll('<', '&lt;');
}

export function get() {
    return fetch(host, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then((response) => {
    if (response.status === 500) {
      throw new Error('Сервер сломался');
    } else {
      return response.json();
    }
  })
};

export function post({name, text}) {
    return fetch(host, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export function login({login, password}) {
  return fetch(userUrl, {
    method: "POST",
    body: JSON.stringify({
    login,
    password,
  }),
}).then((response) => {
  if (response.status === 201) {
    return response.json();
  };
  if (response.status === 400) {
    throw new Error('Некорректные логин или пароль');
  };
  if (response.status === 500) {
    throw new Error('Ошибка сервера');
  };
  }). catch((error) => {
    if (error.message === 'Некорректные логин или пароль') {
      alert('Некорректно введены логин или пароль.');
    };
    if (error.message === 'Ошибка сервера') {
      alert('Сервер сломался, попробуйте позже.');
    }
    if (error.message === 'Failed to fetch') {
      alert('Проблемы с соединением, попробуйте позже.');
    }
    console.warn(error);
  })
};