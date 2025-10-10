// /restaurant-demo/src/main/resources/static/js/menu.js

const API_URL = "http://localhost:8080/api/menus";

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
    list.innerHTML = "<p>読み込み中...</p>";

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const menus = await res.json();

        if (menus.length === 0) {
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
        list.innerHTML = `<p>メニューの読み込み中にエラーが発生しました。</p>`;
    }
}

// 新規メニュー追加フォーム送信
async function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0];

    if (!name || !price || !description) {
        alert("すべての項目を入力してください。");
        return;
    }

    const formData = new FormData();
	formData.append("menu", new Blob([JSON.stringify({ 
	    name: name, 
	    price: Number(price), 
	    description: description 
	})], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        document.getElementById("menu-form").reset();
        await loadMenus();

    } catch (err) {
        console.error(err);
        alert("メニューの追加に失敗しました。");
    }
}

// 既存メニューの画像アップロード
async function uploadMenuImage(menuId, file) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/${menuId}/upload`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    return await res.json();
}

// 画像選択時のイベント（既存メニュー向け）
document.getElementById("image")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 例として menuId=1 のメニューにアップロード
    const menuId = 1;
    try {
        const updatedMenu = await uploadMenuImage(menuId, file);
        console.log("更新後メニュー:", updatedMenu);
        await loadMenus();
    } catch (err) {
        console.error(err);
        alert("画像アップロードに失敗しました。");
    }
});

// ページ読み込み時
window.addEventListener("DOMContentLoaded", () => {
    loadMenus();
    document.getElementById("menu-form").addEventListener("submit", handleFormSubmit);
});

function showDetail(menu) {
	document.getElementById("detail-name").textContent = menu.name;
	document.getElementById("detail-image").src = menu.imageUrl || '';
	document.getElementById("detail-description").textContent = menu.description;
	document.getElementById("detail-price").textContent = menu.price;
	document.getElementById("detail-allergy").textContent = menu.allergy || "なし";
	document.getElementById("menu-detail-modal").style.display = "block";
}

document.getElementById("close-modal").addEventListener("click", () => {
	document.getElementById("menu-detail-modal").style.display = "none";
});

let cart = [];

function addToCart(menuId) {
    fetch(`${API_URL}/${menuId}`)
        .then(res => {
            if (!res.ok) throw new Error("メニュー取得失敗");
            return res.json();
        })
        .then(menu => {
            // すでにカートにあれば数量を +1
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

function renderCart() {
	const cartList = document.getElementById("cart-list");
	if (cart.length === 0) {
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

function removeFromCart(menuId) {
    cart = cart.filter(c => c.menu.id !== menuId);
    renderCart();
    renderMenuCounts();
}

