const API_URL = "/api/contact";

document.getElementById("contact-form").onsubmit = async (e) => {
	e.preventDefault();
	
	const body = {
		name: document.getElementById("name").value,
		email: document.getElementById("email").value,
		message: document.getElementById("message").value
	};
	
	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	
	const statusEl = document.getElementById("status");
	
	if (res.ok) {
		statusEl.textContent = "送信が完了しました。ありがとうございます。";
		e.target.reset();
	} else {
		statusEl.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
	}
};