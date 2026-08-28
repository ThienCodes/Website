const ALT_COUNT = 26;

const STORAGE_KEY = "altDashboardData";


const DEFAULT_DATA = [];

for (let i = 1; i <= ALT_COUNT; i++) {

    DEFAULT_DATA.push({
        name: `Alt ${i}`,
        description: "",
        completed: false,

        tokens: {
            value: 0,
            enabled: true
        },

        keys: {
            value: 0,
            enabled: true
        },

        boosts: {
            value: 0,
            enabled: true
        }
    });

}


function loadData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_DATA)
        );

        return structuredClone(DEFAULT_DATA);

    }

    try {

        const data = JSON.parse(saved);

        while (data.length < ALT_COUNT) {

            const number = data.length + 1;

            data.push({
                name: `Alt ${number}`,
                description: "",
                completed: false,

                tokens: {
                    value: 0,
                    enabled: true
                },

                keys: {
                    value: 0,
                    enabled: true
                },

                boosts: {
                    value: 0,
                    enabled: true
                }
            });

        }

        return data;

    } catch {

        return structuredClone(DEFAULT_DATA);

    }

}


let alts = loadData();


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(alts)
    );

    updateTotals();

}


function renderAlts() {

    const container =
        document.getElementById("altsContainer");

    let list = [...alts];

    const sort =
        document.getElementById("sortSelect").value;


    if (sort === "completed") {

        list.sort(
            (a, b) =>
                Number(b.completed) -
                Number(a.completed)
        );

    }


    if (sort === "uncompleted") {

        list.sort(
            (a, b) =>
                Number(a.completed) -
                Number(b.completed)
        );

    }


    container.innerHTML = "";


    list.forEach((alt, originalIndex) => {

        const index =
            alts.indexOf(alt);


        const card =
            document.createElement("article");

        card.className =
            "alt-card";


        if (alt.completed) {

            card.classList.add("completed");

        }


        card.innerHTML = `

            <div class="alt-header">

                <div>

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
                        class="completed-box"
                        ${alt.completed ? "checked" : ""}
                    >

                    Completed

                </label>

            </div>


            <div class="counter-grid">

                ${counterHTML(
                    "Tower Tokens",
                    "tokens",
                    alt.tokens
                )}

                ${counterHTML(
                    "Limbo Keys",
                    "keys",
                    alt.keys
                )}

                ${counterHTML(
                    "Server Boosts",
                    "boosts",
                    alt.boosts
                )}

            </div>


            <div class="alt-actions">

                <button class="reset-alt">
                    Reset This Alt
                </button>

            </div>

        `;


        container.appendChild(card);


        const name =
            card.querySelector(".alt-name");

        name.addEventListener(
            "input",
            () => {

                alts[index].name =
                    name.value;

                saveData();

            }
        );


        const description =
            card.querySelector(".description");

        description.addEventListener(
            "input",
            () => {

                alts[index].description =
                    description.value;

                saveData();

            }
        );


        const completed =
            card.querySelector(".completed-box");

        completed.addEventListener(
            "change",
            () => {

                alts[index].completed =
                    completed.checked;

                saveData();

                renderAlts();

            }
        );


        card
            .querySelectorAll(".counter")
            .forEach(counter => {

                const type =
                    counter.dataset.type;


                const minus =
                    counter.querySelector(".minus");

                const plus =
                    counter.querySelector(".plus");

                const input =
                    counter.querySelector(".counter-input");

                const toggle =
                    counter.querySelector(".counter-enabled");


                plus.addEventListener(
                    "click",
                    () => {

                        alts[index][type].value++;

                        input.value =
                            alts[index][type].value;

                        saveData();

                    }
                );


                minus.addEventListener(
                    "click",
                    () => {

                        alts[index][type].value--;

                        if (
                            alts[index][type].value < 0
                        ) {

                            alts[index][type].value = 0;

                        }

                        input.value =
                            alts[index][type].value;

                        saveData();

                    }
                );


                input.addEventListener(
                    "change",
                    () => {

                        let value =
                            Number(input.value);

                        if (value < 0)
                            value = 0;

                        alts[index][type].value =
                            value;

                        input.value =
                            value;

                        saveData();

                    }
                );


                toggle.addEventListener(
                    "change",
                    () => {

                        alts[index][type].enabled =
                            toggle.checked;

                        saveData();

                        renderAlts();

                    }
                );

            });


        card
            .querySelector(".reset-alt")
            .addEventListener(
                "click",
                () => {

                    if (
                        !confirm(
                            `Reset ${alts[index].name}?`
                        )
                    ) {

                        return;

                    }


                    alts[index] = {

                        name:
                            alts[index].name,

                        description:
                            alts[index].description,

                        completed: false,

                        tokens: {
                            value: 0,
                            enabled: true
                        },

                        keys: {
                            value: 0,
                            enabled: true
                        },

                        boosts: {
                            value: 0,
                            enabled: true
                        }

                    };


                    saveData();

                    renderAlts();

                }
            );

    });


    updateTotals();

}


function counterHTML(
    title,
    type,
    counter
) {

    return `

        <div class="counter ${!counter.enabled ? "disabled" : ""}"
             data-type="${type}">

            <div class="counter-title">

                <span>${title}</span>

                <label>

                    <input
                        type="checkbox"
                        class="counter-enabled"
                        ${counter.enabled ? "checked" : ""}
                    >

                    Active

                </label>

            </div>


            <div class="counter-controls">

                <button
                    class="minus"
                    ${!counter.enabled ? "disabled" : ""}
                >
                    −
                </button>


                <input
                    class="counter-input"
                    type="number"
                    min="0"
                    value="${counter.value}"
                    ${!counter.enabled ? "disabled" : ""}
                >


                <button
                    class="plus"
                    ${!counter.enabled ? "disabled" : ""}
                >
                    +
                </button>

            </div>

        </div>

    `;

}


function updateTotals() {

    let tokens = 0;
    let keys = 0;
    let boosts = 0;


    alts.forEach(alt => {

        if (alt.tokens.enabled)
            tokens += Number(alt.tokens.value) || 0;

        if (alt.keys.enabled)
            keys += Number(alt.keys.value) || 0;

        if (alt.boosts.enabled)
            boosts += Number(alt.boosts.value) || 0;

    });


    document.getElementById("totalTokens")
        .textContent = tokens;

    document.getElementById("totalKeys")
        .textContent = keys;

    document.getElementById("totalBoosts")
        .textContent = boosts;

}


document
    .getElementById("sortSelect")
    .addEventListener(
        "change",
        renderAlts
    );


document
    .getElementById("resetAll")
    .addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Are you sure you want to reset ALL 26 alts?"
                )
            ) {

                return;

            }


            alts =
                alts.map(alt => ({

                    ...alt,

                    completed: false,

                    tokens: {
                        ...alt.tokens,
                        value: 0
                    },

                    keys: {
                        ...alt.keys,
                        value: 0
                    },

                    boosts: {
                        ...alt.boosts,
                        value: 0
                    }

                }));


            saveData();

            renderAlts();

        }
    );


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


renderAlts();
