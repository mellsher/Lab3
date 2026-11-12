const loadBtn = document.getElementById('load-btn');
const statusMessage = document.getElementById('status-message');

const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('post-title');
const bodyInput = document.getElementById('post-body');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

const postsList = document.getElementById('posts-list');
const emptyState = document.getElementById('empty-state');

let posts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadBtn.addEventListener('click', fetchPosts);
    postForm.addEventListener('submit', handleCreatePost);
    renderPosts();
});

async function fetchPosts() {
    loadBtn.disabled = true;
    showStatus('Загрузка публикаций...');
    hideError();
    hideSuccess();

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        posts = data;
        renderPosts();
        hideStatus();
    } catch (error) {
        showStatus(`Не удалось загрузить публикации: ${error.message}`);
    } finally {
        loadBtn.disabled = false;
    }
}

async function handleCreatePost(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        showError('Заголовок и текст не должны быть пустыми');
        return;
    }

    hideError();
    hideSuccess();
    submitBtn.disabled = true;
    showStatus('Отправка публикации...');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const newPost = await response.json();

        posts.unshift(newPost);
        renderPosts();

        showSuccess(`Пост создан. ID: ${newPost.id}, Заголовок: "${newPost.title}"`);
        postForm.reset();
    } catch (error) {
        showError(`Ошибка при отправке: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        hideStatus();
    }
}

function renderPosts() {
    postsList.innerHTML = '';

    if (posts.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');

        posts.forEach(post => {
            const li = document.createElement('li');
            li.className = 'post-item';

            const h3 = document.createElement('h3');
            h3.textContent = post.title;

            const p = document.createElement('p');
            p.textContent = post.body;

            li.appendChild(h3);
            li.appendChild(p);
            postsList.appendChild(li);
        });
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

function showSuccess(msg) {
    successMessage.textContent = msg;
    successMessage.classList.remove('hidden');
}

function hideSuccess() {
    successMessage.textContent = '';
    successMessage.classList.add('hidden');
}

function showStatus(msg) {
    statusMessage.textContent = msg;
    statusMessage.classList.remove('hidden');
}

function hideStatus() {
    statusMessage.textContent = '';
    statusMessage.classList.add('hidden');
}
