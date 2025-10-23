const API_URL = "/admin/api/reservation";

async function loadReservations() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const tbody = document.querySelector("#reservation-table tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="8">予約データがありません。</td>`;
    tbody.appendChild(tr);
    return;
  }

  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.customerName || "（未入力）"}</td>
      <td>${r.phone}</td>
      <td>${r.type === "DINE_IN" ? "店内" : "テイクアウト"}</td>
      <td>${r.reservationTime?.replace("T", " ").substring(0, 16)}</td>
      <td>${r.numberOfPeople}</td>
      <td>${r.note || ""}</td>
      <td><button onclick="deleteReservation(${r.id})">削除</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteReservation(id) {
  if (!confirm(`予約ID ${id} を削除しますか？`)) return;

  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (res.ok) {
    alert("削除しました。");
    loadReservations();
  } else {
    alert("削除に失敗しました。");
  }
}

document.addEventListener("DOMContentLoaded", loadReservations);
