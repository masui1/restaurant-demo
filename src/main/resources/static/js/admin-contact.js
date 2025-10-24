const API_URL = "/admin/api/contact";

async function loadContacts() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const tbody = document.querySelector("#contact-table tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">お問い合わせデータがありません。</td>`;
    tbody.appendChild(tr);
    return;
  }

  data.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.message}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", loadContacts);
