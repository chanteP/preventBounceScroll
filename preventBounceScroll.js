var notPreventScrollElement = function(element){
    return isExtraElement(element) || isScrollElement(element);
}
//其他不爽的element
var isExtraElement = function(element){
    switch(true){
        case element.tagName === 'INPUT' && element.type === 'range':;
            return true;
        default :
            return false;
    }
}
//能滚的element
var isScrollElement = function(element) {
    while(element) {
        if (checkScrollElement(element)){
            return element;
        }
        element = element.parentElement;
    }
    return false;
}
var checkScrollElement = function(element){
    if(element.scrollHeight <= element.clientHeight){return false;}
    //任性
    return window.getComputedStyle(element)['-webkit-overflow-scrolling'] === 'touch';
}

//bind
var bindFunc = function(e) {
    notPreventScrollElement(e.target) || e.preventDefault();
}

module.exports = {
    bind : function(){
        document.addEventListener('touchmove', bindFunc, false);
    },
    destory : function(){
        document.removeEventListener('touchmove', bindFunc, false);
    }
}
