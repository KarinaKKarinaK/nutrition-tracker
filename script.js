const totalCaloriesEl = document.getElementById("total-calories");
const caloriesAmountEl = document.getElementById("calories-amount");
const proteinAmountEl = document.getElementById("protein-amount");
const mealListEl = document.getElementById("meal-list");
const mealFormEl = document.getElementById("meal-form");
const descriptionEl = document.getElementById("description");
const caloriesEl = document.getElementById("calories");
const proteinEl = document.getElementById("protein");

let meals = JSON.parse(localStorage.getItem("meals")) || [];

// Migration function to handle old transaction data if it exists
function migrateOldData() {
    const oldTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (oldTransactions && oldTransactions.length > 0 && meals.length === 0) {
        // Convert old transaction format to new meal format
        meals = oldTransactions.map(transaction => ({
            id: transaction.id,
            description: transaction.description,
            calories: Math.abs(transaction.amount), // Convert amount to calories
            protein: 0 // Default protein to 0 for migrated data
        }));
        localStorage.setItem("meals", JSON.stringify(meals));
        localStorage.removeItem("transactions"); // Clean up old data
    }
}

// Run migration on load
migrateOldData();

mealFormEl.addEventListener("submit", addMeal);

function addMeal(e) {
    e.preventDefault();

    // get form values
    const description = descriptionEl.value.trim();
    const calories = parseFloat(caloriesEl.value);
    const protein = parseFloat(proteinEl.value);

    // validate inputs
    if (!description) {
        alert("Please enter a meal/food name");
        return;
    }
    
    if (isNaN(calories) || calories < 0) {
        alert("Please enter a valid number of calories (0 or greater)");
        return;
    }
    
    if (isNaN(protein) || protein < 0) {
        alert("Please enter a valid amount of protein (0 or greater)");
        return;
    }

    meals.push({
        id: Date.now(),
        description,
        calories,
        protein
    });

    localStorage.setItem("meals", JSON.stringify(meals));

    updateMealList();
    updateNutritionSummary();

    // Provide visual feedback
    const submitBtn = mealFormEl.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Added!";
    submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
    }, 1000);

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
    li.classList.add("calories"); // Add styling class for consistent appearance

    li.innerHTML = `
    <span>${meal.description}</span>
    <span>
        ${formatCalories(meal.calories)} | ${formatProtein(meal.protein)}
        <button class="delete-btn" onclick="removeMeal(${meal.id})">×</button>
    </span>
    `;

    return li;
}

// Add helpful nutrition context
function updateNutritionSummary() {
    // Calculating the total calories and protein
    const totalCalories = meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    const totalProtein = meals.reduce((acc, meal) => acc + (meal.protein || 0), 0);

    // update ui elements
    totalCaloriesEl.textContent = formatCalories(totalCalories);
    caloriesAmountEl.textContent = formatCalories(totalCalories);
    proteinAmountEl.textContent = formatProtein(totalProtein);
    
    // Add visual indicator for calorie ranges
    updateCalorieIndicator(totalCalories);
}

function updateCalorieIndicator(totalCalories) {
    const totalCaloriesContainer = totalCaloriesEl.parentElement;
    
    // Remove existing indicator classes
    totalCaloriesContainer.classList.remove('low-calories', 'moderate-calories', 'high-calories');
    
    // Add appropriate class based on calorie count
    if (totalCalories < 1200) {
        totalCaloriesContainer.classList.add('low-calories');
    } else if (totalCalories < 2500) {
        totalCaloriesContainer.classList.add('moderate-calories');
    } else {
        totalCaloriesContainer.classList.add('high-calories');
    }
}

function formatCalories(number) {
    // Handle edge cases and ensure proper formatting
    if (isNaN(number) || number < 0) return "0 kcal";
    return `${Math.round(number * 10) / 10} kcal`; // Round to 1 decimal place
}

function formatProtein(number) {
    // Handle edge cases and ensure proper formatting  
    if (isNaN(number) || number < 0) return "0 g";
    return `${Math.round(number * 10) / 10} g`; // Round to 1 decimal place
}

function removeMeal(id) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this meal?")) {
        return;
    }
    
    // filter out the one we want to delete
    const originalLength = meals.length;
    meals = meals.filter(meal => meal.id !== id);
    
    // Check if meal was actually removed
    if (meals.length === originalLength) {
        alert("Error: Meal not found");
        return;
    }

    localStorage.setItem("meals", JSON.stringify(meals));

    updateMealList();
    updateNutritionSummary();
}

// initial render
updateMealList();
updateNutritionSummary();