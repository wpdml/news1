const apiKey ='4851e5992a434a07a5a77e1e205db424';
let news = [];

const getNews = async ()=>{
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles
    console.log("ddd",news);
};
getNews();

