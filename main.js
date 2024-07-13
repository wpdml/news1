const apiKey = '4851e5992a434a07a5a77e1e205db424';
let news = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getLatestNews = async () => {
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
            totalResults = data.totalResults;
            displayNews();
            pagination();
        }
    } catch (error) {
        displayError(`Fetch error: ${error.message}`);
        console.error('Fetch error: ', error);
    }
};

const getNews = async (category = '') => {
    page = 1;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`);
    if (category) {
        url.searchParams.set('category', category);
    }
    getLatestNews();
};

const getNewsByPage = (pageNumber) => {
    page = pageNumber;
    url.searchParams.set('page', page);
    getLatestNews();
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
    page = 1;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}&q=${query}&page=${page}&pageSize=${pageSize}`);
    getLatestNews();
};

const pagination = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    const pageGroup = Math.ceil(page / groupSize);
    const lastPage = Math.min(totalPages, pageGroup * groupSize);
    const firstPage = Math.max(1, lastPage - (groupSize - 1));

    let paginationHTML = `
    <li class="page-item gap-left ${page === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="getNewsByPage(1)">◼</a>
    </li>
`;

    paginationHTML += `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getNewsByPage(${firstPage})"><<</a>
        </li>
    `;
    paginationHTML += `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getNewsByPage(${page - 1})">◀</a>
        </li>
    `;

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="getNewsByPage(${i})">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getNewsByPage(${page + 1})">▶</a>
        </li>
    `;
    
    paginationHTML += `
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getNewsByPage(${lastPage})">>></a>
        </li>
    `;
        
    paginationHTML += `
        <li class="page-item gap-right ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getNewsByPage(${totalPages})">⏭</a>
        </li>
    `;

    document.querySelector('.pagination').innerHTML = paginationHTML;
};

getNews();
