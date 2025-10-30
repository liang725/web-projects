// 初始化部分
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

// 第三方接口地址
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`; // 根据菜名，搜菜单
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`; // 根据菜名id，搜菜谱详情
const STORAGE_KEY = 'lastSearchTerm'; // 用于localStorage存储的键名

// 三个事件
searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMeals();
});
// 使用事件委托处理点击菜单项目事件
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    mealsContainer.scrollIntoView({ behavior: "smooth" }); // 返回搜索结果时滚动到列表
});


// 搜索菜单的方法
async function searchMeals(isInit = false) {
    const searchTerm = searchInput.value.trim();
    // handled the edge case
    if (!searchTerm) {
        errorContainer.textContent = "Please enter a search term";
        errorContainer.classList.remove("hidden");
        return;
    }
    try {
        resultHeading.textContent = `Searching for "${searchTerm}"...`;
        mealsContainer.innerHTML = "";
        errorContainer.classList.add("hidden");
        mealDetails.classList.add("hidden"); // 隐藏详情页

        // fetch meals from API
        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();

        if (data.meals === null) {
            // no meals found
            resultHeading.textContent = ``;
            mealsContainer.innerHTML = "";
            errorContainer.textContent = `No recipes found for "${searchTerm}". Try another search term!`;
            errorContainer.classList.remove("hidden");
            // 搜索失败时不清除上次成功的搜索记录
        } else {
            resultHeading.textContent = `Search results for "${searchTerm}":`;
            displayMeals(data.meals);
            searchInput.value = ""; // 搜索成功后清空输入框
            
            // 扩展功能：将最近一次的搜索结果保存到本地的local-storage
            if (!isInit) {
                localStorage.setItem(STORAGE_KEY, searchTerm);
            }
        }
    } catch (error) {
        errorContainer.textContent = "Something went wrong. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}

// 获取到网络数据 渲染与展示数据的displayMeals函数
function displayMeals(meals) {
    mealsContainer.innerHTML = "";
    // loop through meals and create a card for each meal
    meals.forEach((meal) => {
        mealsContainer.innerHTML += `
            <div class="meal" data-meal-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <h3 class="meal-title">${meal.strMeal}</h3>
                    ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
                </div>
            </div>
        `;
    });
}

// 每一个菜单项 添加点击看详情的事件函数
async function handleMealClick(e) {
    const mealEl = e.target.closest(".meal");
    // 确保点击的是 .meal 元素
    if (!mealEl) return;

    const mealId = mealEl.getAttribute("data-meal-id");

    try {
        errorContainer.classList.add("hidden");
        // 获取详情数据
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];

            const ingredients = [];

            // 遍历最多 20 个配料和用量
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`],
                    });
                }
            }

            // display meal details
            mealDetailsContent.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
                <h2 class="meal-details-title">${meal.strMeal}</h2>
                <div class="meal-details-category">
                    <span>${meal.strCategory || "Uncategorized"}</span>
                </div>
                <div class="meal-details-instructions">
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="meal-details-ingredients">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">
                        ${ingredients
                            .map(
                                (item) => `
                            <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
                        `
                            )
                            .join("")}
                    </ul>
                </div>
                ${
                    meal.strYoutube
                        ? `
                   <div class="youtube-link-wrapper">                       <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
                        <i class="fab fa-youtube"></i> Watch Video
                      </a>
                  </div>
                `
                        : ""
                }
            `;
            // 显示详情区域并滚动到视图
            mealDetails.classList.remove("hidden");
            mealDetails.scrollIntoView({ behavior: "smooth" });
        }
    } catch (error) {
        errorContainer.textContent = "Could not load recipe details. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', init);