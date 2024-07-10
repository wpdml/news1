const apiKey ='4851e5992a434a07a5a77e1e205db424';
let news = []

const getNews = async ()=>{
    const url = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?apiKey=${apiKey}&page=1&pageSize=10`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        news = data.articles;
        displayNews();
    } catch (error) {
        console.error('Fetch error: ', error);
    }
};

const displayNews = () => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = news.map(article => `
        <div class="news-article">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
};

getNews();

