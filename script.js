const menu = {
  Pizza: { Small: 10, Medium: 12, Large: 15 },
  Burger: { Small: 8, Medium: 10, Large: 12 },
  Pasta: { Small: 12, Medium: 14, Large: 16 },
  Salad: { Small: 7, Medium: 9, Large: 11 },
};

let order = [];

window.onload = () => {
  const itemSelect = document.getElementById('item');
  for (let category in menu) {
    let option = document.createElement('option');
    option.value = category;
    option.text = category;
    itemSelect.add(option);
  }

  displayMenu();
  document.getElementById('orderForm').onsubmit = addToOrder;
};

function displayMenu() {
  const menuDiv = document.getElementById('menu');
  menuDiv.innerHTML = '';
  for (let item in menu) {
    const prices = menu[item];
    menuDiv.innerHTML += `<p><strong>${item}</strong>: Small $${prices.Small}, Medium $${prices.Medium}, Large $${prices.Large}</p>`;
  }
}

function addToOrder(e) {
  e.preventDefault();
  const item = document.getElementById('item').value;
  const size = document.getElementById('size').value;
  const qty = parseInt(document.getElementById('quantity').value);
  const price = menu[item][size] * qty;

  order.push({ item, size, qty, price });
  updateOrderList();
}

function updateOrderList() {
  const orderList = document.getElementById('orderList');
  const totalDisplay = document.getElementById('total');
  orderList.innerHTML = '';
  let total = 0;

  order.forEach(o => {
    const li = document.createElement('li');
    li.textContent = `${o.qty}x ${o.size} ${o.item} - $${o.price}`;
    orderList.appendChild(li);
    total += o.price;
  });

  totalDisplay.textContent = total;
}

function finalizeOrder() {
  const address = document.getElementById('address').value;
  const payment = document.getElementById('payment').value;
  const total = document.getElementById('total').textContent;

  if (!address || !order.length) {
    alert('Please complete your order and provide address.');
    return;
  }

  const message = `Thanks for ordering! Your total is $${total}. We’ll deliver to ${address}. Payment method: ${payment}`;
  alert(message);
  speak(message);
}

// Voice Agent using Web Speech API
document.getElementById('voiceBtn').onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (e) => {
    const command = e.results[0][0].transcript.toLowerCase();
    if (command.includes('menu')) speak("Sure! Here's the menu for today.");
    else if (command.includes('order')) speak("Let's get started with your order.");
    else if (command.includes('hello')) speak("Hi there! Welcome to Speedy Bites.");
    else speak("I'm not sure what you meant. Try saying 'menu' or 'order'.");
  };
};

function speak(message) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(message);
  utter.voice = synth.getVoices()[0];
  synth.speak(utter);
}
