const API_URL = "http://localhost:8080/api/menus";

let cart = [];

// --------------------
// メニューごとのカート個数を反映
// --------------------
function renderMenuCounts() {
    document.querySelectorAll(".menu-item").forEach(item => {
        const id = Number(item.dataset.id);
        const c = cart.find(c => c.menu.id === id);
        const countSpan = item.querySelector(".cart-count");
        if (countSpan) countSpan.textContent = c ? `(${c.quantity})` : "";
    });
}

// --------------------
// メニューカードHTML生成（詳細・カートボタン付き）
// --------------------
function createMenuCard(menu) {
    const c = cart.find(c => c.menu.id === menu.id);
    return `
    <div class="menu-item" data-id="${menu.id}">
        <h3>${menu.name} <span class="cart-count">${c ? `(${c.quantity})` : ""}</span></h3>
        ${menu.imageUrl ? `<img src="${menu.imageUrl}" style="width:100%;">` : ""}
        <p>¥${menu.price.toLocaleString()}</p>
        <button onclick='showDetail(${JSON.stringify(menu)})'>詳細を見る</button>
        <button onclick='addToCart(${menu.id})'>カートに追加</button>
    </div>`;
}

// --------------------
// メニュー一覧描画
// --------------------
async function renderMenus() {
    try {
        const [menus, recommended] = await Promise.all([
            fetch(`${API_URL}`).then(r => r.json()),
            fetch(`${API_URL}/recommended`).then(r => r.json())
        ]);

        const recommendedList = document.getElementById("recommended-list");
        const menuList = document.getElementById("menu-list");

        // おすすめメニュー
        if (recommended.length > 0) {
            recommendedList.innerHTML = recommended.map(createMenuCard).join("");
        } else {
            recommendedList.innerHTML = "<p>本日のおすすめはありません。</p>";
        }

        // 通常メニュー（おすすめ以外）
        const normalMenus = menus.filter(m => !m.recommended);
        if (normalMenus.length > 0) {
            menuList.innerHTML = normalMenus.map(createMenuCard).join("");
        } else {
            menuList.innerHTML = "<p>通常メニューはありません。</p>";
        }

        renderMenuCounts();

    } catch (err) {
        console.error(err);
        document.getElementById("recommended-list").innerHTML = "<p>読み込みエラー</p>";
        document.getElementById("menu-list").innerHTML = "<p>読み込みエラー</p>";
    }
}

// --------------------
// メニュー詳細モーダル表示
// --------------------
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

// --------------------
// カート操作
// --------------------
function addToCart(menuId) {
    fetch(`${API_URL}/${menuId}`)
        .then(res => {
            if (!res.ok) throw new Error("メニュー取得失敗");
            return res.json();
        })
        .then(menu => {
            const existing = cart.find(c => c.menu.id === menu.id);
            if (existing) existing.quantity++;
            else cart.push({ menu, quantity: 1 });

            alert(`${menu.name} をカートに追加しました`);
            renderCart();
            renderMenuCounts();
        })
        .catch(err => {
            console.error(err);
            alert("カートに追加できませんでした");
        });
}

function removeFromCart(menuId) {
    cart = cart.filter(c => c.menu.id !== menuId);
    renderCart();
    renderMenuCounts();
}

// --------------------
// カート描画
// --------------------
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

// --------------------
// 注文処理
// --------------------
async function handleCheckout() {
    if (!cart.length) return alert("カートが空です。");

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

        cart = [];
        renderCart();
        renderMenuCounts();
    } catch (err) {
        console.error(err);
        alert("注文送信に失敗しました。");
    }
}

// --------------------
// DOM読み込み後
// --------------------
window.addEventListener("DOMContentLoaded", () => {
    renderMenus();

    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("menu-detail-modal").style.display = "none";
        });
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
});
