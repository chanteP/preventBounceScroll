;(function(){

${content}

document.readyState === 'interactive' || document.readyState === 'complete' ? 
    api.move().bind() : 
    document.addEventListener('DOMContentLoaded', function(){
        api.move().bind();    
    });
window.preventScroll = api;
})();