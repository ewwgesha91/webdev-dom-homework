"use strict";
import { get, post } from "./API.js";
import { renderComments } from "./render.js";

const nameInput = document.getElementById('name-input');
const textInput = document.getElementById('text-input');
const addButton = document.getElementById('add-button');

const preloader = document.getElementById('preloader');
const addForm = document.getElementById('add-form');
const loader = document.getElementById('loader');


loader.style.display = 'none';

export const getComments = () => {
  get().then((responseData) => {
       const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likesCounter: comment.likes,
          isLiked: comment.isLiked,
        };
      });
      comments = appComments;
      renderComments({comments});
      quoteComment();
      preloader.style.display = 'none';
    })
    .catch((error) => {
       if (error.message === 'Сервер сломался') {
        alert('Сервер сломался, попробуйте позже.');
      };
      if (error.message === 'Failed to fetch') {
        alert('Проблемы с соединением, попробуйте позже.');
      }
      console.warn(error);
    });
}; 
getComments();

let comments = [ ];

export const initLikesListeners = () => {
  const likeButtons = document.querySelectorAll('.like-button');
  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const index = likeButton.dataset.index;
      comments[index].likesCounter += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;
      renderComments({comments});
      quoteComment();
    })
  }
}

export const quoteComment = () => {
    const commentElements = document.querySelectorAll(".comment");
    for (const comment of commentElements) {
      comment.addEventListener('click', () => {
      const index = comment.dataset.index;
      textInput.value = `${comments[index].name}: \n${comments[index].text}\n`;
      })
    }
  }

renderComments({comments}); 
quoteComment();

addButton.addEventListener('click', () => {
  nameInput.classList.remove('error');
  textInput.classList.remove('error');
  if (nameInput.value.trim() === '' && textInput.value.trim() === '') {
    nameInput.classList.add('error');
    textInput.classList.add('error');
    return;
  } else if (nameInput.value.trim() === '') {
    nameInput.classList.add('error');
    return;
  } else if (textInput.value.trim() === '') {
    textInput.classList.add('error');
    return;
  }
  
  addForm.style.display = 'none';
  loader.style.display = 'block';

  const postComment = () => {
    post({ 
      name: nameInput.value.replaceAll('>', '&gt;').replaceAll('<', '&lt;'),
      text: textInput.value.replaceAll('>', '&gt;').replaceAll('<', '&lt;')
    }).then(() => {
      loader.style.display = 'none';
      addForm.style.display = 'flex';
      nameInput.value = '';
      textInput.value = '';
    })
    .catch((error) => {
      if (error.message === 'Некорректный запрос') {
        alert('Имя и комментарий должны быть не короче 3 символов.');
      };
       if (error.message === 'Сервер сломался') {
        alert('Сервер сломался, попробуйте позже.');
      };
      if (error.message === 'Failed to fetch') {
        alert('Проблемы с соединением, попробуйте позже.');
      }
      loader.style.display = 'none';
      addForm.style.display = 'flex';
      console.warn(error);
    });
  }
  postComment();
});
renderComments({comments});
quoteComment();