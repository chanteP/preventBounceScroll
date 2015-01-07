;(function(window, document){
    document.addEventListener('touchmove', function(e) {
        notPreventScrollElement(e.target) || e.preventDefault();
    }, false);
    function notPreventScrollElement(element){
        return isExtraElement(element) || isScrollElement(element);
    }
    function isExtraElement(element){
        if(element.tagName === 'INPUT' && element.type === 'range'){
            return true;
        }
    }
    function isScrollElement(element) {
        while(element) {
            if (checkScrollElement(element)){
                return element;
            }
            element = element.parentElement;
        }
        return false;
    }
    function checkScrollElement(element){
        if(element.scrollHeight <= element.clientHeight){return false;}
        return window.getComputedStyle(element)['-webkit-overflow-scrolling'] === 'touch';
    }
})(window, document);