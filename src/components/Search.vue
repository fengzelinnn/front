<template>
    <div class="background-image" :style="{backgroundImage: `url(${backgroundImageUrl})`}"></div>
    <div class="search">
        <div class="header-container" :class="headerClass">
            <h1 :class="headerClass">Gotcha</h1>
            <br>
            <div class="search-bar" :class="headerClass">
                <span class="search-icon">&#x1F50D;</span>
                <input
                    type="text"
                    v-model="searchQuery"
                    @input="debouncedSearch"
                    class="search-input"
                />
            </div>
<!--            <div class="search-history" v-if="searchHistory.length > 0">-->
<!--                <ul>-->
<!--                    <li v-for="history in searchHistory" @click="searchQuery = history">{{ history }}</li>-->
<!--                </ul>-->
<!--            </div>-->
        </div>
        <br>
        <div class="results" :style="resultsStyle">
            <div class="results" :style="resultsStyle">
                <div v-for="result in searchResults" class="result-item">
                    <div class="result-url">
                        ➡️<a :href="result.url" target="_blank">{{ result.title }}</a>
                        <br>
                    </div>
                    <br>
                    <div class="result-text">
                        <span v-html="highlight(result.content)"></span>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import backgroundImageUrl from "@/assets/bakk.png";

export default {
    data() {
        return {
            searchQuery: "",
            searchResults: [],
            backgroundImageUrl, // 新增背景图片 URL 属性
        };
    },
    methods: {
        performSearch() {
            axios
                .post("http://localhost:8080/api/search", { query: this.searchQuery })
                .then((response) => {
                    this.searchResults = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
            this.saveSearchHistory(this.searchQuery);
        },
        highlight(text) {
            const maxLength = 500;
            const shortenedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
            const escapedQuery = this.searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            return shortenedText.replace(regex, '<mark>$1</mark>');
        },
        saveSearchHistory(query) {
            if (!query) return;

            let searchHistory = localStorage.getItem("searchHistory");
            searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

            if (!searchHistory.includes(query)) {
                searchHistory.push(query);
                if (searchHistory.length > 10) { // 限制搜索记录的数量，例如最多10条
                    searchHistory.shift(); // 删除最早的搜索记录
                }
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            }
        },
    },
    created() {
        this.debouncedSearch = _.debounce(this.performSearch, 300);
    },
    computed: {
        headerClass() {
            return this.searchResults.length > 0 ? "minimized" : "";
        },
        resultsStyle() {
            return this.searchResults.length > 0 ? { paddingTop: "2rem" } : {};
        },
        searchHistory() {
            let searchHistory = localStorage.getItem("searchHistory");
            return searchHistory ? JSON.parse(searchHistory) : [];
        },
    },

};
</script>

<style>
* {
    box-sizing: border-box;
}

/* Add media queries for responsiveness */
@media (max-width: 1024px) {
    .search-bar {
        width: 70%;
    }

    .search-bar.minimized {
        width: 90%;
    }
}

@media (max-width: 768px) {
    .search-bar {
        width: 80%;
    }

    .search-bar.minimized {
        width: 95%;
    }
}

@media (max-width: 480px) {
    .search-bar {
        width: 100%;
    }

    .search-input {
        font-size: 20px;
    }

    .search-button {
        font-size: 20px;
    }

    h1 {
        font-size: 2rem;
    }

    .results {
        padding: 0;
    }
}

body {
    font-family: "Roboto", sans-serif;
    margin: 0px;
}


.search {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 5rem;
    min-height: 100%;
}

h1 {
    text-align: center;
    font-size: 6rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #ffffff;
}

.search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    margin: auto;
}

.header-container.minimized {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 11%;
    width: 100%;
    background-color: rgba(48, 88, 200, 0.95);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
}

h1.minimized {
    font-size: 30px;
    position: fixed;
    left: 1rem;
    top: 1.3rem;
    margin: 0;
}

.search-bar.minimized {
    position: fixed;
    top: 1rem;
    left:28%;
    width: 71%;
}

.search-icon {
    position: absolute;
    font-size: 25px;
    padding-left: 1rem;
    padding-top: 0.3rem;
    color: #777;
    z-index: 2;
}

.search-input {
    font-size: 15px;
    flex: 1;
    padding: 1rem 1.5rem;
    padding-left: 45px;
    border-radius: 25px;
    border: 1px solid #e0e0e0;
    background-color: rgba(19, 8, 167, 0);
    transition: box-shadow 0.3s ease;
    color: white;
}

.search-input:focus {
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: rgba(19, 8, 167, 0.5);
    border-color: #6200ee;
}

.search-input:hover {
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: rgba(19, 8, 167, 0.5);
    border-color: #6200ee;
}

.search-button {
    font-size: 26px;
    background-color: #6200ee;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-left: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: #3700b3;
}

.results {
    width: 100%;
}

.result-item {
    background-color: #ffffff;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.result-item:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-url,
.result-text {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212121;
}

.result-url a {
    color: #6200ee;
    text-decoration: none;
    transition: color 0.3s ease;
}

.result-url a:hover {
    color: #3700b3;
}
.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -1;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.result-text mark {
    background-color: #ffeb3b;
    padding: 0;
}

</style>