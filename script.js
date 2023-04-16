$(document).ready(function(){
    $("#collapse").on("click", function(){
        $("#sidebar").toggleClass("active");
    })
})


const contextMenu = document.querySelector(".wrapper"),
shareMenu = contextMenu.querySelector(".share-menu"),
container_right = document.querySelector(".container-right");

container_right.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    var x = e.offsetX, y = e.offsetY,
        winWidth = window.innerWidth,
        winHeight = window.innerHeight,
        cmWidth = contextMenu.offsetWidth,
        cmHeight = contextMenu.offsetHeight;
  
    if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {
        shareMenu.style.left = "-200px";
    } else {
        shareMenu.style.left = "";
        shareMenu.style.right = "-200px";
    }
  
    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;
    
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.visibility = "visible";
  });
  

document.addEventListener("click", () => contextMenu.style.visibility = "hidden");

// 導覽列
const nav = document.querySelector(".nav"),
  searchIcon = document.querySelector("#searchIcon"),
  expandIcon = document.querySelector(".expandIcon");


searchIcon.addEventListener("click", () => {
  // 如果.nav底下已經有.open-search
  nav.classList.toggle("open-search");
  
  if (nav.classList.contains("open-search")) {
    return searchIcon.classList.replace("uil-search", "uil-times");
  }

  // 置換放大鏡icon為叉叉icon
  searchIcon.classList.replace("uil-times", "uil-search");
});

expandIcon.addEventListener("click", () => {
  nav.classList.toggle("open-version");
  nav.classList.remove("open-search");
  searchIcon.classList.replace("uil-times", "uil-search");
});



