import axios from 'axios';

export async function getImages(imageToSearch,currentPage) {
  const images = await axios.get(
    `https://pixabay.com/api/?key=30325215-4f4b62b7b42e30a3a20b05ae5&q=${imageToSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`
  );
    return images.data;
}
