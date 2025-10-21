const API = "/admin/api/menus";
let editTargetId = null; // 編集対象のIDを保持

async function loadAdminMenus() {
  const res = await fetch(API);
  const menus = await res.json();
  const list = document.getElementById("admin-list");
  list.innerHTML = "";

  menus.forEach(m => {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    const h3 = document.createElement('h3');
    h3.textContent = m.name;
    card.appendChild(h3);

    if (m.imageUrl) {
      const img = document.createElement('img');
      img.src = m.imageUrl;
      img.style.maxWidth = "120px";
      card.appendChild(img);
    }

    const pDesc = document.createElement('p');
    pDesc.textContent = m.description;
    card.appendChild(pDesc);

    const pPrice = document.createElement('p');
    pPrice.textContent = `¥${m.price}`;
    card.appendChild(pPrice);

    const pAllergy = document.createElement('p');
    pAllergy.textContent = `アレルギー: ${m.allergy || "なし"}`;
    card.appendChild(pAllergy);

    // 🔸 ボタンを横並びにするグループ
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');

    const btnEdit = document.createElement('button');
    btnEdit.textContent = "編集";
    btnEdit.classList.add('edit-btn');
    btnEdit.onclick = () => openEditModal(m);
    buttonGroup.appendChild(btnEdit);

    const btnDel = document.createElement('button');
    btnDel.textContent = "削除";
    btnDel.classList.add('delete-btn');
    btnDel.onclick = () => deleteMenu(m.id);
    buttonGroup.appendChild(btnDel);

    card.appendChild(buttonGroup);
    list.appendChild(card);
  });
}


// 新規追加
async function handleAdminForm(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const allergy = document.getElementById("allergy").value;
  const recommended = document.getElementById("recommended").checked;
  const image = document.getElementById("image").files[0];

  const form = new FormData();
  const menu = { name, price: parseInt(price), description, allergy, recommended };
  form.append("menu", new Blob([JSON.stringify(menu)], { type: "application/json" }));
  if (image) form.append("image", image);

  const res = await fetch(API, { method: "POST", body: form });
  if (res.ok) {
    alert("追加しました");
    document.getElementById("admin-form").reset();
    loadAdminMenus();
  } else {
    alert("追加失敗");
  }
}

// 編集モーダルを開く
function openEditModal(menu) {
  editTargetId = menu.id;
  document.getElementById("edit-name").value = menu.name;
  document.getElementById("edit-price").value = menu.price;
  document.getElementById("edit-description").value = menu.description;
  document.getElementById("edit-allergy").value = menu.allergy || "";
  document.getElementById("edit-recommended").checked = menu.recommended;
  document.getElementById("edit-modal").style.display = "block";
}

// 編集送信
async function handleEditForm(e) {
  e.preventDefault();
  const name = document.getElementById("edit-name").value;
  const price = document.getElementById("edit-price").value;
  const description = document.getElementById("edit-description").value;
  const allergy = document.getElementById("edit-allergy").value;
  const recommended = document.getElementById("edit-recommended").checked;
  const image = document.getElementById("edit-image").files[0];

  const form = new FormData();
  const menu = { name, price: parseInt(price), description, allergy, recommended };
  form.append("menu", new Blob([JSON.stringify(menu)], { type: "application/json" }));
  if (image) form.append("image", image);

  const res = await fetch(`${API}/${editTargetId}`, {
    method: "PUT",
    body: form
  });

  if (res.ok) {
    alert("更新しました");
    closeEditModal();
    loadAdminMenus();
  } else {
    alert("更新失敗");
  }
}

// モーダルを閉じる
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
  editTargetId = null;
}

// 削除
async function deleteMenu(id) {
  if (!confirm("削除しますか？")) return;
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (res.ok) loadAdminMenus();
  else alert("削除失敗");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("admin-form").addEventListener("submit", handleAdminForm);
  document.getElementById("edit-form").addEventListener("submit", handleEditForm);
  document.getElementById("close-edit-modal").addEventListener("click", closeEditModal);
  loadAdminMenus();
});
