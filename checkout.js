let dishes = [];
let selectedDishes = {};

/* ==================== РАЗДЕЛ «СОСТАВ ЗАКАЗА» ==================== */

function createOrderCard(dish) {
    const card = document.createElement("div");
    card.className = "dish-card";

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
    button.textContent = "Удалить";
    button.addEventListener("click", () => removeDish(dish.id));

    card.append(image, price, title, count, button);
    return card;
}

function renderOrderDishes() {
    const container = document.getElementById("order-dishes");
    const emptyEl = document.getElementById("order-empty");
    container.innerHTML = "";

    if (Object.keys(selectedDishes).length === 0) {
        container.style.display = "none";
        emptyEl.style.display = "block";
        return;
    }
    container.style.display = "";
    emptyEl.style.display = "none";

    categories.forEach((cat) => {
        const dish = selectedDishes[cat.key];
        if (dish) container.appendChild(createOrderCard(dish));
    });
}

function removeDish(dishId) {
    // 1) убираем id из localStorage
    const ids = getSelectedIds().filter(id => id !== dishId);
    setSelectedIds(ids);

    // 2) убираем из in-memory-карты
    const dish = dishes.find(d => d.id === dishId);
    if (dish) delete selectedDishes[dish.category];

    // 3) перерисовываем блоки
    renderOrderDishes();
    renderOrderSummary();
}

/* ==================== РАЗДЕЛ «ОФОРМЛЕНИЕ ЗАКАЗА» ==================== */

function renderOrderSummary() {
    const summary = document.getElementById("order-summary");
    summary.innerHTML = "";

    if (Object.keys(selectedDishes).length === 0) {
        const p = document.createElement("p");
        p.className = "order-nothing";
        p.textContent = "Ничего не выбрано";
        summary.appendChild(p);
        return;
    }

    let total = 0;

    categories.forEach((cat) => {
        const label = document.createElement("p");
        label.className = "order-category";
        label.textContent = cat.title;
        summary.appendChild(label);

        const value = document.createElement("p");
        const dish = selectedDishes[cat.key];

        if (dish) {
            value.className = "order-dish";
            value.textContent = dish.name + " — " + dish.price + " руб.";
            total += Number(dish.price);
        } else {
            value.className = "order-empty";
            value.textContent = cat.emptyMessage;
        }
        summary.appendChild(value);
    });

    const totalEl = document.createElement("p");
    totalEl.className = "order-total";
    totalEl.textContent = "Итого: " + total + " руб.";
    summary.appendChild(totalEl);
}

/* ==================== ОТПРАВКА ==================== */

function isValidDeliveryTime(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    if (h < 7 || h > 23) return false;
    if (h === 23 && m > 0) return false;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return (h * 60 + m) > nowMinutes;
}

async function handleSubmit(event) {
    event.preventDefault();

    if (Object.keys(selectedDishes).length === 0) {
        alert("Ничего не выбрано. Добавьте блюда в заказ.");
        return;
    }

    if (!isLunchValid(selectedDishes)) {
        alert("Состав заказа не соответствует ни одному из доступных комбо.");
        return;
    }

    const form = event.target;
    const fd = new FormData(form);

    const deliveryTypeRaw = fd.get("delivery_type"); // "asap" | "by_time"
    const apiDeliveryType = deliveryTypeRaw === "by_time" ? "by_time" : "now";

    const payload = {
        full_name: fd.get("username"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        delivery_address: fd.get("address"),
        delivery_type: apiDeliveryType,
        subscribe: fd.get("subscribe") ? 1 : 0,
        comment: fd.get("comment") || ""
    };

    if (apiDeliveryType === "by_time") {
        const time = fd.get("delivery_time");
        if (!time) {
            alert("Укажите время доставки.");
            return;
        }
        if (!isValidDeliveryTime(time)) {
            alert("Время доставки должно быть с 07:00 до 23:00 и не раньше текущего времени.");
            return;
        }
        payload.delivery_time = time;
    }

    // id блюд по полям API
    Object.entries(CATEGORY_TO_ORDER_FIELD).forEach(([categoryKey, field]) => {
        const dish = selectedDishes[categoryKey];
        if (dish) payload[field] = dish.id;
    });

    try {
        const url = API_ORDERS + "?api_key=" + encodeURIComponent(API_KEY);
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            let msg = "Ошибка при отправке заказа";
            try {
                const data = await res.json();
                if (data.error) msg = data.error;
            } catch (e) { /* ignore */ }
            throw new Error(msg);
        }

        // Успех: очищаем localStorage и уводим пользователя
        clearSelectedIds();
        alert("Заказ успешно оформлен!");
        window.location.href = "index.html";

    } catch (err) {
        // Ошибка: данные НЕ удаляем
        alert("Не удалось оформить заказ: " + err.message);
    }
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */

async function initCheckout() {
    try {
        dishes = await loadDishesApi();
    } catch (e) {
        alert("Не удалось загрузить список блюд: " + e.message);
        return;
    }

    selectedDishes = buildSelectionMap(dishes, getSelectedIds());
    renderOrderDishes();
    renderOrderSummary();

    document.getElementById("checkout-form")
        .addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", initCheckout);