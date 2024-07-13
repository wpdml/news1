const apiKey = '4851e5992a434a07a5a77e1e205db424';
let news = [];

let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}`)

const getLatestNews = async() => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.articles.length === 0) {
            displayError('No matches for your search');
        } else {
            news = data.articles;
            displayNews();
        }
    } catch (error) {
        displayError(`Fetch error: ${error.message}`);
        console.error('Fetch error: ', error);
    }
}

const getNews = async (category = '') => {
    url = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}&page=1&pageSize=10`;
    if (category) {
        url += `&category=${category}`;
    }
    getLatestNews()
};

const displayNews = () => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = news.map(article => `
        <div class="col-md-4">
            <div class="news-article">
                <h2 class="news-title">${article.title || 'No Title'}</h2>
                <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="News Image">
                <p>${article.description ? article.description.substring(0, 200) + (article.description.length > 200 ? '...' : '') : 'No Description'}</p>
                <p><strong>Source:</strong> ${article.source.name || 'No Source'}</p>
                <p><strong>Published:</strong> ${moment(article.publishedAt).fromNow()}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        </div>
    `).join('');
};

const displayError = (message) => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = `<div class="col-md-12"><p class="error-message">${message}</p></div>`;
};

const handleCategoryClick = (category) => {
    closeNav();
    getNews(category); 
};

const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
};

const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
};

const toggleSearch = () => {
    const searchBar = document.getElementById('search-bar');
    searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
};

const handleSearch = (event) => {
    if (event.key === 'Enter') {
        const query = event.target.value;
        getNewsByQuery(query);
    }
};

const getNewsByQuery = async (query) => {
    url = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}&q=${query}&page=1&pageSize=10`;
    getLatestNews()
};

getNews();
