import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './axiosFetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  inputField: document.querySelector("input[type='text']"),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let currentImage = '';
refs.searchForm.addEventListener('submit', onSubmitForm);

async function onSubmitForm(event) {
  event.preventDefault();
  let page = 1;
  const imageToSearch = refs.inputField.value;
  if (imageToSearch === currentImage) {
    return;
  }

  currentImage = imageToSearch;

  clearGallery();
  hideMoreBtn();

  const images = await getImages(imageToSearch, page);
  page += 1;
  const totalHits = images.totalHits;

  if (+totalHits > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderMarkup(images);
    const lastPage = Math.ceil(images.totalHits / 40);

    lastPage > 1 && showMoreBtn();

    refs.loadMoreBtn.addEventListener('click', () => {
      if (page <= lastPage) {
        getImages(imageToSearch, page)
          .then(images => renderMarkup(images))
          .then(() => (page += 1));
      } else {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });

    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}

function renderMarkup({ hits }) {
  hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const markup = `
      <div class="photo-card">
        <a class="photo-card__link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    }
  );
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function showMoreBtn() {
  refs.loadMoreBtn.classList.remove('visually-hidden');
}
function hideMoreBtn() {
  refs.loadMoreBtn.classList.add('visually-hidden');
}
