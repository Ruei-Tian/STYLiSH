const apiHost = "https://api.appworks-school.tw/api/1.0/";

window.addEventListener('DOMContentLoaded', () => {
    let url = new URL(window.location);
    let params = url.searchParams.get("id");
    loadProductPage(params);
})

function loadProductPage(params) {
    let productDetail = new XMLHttpRequest();
    productDetail.open('get', apiHost + `products/details?id=${params}`);
    productDetail.send();
    productDetail.onreadystatechange = () => {
        if(productDetail.readyState === 4 && productDetail.status === 200) {
            let productDetailData = JSON.parse(productDetail.responseText).data;
            console.log(productDetailData);
            
            renderPage(productDetailData);

            let allSizeSelect = document.querySelectorAll('.sizeSelectA');
            let allColorSelect = document.querySelectorAll('.colorSelect');
            let amountInput = document.querySelector('#amountInput');
            let matchStockAmount ;

            let sizeSelectArr = [...allSizeSelect];            
            let colorSelectArr = [...allColorSelect];
            let colorCode = allColorSelect[0].childNodes[0].dataset.code;
            let matchVariantsArr;
            
            //default setting
            allColorSelect[0].classList.add('active');
            allSizeSelect[0].classList.add('active');
            ifSize();
            allColorSelect.forEach((colorSelect) => {colorSelect.addEventListener('click',checkStock)});
            allSizeSelect.forEach((sizeSelect) => {sizeSelect.addEventListener('click',checkStock)});
            maxAmount();

            function checkStock(e) {
                e.preventDefault();
                if(e.target.nodeName !== 'A') {
                    return;
                }
                let targetIndex = e.target.dataset.index;
                let currentIndex;
                colorCode = e.target.dataset.code;
                if(colorCode !== undefined) {
                    currentIndex = colorSelectArr.findIndex((color) => color.classList.contains('active'));
                    allColorSelect[currentIndex].classList.remove('active');
                    allColorSelect[targetIndex].classList.add('active');
                    ifSize();
                    maxAmount();
                } else {
                    if(e.target.classList.contains('readonly')) {
                        return;
                    }
                    currentIndex = sizeSelectArr.findIndex((size) => size.classList.contains('active'));
                    allSizeSelect[currentIndex].classList.remove('active');
                    allSizeSelect[targetIndex].classList.add('active');
                    amountInput.value = 1;
                    maxAmount();
                }    
            }
            function ifSize() {
                matchVariantsArr = productDetailData.variants.filter((variants) => variants.color_code === colorCode);       
                let noStockIndex = [];
                for (let i = 0; i < matchVariantsArr.length; i++) {
                    if(matchVariantsArr[i].stock == 0) {
                        noStockIndex.push(i);
                    } else {
                        allSizeSelect[i].classList.remove('readonly');
                    }
                } 
                if(noStockIndex.length == 0) {return;}
                for (let i = 0; i < noStockIndex.length; i++) {
                    allSizeSelect[noStockIndex[i]].classList.remove('active');
                    allSizeSelect[noStockIndex[i]].classList.add('readonly');
                }
                if(sizeSelectArr.some((size) => size.classList.contains('active'))) {
                    return;
                } 

                //find the first element without class name readonly 
                let withoutReadonlyIndex = sizeSelectArr.findIndex((size) => !size.classList.contains('readonly'));
                allSizeSelect[withoutReadonlyIndex].classList.add('active');
            }
            
            function maxAmount() {
                console.log(matchVariantsArr);
                let currentActiveSizeIndex = sizeSelectArr.findIndex((size) => size.classList.contains('active'));
                let currentActiveSize = allSizeSelect[currentActiveSizeIndex].textContent;
                // console.log(currentActiveSize);
                let matchStock = matchVariantsArr.filter((variant) => currentActiveSize === variant.size);
                
                matchStockAmount = matchStock[0].stock; 
                console.log(matchStockAmount);    
            }

            //counter function
            let plus = document.querySelector('.plus');
            let minus = document.querySelector('.minus');

            minus.addEventListener('click', minusAmount);
            plus.addEventListener('click', plusAmount);

            function minusAmount() {
                if(amountInput.value == 1) {
                    return;
                }
                amountInput.value--;
            }
            function plusAmount() {
                if(amountInput.value == matchStockAmount || matchStockAmount == 0) {
                    return;
                } 
                amountInput.value++;
            }
            
            //add to cart
            let addCartBtn = document.querySelector('.addCartBtn');
            let currentOrder = JSON.parse(localStorage.getItem("cart")) || '';

            addCartBtn.addEventListener('click', addToCart);

            function addToCart(e) {
                e.preventDefault();
                let selectedColorIndex = colorSelectArr.findIndex((color) => color.classList.contains('active'));
                let selectedSizeIndex = sizeSelectArr.findIndex((size) => size.classList.contains('active'));
                
                let selectedColor = productDetailData.colors.filter((color) => color.code == allColorSelect[selectedColorIndex].childNodes[0].dataset.code);
                let selectedSize = productDetailData.sizes.filter((size) => size == allSizeSelect[selectedSizeIndex].textContent);
                let freight = 60;
                
                let firstOrderDetail = {
                    "prime": "",
                    "order": {
                        "shipping": "mainLand",
                        "payment": "credit_card",
                        "subtotal": productDetailData.price * amountInput.value,
                        "freight": freight,
                        "total": (productDetailData.price * amountInput.value ) + freight,
                        "recipient": {
                        "name": "",
                        "phone": "",
                        "email": "",
                        "address": "",
                        "time": "mornig"
                        },
                        "list": [
                            {
                              "id": productDetailData.id,
                              "name": productDetailData.title,
                              "price": productDetailData.price,
                              "main_image": productDetailData.main_image,
                              "color": {
                                  "code": selectedColor[0].code,
                                  "name": selectedColor[0].name
                              },
                              "size": selectedSize[0],
                              "qty": amountInput.value,
                              "stock":  matchStockAmount
                            }
                          ]             
                    }                       
                }                

                let newOrderList = {
                    "id": productDetailData.id,
                    "name": productDetailData.title,
                    "price": productDetailData.price,
                    "main_image": productDetailData.main_image,
                    "color": {
                        "code": selectedColor[0].code,
                        "name": selectedColor[0].name
                    },
                    "size": selectedSize[0],
                    "qty": amountInput.value,
                    "stock":  matchStockAmount
                  }

                  console.log(currentOrder);
                  console.log(newOrderList);


                if(currentOrder == '') { 
                    currentOrder = firstOrderDetail;
                    window.alert('成功加入購物車!');
                } else {
                    let ifRepeat = currentOrder.order.list.findIndex((list) =>   list.id == newOrderList.id && list.color.code == newOrderList.color.code && list.size[0] == newOrderList.size);

                    if( ifRepeat == -1) {
                        currentOrder.order.list.push(newOrderList);
                        window.alert('成功加入購物車!');
                    } else {
                        currentOrder.order.list[ifRepeat] = newOrderList;
                        window.alert('已更新選購商品數量');
                    }
                    
                    let calculateSubtotal = 0;
                    for(let i = 0; i < currentOrder.order.list.length; i++) {             
                        calculateSubtotal += Number(currentOrder.order.list[i].price) * Number(currentOrder.order.list[i].qty);
                    };
                    currentOrder.order.subtotal = calculateSubtotal;
                    currentOrder.order.total = currentOrder.order.subtotal + freight;
                }

                localStorage.setItem("cart", JSON.stringify(currentOrder));
                
                currentOrder = JSON.parse(localStorage.getItem("cart"));
                cartCount.value = currentOrder.order.list.length;
            }
        }
    }
}




function renderPage(productDetailData) {
    let mainImg = document.querySelector('.mainImg');
            let img = document.createElement('img');
            img.setAttribute('src', `${productDetailData.main_image}`);
            mainImg.appendChild(img);

            let title = document.querySelector('.title');
            title.textContent = productDetailData.title;
            let idNum = document.querySelector('.idNum');
            idNum.textContent = productDetailData.id;
            let price = document.querySelector('.price');
            price.textContent = 'TWD.' + productDetailData.price;

            let colorLi = document.querySelector('.colorLi')
            for(let i = 0; i < productDetailData.colors.length; i++) {
                let colorSelect = document.createElement('div');
                colorSelect.setAttribute('class', 'colorSelect');
                colorSelect.innerHTML = `<a href="#" data-index="${i}" data-code="${productDetailData.colors[i].code}" style="background: #${productDetailData.colors[i].code}"></a>`;
                colorLi.appendChild(colorSelect)
            }
            
            let sizeLi = document.querySelector('.sizeLi')
            for(let i = 0; i < productDetailData.sizes.length; i++) {
                let sizeSelect = document.createElement('div');
                sizeSelect.setAttribute('class', 'sizeSelect');
                sizeSelect.innerHTML = `<a href="#"  data-index="${i}" class="sizeSelectA">${productDetailData.sizes[i]}</a>`;
                sizeLi.appendChild(sizeSelect);
            }

            let note = document.querySelector('.note');
            note.textContent = '*' + productDetailData.note;
            let texture = document.querySelector('.texture');
            texture.textContent = productDetailData.texture;
            let sourceFrom = document.querySelector('.sourceFrom');
            sourceFrom.textContent = '素材產地 / ' + productDetailData.place;
            let madeFrom = document.querySelector('.madeFrom');
            madeFrom.textContent = '加工產地 / ' + productDetailData.place;

            let productIntro = document.querySelector('.productIntro');            

            let detailImgSection = productDetailData.images.map((img) => { 
                let story = document.createElement('div');
                story.setAttribute('class','story');
                let storyText = document.createTextNode(productDetailData.story)
                story.appendChild(storyText);

                let detailImgs = document.createElement('div');
                detailImgs.setAttribute('class','detailImg');
                let detailImg = document.createElement('img');
                detailImg.setAttribute('src', `${img}`);
                detailImgs.appendChild(detailImg);

                let section = document.createElement('div')
                section.appendChild(story);
                section.appendChild(detailImgs);

                return section;
            });
            detailImgSection.map((eachSection) =>  productIntro.appendChild(eachSection) )
            console.log(productDetailData.variants);     
}