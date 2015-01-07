;(function(window, document){
    document.addEventListener('touchmove', function(e) {
        notPreventScrollElement(e.target) || e.preventDefault();
    }, false);
    function notPreventScrollElement(element){
        return isExtraElement(element) || isScrollElement(element);
    }
    function isExtraElement(element){
        switch(true){
            case element.tagName === 'INPUT' && element.type === 'range':;
                return true;
            default :
                return false;
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