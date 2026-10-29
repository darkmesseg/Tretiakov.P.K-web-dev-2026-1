let dishes = [];
let selectedDishes = {};

/* ==================== ОТОБРАЖЕНИЕ ==================== */

function createDishCard(dish) {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;
    card.dataset.category = dish.category;

    const image = document.createElement("img");
    image.src = dish.image;
    image.alt = dish.name;
    image.onerror = function () {
        this.src = "https://via.placeholder.com/300x200?text=Нет+фото";
    };

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
        const grid = document.querySelector('.dishes-grid[data-category="' + category.key + '"]');
        if (!grid) return;
        dishes
            .filter(d => d.category === category.key)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"))
            .forEach(d => grid.appendChild(createDishCard(d)));
    });
}

/* ==================== ВЫБОР ==================== */

function persistSelection() {
    const ids = Object.values(selectedDishes).map(d => d.id);
    setSelectedIds(ids);
}

function selectDish(keyword) {
    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    selectedDishes[dish.category] = dish;
    persistSelection();
    updateCardSelection();
    updateStickyPanel();
}

function updateCardSelection() {
    document.querySelectorAll(".dish-card").forEach((card) => {
        const dish = dishes.find(d => d.keyword === card.dataset.dish);
        if (!dish) return;
        const cur = selectedDishes[dish.category];
        card.classList.toggle("selected", cur && cur.keyword === dish.keyword);
    });
}

/* ==================== STICKY-ПАНЕЛЬ ==================== */

function updateStickyPanel() {
    const panel = document.getElementById("order-panel");
    if (!panel) return;

    if (Object.keys(selectedDishes).length === 0) {
        panel.classList.add("hidden");
        return;
    }
    panel.classList.remove("hidden");

    let total = 0;
    Object.values(selectedDishes).forEach(d => total += Number(d.price));
    document.getElementById("order-panel-total-value").textContent = total + " руб.";

    const link = document.getElementById("order-panel-link");
    if (isLunchValid(selectedDishes)) {
        link.classList.remove("disabled");
        link.removeAttribute("aria-disabled");
        link.removeAttribute("tabindex");
    } else {
        link.classList.add("disabled");
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("tabindex", "-1");
    }
}

/* ==================== ФИЛЬТРЫ ==================== */

function applyFilter(categoryKey) {
    const container = document.querySelector('.active-filters[data-category="' + categoryKey + '"]');
    const grid = document.querySelector('.dishes-grid[data-category="' + categoryKey + '"]');
    if (!grid) return;

    const activeBtn = container ? container.querySelector(".filter-btn.active") : null;
    const kind = activeBtn ? activeBtn.dataset.kind : null;

    grid.querySelectorAll(".dish-card").forEach((card) => {
        card.style.display = (!kind || card.dataset.kind === kind) ? "" : "none";
    });
}

function setupFilters() {
    document.querySelectorAll(".active-filters").forEach((container) => {
        const categoryKey = container.dataset.category;
        const buttons = container.querySelectorAll(".filter-btn");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const isActive = btn.classList.contains("active");
                buttons.forEach(b => b.classList.remove("active"));
                if (!isActive) btn.classList.add("active");
                applyFilter(categoryKey);
            });
        });
    });
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */

async function initApp() {
    try {
        dishes = await loadDishesApi();
    } catch (e) {
        console.error(e);
        alert("Не удалось загрузить список блюд. Попробуйте позже.");
        return;
    }

    // Восстанавливаем выбор пользователя из localStorage
    selectedDishes = buildSelectionMap(dishes, getSelectedIds());

    renderDishes();
    setupFilters();
    updateCardSelection();
    updateStickyPanel();
}

document.addEventListener("DOMContentLoaded", initApp);