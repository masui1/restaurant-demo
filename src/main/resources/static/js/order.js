// js/orders.js
async function loadOrders() {
  const res = await fetch("/api/orders",);
  if (!res.ok) {
    document.getElementById("order-list").innerHTML = "<p>注文履歴の取得に失敗しました。</p>";
    return;
  }

  const orders = await res.json();
  const list = document.getElementById("order-list");

  if (orders.length === 0) {
    list.innerHTML = "<p>注文履歴はありません。</p>";
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="order">
      <h3>注文ID: ${o.id}</h3>
      <p>お客様: ${o.customerName}</p>
      <p>合計金額: ¥${o.totalPrice.toLocaleString()}</p>
      <ul>
        ${o.items.map(i => `
          <li>${i.menuName} × ${i.quantity}（¥${i.price.toLocaleString()}）</li>
        `).join("")}
      </ul>
      <hr>
    </div>
  `).join("");
}

window.addEventListener("DOMContentLoaded", loadOrders);

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
    return `
      <div class="cart-item">
        <span>${c.menu.name}</span>
        <div>
          <button onclick="changeQuantity(${c.menu.id}, -1)">−</button>
          <span>${c.quantity}</span>
          <button onclick="changeQuantity(${c.menu.id}, 1)">＋</button>
        </div>
        <span>¥${(c.menu.price * c.quantity).toLocaleString()}</span>
        <button onclick="removeFromCart(${c.menu.id})">削除</button>
      </div>`;
  }).join("");

  document.getElementById("cart-total").textContent = total.toLocaleString();
}

function changeQuantity(menuId, delta) {
  const item = cart.find(c => c.menu.id === menuId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(c => c.menu.id !== menuId);
  }
  renderCart();
  renderMenuCounts();
}
