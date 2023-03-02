const optionsProducts = document.querySelector('.click-open-options');
const subList = document.querySelector('.sublistProduct1');
const subList2 = document.querySelector('.sublistProduct2');
optionsProducts.addEventListener('click',(e)=>{
    subList.classList.toggle('inactive');
    subList2.classList.toggle('inactive');
     if(subList.classList.contains('inactive')) {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-29-xxl.png');
    } else {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-208-xxl.png');
    }

})