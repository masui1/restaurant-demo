const API = "/admin/api/menus";

async function loadAdminMenus() {
  const res = await fetch(API);
  const menus = await res.json();
  const list = document.getElementById("admin-list");
  list.innerHTML = ""; // まず空にする

  menus.forEach(m => {
    // カードを作成
    const card = document.createElement('div');
    card.classList.add('menu-card');

    // メニュー名
    const h3 = document.createElement('h3');
    h3.textContent = m.name;
    card.appendChild(h3);

    // 画像
    if (m.imageUrl) {
      const img = document.createElement('img');
      img.src = m.imageUrl;
      img.style.maxWidth = "120px";
      card.appendChild(img);
    }

    // 説明
    const pDesc = document.createElement('p');
    pDesc.textContent = m.description;
    card.appendChild(pDesc);

    // 価格
    const pPrice = document.createElement('p');
    pPrice.textContent = `¥${m.price}`;
    card.appendChild(pPrice);

    // 削除ボタン
    const btnDel = document.createElement('button');
    btnDel.textContent = "削除";
    btnDel.onclick = () => deleteMenu(m.id);
    card.appendChild(btnDel);

    // カードをリストに追加
    list.appendChild(card);
  });
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
