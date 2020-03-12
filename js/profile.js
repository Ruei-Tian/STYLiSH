const apiHost = "https://api.appworks-school.tw/api/1.0/";
const data = JSON.parse(localStorage.getItem("cart"));
const orderNum = document.querySelector(".orderNum");
const orderDate = document.querySelector('.orderDate');
const orderPrice = document.querySelector(".orderPrice")
  
window.addEventListener('DOMContentLoaded', () => {
  showOrderNumber();
  showTradeTime();
})

function showTradeTime() {
  let timestamp = data.orderInfo.time;
  let time = new Date(timestamp);
  console.log(time);
  let year = time.getFullYear();
  let months = time.getMonth() + 1;
  let day = time.getDate();
  let hours = time.getHours();
  let mins = time.getMinutes();
  let seconds = time.getSeconds();
  let tradeTime = `${year}/${months}/${day} ${hours}:${mins}:${seconds}`;
  orderDate.textContent = tradeTime;
}

function showOrderNumber() {
  let number = data.orderInfo.num;
  orderNum.textContent = number;
  let price = data.order.total;
  orderPrice.textContent = "NT$" + price;
}

