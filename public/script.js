document.getElementById("faqForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer").value;

    const response = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
    });

    if (response.ok) {
        alert("FAQ added successfully!");
        document.getElementById("faqForm").reset();
        fetchFAQs();
    } else {
        alert("Error adding FAQ");
    }
});

async function fetchFAQs() {
    const lang = document.getElementById("language").value;
    const response = await fetch(`/api/faqs?lang=${lang}`);
    const data = await response.json();

    console.log(data[4]);
    const faqList = document.getElementById("faqList");
    faqList.innerHTML = "";
    
    data.data.forEach(faq => {
        const li = document.createElement("li");
        li.textContent = `Question: - ${faq.question} || Answer: - ${faq.answer}`;
        faqList.appendChild(li);
    });
}
