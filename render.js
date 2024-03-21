import { initLikesListeners, quoteComment } from "./main.js";
import { currentDate } from "./date.js";

const comment = document.getElementById('comment');

export const renderComments = ({comments}) => {
    comment.innerHTML = comments.map((comment, index) => {
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
    initLikesListeners({comments}, {renderComments});
    quoteComment();
  };
