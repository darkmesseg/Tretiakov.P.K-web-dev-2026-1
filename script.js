// categories и dishes уже объявлены в dishes.js

// Выбранные блюда: { "soup": блюдо, "main": блюдо, ... }
let selectedDishes = {};

/* ==================== ОТОБРАЖЕНИЕ БЛЮД ==================== */

function createDishCard(dish) {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;
    card.dataset.category = dish.category;

    const image = document.createElement("img");
    image.src = dish.image;
    image.alt = dish.name;

    const price = document.createElement("p");
    price.className = "dish-price";
    price.textContent = dish.price + " руб.";

    const title = document.createElement("p");
    title.className = "dish-title";
    title.textContent = dish.name;

    const count = document.createElement("p");
    count.className = "dish-weight";
    count.textContent = dish.count;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dish-btn";
    button.textContent = "Добавить";
    button.addEventListener("click", () => selectDish(dish.keyword));

    card.append(image, price, title, count, button);
    return card;
}

function renderDishes() {
    categories.forEach((category) => {
        const grid = document.querySelector(
            '.dishes-grid[data-category="' + category.key + '"]'
        );
        if (!grid) return;

        const categoryDishes = dishes
            .filter((dish) => dish.category === category.key)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"));

        categoryDishes.forEach((dish) => {
            grid.appendChild(createDishCard(dish));
        });
    });
}

/* ==================== ВЫБОР БЛЮД ==================== */

function selectDish(keyword) {
    const dish = dishes.find((d) => d.keyword === keyword);
    if (!dish) return;

    selectedDishes[dish.category] = dish;

    updateCardSelection();
    updateOrderSummary();
    updateHiddenInputs();
}

function updateCardSelection() {
    document.querySelectorAll(".dish-card").forEach((card) => {
        const dish = dishes.find((d) => d.keyword === card.dataset.dish);
        if (!dish) return;

        const selectedDish = selectedDishes[dish.category];

        if (selectedDish && selectedDish.keyword === dish.keyword) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
}

function updateOrderSummary() {
    const summary = document.getElementById("order-summary");
    if (!summary) return;

    summary.innerHTML = "";

    if (Object.keys(selectedDishes).length === 0) {
        const message = document.createElement("p");
        message.className = "order-nothing";
        message.textContent = "Ничего не выбрано";
        summary.appendChild(message);
        return;
    }

    let totalPrice = 0;

    categories.forEach((category) => {
        const label = document.createElement("p");
        label.className = "order-category";
        label.textContent = category.title;
        summary.appendChild(label);

        const dish = selectedDishes[category.key];
        const value = document.createElement("p");

        if (dish) {
            value.className = "order-dish";
            value.textContent = dish.name + " — " + dish.price + " руб.";
            totalPrice += dish.price;
        } else {
            value.className = "order-empty";
            value.textContent = category.emptyMessage;
        }

        summary.appendChild(value);
    });

    const total = document.createElement("p");
    total.className = "order-total";
    total.textContent = "Стоимость заказа: " + totalPrice + " руб.";
    summary.appendChild(total);
}

function updateHiddenInputs() {
    categories.forEach((category) => {
        const input = document.querySelector(
            'input[type="hidden"][name="' + category.formField + '"]'
        );
        if (!input) return;

        const dish = selectedDishes[category.key];
        input.value = dish ? dish.keyword : "";
    });
}

function handleFormReset() {
    selectedDishes = {};
    updateCardSelection();
    updateOrderSummary();
    updateHiddenInputs();

    // Сброс фильтров
    document.querySelectorAll(".active-filters .filter-btn.active").forEach((btn) => {
        btn.classList.remove("active");
    });
    document.querySelectorAll(".dishes-grid").forEach((grid) => {
        grid.querySelectorAll(".dish-card").forEach((card) => {
            card.style.display = "";
        });
    });
}

/* ==================== ФИЛЬТРАЦИЯ ==================== */

function applyFilter(categoryKey) {
    const container = document.querySelector(
        '.active-filters[data-category="' + categoryKey + '"]'
    );
    const grid = document.querySelector(
        '.dishes-grid[data-category="' + categoryKey + '"]'
    );
    if (!grid) return;

    const activeBtn = container ? container.querySelector(".filter-btn.active") : null;
    const kind = activeBtn ? activeBtn.dataset.kind : null;

    grid.querySelectorAll(".dish-card").forEach((card) => {
        if (!kind || card.dataset.kind === kind) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

function setupFilters() {
    document.querySelectorAll(".active-filters").forEach((container) => {
        const categoryKey = container.dataset.category;
        const buttons = container.querySelectorAll(".filter-btn");

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const isActive = btn.classList.contains("active");

                // Убираем active у всех кнопок этой категории
                buttons.forEach((b) => b.classList.remove("active"));

                // Если кнопка не была активна — делаем её активной
                if (!isActive) {
                    btn.classList.add("active");
                }

                applyFilter(categoryKey);
            });
        });
    });
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */

function initApp() {
    renderDishes();
    setupFilters();
    updateOrderSummary();

    const form = document.getElementById("order-form");
    if (form) {
        form.addEventListener("reset", handleFormReset);
    }
}

document.addEventListener("DOMContentLoaded", initApp);