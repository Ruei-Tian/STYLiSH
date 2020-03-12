const orderNum = document.querySelector('.orderNum');
const orderTime = document.querySelector('.orderTime');
const goProductPageBtn = document.querySelector('.goProductPage');
const goHomePageBtn = document.querySelector('.goHomePage');


const apiHost = "https://api.appworks-school.tw/api/1.0/";
const productPage = "./product.html";
const data = JSON.parse(localStorage.getItem("cart"));


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
    orderTime.textContent = tradeTime;
}

function showOrderNumber() {
    let number = data.orderInfo.num;
    orderNum.textContent = number;
}