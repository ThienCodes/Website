// ===============================
// ADMIN LOGIN
// ===============================

const ADMIN_PASSWORD = "CHANGE-ME";

const loginSection = document.getElementById("login");
const adminPanel = document.getElementById("panel");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");


// Check if already logged in
if (localStorage.getItem("ghostlyAdmin") === "1") {
    openAdmin();
}


// Login
loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {

        localStorage.setItem("ghostlyAdmin", "1");

        openAdmin();

    } else {

        loginError.textContent = "Incorrect password.";

    }

});


// Open Admin
function openAdmin() {

    loginSection.style.display = "none";

    adminPanel.style.display = "block";

    renderAdmin();

}


// Logout
document.getElementById("logout").addEventListener("click", function() {

    sessionStorage.removeItem("ghostlyAdmin");

    location.reload();

});


// ===============================
// ADMIN DATA
// ===============================

function renderAdmin() {

    const d = data();

    renderList(
        "classes",
        d.yen.classes,
        "classes"
    );

    renderList(
        "titles",
        d.yen.titles,
        "titles"
    );

    renderList(
        "traits",
        d.yen.traits,
        "traits"
    );

    renderList(
        "passives",
        d.yen.passives,
        "passives"
    );

    renderList(
        "potions",
        d.yen.potions,
        "potions"
    );


    // Stats

    document.getElementById("statsEdit").innerHTML =
        Object.entries(d.stats)
        .map(([name, values]) => {

            return `
                <div class="adminRow">

                    <b>${name}</b>

                    <input
                        type="number"
                        value="${values[0]}"
                        data-stat="${name}"
                        data-index="0"
                    >

                    <input
                        type="number"
                        value="${values[1]}"
                        data-stat="${name}"
                        data-index="1"
                    >

                </div>
            `;

        })
        .join("");


    // Activities

    document.getElementById("activityEdit").innerHTML =
        Object.entries(d.activities)
        .map(([name, value]) => {

            return `
                <label>

                    ${name}

                    <input
                        type="number"
                        value="${value}"
                        data-activity="${name}"
                    >

                </label>
            `;

        })
        .join("");


    // Stock

    document.getElementById("stockTokens").value =
        d.stock.tokens;

    document.getElementById("stockKeys").value =
        d.stock.keys;


    // Stats changes

    document.querySelectorAll("[data-stat]")
    .forEach(input => {

        input.addEventListener("change", function() {

            const d = data();

            const stat =
                this.dataset.stat;

            const index =
                Number(this.dataset.index);

            d.stats[stat][index] =
                Number(this.value);

            put(
                d,
                `Updated ${stat}`
            );

        });

    });


    // Activity changes

    document.querySelectorAll("[data-activity]")
    .forEach(input => {

        input.addEventListener("change", function() {

            const d = data();

            const activity =
                this.dataset.activity;

            d.activities[activity] =
                Number(this.value);

            put(
                d,
                `Updated ${activity}`
            );

        });

    });


    // Edit buttons

    document.querySelectorAll(".edit")
    .forEach(button => {

        button.addEventListener("click", function() {

            editItem(
                this.dataset.type,
                Number(this.dataset.index)
            );

        });

    });


    // Delete buttons

    document.querySelectorAll(".delete")
    .forEach(button => {

        button.addEventListener("click", function() {

            deleteItem(
                this.dataset.type,
                Number(this.dataset.index)
            );

        });

    });


    // Add buttons

    document.querySelectorAll(".add")
    .forEach(button => {

        button.addEventListener("click", function() {

            addItem(
                this.dataset.type
            );

        });

    });


    // History

    const historyList = history();

    document.getElementById("history").innerHTML =
        historyList.length
        ? historyList
            .map(item => `
                <div class="history">

                    <small>${item.t}</small>

                    — ${item.m}

                </div>
            `)
            .join("")
        : "<p>No changes yet.</p>";

}


// ===============================
// LISTS
// ===============================

function renderList(container, items, type) {

    document.getElementById(container).innerHTML =
        items
        .map((item, index) => {

            return `
                <div class="adminRow">

                    <input
                        value="${item[0]}"
                        readonly
                    >

                    <input
                        value="${item[1]}"
                        readonly
                    >

                    <div>

                        <button
                            class="btn edit"
                            data-type="${type}"
                            data-index="${index}">
                            Edit
                        </button>

                        <button
                            class="btn danger delete"
                            data-type="${type}"
                            data-index="${index}">
                            Delete
                        </button>

                    </div>

                </div>
            `;

        })
        .join("");

}


// ===============================
// EDIT
// ===============================

function editItem(type, index) {

    const d = data();

    const item =
        d.yen[type][index];


    const newName =
        prompt(
            "Name:",
            item[0]
        );


    if (newName === null) {
        return;
    }


    const newValue =
        prompt(
            type === "classes"
                ? "Multiplier:"
                : "Yen bonus percentage:",
            item[1]
        );


    if (newValue === null) {
        return;
    }


    item[0] =
        newName.trim();

    item[1] =
        Number(newValue);


    put(
        d,
        `Edited ${type}: ${item[0]}`
    );


    renderAdmin();

}


// ===============================
// DELETE
// ===============================

function deleteItem(type, index) {

    const d = data();

    const name =
        d.yen[type][index][0];


    if (
        !confirm(
            `Are you sure you want to delete "${name}"?`
        )
    ) {

        return;

    }


    d.yen[type].splice(
        index,
        1
    );


    put(
        d,
        `Deleted ${type}: ${name}`
    );


    renderAdmin();

}


// ===============================
// ADD
// ===============================

function addItem(type) {

    const d = data();


    const name =
        prompt(
            "Enter the name:"
        );


    if (!name) {
        return;
    }


    const value =
        prompt(
            type === "classes"
                ? "Enter multiplier:"
                : "Enter Yen bonus percentage:",
            "0"
        );


    if (value === null) {
        return;
    }


    d.yen[type].push([
        name.trim(),
        Number(value)
    ]);


    put(
        d,
        `Added ${type}: ${name}`
    );


    renderAdmin();

}


// ===============================
// PUBLIC STOCK
// ===============================

document
.getElementById("stockSave")
.addEventListener("click", function() {

    const d = data();

    d.stock.tokens =
        Number(
            document.getElementById(
                "stockTokens"
            ).value
        ) || 0;

    d.stock.keys =
        Number(
            document.getElementById(
                "stockKeys"
            ).value
        ) || 0;


    put(
        d,
        "Updated public stock"
    );


    renderAdmin();

});


// ===============================
// BACKUP
// ===============================

document
.getElementById("backup")
.addEventListener("click", function() {

    const backup =
        JSON.stringify(
            data(),
            null,
            2
        );


    const blob =
        new Blob(
            [backup],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "ghostly-dashboard-backup.json";


    link.click();


    URL.revokeObjectURL(url);


    hist(
        "Created backup"
    );


    renderAdmin();

});


// ===============================
// UNDO
// ===============================

document
.getElementById("undo")
.addEventListener("click", function() {

    alert(
        "Full Undo will be connected to the change history system in the next version."
    );

});
