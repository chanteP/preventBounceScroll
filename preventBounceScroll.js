/**
 * 单例
 *
 * 规则：
    1. overscroll:scroll的元素始终可以在对应坐标方向滚动
    2. overscroll:auto的元素如果在对应方向滚动到头则继续向上层寻找可滚动元素
    3. 符合extra条件的元素不能作为选择元素的条件
*/
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
    }
};
var config = {};

var notPreventScrollElement = function(element){
    return config.isExtraElement(element) || isScrollElement(element);
}
//能滚的element
var isScrollElement = function(element, whileTouch) {
    var checkFunc = whileTouch ? checkIsScrollElementWhileTouch : checkIsScrollElementWhileScroll;
    while(element) {
        if(checkFunc(element)){
            return element;
        }
        element = element.parentElement;
    }
    return false;
}
var checkIsScrollElementWhileTouch = function(element){
    var style = window.getComputedStyle(element);
    var tmp, check;
    //规则1
    if(style.overflowY === 'scroll' && element.scrollHeight > element.clientHeight){
        check = true;
        if(element.scrollTop === 0){
            element.scrollTop = 1;
        }
        tmp = element.scrollHeight - element.clientHeight;
        if(tmp === element.scrollTop){
            element.scrollTop = tmp - 1;
        }
    }
    if(style.overflowX === 'scroll' && element.scrollWidth > element.clientWidth){
        check = true;
        if(element.scrollLeft === 0){
            element.scrollLeft = 1;
        }
        tmp = element.scrollWidth - element.clientWidth;
        if(tmp === element.scrollLeft){
            element.scrollLeft = tmp - 1;
        }
    }
    if(check){
        return element;
    }
}
var checkIsScrollElementWhileScroll = function(element){
    var style = window.getComputedStyle(element);
    //规则2
    return (
        (style.overflowY === 'scroll' || style.overflowY === 'auto')
        && (
            element.scrollHeight > element.clientHeight
            && !(startPosY <= curPosY && element.scrollTop === 0)
            && !(startPosY >= curPosY && element.scrollHeight - element.scrollTop === element.clientHeight)
        ) 
        || 
        (style.overflowX === 'scroll' || style.overflowX === 'auto')
        && 
            element.scrollWidth > element.clientWidth
            && !(startPosX <= curPosX && element.scrollLeft === 0)
            && !(startPosX >= curPosX && element.scrollWidth - element.scrollLeft === element.clientWidth)
        );
}

//bind
var bindFunc = {
    move : function(e) {
        curPosY = e.touches ? e.touches[0].screenY : e.screenY;
        curPosX = e.touches ? e.touches[0].screenX : e.screenX;
        notPreventScrollElement(e.target) || e.preventDefault();
    },
    start : function(e){
        var target = isScrollElement(e.target, true);
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
        return this;
    },
    move : function(nodes, target){
        nodes = nodes ? 
            nodes : 
            'all' in document ?
                [].filter.call(document.all, function(el){
                    return window.getComputedStyle(el).position === 'fixed';
                }) : 
                [];
        target = target || document.body;
        [].forEach.call(nodes, function(el){
            target.appendChild(el);
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
