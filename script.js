const API_KEY = "68587491572849668424f32d95c1a227";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    fetchNews("India");
});


function reload() {
   window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const saveCuttingButton = cardClone.querySelector(".save-cutting-button");
    const seeMoreButton = cardClone.querySelector(".see-more-button");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });

    saveCuttingButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click event from bubbling up
        saveToCuttings(article);
    });

    seeMoreButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click event from bubbling up
        window.open(article.url, "_blank");
    });
}


let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function saveToCuttings(article) {
    let cuttings = JSON.parse(localStorage.getItem("cuttings")) || [];
    cuttings.push(article);
    localStorage.setItem("cuttings", JSON.stringify(cuttings));
    alert("Cutting added!");
    loadCuttings();
    scrollToCuttings();
}

function loadCuttings() {
    const cuttingsContainer = document.getElementById("cuttings-container");
    cuttingsContainer.innerHTML = "";
    let cuttings = JSON.parse(localStorage.getItem("cuttings")) || [];

    cuttings.forEach((article, index) => {
        const cardClone = document.createElement("div");
        cardClone.className = "card";
        cardClone.innerHTML = `
            <div class="card-header">
                <img src="${article.urlToImage}" alt="news-image">
            </div>
            <div class="card-content">
                <h3>${article.title}</h3>
                <h6 class="news-source">${article.source.name} · ${new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}</h6>
                <p class="news-desc">${article.description}</p>
                <button class="delete-cutting-button" onclick="deleteCutting(${index})">Delete</button>
            </div>
        `;
        cuttingsContainer.appendChild(cardClone);
    });
}

function deleteCutting(index) {
    let cuttings = JSON.parse(localStorage.getItem("cuttings")) || [];
    cuttings.splice(index, 1);
    localStorage.setItem("cuttings", JSON.stringify(cuttings));
    loadCuttings();
}

function scrollToCuttings() {
    document.querySelector("section").scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const scrollToTopButton = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
    // Show the scroll-to-top button whenever the user scrolls down
    if (window.pageYOffset > 100) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
});

// Event listener for the scroll-to-top button
scrollToTopButton.addEventListener("click", () => {
    scrollToTop();
});
