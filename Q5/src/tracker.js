// ============================================================
//  CYSE 411 Q5 Starter Code
//  Incident Tracker Application
// ============================================================

const ALLOWED_FILTERS = ["all", "low", "medium", "high", "critical"];
const ALLOWED_SEVERITIES = ["low", "medium", "high", "critical"];

function isValidFilter(value) {
    return ALLOWED_FILTERS.includes(value);
}

function isValidSeverity(value) {
    return ALLOWED_SEVERITIES.includes(value);
}

// ------------------------------------------------------------
// Q5.C - Secure Dashboard State Management
// ------------------------------------------------------------
function loadDashboardState() {
    const raw = localStorage.getItem("dashboardState");

    if (!raw) {
        return { filter: "all" };
    }

    try {
        const state = JSON.parse(raw);

        if (!state || !isValidFilter(state.filter)) {
            return { filter: "all" };
        }

        return {
            filter: state.filter
        };
    } catch (err) {
        console.error("Failed to parse dashboard state:", err);
        return { filter: "all" };
    }
}

function saveDashboardState() {
    const filterEl = document.getElementById("filter");

    if (!filterEl) {
        return;
    }

    const value = filterEl.value;

    if (!isValidFilter(value)) {
        console.warn("Invalid filter not saved:", value);
        return;
    }

    const state = {
        filter: value
    };

    localStorage.setItem("dashboardState", JSON.stringify(state));
}

// ------------------------------------------------------------
// Q5.A - Secure Async Fetch with HTTP Status Checking
// ------------------------------------------------------------
async function fetchIncidents() {
    try {
        const res = await fetch("/api/incidents");

        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }

        const data = await res.json();
        return data;
        
    } catch (err) {
        console.error("Failed to fetch incidents:", err);
        return [];
    }
}

// ------------------------------------------------------------
// Q5.B - Safe Incident List Rendering
// ------------------------------------------------------------
function renderIncidents(incidents) {
    const container = document.getElementById("incident-list");
    const item = document.createElement(container);


    if (!container) {
        return;
    }

    container.textContent = "";
    const title.textContent = "";
    const severity.textContent = "";
    

    if (!Array.isArray(incidents)) {
        const msg = document.createElement("p");
        msg.textContent = "Unable to display incidents right now.";
        container.appendChild(msg);
        return;
    }

    const list = document.createElement("ul");

    incidents.forEach(function (incident) {
        if (
            !incident ||
            typeof incident.title !== "string" ||
            incident.title.trim() === "" ||
            typeof incident.severity !== "string" ||
            !isValidSeverity(incident.severity)
        ) {
            console.warn("Skipping invalid incident:", incident);
            return;
        }

        const item = document.createElement("li");

        const titleEl = document.createElement("span");
        titleEl.textContent = incident.title.trim();

        const sepEl = document.createElement("span");
        sepEl.textContent = " - ";

        const severityEl = document.createElement("span");
        severityEl.textContent = incident.severity;

        item.appendChild(titleEl);
        item.appendChild(sepEl);
        item.appendChild(severityEl);

        list.appendChild(item);
    });

    container.appendChild(list);
}
// ------------------------------------------------------------
// Optional filter helper
// ------------------------------------------------------------
function applyFilter(incidents, filterValue) {
    if (!Array.isArray(incidents)) {
        return [];
    }

    if (!isValidFilter(filterValue) || filterValue === "all") {
        return incidents;
    }

    return incidents.filter(function (incident) {
        return incident && incident.severity === filterValue;
    });
}

// ------------------------------------------------------------
// Application Bootstrap
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async function () {
    const filterEl = document.getElementById("filter");

    const state = loadDashboardState();

    if (filterEl) {
        filterEl.value = state.filter;
    }

    const incidents = await fetchIncidents();
    const currentFilter = filterEl && isValidFilter(filterEl.value)
        ? filterEl.value
        : "all";

    const visibleIncidents = applyFilter(incidents, currentFilter);
    renderIncidents(visibleIncidents);

    saveDashboardState();

    if (filterEl) {
        filterEl.addEventListener("change", function () {
            const selected = isValidFilter(filterEl.value)
                ? filterEl.value
                : "all";

            const filtered = applyFilter(incidents, selected);
            renderIncidents(filtered);
            saveDashboardState();
        });
    }
});
