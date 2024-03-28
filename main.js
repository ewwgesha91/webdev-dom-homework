"use strict";
import { get } from "./API.js";
import { renderLogin } from "./renderLogin.js";
import { renderComments, addNewComment } from "./render.js";

const textInput = document.getElementById('text-input');
const preloader = document.getElementById('preloader');

export let comments = [ ];

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
      preloader.style.display = 'none';
      renderComments({comments});
      quoteComment();
      addNewComment();
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

renderLogin();

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