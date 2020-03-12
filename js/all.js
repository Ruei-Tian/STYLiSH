//fb login  
const ifProfile = window.location.pathname.includes("profile")
let iflogin = JSON.parse(localStorage.getItem("iflogin")) || '';
window.fbAsyncInit = function() {
    FB.init({
      appId      : '2593325480721916',
      cookie     : true,                    
      xfbml      : true,                    
      version    : 'v5.0'          
    });

    if(ifProfile) {
      FB.getLoginStatus(function(response) {  
        if (response.status === 'connected') {  
          statusChangeCallback(response);
        } else {                        
          FB.login(function(response) {
            statusChangeCallback(response);
          },{scope: 'email'});
        }  
    });
    } else {
      loginStatus();   
    }
 
  };

  function showProfilePage(data) {
    console.log(data);
    const profileImg = document.querySelector(".profileImg");
    const memberPic = document.querySelector(".memberPic");
    const memberName = document.querySelector(".memberName");
    const memberEmail = document.querySelector(".memberEmail");
    profileImg.innerHTML = `<img src="${data.user.picture}" alt="">會員`;
    memberPic.setAttribute("src", data.user.picture);
    memberName.textContent = data.user.name;
    memberEmail.textContent = data.user.email;
  }
  
    //when page render check if user status
  function statusChangeCallback(response) {  
      console.log(response);    
      let api = "https://api.appworks-school.tw/api/1.0/";               
        let userSignInData = {
          "provider": "facebook",
          "access_token": response.authResponse.accessToken
        };
        let xhr = new XMLHttpRequest();
        xhr.open('POST', api + 'user/signin');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(userSignInData));
        xhr.onreadystatechange = () => {
          if (xhr.status == 200 && xhr.readyState == 4) {
            let data = JSON.parse(xhr.responseText).data;
            showProfilePage(data);
          } 
        }  
    };
  


  function loginStatus() {
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
          getUsersInfo(response); 
      } else {
          return;
      }
   }) 
  }
  
  (function(d, s, id) {                    
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


const profileImg = document.querySelector(".profileImg");
const profilePage = "./profile.html"

function showProfile(response) {
    profileImg.innerHTML = `<img src="${response.picture.data.url}" alt="">會員`;
};

function getUsersInfo(response) {        
    console.log('登入成功');
    FB.api('/me','get',{
        access_token: response.authResponse.accessToken,
        fields: "id,name,email,picture"
    }, function(response) {
        console.log('Graph API', response);
        showProfile(response);
    });
  };



function logInFb(response) {
    FB.login(function(response) {
        localStorage.setItem("iflogin", JSON.stringify(response.authResponse.accessToken));
        loginStatus();
      },{scope: 'email'});
}


function checkLoginState(e) {      
    e.preventDefault();             
    FB.getLoginStatus(function(response) {  
        if (response.status === 'connected') {  
            window.location = profilePage;            
        } else {                       
          logInFb(response);
        }
    });
  };

//main header function
const logo = document.querySelector('.logo');
const womenProductList = document.querySelector('.forWomen');
const menProductList = document.querySelector('.forMen');
const accessoriesProductList = document.querySelector('.accessories');
const cartBtn = document.querySelector('.cart');
const ifIndex = window.location.pathname.includes('index');
const homePage = "./index.html";
const cartPage = "./cart.html";
console.log(ifIndex);

const memberBtn = document.querySelector(".member");
memberBtn.addEventListener('click', checkLoginState);


logo.addEventListener('click', (e) => {
  e.preventDefault();
  if(ifIndex) {
    mainContent.innerHTML = '';
    loadPage('all',0);
  } else {
    window.location = homePage;
  }
});


womenProductList.addEventListener('click', (e) => {
  e.preventDefault();
  if (ifIndex) {
    mainContent.innerHTML = '';
    loadPage('women',0);
  } else {
    window.location = homePage + '?tag=women';
  }
});

menProductList.addEventListener('click', (e) => {
  e.preventDefault();
  if (ifIndex) {
    mainContent.innerHTML = '';
    loadPage('men',0);
  } else {
    window.location = homePage + '?tag=men';
  }
});
accessoriesProductList.addEventListener('click', (e) => {
  e.preventDefault();
  if (ifIndex) {
    mainContent.innerHTML = '';
    loadPage('accessories',0);
  } else {
    window.location = homePage + '?tag=accessories';
  } 
});
cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location = cartPage;  
});

//search function
const searchForm = document.querySelector('.searchForm');
const searchInput = document.querySelector('#searchInput');
const toggleSearchForm = document.querySelector('.toggle-searchForm');


window.addEventListener("resize", (e) => {
  if(window.innerWidth >= 900) {
    searchForm.style.display = 'block';
    document.querySelector(".wrap").style.marginTop = "0px";
  } else {
    if (searchForm.style.display == 'block') {
      document.querySelector(".wrap").style.marginTop = "220px";
    }
  }
})

toggleSearchForm.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e);
  if(searchForm.style.display == 'none') {
    searchForm.style.display = 'block';
    document.querySelector(".wrap").style.marginTop = "220px";
  } else {
    searchForm.style.display = 'none';
    document.querySelector(".wrap").style.marginTop = "0px";
  }
});
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if(searchInput.value.trim() !== '') {
    if (ifIndex) {
      mainContent.innerHTML = '';
      searchItem(searchInput.value);
      return;
    } else {
      window.location = homePage + `?tag=${searchInput.value}`;
    }
      
  } else {
      alert('請輸入關鍵字');
      return;
  }
  searchInput.value = '';
});

// cart item amount 
let currentOrder = JSON.parse(localStorage.getItem("cart")) || '';
const cartCount = document.querySelector('.cartCount');

if(currentOrder !== '') {
    cartCount.value = currentOrder.order.list.length;
}

// ajax 
function ajax(method, src, args, headers, callback) {
  let req = new XMLHttpRequest();
  if(method.toLowerCase() === "post") {
    req.open(method, src);
    req.setRequestHeader("Content-Type", "application/json");
  }
}