const GITHUB_REPO = "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME";

function loadUtterances() {
    const container = document.getElementById("utterances-container");
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", GITHUB_REPO);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-light");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
}

let allGods = [];

async function fetchGreekGods() {
    const grid = document.getElementById("godsGrid");
    if (!grid) return;

    try {
        const response = await fetch("https://thegreekmythapi.vercel.app/api/gods");
        const data = await response.json();
        allGods = Array.isArray(data) ? data : (data.gods || data.data || []);
        renderGods(allGods);
    } catch (error) {
        grid.innerHTML = "<p class='loading-text'>Unable to reach Mount Olympus right now. Please refresh the page.</p>";
    }
}

function renderGods(godsList) {
    const grid = document.getElementById("godsGrid");
    if (!grid) return;

    if (godsList.length === 0) {
        grid.innerHTML = "<p class='loading-text'>No deities matched your search.</p>";
        return;
    }

    grid.innerHTML = godsList.map(god => {
        const name = god.name || "Unknown Deity";
        const category = god.category || "Olympian";
        const desc = god.description || "A figure from classical Greek mythology.";
        const attributes = god.attributes || {};
        const abode = attributes.abode || "Mount Olympus";
        const symbols = Array.isArray(attributes.symbols) ? attributes.symbols.join(", ") : "Sacred Relic";
        const powers = Array.isArray(attributes.powers) ? attributes.powers.join(", ") : "Divine Influence";

        return `
            <article class="god-card">
                <div>
                    <span class="god-category">${category}</span>
                    <h3>${name}</h3>
                    <p class="god-desc">${desc}</p>
                    <div class="god-meta">
                        <div><strong>Abode:</strong> ${abode}</div>
                        <div><strong>Symbols:</strong> ${symbols}</div>
                        <div><strong>Powers:</strong> ${powers}</div>
                    </div>
                </div>
                <button class="btn-discuss-god" onclick="scrollToDiscuss('${name}')">Comment on ${name}</button>
            </article>
        `;
    }).join("");
}

function scrollToDiscuss(godName) {
    const commentBox = document.getElementById("pantheon-comments");
    const subText = commentBox ? commentBox.querySelector(".section-sub") : null;
    if (subText) {
        subText.textContent = `Commenting on ${godName}: Mention "${godName}" in your note below so readers know which deity you are discussing.`;
    }
    if (commentBox) {
        commentBox.scrollIntoView({ behavior: "smooth" });
    }
}

function setupSearch() {
    const searchInput = document.getElementById("godSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = allGods.filter(god => {
            const name = (god.name || "").toLowerCase();
            const desc = (god.description || "").toLowerCase();
            const abode = (god.attributes && god.attributes.abode ? god.attributes.abode : "").toLowerCase();
            const symbols = (god.attributes && Array.isArray(god.attributes.symbols) ? god.attributes.symbols.join(" ") : "").toLowerCase();
            return name.includes(term) || desc.includes(term) || abode.includes(term) || symbols.includes(term);
        });
        renderGods(filtered);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadUtterances();
    fetchGreekGods();
    setupSearch();
});