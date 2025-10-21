const API = "/admin/api/orders";
let currentPage = 0;
const pageSize = 10;

async function loadOrders() {
  const res = await fetch(`${API}?page=${currentPage}&size=${pageSize}`);
  const data = await res.json();
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  data.content.forEach(order => {
    const div = document.createElement("div");
    div.classList.add("order-card");
    div.innerHTML = `
      <h4>注文ID: ${order.id} (${order.customerName})</h4>
      <p>合計: ¥${order.totalPrice}</p>
      <button onclick="viewDetail(${order.id})">詳細</button>
    `;
    list.appendChild(div);
  });

  document.getElementById("page-info").textContent = `ページ ${currentPage+1} / ${data.totalPages}`;
}

async function viewDetail(id) {
  const res = await fetch(`${API}/${id}`);
  const order = await res.json();
  alert(
    `注文ID: ${order.id}\n顧客名: ${order.customerName}\n合計: ¥${order.totalPrice}\n` +
    order.items.map(i => `${i.menuName} x${i.quantity} ¥${i.price}`).join("\n")
  );
}

document.getElementById("prev-page").onclick = () => { 
	if(currentPage>0) {
		currentPage--; loadOrders();
	} 
};
document.getElementById("next-page").onclick = () => {
	if (currentPage + 1 < totalPages) {
		currentPage++;
		loadOrders();
	}
 };
document.addEventListener("DOMContentLoaded", loadOrders);
