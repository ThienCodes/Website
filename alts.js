const STORAGE_KEY = "ghostlyAltDashboard";

const DEFAULT_ALT_COUNT = 26;

function createAlt(number) {
    return {
        name: `Alt ${number}`,
        description: "",
        completed: false,

        tokens: 0,
        keys: 0,
        boosts: 0,

        tokensEnabled: true,
        keysEnabled: true,
        boostsEnabled: true
    };
}


function loadAlts() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {

        try {
            return JSON.parse(saved);
        } catch {
            console.log("Could not load saved alts.");
        }

    }

    const startingAlts = [];

    for (let i = 1; i <= DEFAULT_ALT_COUNT; i++) {
        startingAlts.push(createAlt(i));
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(startingAlts)
    );

    return startingAlts;
}


let alts = loadAlts();


function save() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(alts)
    );

    updateTotals();
}


function render() {

    const container =
        document.getElementById("altsContainer");

    container.innerHTML = "";


    let displayedAlts = [...alts];

    const sort =
        document.getElementById("sortSelect").value;


    if (sort === "completed") {

        displayedAlts.sort(
            (a, b) =>
                Number(b.completed) -
                Number(a.completed)
        );

    }


    if (sort === "uncompleted") {

        displayedAlts.sort(
            (a, b) =>
                Number(a.completed) -
                Number(b.completed)
        );

    }


    displayedAlts.forEach(alt => {

        const index =
            alts.indexOf(alt);


        const card =
            document.createElement("article");

        card.className = "alt-card";


        if (alt.completed) {
            card.classList.add("completed");
        }


        card.innerHTML = `

            <div class="alt-header">

                <div class="alt-info">

                    <input
                        class="alt-name"
                        value="${escapeHTML(alt.name)}"
                        placeholder="Alt name"
                    >

                    <textarea
                        class="description"
                        placeholder="Description..."
                    >${escapeHTML(alt.description)}</textarea>

                </div>


                <label class="completed-check">

                    <input
                        type="checkbox"
                        class="completed"
                        ${alt.completed ? "checked" : ""}
                    >

                    Completed

                </label>

            </div>


            <div class="counter-grid">

                ${counter(
                    "Tower Tokens",
                    "tokens",
                    alt.tokens,
                    alt.tokensEnabled
                )}

                ${counter(
                    "Limbo Keys",
                    "keys",
                    alt.keys,
                    alt.keysEnabled
                )}

                ${counter(
                    "Server Boosts",
                    "boosts",
                    alt.boosts,
                    alt.boostsEnabled
                )}

            </div>


            <div class="alt-actions">

                <button
                    class="reset-alt danger">
                    Reset This Alt
                </button>

                <button
                    class="delete-alt danger">
                    Delete Alt
                </button>

            </div>

        `;


        container.appendChild(card);


        // Name

        card.querySelector(".alt-name")
            .addEventListener("input", e => {

                alts[index].name =
                    e.target.value;

                save();

            });


        // Description

        card.querySelector(".description")
            .addEventListener("input", e => {

                alts[index].description =
                    e.target.value;

                save();

            });


        // Completed

        card.querySelector(".completed")
            .addEventListener("change", e => {

                alts[index].completed =
                    e.target.checked;

                save();

                render();

            });


        setupCounter(
            card,
            index,
            "tokens"
        );

        setupCounter(
            card,
            index,
            "keys"
        );

        setupCounter(
            card,
            index,
            "boosts"
        );


        // Reset

        card.querySelector(".reset-alt")
            .addEventListener("click", () => {

                if (
                    !confirm(
                        `Reset ${alts[index].name}?`
                    )
                ) {
                    return;
                }


                const oldName =
                    alts[index].name;

                const oldDescription =
                    alts[index].description;


                alts[index] =
                    createAlt(index + 1);


                alts[index].name =
                    oldName;

                alts[index].description =
                    oldDescription;


                save();

                render();

            });


        // Delete

        card.querySelector(".delete-alt")
            .addEventListener("click", () => {

                if (
                    !confirm(
                        `Delete ${alts[index].name}?`
                    )
                ) {
                    return;
                }


                alts.splice(index, 1);


                save();

                render();

            });

    });


    updateTotals();

}


function counter(
    title,
    type,
    value,
    enabled
) {

    return `

        <div
            class="counter ${enabled ? "" : "disabled"}"
            data-type="${type}"
        >

            <div class="counter-title">

                <span>${title}</span>

                <label>

                    <input
                        type="checkbox"
                        class="counter-enabled"
                        ${enabled ? "checked" : ""}
                    >

                    Active

                </label>

            </div>


            <div class="counter-controls">

                <button
                    class="minus"
                    ${enabled ? "" : "disabled"}
                >
                    −
                </button>


                <input
                    class="counter-input"
                    type="number"
                    min="0"
                    value="${value}"
                    ${enabled ? "" : "disabled"}
                >


                <button
                    class="plus"
                    ${enabled ? "" : "disabled"}
                >
                    +
                </button>

            </div>

        </div>

    `;

}


function setupCounter(
    card,
    index,
    type
) {

    const box =
        card.querySelector(
            `[data-type="${type}"]`
        );


    const input =
        box.querySelector(".counter-input");

    const minus =
        box.querySelector(".minus");

    const plus =
        box.querySelector(".plus");

    const enabled =
        box.querySelector(".counter-enabled");


    plus.addEventListener(
        "click",
        () => {

            alts[index][type]++;

            input.value =
                alts[index][type];

            save();

        }
    );


    minus.addEventListener(
        "click",
        () => {

            alts[index][type]--;

            if (
                alts[index][type] < 0
            ) {
                alts[index][type] = 0;
            }

            input.value =
                alts[index][type];

            save();

        }
    );


    input.addEventListener(
        "change",
        () => {

            let value =
                Number(input.value);

            if (value < 0)
                value = 0;

            alts[index][type] =
                value;

            save();

        }
    );


    enabled.addEventListener(
        "change",
        () => {

            alts[index][`${type}Enabled`] =
                enabled.checked;

            save();

            render();

        }
    );

}


function updateTotals() {

    let tokens = 0;
    let keys = 0;
    let boosts = 0;


    alts.forEach(alt => {

        if (alt.tokensEnabled) {

            tokens +=
                Number(alt.tokens) || 0;

        }


        if (alt.keysEnabled) {

            keys +=
                Number(alt.keys) || 0;

        }


        if (alt.boostsEnabled) {

            boosts +=
                Number(alt.boosts) || 0;

        }

    });


    document.getElementById(
        "totalTokens"
    ).textContent = tokens;


    document.getElementById(
        "totalKeys"
    ).textContent = keys;


    document.getElementById(
        "totalBoosts"
    ).textContent = boosts;

}


document.getElementById(
    "sortSelect"
).addEventListener(
    "change",
    render
);


// Reset all

document.getElementById(
    "resetAll"
).addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "Are you sure you want to reset ALL alts?"
            )
        ) {
            return;
        }


        alts =
            alts.map((alt, index) => {

                const newAlt =
                    createAlt(index + 1);

                newAlt.name =
                    alt.name;

                newAlt.description =
                    alt.description;

                return newAlt;

            });


        save();

        render();

    }
);


// Add Alt button

function addAlt() {

    const number =
        alts.length + 1;

    alts.push(
        createAlt(number)
    );

    save();

    render();

}


// Add button

document.getElementById("addAlt")
    .addEventListener("click", addAlt);


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


render();
