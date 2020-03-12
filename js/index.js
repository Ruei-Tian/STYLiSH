const mainContent = document.querySelector('.main-content');
const keyVisual = document.querySelector('.key-visual');

const apiHost = "https://api.appworks-school.tw/api/1.0/";
const goProductPage = "./product.html";

let isLoading = false; //避免 scroll 事件連續觸發 loadPage
let productPage;
let category;

function loadPage(categories,page) {
    if(isLoading == false) {
        let url = apiHost + `products/${categories}?paging=${page}`
        isLoading = true;
        xhr = new XMLHttpRequest();
        xhr.open('get', url ,true);
        xhr.send();  
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                products = JSON.parse(xhr.responseText);                
                productsDetail = products.data;
                console.log();
    
                let productHtml = document.createElement("div");
                productHtml.setAttribute('class', 'productList');
    
                productsDetail.map((product) => {
                    let colorBox = product.colors.map((color) => {               
                        return `<div class="colorBox" style="background: #${color.code}"></div>`;
                        }).join('');
                    
                    // col
                    let col = document.createElement("div");
                    col.setAttribute('class', 'col');
    
                   // new
                   if(product.price >= 1000) {
                    let mark = document.createElement("div");
                    let markText = document.createTextNode('新品');
                    mark.setAttribute('class', 'new');
                    mark.appendChild(markText);
                    col.appendChild(mark);
                }
    
                    // media 
                    let media = document.createElement("div");
                    media.setAttribute('class', 'media');
                    let imgA = document.createElement('a');
                    imgA.setAttribute('href', goProductPage + `?id=${product.id}`);
                    let img = document.createElement('img');
                    img.setAttribute('src', product.main_image);
                    imgA.appendChild(img);
                    media.appendChild(imgA);
                        
    
                    // description 
                    let description = document.createElement("div");
                    description.setAttribute('class','description');
                    let color = document.createElement('div');
                    color.setAttribute('class', 'color');
                    color.innerHTML = colorBox;
                    let title = document.createElement('h3');
                    let titleText = document.createTextNode(product.title);
                    title.appendChild(titleText);
                    let price = document.createElement('p');
                    let pText = document.createTextNode('TWD.' + product.price);
                    price.appendChild(pText);
                    description.appendChild(color);
                    description.appendChild(title);
                    description.appendChild(price);
    
                    // col.appendChild(mark);
                    col.appendChild(media);
                    col.appendChild(description);
                    productHtml.appendChild(col);
                });
    
                mainContent.appendChild(productHtml);
                isLoading = false;
                productPage = products.next_paging;
                category = categories;
            }            
        }      
    }

}


//get tag then render page
window.addEventListener('DOMContentLoaded', () => {
    let url = new URL(window.location);
    let params = url.searchParams.get("tag");

    if(params == null) {
        loadPage('all', 0);
    } else if(params == 'women'|| params == 'men' || params == 'accessories') {
        loadPage(params, 0);
    } else {  
        searchItem(params);
    }
})

// Infinite Scroll function
window.addEventListener('scroll', (e) => {         
    let bottom = document.body.getBoundingClientRect().bottom;
    let loadPosition = bottom - window.innerHeight;
    console.log(productsDetail)
    if(loadPosition <= 1) {
        if(productPage !== undefined) {             
            loadPage(category, productPage); 
        } else {
            return;
        }
    }     
});


// keywords search function
function searchItem(searchInputValue) {
    xhr = new XMLHttpRequest();
    xhr.open('get', apiHost + `products/search?keyword=${searchInputValue}`,true);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {        
                productsDetail = JSON.parse(xhr.responseText).data;
                if (productsDetail == '') {
                    alert('Sorry, 找不到符合關鍵字的商品。')
                    loadPage('all', 0); 
                    return;
                }

                let productHtml = document.createElement("div");
                productHtml.setAttribute('class', 'productList');

                productsDetail.map((product) => {
                    let colorBox = product.colors.map((color) => {                        
                        return `<div class="colorBox" style="background: #${color.code}"></div>`;
                    }).join('');
                
                    // col
                    let col = document.createElement("div");
                    col.setAttribute('class', 'col');

                    
                    // new
                    if(product.price >= 1000) {
                        let mark = document.createElement("div");
                        let markText = document.createTextNode('新品');
                        mark.setAttribute('class', 'new');
                        mark.appendChild(markText);
                        col.appendChild(mark);
                    }
                    

                    // media 
                    let media = document.createElement("div");
                    media.setAttribute('class', 'media');
                    let imgA = document.createElement('a');
                    imgA.setAttribute('href', '#');
                    let img = document.createElement('img');
                    img.setAttribute('src', product.main_image);
                    imgA.appendChild(img);
                    media.appendChild(imgA);
                    

                    // description 
                    let description = document.createElement("div");
                    description.setAttribute('class','description');
                    let color = document.createElement('div');
                    color.setAttribute('class', 'color');
                    color.innerHTML = colorBox;
                    let title = document.createElement('h3');
                    let titleText = document.createTextNode(product.title);
                    title.appendChild(titleText);
                    let price = document.createElement('p');
                    let pText = document.createTextNode('TWD.' + product.price);
                    price.appendChild(pText);
                    description.appendChild(color);
                    description.appendChild(title);
                    description.appendChild(price);

                   
                    col.appendChild(media);
                    col.appendChild(description);
                    productHtml.appendChild(col);
                    });
                mainContent.appendChild(productHtml);
                productPage = undefined;   
        }
    }
    xhr.send();
};

// Slide Effect
window.addEventListener('DOMContentLoaded', () => {
    let campaigns = new XMLHttpRequest();
    campaigns.open('get', apiHost + 'marketing/campaigns', true);
    campaigns.send();
    campaigns.onreadystatechange = () => {
        if(campaigns.readyState === 4 && campaigns.status === 200) {
            keyVisualData = JSON.parse(campaigns.responseText).data;

            //render key-visual
            keyVisualData.map((data) => {
                //banner
                let banner = document.createElement('a');
                banner.setAttribute('class', `banner banner-${data.id}`)
                let imgUrl = `https://api.appworks-school.tw${data.picture}`;
                banner.style.backgroundImage = `url(${imgUrl})`;

                //article 
                let article = document.createElement('article');
                let p = document.createElement('p');
                let pText = data.story.replace(/\r\n/ig, '<br/>');
                p.innerHTML = pText;
                article.appendChild(p);
                banner.appendChild(article);
                keyVisual.appendChild(banner);
            })

            //controller 
            let controller = document.createElement('div');
            controller.setAttribute('class', 'controller');
            for (let i = 0; i < keyVisualData.length; i++) {
                let button = document.createElement('button');
                button.setAttribute('class', `btn btn-${keyVisualData[i].id}`);
                controller.appendChild(button);
            }
            keyVisual.appendChild(controller);

            let bannerGroup = document.querySelectorAll('.banner');
            let btnGroup = document.querySelectorAll('.btn');
            let bannerGroupArr = [...bannerGroup]; 
            let btnGroupArr = [...btnGroup]; 
            
            let i = 0; 
            function keyVisualSlide() { 
                let activeIndex = btnGroupArr.findIndex((btn) => btn.classList.contains("active"));
                let checkIfActive = btnGroupArr.some((btn) => btn.classList.contains("active"))
                if(checkIfActive) {
                    btnGroup[activeIndex].classList.remove('active'); 
                    bannerGroup[activeIndex].classList.remove('active');
                }

                btnGroup[i].classList.remove('active'); 
                bannerGroup[i].classList.remove('active');
                //slide tip : use concept of remainder to control i variable
                i = (i + 1) % bannerGroup.length;   
                btnGroup[i].classList.add('active');
                bannerGroup[i].classList.add('active');
            }
    
            //slide effect
            bannerGroup[0].classList.add('active');
            btnGroup[0].classList.add('active');

            setInterval(keyVisualSlide, 10000); 
            
            //controller
            bannerGroup.forEach((banner) => { banner.addEventListener('click', campaignDetail)});
            btnGroup.forEach((btn) => { btn.addEventListener('click', (e) => {
                let currentIndex = bannerGroupArr.findIndex((banner) => banner.classList.contains("active"));
                let targetIndex = btnGroupArr.indexOf(e.target);
                btnGroup[currentIndex].classList.remove('active');
                bannerGroup[currentIndex].classList.remove('active');
                btnGroup[targetIndex].classList.add('active');
                bannerGroup[targetIndex].classList.add('active');              
            })});

            function campaignDetail(){
                let targetIndex = bannerGroupArr.findIndex((banner) => banner.classList.contains("active"));
                window.location = goProductPage + `?id=${keyVisualData[targetIndex].product_id}`;
                clearInterval(keyVisualSlide);
            }         
        }   
    }
});
