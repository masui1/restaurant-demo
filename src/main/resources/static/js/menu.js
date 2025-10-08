// /restaurant-demo/src/main/resources/static/js/menu.js

// APIのURLを定義
const API_URL = "http://localhost:8080/api/menus";

async function loadMenus() {
    const list = document.getElementById("menu-list");
    list.innerHTML = "<p>読み込み中...</p>";

    try {
        const res = await fetch("http://localhost:8080/api/menus");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const menus = await res.json();

        if (menus.length === 0) {
            list.innerHTML = "<p>メニューはまだ登録されていません。</p>";
            return;
        }

        list.innerHTML = menus.map(m =>
            `<div class="menu-item">
                <h2>${m.name}</h2>
                <p class="description">${m.description}</p>
                <p class="price">¥${m.price.toLocaleString()}</p>
            </div>`
        ).join("");

    } catch (err) {
        console.error(err);
        list.innerHTML = `<p>メニューの読み込み中にエラーが発生しました。</p>`;
    }
}

// メニュー追加フォーム送信処理
async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value.trim();

  if (!name || !price || !description) {
    alert("すべての項目を入力してください。");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, price, description })
    });

    if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    document.getElementById("menu-form").reset();

    await loadMenus(); // 更新表示

  } catch (err) {
    console.error(err);
    alert("メニューの追加に失敗しました。");
  }
}


// ページ読み込み時にメニューをロード
window.addEventListener("DOMContentLoaded", () => {
  loadMenus();
  document.getElementById("menu-form").addEventListener("submit", handleFormSubmit);
});
