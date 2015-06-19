var startPosY, startPosX, curPosY, curPosX;

var stat = false;
var defaultConfig = {
    //其他不爽的element
    isExtraElement : function(element){
        switch(true){
            case element.tagName === 'INPUT' && element.type === 'range':;
                return true;
            default :
                return false;
        }
    },
    //外层滚动回弹，false为顶部、底部滚动时固定
    outerBounce : true
};
var config = {};

var notPreventScrollElement = function(element){
    return config.isExtraElement(element) || isScrollElement(element);
}
//能滚的element
var isScrollElement = function(element) {
    while(element) {
        if(checkScrollElement(element)){
            return element;
        }
        element = element.parentElement;
    }
    return false;
}
//获取最外层能滚的element
var getOuterScrollElement = function(element){
    var target;
    while(element){
        if(checkScrollElement(element, true)){
            target = element;
        }
        element = element.parentElement;
    }
    return target;
}

var checkScrollElement = function(element, scrollOnly){
    var style = window.getComputedStyle(element);
    return (
            style['overflow'] === 'scroll' 
            || style['overflow'] === 'auto' && style['overflowY'] !== 'hidden' 
            || style['overflowY'] === 'scroll' 
            || style['overflowY'] === 'auto'
        )
        && (
            scrollOnly || 
            element.scrollHeight > element.clientHeight
            && !(startPosY <= curPosY && element.scrollTop === 0)
            && !(startPosY >= curPosY && element.scrollHeight - element.scrollTop === window.parseInt(style.height))
        ) || (
            style['overflow'] === 'scroll' 
            || style['overflow'] === 'auto' && style['overflowX'] !== 'hidden' 
            || style['overflowX'] === 'scroll' 
            || style['overflowX'] === 'auto'
        )
        && (
            scrollOnly || 
            element.scrollWidth > element.clientWidth
            && !(startPosX <= curPosX && element.scrollLeft === 0)
            && !(startPosX >= curPosX && element.scrollWidth - element.scrollLeft === window.parseInt(style.width))
        );
}
//外层滚动
var checkOuterScroll = function(outerNode){
    var style = getComputedStyle(outerNode);
    if(style.overflowY === 'auto' || style.overflowY === 'scroll'){
        if(outerNode.scrollTop === 0){
            outerNode.scrollTop = 1;
            return;
        }
        var outerHeight = window.parseInt(getComputedStyle(outerNode).height);
        if(outerNode.scrollHeight - outerNode.scrollTop === outerHeight){
            outerNode.scrollTop = outerNode.scrollHeight - outerHeight - 1;
        }
    }
    else{
        if(outerNode.scrollLeft === 0){
            outerNode.scrollLeft = 1;
            return;
        }
        var outerWidth = window.parseInt(getComputedStyle(outerNode).width);
        if(outerNode.scrollWidth - outerNode.scrollLeft === outerWidth){
            outerNode.scrollLeft = outerNode.scrollWidth - outerWidth - 1;
        }
    }
}

//bind
var bindFunc = {
    move : function(e) {
        curPosY = e.touches ? e.touches[0].screenY : e.screenY;
        curPosX = e.touches ? e.touches[0].screenX : e.screenX;
        notPreventScrollElement(e.target) || e.preventDefault();
    },
    start : function(e){
        if(config.outerBounce){
            var outerScrollBox = getOuterScrollElement(e.target);
            if(outerScrollBox && !notPreventScrollElement(e.target)){
                checkOuterScroll(outerScrollBox);
            }
        }
        startPosY = e.touches ? e.touches[0].screenY : e.screenY;
        startPosX = e.touches ? e.touches[0].screenX : e.screenX;
    }
}
var api = module.exports = {
    bind : function(){
        if(!stat){
            stat = true;
            document.addEventListener('touchmove', bindFunc.move, false);
            document.addEventListener('touchstart', bindFunc.start, false);
        }
        return this;
    },
    config : function(cfg){
        cfg = cfg || {};
        config.isExtraElement = cfg.isExtraElement || defaultConfig.isExtraElement;
        config.outerBounce = 'outerBounce' in cfg ? cfg.outerBounce : defaultConfig.outerBounce;
        return this;
    },
    move : function(nodes, target){
        [].forEach.call(nodes || [], function(el){
            (target || document.body).appendChild(el);
        });
        return this;
    },
    destory : function(){
        stat = false;
        document.removeEventListener('touchmove', bindFunc.move, false);
        document.removeEventListener('touchstart', bindFunc.start, false);
    }
};
api.config();
