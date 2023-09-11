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
  rootMargin: '0px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handleIntersect, options);

searchForm.addEventListener('submit', handlerSearchForm);
loadMoreBtn.addEventListener('click', handlerLoadMoreBtn);

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
    try {
        const { data } = await pixabayAPI.fetchPhotos();
        if (data.hits.length < 1) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      // loadMoreBtn.hidden = true;
      return;
        }
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        target.hidden = false;
        observer.observe(target);
        simplelightbox.refresh();
        // loadMoreBtn.hidden = false;
    } catch (error) {
        console.log(error);
    };
}

function handleIntersect(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixabayAPI.page += 1;
      const result = pixabayAPI.page * 40;
      const { data } = await pixabayAPI.fetchPhotos();
        
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      if (result >= data.totalHits) {
        observer.unobserve(target);
        Notify.failure("We're sorry, but you've reached the end of search results.");
       
        return;
      };

      simplelightbox.refresh();
    }
  });
}

  async function searchMorePhotos () {
    try {
        const result = pixabayAPI.page * 40;
        const { data } = await pixabayAPI.fetchPhotos();
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        if (result >= data.totalHits) {
            observer.unobserve(target);
            Notify.failure("We're sorry, but you've reached the end of search results.");
            // loadMoreBtn.hidden = true;
            return;
          };
          // addSmoothScroll();
    simplelightbox.refresh();
} catch (error) {
  
}

}

// function handlerLoadMoreBtn() {
//   pixabayAPI.page += 1;
//   searchMorePhotos();
   
// }

// async function searchMorePhotos() {
//   try {
//     const result = pixabayAPI.page * 40;
//     const { data } = await pixabayAPI.fetchPhotos();
//     if (result >= data.totalHits) {
//       Notify.failure("We're sorry, but you've reached the end of search results.");
//       loadMoreBtn.hidden = true;
//       return;
//     };
//     gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits)); 
//     // addSmoothScroll();
//     simplelightbox.refresh();
//   } catch (error) {
    
//   }
// }

// function addSmoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector(".gallery")
//     .firstElementChild.getBoundingClientRect();
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: "smooth",
//   });
// }