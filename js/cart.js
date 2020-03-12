const apiHost = "https://api.appworks-school.tw/api/1.0/";
const thankYouPage = "./thankyou.html"

const totalItemAmount = document.querySelector(".totalItemAmount");
const recipientName = document.querySelector("#recipientName");
const recipientPhone = document.querySelector("#recipientPhone");
const recipientAddress = document.querySelector("#recipientAddress");
const recipientEmail = document.querySelector("#recipientEmail");
const recipientTime = document.querySelectorAll(".recipientTime");
const deliveryCountry = document.querySelector("#deliveryCountry");
const payment = document.querySelector("#payment");
const allSubtotal = document.querySelector(".allSubtotal");
const allFreight = document.querySelector(".allFreight");
const allTotal = document.querySelector(".allTotal");

let orderData;

loadCartPage();

//set up TapPay
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
TPDirect.card.setup({
    fields: {
        number: {
            // css document.querySelector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

function calculateSum() {
    let allSubtotalNum = 0;
    for(let i = 0; i < orderData.order.list.length; i++) {
        allSubtotalNum += (Number(orderData.order.list[i].price) * Number(orderData.order.list[i].qty)); 
    }

    allSubtotal.childNodes[1].textContent = allSubtotalNum;
    allFreight.childNodes[1].textContent = orderData.order.freight;
    allTotal.childNodes[1].textContent = allSubtotalNum + orderData.order.freight;
    orderData.order.subtotal = allSubtotalNum;
    orderData.order.total = allSubtotalNum + orderData.order.freight;
    localStorage.setItem("cart", JSON.stringify(orderData)); 
}

function loadCartPage(){
    orderData = JSON.parse(localStorage.getItem('cart')) || '';
    renderCartPage();
}

function renderCartPage() {
    let cartCount = document.querySelector('.cartCount');
    let desktopCartBody = document.querySelector(".desktop-cart-tbody");
    let mobileCart = document.querySelector(".mobile-cart");
    desktopCartBody.innerHTML = "";
    mobileCart.innerHTML = "";

    if (orderData == '' || orderData.order.list.length == 0) {
        let cartDetail = document.querySelector(".cartDetail");
        cartDetail.innerHTML = `<h4 style="letter-spacing: 4px; text-align: center; margin-top: 180px">您尚未選購任何商品</h4>`; 
        totalItemAmount.textContent = "購物車(0)";
        allSubtotal.childNodes[1].textContent = 0;
        allFreight.childNodes[1].textContent = 0;
        allTotal.childNodes[1].textContent = 0;
        cartCount.value = 0;
        return;
    }

    cartCount.value = orderData.order.list.length;
    totalItemAmount.textContent = "購物車(" + orderData.order.list.length + ")";
    orderData.order.list.map((item) => {
        // desktop
       let desktopCartBody = document.querySelector(".desktop-cart-tbody");
       let desktopTr = document.createElement('tr');
       // main image
       let itemImage = document.createElement('td');
       itemImage.setAttribute("class", "item-image");
       let image = document.createElement('img');
       image.setAttribute("src", item.main_image);
       itemImage.appendChild(image);
       // detail
       let itemDetai = document.createElement('td');
       itemDetai.setAttribute("class", "item-detail");
       
       let itemTitle = document.createElement('p');
       itemTitle.setAttribute("class", "itemTitle");
       itemTitle.textContent = item.name;
       let itemId = document.createElement('p');
       itemId.setAttribute("class", "itemId");
       itemId.textContent = item.id;
       let itemColor = document.createElement('p');
       itemColor.setAttribute("class", "itemColor");
       itemColor.textContent = "顏色 | " + item.color.name;
       let itemSize = document.createElement('p');
       itemSize.setAttribute("class", "itemSize");
       itemSize.textContent = "尺寸 | " + item.size;

       itemDetai.appendChild(itemTitle);
       itemDetai.appendChild(itemId);
       itemDetai.appendChild(itemColor);
       itemDetai.appendChild(itemSize);

       // price td
       let amountTd = document.createElement('td');
       let itemAmountInput = document.createElement('select');      
       itemAmountInput.setAttribute("data-id", item.id);
       itemAmountInput.setAttribute("data-color", item.color.code);
       itemAmountInput.setAttribute("data-size", item.size);
       itemAmountInput.setAttribute("class", "itemAmountInput");
       let amountOption;
       for (let i = 1; i <= item.stock; i++) {
            amountOption = document.createElement('option');
            amountOption.setAttribute("value", i);
            amountOption.textContent = i;
            if(i == item.qty) {
                amountOption.setAttribute("selected", "selected");
            }
            itemAmountInput.appendChild(amountOption);
       }
       amountTd.appendChild(itemAmountInput);

       let priceTd = document.createElement('td');
       let itemPrice = document.createElement('p');
       itemPrice.setAttribute("class", "itemPrice");
       itemPrice.textContent = "NT." + item.price;
       priceTd.appendChild(itemPrice);


       let subtotalTd = document.createElement('td');
       let itemSubtotal = document.createElement('p');
       itemSubtotal.setAttribute("class", "itemSubtotal");
       itemSubtotal.textContent = "NT." + (Number(item.price) * Number(item.qty));
       subtotalTd.appendChild(itemSubtotal);

       // romoveBtn
       let btnTd = document.createElement('td');
       btnTd.setAttribute("class", "btnTd");
       let removeItemBtn = document.createElement('img');
       removeItemBtn.setAttribute("class", "removeItemBtn");
       removeItemBtn.setAttribute("data-id", item.id);
       removeItemBtn.setAttribute("data-color", item.color.code);
       removeItemBtn.setAttribute("data-size", item.size);


       removeItemBtn.setAttribute("src", "./images/cart-remove.png");
       btnTd.appendChild(removeItemBtn);

       desktopTr.appendChild(itemImage);
       desktopTr.appendChild(itemDetai);
       desktopTr.appendChild(amountTd);
       desktopTr.appendChild(priceTd);
       desktopTr.appendChild(subtotalTd);
       desktopTr.appendChild(btnTd);  
       desktopCartBody.appendChild(desktopTr);

       //Mobile
       let mobileCart = document.querySelector(".mobile-cart");
       let containerDiv = document.createElement('div');

       // detail
       let cartItemMobile = document.createElement('div');
       cartItemMobile.setAttribute("class", "cartItem");

       let itemImageMobile = document.createElement('div');
       itemImageMobile.setAttribute("class", "item-image");
       let imageMobile = document.createElement('img');
       imageMobile.setAttribute("src", item.main_image);
       itemImageMobile.appendChild(imageMobile);
       
       let itemDetaiMobile = document.createElement('div');
       itemDetaiMobile.setAttribute("class", "item-detail");
       
       let itemTitleMobile = document.createElement('p');
       itemTitleMobile.setAttribute("class", "itemTitle");
       itemTitleMobile.textContent = item.name;
       let itemIdMobile = document.createElement('p');
       itemIdMobile.setAttribute("class", "itemId");
       itemIdMobile.textContent = item.id;
       let itemColorMobile = document.createElement('p');
       itemColorMobile.setAttribute("class", "itemColor");
       itemColorMobile.textContent = "顏色 | " + item.color.name;
       let itemSizeMobile = document.createElement('p');
       itemSizeMobile.setAttribute("class", "itemSize");
       itemSizeMobile.textContent = "尺寸 | " + item.size;

       itemDetaiMobile.appendChild(itemTitleMobile);
       itemDetaiMobile.appendChild(itemIdMobile);
       itemDetaiMobile.appendChild(itemColorMobile);
       itemDetaiMobile.appendChild(itemSizeMobile);

       let removeItemBtnMobile = document.createElement('img');
       removeItemBtnMobile.setAttribute("class", "removeItemBtn");
       removeItemBtnMobile.setAttribute("data-id", item.id);
       removeItemBtnMobile.setAttribute("data-color", item.color.code);
       removeItemBtnMobile.setAttribute("data-size", item.size);
       removeItemBtnMobile.setAttribute("src", "./images/cart-remove.png");

       cartItemMobile.appendChild(itemImageMobile);
       cartItemMobile.appendChild(itemDetaiMobile);
       cartItemMobile.appendChild(removeItemBtnMobile);

       // price table
       let mobileTableMobile = document.createElement("table");
       mobileTableMobile.setAttribute("class", "mobile-table");
       let fixTrMobile = document.createElement("tr");
       let fixth1Mobile = document.createElement("th");
       fixth1Mobile.textContent = "數量";
       let fixth2Mobile = document.createElement("th");
       fixth2Mobile.textContent = "單價";
       let fixth3Mobile = document.createElement("th");
       fixth3Mobile.textContent = "小計";
       fixTrMobile.appendChild(fixth1Mobile);
       fixTrMobile.appendChild(fixth2Mobile);
       fixTrMobile.appendChild(fixth3Mobile);

       let priceTrMobile = document.createElement("tr");
       let amountTdMobile = document.createElement('td');
       let itemAmountInputMobile = document.createElement('select');      
       itemAmountInputMobile.setAttribute("data-id", item.id);
       itemAmountInputMobile.setAttribute("data-color", item.color.code);
       itemAmountInputMobile.setAttribute("data-size", item.size);
       itemAmountInputMobile.setAttribute("class", "itemAmountInput");
       let amountOptionMobile;
       for (let i = 1; i <= item.stock; i++) {
            amountOptionMobile = document.createElement('option');
            amountOptionMobile.setAttribute("value", i);
            if(i == item.qty) {
                amountOptionMobile.setAttribute("selected", "selected");
            }
            amountOptionMobile.textContent = i;
            itemAmountInputMobile.appendChild(amountOptionMobile);
       }

       amountTdMobile.appendChild(itemAmountInputMobile);

       let priceTdMobile = document.createElement('td');
       let itemPriceMobile = document.createElement('p');
       itemPriceMobile.setAttribute("class", "itemPrice");
       itemPriceMobile.textContent = "NT." + item.price;
       priceTdMobile.appendChild(itemPriceMobile);

       let subtotalTdMobile = document.createElement('td');
       let itemSubtotalMobile = document.createElement('p');
       itemSubtotalMobile.setAttribute("class", "itemSubtotal");
       itemSubtotalMobile.textContent = "NT." + (Number(item.price) * Number(item.qty));
       subtotalTdMobile.appendChild(itemSubtotalMobile);

       priceTrMobile.appendChild(amountTdMobile);
       priceTrMobile.appendChild(priceTdMobile);
       priceTrMobile.appendChild(subtotalTdMobile);
       mobileTableMobile.appendChild(fixTrMobile);
       mobileTableMobile.appendChild(priceTrMobile);
       containerDiv.appendChild(cartItemMobile);
       containerDiv.appendChild(mobileTableMobile);
       mobileCart.appendChild(containerDiv);
       
   });
   
   //sum section
   calculateSum();
   //recipient section 
   recipientName.value = orderData.order.recipient.name;
   recipientPhone.value = orderData.order.recipient.phone;
   recipientAddress.value = orderData.order.recipient.address;
   recipientEmail.value = orderData.order.recipient.email;
   recipientTime.value = orderData.order.recipient.time;
   
   deliveryCountry.value = orderData.order.shipping;
   payment.value = orderData.order.payment;

    let allItemAmountInput = document.querySelectorAll(".itemAmountInput");
    let allRemoveBtn = document.querySelectorAll(".removeItemBtn");

    //change amount, re-calculate subtotal 
    allItemAmountInput.forEach((el) => el.addEventListener("change", calculateSubtotal));
    //remove Item  
    allRemoveBtn.forEach((btn) => btn.addEventListener("click", removeItem));
}

function calculateSubtotal(e) {
    let targetItemIndex = orderData.order.list.findIndex((item) => item.id == e.target.dataset.id && item.color.code == e.target.dataset.color && item.size == e.target.dataset.size);
    orderData.order.list[targetItemIndex].qty = e.target.value;
    localStorage.setItem("cart", JSON.stringify(orderData)); 
    loadCartPage(); 
}

function removeItem(e) {
    if(confirm(`確定要刪除這項珊品嗎?`) === true) {
        let targetItemIndex = orderData.order.list.findIndex((item) => item.id == e.target.dataset.id && item.color.code == e.target.dataset.color && item.size == e.target.dataset.size);
        orderData.order.list.splice(targetItemIndex, 1);
        console.log(orderData.order.list);
        localStorage.setItem("cart", JSON.stringify(orderData)); 
        loadCartPage();
    }
}

// 0	欄位已填好，並且沒有問題
// 1	欄位還沒有填寫
// 2	欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor
// 3	使用者正在輸入中

//some credit card hint for users
let cardNumHint = document.querySelector(".card-number-hint");
let cardExpirationDateHint = document.querySelector(".card-expiration-date-hint");
let ccvHint = document.querySelector(".card-ccv-hint");

TPDirect.card.onUpdate(function (update) {
    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
        cardNumHint.textContent = "WRONG Card Number";
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
        cardNumHint.textContent = "GOOD!";
    } else {
        // setNumberFormGroupToNormal()
        cardNumHint.textContent = "Required Field";
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
        cardExpirationDateHint.textContent = "WRONG Expiration Date";
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
        cardExpirationDateHint.textContent = "GOOD!";
    } else {
        // setNumberFormGroupToNormal()
        cardExpirationDateHint.textContent = "Required Field";
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
        ccvHint.textContent = "WRONG CCV";
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
        ccvHint.textContent = "GOOD!";
    } else {
        // setNumberFormGroupToNormal()
        ccvHint.textContent = "Required Field";
    }
})

let confirmDetailBtn = document.querySelector(".confirmDetailBtn");
confirmDetailBtn.addEventListener("click", submitOrder);
let isLoading = false;
let loadingWrap = document.querySelector(".loadingWrap");

function displayLoader() {
    if(isLoading == true) {
        loadingWrap.style.display = "flex";
    } else {
        loadingWrap.style.display = "none";
    }
}

function postToCheckoutAPI(result, response) {
        isLoading = true;
        displayLoader();
        orderData.prime =  result.card.prime;
        localStorage.setItem("cart", JSON.stringify(orderData));
        let finalOrderData = JSON.parse(localStorage.getItem('cart'));
        let token = JSON.parse(localStorage.getItem('iflogin'))
        let xhr = new XMLHttpRequest();
        xhr.open('POST', apiHost + "order/checkout", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', "Bearer " + token);
        xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200) {
        // isLoading = false;
        // displayLoader();
            console.log(xhr.responseText);
            let number = JSON.parse(xhr.responseText).data.number;
            let now = Date.now();
            finalOrderData.order.list = [];
            finalOrderData.orderInfo = {};
            finalOrderData.orderInfo.num = number;
            finalOrderData.orderInfo.time = now;
            localStorage.setItem("cart", JSON.stringify(finalOrderData));
            loadingWrap.style.display = "none";
            window.location = thankYouPage;
            };
        };
        xhr.send(JSON.stringify(finalOrderData));
}

function submitOrder(e) {
    e.preventDefault();
    if (orderData == '' || orderData.order.list.length == 0) {
        alert('您尚未選購商品!');
    } else if(recipientName.value.trim() == '') {
        alert('請輸入收件人姓名!');
        return;
    } else if (recipientPhone.value.trim() == "") {
        alert('請輸入手機!');
        return;
    } else if ( recipientEmail.value.trim() == "") {
        alert('請輸入信箱!');
        return;
    }  else if ( recipientAddress.value.trim() == "") {
        alert('請輸入地址!');
        return;
    }

    orderData.order.recipient.name = recipientName.value.trim();
    orderData.order.recipient.phone = recipientPhone.value.trim();
    orderData.order.recipient.email = recipientEmail.value.trim();
    orderData.order.recipient.address = recipientAddress.value.trim();
    let recipientTimeValue;
    for(let i = 0; i < recipientTime.length; i++) {
        if(recipientTime[i].checked) {
            recipientTimeValue = recipientTime[i].value;
            break;
        }
    }    
    orderData.order.recipient.time = recipientTimeValue;
    orderData.order.shipping = deliveryCountry.value;
    orderData.order.payment = payment.value;
    localStorage.setItem("cart", JSON.stringify(orderData));
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    
   // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('請填寫正確付款資料')
        return;
    }
    
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return;
        } 
        FB.getLoginStatus(function(response) {
            if(response.status === 'connected') {
                postToCheckoutAPI(result, response); 
            } else {
                alert('請先登入');
                logInFb(response);
                getUsersInfo(response);
                return;
            }
        }); 
    });
};

//validation by Regex
const allRecipientInput = document.querySelectorAll(".recipientInfo>label>input");
console.log(allRecipientInput);
allRecipientInput.forEach((inputField) => inputField.addEventListener("input", () => {
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.value.trim()) == false) {
        document.querySelector(".emailHint").style.display = "inline-block";
    } else {
        document.querySelector(".emailHint").style.display = "none";
    }
    if(/\d/.test(recipientPhone.value.trim()) == false) {
        document.querySelector(".phoneHint").style.display = "inline-block";
    } else {
        document.querySelector(".phoneHint").style.display = "none";
    }    
}))
