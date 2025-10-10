const API = "/admin/api/menus";

async function loadAdminMenus() {
  const res = await fetch(API);
  const menus = await res.json();
  const list = document.getElementById("admin-list");
  list.innerHTML = menus.map(m => `
    <div class="menu-item">
      <h3>${m.name}</h3>
      <img src="${m.imageUrl || ''}" style="max-width:120px;"><br>
      <p>${m.description}</p>
      <p>¥${m.price}</p>
      <button onclick="deleteMenu(${m.id})">削除</button>
    </div>
  `).join("");
}

async function handleAdminForm(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  const form = new FormData();
  const menu = { name, price: parseInt(price), description };
  form.append("menu", new Blob([JSON.stringify(menu)], { type: "application/json" }));
  if (image) form.append("image", image);

  const res = await fetch(API, {
    method: "POST",
    body: form
  });
  if (res.ok) {
    alert("追加しました");
    document.getElementById("admin-form").reset();
    await loadAdminMenus();
  } else {
    alert("追加失敗");
  }
}

async function deleteMenu(id) {
  if (!confirm("削除しますか？")) return;
  const res = await fetch(API + "/" + id, { method: "DELETE" });
  if (res.ok) loadAdminMenus();
  else alert("削除失敗");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("admin-form").addEventListener("submit", handleAdminForm);
  loadAdminMenus();
});
