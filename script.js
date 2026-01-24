// ==============================
// STATE
// ==============================
const MAX_DICE = 10;
let trayDice = [];
let bonus = 0;

// ==============================
// ELEMENTS
// ==============================
const diceTray = document.querySelector(".dice-tray");
const diceControls = document.querySelectorAll(".dice-control");
const rollBtn = document.querySelector(".roll-btn");
const bonusInput = document.querySelector(".bonus-input");
const results = document.querySelector(".results");
const history = document.querySelector(".history ul");

// ==============================
// HELPERS
// ==============================
function getDiceCounts() {
  return trayDice.reduce((acc, sides) => {
    acc[sides] = (acc[sides] || 0) + 1;
    return acc;
  }, {});
}

// ==============================
// UI UPDATES (AUTHORITATIVE)
// ==============================
function updateDiceSelectors() {
  const counts = getDiceCounts();
  const trayFull = trayDice.length >= MAX_DICE;

  diceControls.forEach(control => {
    const sides = Number(control.dataset.die);
    const label = control.querySelector("span");
    const plus = control.querySelector(".plus");
    const minus = control.querySelector(".minus");

    const count = counts[sides] || 0;

    // Label shows count
    label.textContent = count > 0 ? `d${sides} (${count})` : `d${sides}`;

    // Disable rules
    minus.disabled = count === 0;
    plus.disabled = trayFull;
  });
}

function renderTray() {
  diceTray.innerHTML = "";

  if (trayDice.length === 0) {
    diceTray.innerHTML = `<p class="tray-placeholder">Select dice to add</p>`;
    diceTray.classList.remove("full");
    return;
  }

  trayDice.forEach(sides => {
  const die = document.createElement("div");
  die.className = "die";
  die.dataset.sides = sides;

  die.innerHTML = `
    <span class="die-type">d${sides}</span>
    <span class="die-value"></span>
  `;

  diceTray.appendChild(die);
});


  diceTray.classList.toggle("full", trayDice.length >= MAX_DICE);
}

// ==============================
// DICE CONTROLS
// ==============================

diceControls.forEach(control => {
  const sides = Number(control.dataset.die);
  const plus = control.querySelector(".plus");
  const minus = control.querySelector(".minus");

  plus.addEventListener("click", () => {
    if (trayDice.length >= MAX_DICE) return;

    trayDice.push(sides);
    renderTray();
    updateDiceSelectors();
  });

  minus.addEventListener("click", () => {
    const index = trayDice.indexOf(sides);
    if (index === -1) return;

    trayDice.splice(index, 1);
    renderTray();
    updateDiceSelectors();
  });
});

// ==============================
// BONUS
// ==============================

const bonusLabel = document.getElementById("bonusValue");
const bonusPlus = document.getElementById("bonusPlus");
const bonusMinus = document.getElementById("bonusMinus");

function updateBonusUI() {
  bonusLabel.textContent = `Bonus: ${bonus}`;
  bonusMinus.disabled = bonus <= 0;
}

bonusPlus.addEventListener("click", () => {
  bonus++;
  updateBonusUI();
});

bonusMinus.addEventListener("click", () => {
  if (bonus === 0) return;
  bonus--;
  updateBonusUI();
});

// ==============================
// ROLL
// ==============================

rollBtn.addEventListener("click", () => {
  if (!trayDice.length) return;
  const diceEls = [...diceTray.querySelectorAll(".die")];
  let total = bonus;
  let rolls = [];

  diceEls.forEach(dieEl => {
    const sides = Number(dieEl.dataset.sides);
    const roll = Math.ceil(Math.random() * sides);

    total += roll;
    rolls.push(`d${sides}: ${roll}`);

    // reset state
    dieEl.classList.remove("show-result");
    dieEl.classList.add("rolling");

    setTimeout(() => {
      dieEl.classList.remove("rolling");
      dieEl.classList.add("show-result");
      dieEl.querySelector(".die-value").textContent = roll;
    }, 600);
  });

  results.textContent = `Total: ${total}`;

  const li = document.createElement("li");
  li.textContent = `${rolls.join(", ")} | Bonus: ${bonus} | Total: ${total}`;
  history.prepend(li);
  while (history.children.length > 10) {
  history.removeChild(history.lastChild);
}
});

// ==============================
// INIT
// ==============================
renderTray();
updateDiceSelectors();
updateBonusUI();
