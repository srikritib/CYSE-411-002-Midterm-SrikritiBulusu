// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application


function loadSession() {
    const raw = sessionStorage.getItem("session");
    const session = JSON.parse(raw);          // No try/catch
    return session;                            // No field validation
}


//  Q4.A  Status Message Rendering
//  Displays an employee's status message on their profile card.
//  VULNERABILITY: The message is inserted via innerHTML,
//  allowing any HTML or script tags in the message to
//  execute in the viewer's browser (stored XSS).


function renderStatusMessage(containerElement, message) {

    const li = document.createElement(message);
    containerElement.textContent(li);
    //containerElement.innerHTML = "<p>" + message + "</p>";   // UNSAFE
}




//  Q4.B  Search Query Sanitization
//  Builds a display label from the user's search input.
//  VULNERABILITY: The raw input is used directly with no
//  character filtering, no length limit, and no trimming.


function sanitizeSearchQuery(input) {
    if (typeof input !== "string") {
        return null;
    }

    input = input.slice(0,40);
    input = input.replace(/[^A-Za-z0-9 _-]/g, "_");

    if (input.length === 0) {
        return null;
    }

    // TODO: Implement sanitization.
    // Requirements:
    //   - Allow only letters, digits, spaces, hyphens, underscores
    //   - Trim leading/trailing whitespace before processing
    //   - Max 40 characters
    //   - Return null if the result is empty after sanitization
    return input;   // UNSAFE – returns raw input unchanged
}

function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");
    query.textContent(label);
}



//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", function () {

   //Didn't understand which section to modify for Q4.C
   
   const session = loadSession();
   try {
    if (session) {
        if (displayName.length === 0 || userId.length === 0 || if role.length === 0) {
            return null;
        }
        document.getElementById("welcome-msg").textContent =
        "Welcome, " + session.displayName;
    }

   }
   catch (error) {
    return null;
   }
    

    // Simulate receiving a profile card with a status message
    // In production this would come from an API response.
    const simulatedProfiles = [
        {
            name: "Alice Johnson",
            department: "Engineering",
            status: "Working from home today"
        },
        {
            name: "Bob Martinez",
            department: "Security",
            // Attacker-controlled payload – should NOT execute
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // Q4.A – fix this call
        renderStatusMessage(statusContainer, profile.div);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // Search button handler
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});
