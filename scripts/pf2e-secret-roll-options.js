function init() {
    game.settings.register("pf2e-secret-roll-options", "rollMode", {
        name: "Roll Type",
        hint: "The type of roll secret checks should default to for players.",
        scope: "world",
        config: true,
        type: String,
        default: "defaultroll",
        choices: {
            "defaultroll": "Default Roll Mode",
            "publicroll": "Public Roll",
            "gmroll": "Private GM Roll",
            "blindroll": "Blind GM Roll",
            "selfroll": "Self Roll"
        },
        onChange: value => {
            console.log("pf2e-secret-roll-options | Default roll type changed to", value);
        },
        requiresReload: false
    });

    game.settings.register("pf2e-secret-roll-options", "maxRole", {
        name: "Max User Role",
        hint: "The highest user role that should have the role type changed.",
        scope: "world",
        config: true,
        type: Number,
        default: 2,
        choices: {
            1: "Player",
            2: "Trusted Player",
            3: "Assistant GM",
            4: "Game Master"
        },
        onChange: value => {
            console.log("pf2e-secret-roll-options | Max user role changed to", value);
        },
        requiresReload: false
    });

    const playerRole = game.users.current.role;
    const rollModes = ["publicroll", "gmroll", "blindroll", "selfroll"]

    const updateCheckModifiersDialog = (checkModifiersDialog, ...args) => {
        const rollModeSetting = game.settings.get("pf2e-secret-roll-options", "rollMode");
        console.debug("pf2e-secret-roll-options | rollModeSetting:", rollModeSetting)
        const maxRole = game.settings.get("pf2e-secret-roll-options", "maxRole");
        console.debug("pf2e-secret-roll-options | maxRole:", maxRole)
        const rollMode = rollModeSetting === "defaultroll" ? game.settings.get("core", "rollMode") : rollModeSetting;
        console.debug("pf2e-secret-roll-options | rollMode:", rollMode)
        const index = rollModes.indexOf(rollMode)
        console.debug("pf2e-secret-roll-options | index:", index)
        if (checkModifiersDialog.context?.traits?.includes("secret") && playerRole <= maxRole) {
            checkModifiersDialog.context.rollMode = rollMode;
            const rollSelect = checkModifiersDialog.element.find("select[name='rollmode']")
            for (let i = 0; i < rollSelect.children().length; i++) {
                if (rollSelect.find(`option[value='${rollModes[i]}']`).length > 0) rollSelect.find(`option[value='${rollModes[i]}']`)[0].selected = false;
            }
            if (rollSelect.find(`option[value='${rollModes[index]}']`).length > 0) rollSelect.find(`option[value='${rollModes[index]}']`)[0].selected = true;
        }
    }

    Hooks.on("renderCheckModifiersDialog", updateCheckModifiersDialog);
    console.debug("pf2e-secret-roll-options | Hook registered")

    console.info("pf2e-secret-roll-options | Initialised");
}

Hooks.once("ready", init)
