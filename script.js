
const categories = [
    {
        key: "soup",
        title: "Суп",
        emptyMessage: "Блюдо не выбрано",
        formField: "soup"
    },
    {
        key: "main",
        title: "Главное блюдо",
        emptyMessage: "Блюдо не выбрано",
        formField: "main_dish"
    },
    {
        key: "drink",
        title: "Напиток",
        emptyMessage: "Напиток не выбран",
        formField: "drink"
    }
];

// Выбранные блюда: { "soup": блюдо, "main": блюдо, "drink": блюдо }
let selectedDishes = {};


/* ==================== ОТОБРАЖЕНИЕ БЛЮД НА СТРАНИЦЕ ==================== */

// Создание карточки одного блюда
function createDishCard(dish) {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.dataset.dish = dish.keyword; // data-атрибут с названием блюда на латинице

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

// Перебор массива блюд и добавление карточек в нужные секции
function renderDishes() {
    categories.forEach((category) => {
        // Секция каждой категории находится по data-атрибуту сетки
        const grid = document.querySelector(
            '.dishes-grid[data-category="' + category.key + '"]'
        );
        if (!grid) {
            return;
        }

        // Блюда категории сортируются в алфавитном порядке перед выводом
        const categoryDishes = dishes
            .filter((dish) => dish.category === category.key)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"));

        categoryDishes.forEach((dish) => {
            grid.appendChild(createDishCard(dish));
        });
    });
}


/* ==================== ВЫБОР БЛЮД И БЛОК «ВАШ ЗАКАЗ» ==================== */

// Поиск блюда в массиве по keyword из data-атрибута карточки
function selectDish(keyword) {
    const dish = dishes.find((d) => d.keyword === keyword);
    if (!dish) {
        return;
    }

    // Блюдо той же категории заменяет ранее выбранное
    selectedDishes[dish.category] = dish;

    updateCardSelection();
    updateOrderSummary();
    updateHiddenInputs();
}

// Выделение выбранной карточки рамкой (как при наведении курсора)
function updateCardSelection() {
    document.querySelectorAll(".dish-card").forEach((card) => {
        const dish = dishes.find((d) => d.keyword === card.dataset.dish);
        const selectedDish = selectedDishes[dish.category];

        if (selectedDish && selectedDish.keyword === dish.keyword) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
}

// Обновление блока «Ваш заказ»: категории, выбранные блюда и итоговая стоимость
function updateOrderSummary() {
    const summary = document.getElementById("order-summary");
    summary.innerHTML = "";

    // Пока ничего не выбрано — только сообщение, названия категорий скрыты
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

        summary.appendChild(value);x
    });

    // Блок с итоговой стоимостью заказа
    const total = document.createElement("p");
    total.className = "order-total";
    total.textContent = "Стоимость заказа: " + totalPrice + " руб.";
    summary.appendChild(total);
}

// Запись keyword выбранных блюд в скрытые поля формы для отправки на сервер
function updateHiddenInputs() {
    categories.forEach((category) => {
        const input = document.querySelector(
            'input[type="hidden"][name="' + category.formField + '"]'
        );
        const dish = selectedDishes[category.key];
        input.value = dish ? dish.keyword : "";
    });
}

//сброс
function handleFormReset() {
    selectedDishes = {};
    updateCardSelection();
    updateOrderSummary();
    updateHiddenInputs();
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */

//инициализация приложения
function initApp() {
    renderDishes();
    updateOrderSummary();

    const form = document.getElementById("order-form");
    if (form) {
        // Передаем имя функции handleFormReset
        form.addEventListener("reset", handleFormReset);
    }
}

//Передаем имя функции initApp вместо   
document.addEventListener("DOMContentLoaded", initApp);

