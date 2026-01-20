const rollBtn = document.getElementById("rollBtn");
const diceImage = document.getElementById("diceImage");
const diceResult = document.getElementById("diceResult");
const historyList = document.getElementById("historyList");


rollBtn.addEventListener("click", rollDice);

function rollDice() {
  diceImage.classList.add("rolling");

  setTimeout(() => {
    //Generate random number between 1 and 6
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    //update text
    diceResult.textContent = `You rolled a ${randomNumber}!`;
    //update image
    diceImage.src = `images/dice${randomNumber}.png`;
    //stop rolling
    diceImage.classList.remove("rolling");
    //add to history
    addToHistory(randomNumber);
  }, 600);
}

function addToHistory(number) {
  //add result to history list
  const listItem = document.createElement("li");
  listItem.textContent = `🎲 Rolled ${number}`;
  historyList.prepend(listItem);

  // limit history to 10 rolls
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

