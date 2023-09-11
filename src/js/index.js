import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const pixabayAPI = new PixabayAPI();
const target = document.querySelector('.js-guard');
const simplelightbox = new SimpleLightbox('.gallery a', {});

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handleIntersect, options);
searchForm.addEventListener('submit', handlerSearchForm);
// loadMoreBtn.addEventListener('click', handlerLoadMoreBtn);

function handlerSearchForm(evt) {
  evt.preventDefault();
  target.hidden = true;
  // loadMoreBtn.hidden = true;
  gallery.innerHTML = '';
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;
  pixabayAPI.page = 1;
  searchPhotos();
}

async function searchPhotos() {
    
}