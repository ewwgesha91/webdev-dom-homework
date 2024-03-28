import { getComments, initLikesListeners, quoteComment } from "./main.js";
import { currentDate } from "./date.js";
import { post, token, user } from "./API.js";
import { renderLogin } from "./renderLogin.js";

const comment = document.getElementById('comment');

export const renderComments = ({comments}) => {
  const appElement = document.getElementById('app');
    const commentHtml = comments.map((comment, index) => {
      return `<li class="comment" data-index="${index}">
        <div class="comment-header">
          <div id ='name-input'>${comment.name}</div>
          <div>${currentDate(comment.date)}</div>
        </div>
        <div class="comment-body">
          <div id='text-input' class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likesCounter}</span>
            <button data-index='${index}' class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>`
    }).join('');

    const formHtml = () => {
      const btnLogin = `
      <p class='render-login-btn'>Чтобы добавить комментарий, <n id="render-login-btn">авторизуйтесь.</n></p>`
      if (!token) return btnLogin; 
      return `
      <div class='container'>
      <div id="add-form" class="add-form">
        <input id = 'name-input'
          type="text"
          class="add-form-name"
          value="${user}" 
          readonly/>
        <textarea id = 'add-text'
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш коментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button id="add-button" class="add-form-button">Написать</button>
        </div>
      </div>
      <div id="loader"></div>
      </div>`
    } 
    
    function actionRenderLoginBtn() {
      if (token) return;
      const btn = document.querySelector('.render-login-btn');
      btn.addEventListener('click', () => {
        renderLogin();
      });
    }

    const appHtml = `
    <div class="container">
        <ul id = 'comment' class="comments">${commentHtml}</ul>
      ${formHtml()}
    </div>`;

    appElement.innerHTML = appHtml;

    actionRenderLoginBtn();   
    initLikesListeners({comments}, {renderComments});
    quoteComment();
  };

export const addNewComment = () => {
    const addButton = document.getElementById('add-button');
    const nameInput = document.getElementById('name-input');
    const addText = document.getElementById('add-text');

    if (addButton) {
      addButton.addEventListener('click', () => {
        nameInput.classList.remove('error');
        addText.classList.remove('error');
        if (addText.value === '') {
          nameInput.classList.add('error');
          addText.classList.add('error');
          return;
        } else if (nameInput.value === '') {
          nameInput.classList.add('error');
          return;
        } else if (addText.value === '') {
          addText.classList.add('error');
          return;
        }

        addButton.disabled = true;
        addButton.textContent = 'Комментарий добавляется...';
        addButton.classList.remove('hover');
  
        const postComment = () => {
          post({ 
            name: nameInput.value,
            text: addText.value,
          }).then(() => {
            return getComments();
          }).then(() => {
            addButton.disabled = false;
            addButton.textContent = 'Написать';
            nameInput.value = '';
            addText.value = '';
          })
          .catch((error) => {
            if (error.message === 'Некорректный запрос') {
              alert('Комментарий должен быть не короче 3 символов.');
              addButton.disabled = false;
              addButton.textContent = 'Написать';
            };
             if (error.message === 'Сервер сломался') {
              alert('Сервер сломался, попробуйте позже.');
              addButton.disabled = false;
              addButton.textContent = 'Написать';
            };
            if (error.message === 'Failed to fetch') {
              alert('Проблемы с соединением, попробуйте позже.');
              addButton.disabled = false;
              addButton.textContent = 'Написать';
            }
            console.warn(error);
          });
        }
        postComment();
      });
    };
  }