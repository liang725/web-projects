const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

// MealDB API 基础信息
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`; // 根据菜名搜索 URL
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`; // 根据 ID 查详情 URL

// 事件监听器：搜索按钮点击、输入框回车
searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMeals();
});
mealsContainer.addEventListener("click", handleMealClick); // 监听菜谱卡片点击
backBtn.addEventListener("click", () => mealDetails.classList.add("hidden")); // 监听返回按钮


/** 执行菜谱搜索并更新界面 */
async function searchMeals() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) { // 处理空搜索
    errorContainer.textContent = "请输入搜索关键词";
    errorContainer.classList.remove("hidden");
    return;
  }
  
  try {
    resultHeading.textContent = `正在搜索 "${searchTerm}"...`;
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden");

    // 从 API 获取菜谱列表
    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json();

    if (data.meals === null) {
      // 未找到结果
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      errorContainer.textContent = `未找到 "${searchTerm}" 的菜谱。请尝试其他关键词!`;
      errorContainer.classList.remove("hidden");
    } else {
      resultHeading.textContent = `"${searchTerm}" 的搜索结果:`;
      displayMeals(data.meals);
      searchInput.value = "";
    }
  } catch (error) {
    errorContainer.textContent = "搜索出错，请稍后重试。";
    errorContainer.classList.remove("hidden");
  }
}

/** 在容器中显示菜谱卡片列表 */
function displayMeals(meals) {
  mealsContainer.innerHTML = "";
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


/** 处理点击菜谱卡片事件，显示详情 */
async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal");
  if (!mealEl) return;

  const mealId = mealEl.getAttribute("data-meal-id");

  try {
    const response = await fetch(`${LOOKUP_URL}${mealId}`);
    const data = await response.json();

    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];
      const ingredients = [];

      // 提取配料和份量（API 返回 1-20 个字段）
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push({
            ingredient: ingredient,
            measure: meal[`strMeasure${i}`],
          });
        }
      }

      // 渲染菜谱详情
      mealDetailsContent.innerHTML = `
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
           <h2 class="meal-details-title">${meal.strMeal}</h2>
           <div class="meal-details-category">
             <span>${meal.strCategory || "未分类"}</span>
           </div>
           <div class="meal-details-instructions">
             <h3>步骤说明</h3>
             <p>${meal.strInstructions}</p>
           </div>
           <div class="meal-details-ingredients">
             <h3>配料清单</h3>
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
             <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
               <i class="fab fa-youtube"></i> 查看视频
             </a>
           `
               : ""
           }
         `;
      mealDetails.classList.remove("hidden");
      mealDetails.scrollIntoView({ behavior: "smooth" }); // 滚动到详情页
    }
  } catch (error) {
    errorContainer.textContent = "无法加载菜谱详情，请稍后重试。";
    errorContainer.classList.remove("hidden");
  }
}