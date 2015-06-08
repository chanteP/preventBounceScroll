var startPos, curPos;
var outerScrollBox;

var stat = false;

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
    var style = window.getComputedStyle(element);
    return (style['overflow'] === 'scroll' || style['overflow'] === 'auto' || style['overflowY'] === 'scroll' || style['overflowY'] === 'auto')
        && element.scrollHeight > element.clientHeight
        && !(startPos <= curPos && element.scrollTop === 0)
        && !(startPos >= curPos && element.scrollHeight - element.scrollTop === window.parseInt(style.height));
}
var checkOuterScroll = function(outerNode){
    if(outerNode.scrollTop === 0){
        outerNode.scrollTop = 1;
        return;
    }
    var outerHeight = window.parseInt(getComputedStyle(outerNode).height);
    if(outerNode.scrollHeight - outerNode.scrollTop === outerHeight){
        outerNode.scrollTop = outerNode.scrollHeight - outerHeight - 1;
    }
}

//bind
var bindFunc = {
    move : function(e) {
        curPos = e.touches ? e.touches[0].screenY : e.screenY;
        notPreventScrollElement(e.target) || e.preventDefault();
    },
    start : function(e){
        outerScrollBox && checkOuterScroll(outerScrollBox);
        startPos = e.touches ? e.touches[0].screenY : e.screenY;
    }
}
module.exports = {
    bind : function(outer){
        outerScrollBox = outer;
        if(!stat){
            stat = true;
            document.addEventListener('touchmove', bindFunc.move, false);
            document.addEventListener('touchstart', bindFunc.start, false);
        }
    },
    destory : function(){
        stat = false;
        document.removeEventListener('touchmove', bindFunc.move, false);
        document.removeEventListener('touchstart', bindFunc.start, false);
    }
}
