
const form = document.getElementById("strollForm");
const strollList = document.getElementById("strollList");

let strolls = [];

try {
    strolls = JSON.parse(
        localStorage.getItem("cousinsStrolls") || "[]"
    );

    if (!Array.isArray(strolls)) strolls = [];
} catch {
    strolls = [];
}

function saveStrolls() {
    localStorage.setItem("cousinsStrolls", JSON.stringify(strolls));
}

function addText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    parent.appendChild(element);
    return element;
}

function displayStrolls() {
    strollList.replaceChildren();

    document.getElementById("total").textContent = strolls.length;

    const places = new Set(
        strolls.map(s => s.place.trim().toLowerCase())
    );
    document.getElementById("places").textContent = places.size;

    if (strolls.length === 0) {
        addText(strollList, "p",
            "No strolls recorded yet. Add your first memory!",
            "empty");
        return;
    }

    [...strolls].reverse().forEach(stroll => {
        const card = document.createElement("article");
        card.className = "stroll-card";

        addText(card, "h3", "📍 " + stroll.place);
        addText(card, "p", "📅 Date: " + stroll.date);
        addText(card, "p", "🎯 Activity: " + stroll.activity);
        addText(card, "p", "👨‍👩‍👧 Cousins: " + stroll.cousins);
        addText(card, "p", "💚 Memory: " + (stroll.notes || "No description"));

        const button = addText(card, "button", "Delete Record", "delete-btn");
        button.type = "button";

        button.addEventListener("click", () => {
            if (confirm("Delete this stroll record?")) {
                strolls = strolls.filter(s => s.id !== stroll.id);
                saveStrolls();
                displayStrolls();
            }
        });

        strollList.appendChild(card);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const stroll = {
        id: crypto.randomUUID(),
        date: document.getElementById("date").value,
        place: document.getElementById("place").value.trim(),
        activity: document.getElementById("activity").value,
        cousins: document.getElementById("cousins").value.trim(),
        notes: document.getElementById("notes").value.trim()
    };

    if (!stroll.place || !stroll.cousins) return;

    strolls.push(stroll);
    saveStrolls();
    displayStrolls();

    form.reset();

    alert("Stroll record saved successfully!");
});

displayStrolls();
