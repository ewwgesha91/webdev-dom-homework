import { login, setToken, setUser } from "./API.js";
import { getComments } from "./main.js";
import _ from "lodash";

export const renderLogin = () => {
  const appElement = document.getElementById("app");
  const loginHtml = `
    <div class="container">
        <div class = 'add-form'>
            <h3 class='form-title'>Форма входа</h3>
            <div class='form-row'>
                <input id = 'login-input'
                    type="text"
                    class="input"
                    placeholder="Введите логин"
                />
                <input id = 'password-input'
                    type="password"
                    class="input"
                    placeholder="Введите пароль"
                />
            </div>
            <button id="login-button" class="button">Войти</button>
            <a href="#" id='reg-link' class="reg">Зарегистрироваться</a>               
        </div>
        </div>`;
  appElement.innerHTML = loginHtml;

  const buttonElement = document.getElementById("login-button");
  const loginInputElement = document.getElementById("login-input");
  const passwordInputElement = document.getElementById("password-input");

  buttonElement.addEventListener("click", () => {
    login({
      login: loginInputElement.value,
      password: passwordInputElement.value,
      name: _.capitalize(name),
    })
      .then((responseData) => {
        setToken(responseData.user.token);
        setUser(responseData.user.name);
      })
      .then(() => {
        getComments();
      });
    loginInputElement.value = "";
    passwordInputElement.value = "";
  });
};
