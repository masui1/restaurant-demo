// /restaurant-demo/src/main/resources/static/js/menu.js
const API_URL = "http://localhost:8080/api/menus";

let cart = [];

// メニューごとのカート個数を反映
function renderMenuCounts() {
    document.querySelectorAll(".menu-item").forEach(item => {
        const id = Number(item.dataset.id);
        const c = cart.find(c => c.menu.id === id);
        const countSpan = item.querySelector(".cart-count");
        if (countSpan) countSpan.textContent = c ? `(${c.quantity})` : "";
    });
}

// メニュー一覧を取得して表示
async function loadMenus() {
    const list = document.getElementById("menu-list");
    if (!list) return;
    list.innerHTML = "<p>読み込み中...</p>";

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const menus = await res.json();

        if (!menus.length) {
            list.innerHTML = "<p>メニューはまだ登録されていません。</p>";
            return;
        }

        list.innerHTML = menus.map(m => {
            const c = cart.find(c => c.menu.id === m.id);
            return `<div class="menu-item" data-id="${m.id}">
                <h3>${m.name} <span class="cart-count">${c ? `(${c.quantity})` : ""}</span></h3>
                ${m.imageUrl ? `<img src="${m.imageUrl}" alt="${m.name}" width="120">` : ""}
                <p>¥${m.price.toLocaleString()}</p>
                <button onclick='showDetail(${JSON.stringify(m)})'>詳細を見る</button>
                <button onclick='addToCart(${m.id})'>カートに追加</button>
            </div>`;
        }).join("");

        renderMenuCounts();

    } catch (err) {
        console.error(err);
        if (list) list.innerHTML = `<p>メニューの読み込み中にエラーが発生しました。</p>`;
    }
}

// メニュー詳細モーダル表示
function showDetail(menu) {
    const modal = document.getElementById("menu-detail-modal");
    if (!modal) return;
    document.getElementById("detail-name").textContent = menu.name;
    document.getElementById("detail-image").src = menu.imageUrl || '';
    document.getElementById("detail-description").textContent = menu.description;
    document.getElementById("detail-price").textContent = menu.price;
    document.getElementById("detail-allergy").textContent = menu.allergy || "なし";
    modal.style.display = "block";
}

// カートに追加
function addToCart(menuId) {
    fetch(`${API_URL}/${menuId}`)
        .then(res => {
            if (!res.ok) throw new Error("メニュー取得失敗");
            return res.json();
        })
        .then(menu => {
            const existing = cart.find(c => c.menu.id === menu.id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ menu, quantity: 1 });
            }
            alert(`${menu.name} をカートに追加しました`);
            renderCart();
            renderMenuCounts();
        })
        .catch(err => {
            console.error(err);
            alert("カートに追加できませんでした");
        });
}

// カート描画
function renderCart() {
    const cartList = document.getElementById("cart-list");
    if (!cartList) return;

    if (!cart.length) {
        cartList.innerHTML = "<p>カートは空です。</p>";
        document.getElementById("cart-total").textContent = "0";
        return;
    }

    let total = 0;
    cartList.innerHTML = cart.map(c => {
        total += c.menu.price * c.quantity;
        return `<div class="cart-item">
            <span>${c.menu.name} x ${c.quantity}</span>
            <span>¥${(c.menu.price * c.quantity).toLocaleString()}</span>
            <button onclick="removeFromCart(${c.menu.id})">削除</button>
        </div>`;
    }).join("");

    document.getElementById("cart-total").textContent = total.toLocaleString();
}

// カートから削除
function removeFromCart(menuId) {
    cart = cart.filter(c => c.menu.id !== menuId);
    renderCart();
    renderMenuCounts();
}

// 注文処理
async function handleCheckout() {
    if (!cart.length) {
        alert("カートが空です。");
        return;
    }

    const order = {
        customerName: "ゲスト",
        totalPrice: cart.reduce((sum, c) => sum + c.menu.price * c.quantity, 0),
        items: cart.map(c => ({
            menuId: c.menu.id,
            menuName: c.menu.name,
            price: c.menu.price,
            quantity: c.quantity
        }))
    };

    try {
        const res = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!res.ok) throw new Error("注文送信に失敗");

        const saved = await res.json();
        alert(`注文が確定しました！（注文ID: ${saved.id}）`);

        // カートクリア
        cart = [];
        localStorage.removeItem("cart");
        renderCart();
        renderMenuCounts();

    } catch (err) {
        console.error(err);
        alert("注文送信に失敗しました。");
    }
}

// DOM読み込み後に安全にイベント登録
window.addEventListener("DOMContentLoaded", () => {
    loadMenus();

    // モーダル閉じる
    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const modal = document.getElementById("menu-detail-modal");
            if (modal) modal.style.display = "none";
        });
    }

    // 注文ボタン
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
});
