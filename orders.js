let allDishes = [];
let dishesById = {};
let orders = [];

/* ==================== ВСПОМОГАТЕЛЬНЫЕ ==================== */

function showNotification(message) {
    alert(message);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const pad = n => String(n).padStart(2, "0");
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isValidDeliveryTime(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    if (h < 7 || h > 23) return false;
    if (h === 23 && m > 0) return false;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return (h * 60 + m) > nowMinutes;
}

function getOrderDishIds(order) {
    return [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id]
        .filter(id => id != null);
}

function getOrderDishes(order) {
    return getOrderDishIds(order).map(id => dishesById[id]).filter(Boolean);
}

function getOrderTotal(order) {
    return getOrderDishes(order).reduce((sum, d) => sum + Number(d.price), 0);
}

function getOrderComposition(order) {
    return getOrderDishes(order).map(d => d.name).join(", ");
}

function getDeliveryTimeText(order) {
    if (order.delivery_type === "by_time" && order.delivery_time) {
        return order.delivery_time.slice(0, 5);
    }
    return "Как можно скорее (с 7:00 до 23:00)";
}

/* ==================== API ==================== */

async function loadOrders() {
    const url = API_ORDERS + "?api_key=" + encodeURIComponent(API_KEY);
    const res = await fetch(url);
    if (!res.ok) {
        let msg = "Ошибка загрузки заказов";
        try {
            const data = await res.json();
            if (data.error) msg = data.error;
        } catch (e) { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
}

async function updateOrder(id, payload) {
    const url = API_ORDERS + "/" + id + "?api_key=" + encodeURIComponent(API_KEY);
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        let msg = "Ошибка при обновлении заказа";
        try {
            const data = await res.json();
            if (data.error) msg = data.error;
        } catch (e) { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
}

async function deleteOrder(id) {
    const url = API_ORDERS + "/" + id + "?api_key=" + encodeURIComponent(API_KEY);
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
        let msg = "Ошибка при удалении заказа";
        try {
            const data = await res.json();
            if (data.error) msg = data.error;
        } catch (e) { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
}

/* ==================== СПИСОК ЗАКАЗОВ ==================== */

function renderOrders() {
    const container = document.getElementById("orders-list");
    const emptyEl = document.getElementById("orders-empty");
    container.innerHTML = "";

    if (!orders.length) {
        container.style.display = "none";
        emptyEl.style.display = "block";
        return;
    }
    container.style.display = "";
    emptyEl.style.display = "none";

    orders.forEach((order, index) => {
        const item = document.createElement("div");
        item.className = "order-item";

        const info = document.createElement("div");
        info.className = "order-item-info";

        const header = document.createElement("div");

        const num = document.createElement("span");
        num.className = "order-item-number";
        num.textContent = `Заказ №${index + 1}`;

        const date = document.createElement("span");
        date.className = "order-item-date";
        date.textContent = formatDate(order.created_at);

        header.append(num, date);

        const dishes = document.createElement("div");
        dishes.className = "order-item-dishes";
        dishes.textContent = getOrderComposition(order) || "Блюда не указаны";

        const total = document.createElement("div");
        total.className = "order-item-total";
        total.textContent = `Стоимость: ${getOrderTotal(order)} руб.`;

        const delivery = document.createElement("div");
        delivery.className = "order-item-delivery";
        delivery.textContent = `Доставка: ${getDeliveryTimeText(order)}`;

        info.append(header, dishes, total, delivery);

        const actions = document.createElement("div");
        actions.className = "order-item-actions";

        const btnDetails = document.createElement("button");
        btnDetails.type = "button";
        btnDetails.className = "order-action-btn";
        btnDetails.textContent = "Подробнее";
        btnDetails.addEventListener("click", () => openDetailsModal(order));

        const btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.className = "order-action-btn";
        btnEdit.textContent = "Редактирование";
        btnEdit.addEventListener("click", () => openEditModal(order));

        const btnDelete = document.createElement("button");
        btnDelete.type = "button";
        btnDelete.className = "order-action-btn";
        btnDelete.textContent = "Удаление";
        btnDelete.addEventListener("click", () => openDeleteModal(order));

        actions.append(btnDetails, btnEdit, btnDelete);
        item.append(info, actions);
        container.appendChild(item);
    });
}

async function refreshOrders() {
    try {
        orders = await loadOrders();
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        renderOrders();
    } catch (e) {
        showNotification("Не удалось загрузить заказы: " + e.message);
    }
}

/* ==================== МОДАЛЬНЫЕ ОКНА ==================== */

const overlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");

function openModal(html) {
    modalContent.innerHTML = html;
    overlay.style.display = "flex";
    const closeBtn = modalContent.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
}

function closeModal() {
    overlay.style.display = "none";
    modalContent.innerHTML = "";
}

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});

/* ---------- Подробнее ---------- */

function openDetailsModal(order) {
    const dishes = getOrderDishes(order);
    const dishList = dishes.length
        ? dishes.map(d => `${escapeHtml(d.name)} — ${d.price} руб.`).join("<br>")
        : "—";

    const html = `
        <button class="modal-close" type="button">&times;</button>
        <h3 class="modal-title">Заказ от ${formatDate(order.created_at)}</h3>
        <div class="modal-field"><strong>Имя:</strong> ${escapeHtml(order.full_name || "")}</div>
        <div class="modal-field"><strong>Email:</strong> ${escapeHtml(order.email || "")}</div>
        <div class="modal-field"><strong>Телефон:</strong> ${escapeHtml(order.phone || "")}</div>
        <div class="modal-field"><strong>Адрес доставки:</strong> ${escapeHtml(order.delivery_address || "")}</div>
        <div class="modal-field"><strong>Тип доставки:</strong> ${order.delivery_type === "by_time" ? "К указанному времени" : "Как можно скорее"}</div>
        ${order.delivery_type === "by_time" ? `<div class="modal-field"><strong>Время доставки:</strong> ${escapeHtml(order.delivery_time || "")}</div>` : ""}
        <div class="modal-field"><strong>Комментарий:</strong> ${escapeHtml(order.comment || "—")}</div>
        <div class="modal-field"><strong>Состав заказа:</strong><br>${dishList}</div>
        <div class="modal-field"><strong>Итого:</strong> ${getOrderTotal(order)} руб.</div>
        <div class="modal-buttons">
            <button type="button" class="modal-btn-primary" id="modal-ok">Ок</button>
        </div>
    `;
    openModal(html);
    document.getElementById("modal-ok").addEventListener("click", closeModal);
}

/* ---------- Редактирование ---------- */

function openEditModal(order) {
    const html = `
        <button class="modal-close" type="button">&times;</button>
        <h3 class="modal-title">Редактирование заказа</h3>
        <form id="edit-order-form">
            <div class="modal-form-group">
                <label for="edit-full-name">Имя</label>
                <input type="text" id="edit-full-name" name="full_name" value="${escapeHtml(order.full_name || "")}" required>
            </div>
            <div class="modal-form-group">
                <label for="edit-email">Email</label>
                <input type="email" id="edit-email" name="email" value="${escapeHtml(order.email || "")}" required>
            </div>
            <div class="modal-form-group">
                <label for="edit-phone">Телефон</label>
                <input type="tel" id="edit-phone" name="phone" value="${escapeHtml(order.phone || "")}" required>
            </div>
            <div class="modal-form-group">
                <label for="edit-address">Адрес доставки</label>
                <input type="text" id="edit-address" name="delivery_address" value="${escapeHtml(order.delivery_address || "")}" required>
            </div>
            <div class="modal-form-group">
                <label for="edit-delivery-type">Тип доставки</label>
                <select id="edit-delivery-type" name="delivery_type">
                    <option value="now" ${order.delivery_type === "now" ? "selected" : ""}>Как можно скорее</option>
                    <option value="by_time" ${order.delivery_type === "by_time" ? "selected" : ""}>К указанному времени</option>
                </select>
            </div>
            <div class="modal-form-group" id="edit-time-group" style="${order.delivery_type === "by_time" ? "" : "display:none;"}">
                <label for="edit-delivery-time">Время доставки</label>
                <input type="time" id="edit-delivery-time" name="delivery_time" min="07:00" max="23:00" step="300"
                       value="${order.delivery_time ? order.delivery_time.slice(0, 5) : ""}">
            </div>
            <div class="modal-form-group">
                <label for="edit-comment">Комментарий</label>
                <textarea id="edit-comment" name="comment">${escapeHtml(order.comment || "")}</textarea>
            </div>
            <div class="modal-buttons">
                <button type="submit" class="modal-btn-primary">Сохранить</button>
                <button type="button" class="modal-btn-secondary" id="modal-cancel">Отмена</button>
            </div>
        </form>
    `;
    openModal(html);

    const form = document.getElementById("edit-order-form");
    const typeSelect = document.getElementById("edit-delivery-type");
    const timeGroup = document.getElementById("edit-time-group");

    typeSelect.addEventListener("change", () => {
        timeGroup.style.display = typeSelect.value === "by_time" ? "" : "none";
    });

    document.getElementById("modal-cancel").addEventListener("click", closeModal);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const deliveryType = fd.get("delivery_type");

        const payload = {
            full_name: fd.get("full_name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            delivery_address: fd.get("delivery_address"),
            delivery_type: deliveryType,
            comment: fd.get("comment") || ""
        };

        if (deliveryType === "by_time") {
            const time = fd.get("delivery_time");
            if (!time) {
                showNotification("Укажите время доставки.");
                return;
            }
            if (!isValidDeliveryTime(time)) {
                showNotification("Время доставки должно быть с 07:00 до 23:00 и не раньше текущего времени.");
                return;
            }
            payload.delivery_time = time;
        }

        try {
            await updateOrder(order.id, payload);
            closeModal();
            showNotification("Заказ успешно изменён");
            await refreshOrders();
        } catch (err) {
            showNotification("Не удалось изменить заказ: " + err.message);
        }
    });
}

/* ---------- Удаление ---------- */

function openDeleteModal(order) {
    const html = `
        <button class="modal-close" type="button">&times;</button>
        <h3 class="modal-title">Удаление заказа</h3>
        <p>Вы действительно хотите удалить заказ от ${formatDate(order.created_at)}?</p>
        <div class="modal-buttons">
            <button type="button" class="modal-btn-primary" id="modal-yes">Да</button>
            <button type="button" class="modal-btn-secondary" id="modal-cancel">Отмена</button>
        </div>
    `;
    openModal(html);

    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    document.getElementById("modal-yes").addEventListener("click", async () => {
        try {
            await deleteOrder(order.id);
            closeModal();
            showNotification("Заказ успешно удалён");
            await refreshOrders();
        } catch (err) {
            showNotification("Не удалось удалить заказ: " + err.message);
        }
    });
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */

async function initOrdersPage() {
    try {
        allDishes = await loadDishesApi();
    } catch (e) {
        showNotification("Не удалось загрузить список блюд: " + e.message);
        return;
    }

    dishesById = {};
    allDishes.forEach(d => { dishesById[d.id] = d; });

    await refreshOrders();
}

document.addEventListener("DOMContentLoaded", initOrdersPage);