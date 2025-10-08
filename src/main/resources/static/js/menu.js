async function loadMenus() {
  const res = await fetch("http://localhost:8080/api/menus");
  const menus = await res.json();

  const list = document.getElementById("menu-list");
  list.innerHTML = menus.map(m =>
    `<div class="menu-item">
       <h3>${m.name}</h3>
       <p>${m.description}</p>
       <strong>¥${m.price}</strong>
     </div>`
  ).join("");
}

window.onload = loadMenus;
