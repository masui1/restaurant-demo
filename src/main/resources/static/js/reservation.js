const API_URL = "http://localhost:8080/api/reservation";

document.getElementById("reservation-form").onsubmit = async (e) => {
      e.preventDefault();
      const body = {
        customerName: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        type: document.getElementById("type").value,
        reservationTime: document.getElementById("datetime").value,
        numberOfPeople: document.getElementById("people").value,
        note: document.getElementById("note").value
      };
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert("予約が完了しました！");
        e.target.reset();
      } else {
        alert("予約に失敗しました。");
      }
};