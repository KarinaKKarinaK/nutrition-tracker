const totalCaloriesEl = document.getElementById("total-calories");
const caloriesAmountEl = document.getElementById("calories-amount");
const proteinAmountEl = document.getElementById("protein-amount");
const mealListEl = document.getElementById("meal-list");
const mealFormEl = document.getElementById("meal-form");
const descriptionEl = document.getElementById("description");
const caloriesEl = document.getElementById("calories");
const proteinEl = document.getElementById("protein");

let meals = JSON.parse(localStorage.getItem("meals")) || [];

mealFormEl.addEventListener("submit", addMeal);

function addMeal(e) {
    e.preventDefault();

    // get form values
    const description = descriptionEl.value.trim();
    const calories = parseFloat(caloriesEl.value);
    const protein = parseFloat(proteinEl.value);

    meals.push({
        id: Date.now(),
        description,
        calories,
        protein
    });

    localStorage.setItem("meals", JSON.stringify(meals));

    updateMealList();
    updateNutritionSummary();

    mealFormEl.reset();
}

function updateMealList() {
    mealListEl.innerHTML = "";

    // most recent first
    const sortedMeals = [...meals].reverse()

    //add each meal to the list
    sortedMeals.forEach((meal) => {
        const mealEl = createMealElement(meal);
        mealListEl.appendChild(mealEl);
    });
}

function createMealElement(meal) {
    const li = document.createElement("li");
    li.classList.add("meal");
    li.classList.add("calories");

    li.innerHTML = `
    <span>${meal.description}</span>
    <span>
        ${formatCalories(meal.calories)} | ${formatProtein(meal.protein)}
        <button class="delete-btn" onclick="removeMeal(${meal.id})">x</button>
    </span>
    `;

    return li;
}

function updateNutritionSummary() {
    // Calculating the total calories and protein
    const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
    const totalProtein = meals.reduce((acc, meal) => acc + meal.protein, 0);

    // update ui
    totalCaloriesEl.textContent = formatCalories(totalCalories);
    caloriesAmountEl.textContent = formatCalories(totalCalories);
    proteinAmountEl.textContent = formatProtein(totalProtein);
}

function formatCalories(number) {
    return `${number.toLocaleString()} kcal`;
}

function formatProtein(number) {
    return `${number.toLocaleString()} g`;
}

function removeMeal(id) {
    // filter out the one we want to delete
    meals = meals.filter(meal => meal.id !== id);

    localStorage.setItem("meals", JSON.stringify(meals));

    updateMealList();
    updateNutritionSummary();
}

// initial render
updateMealList();
updateNutritionSummary();