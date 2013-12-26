(function(exports){
    var wipe = function(element, opt){
        this.startX = 0, 
        this.startY = 0,
        this.clock = 0,
        this.dx = 0,
        this.dy = 0,
        this.isMoving = false,
        this.el = element;
        this.ctrlEl = element.children[0];

        if(!opt) opt = {};

        this.config = {
            min: opt.min || 40,
            minTime: opt.minTime || 150,
            wipeLeft: opt.wipeLeft || function(){},
            wipeRight: opt.wipeRight || function(){},
            wipeTop: opt.wipeTop || function(){},
            wipeBottom: opt.wipeBottom || function(){},
            transition: opt.transition || function(){},
            rollBack: opt.rollBack || function(){}
        };

        this.el.addEventListener('touchstart', this, false);
        this.el.addEventListener('touchmove', this, false);
        this.el.addEventListener('touchend', this, false);
        this.el.addEventListener('webkitTransitionEnd', this, false);
    }

    wipe.prototype.onTouchMove = function(e){
        this.isMoving = true;
        if(this.startX == null){
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
        }

        this.dx = e.touches[0].pageX - this.startX;
        this.dy = e.touches[0].pageY - this.startY;
        this.config.transition(this.dx, e);
    }

    wipe.prototype.cancelTouch = function(){
        this.startX = null;
        this.startY = null;
        this.dx = null;
        this.dy = null;
        this.isMoving = false;
    }

    wipe.prototype.onTouchEnd = function(e){
        if(this.isMoving){
            var timer = e.timeStamp - this.clock;
            this.ctrlEl.style.webkitTransition = '-webkit-transform 400ms cubic-bezier(0.2,0.2, 1, .70)'
            if(Math.abs(this.dy) > Math.abs(2 * this.dx)){
                this.config.rollBack();
                if(this.dy > 0 )
                    this.config.wipeBottom();
                else
                    this.config.wipeTop();
            }else{
                if(Math.abs(this.dx) > this.config.min || timer < this.config.minTime){
                    if(this.dx > 0)
                        this.config.wipeRight();
                    else
                        this.config.wipeLeft();
                }else
                    this.config.rollBack();
            }
        }
        this.cancelTouch();
    }

    wipe.prototype.onTouchStart = function(e)
    {
        if (e.touches.length == 1) {
            if(this.isMoving)
                this.stopMomenting();
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
            this.clock = e.timeStamp;
        }
    }
    wipe.prototype.stopMomenting = function(){
        var style = document.defaultView.getComputedStyle(this.el, null);
        var transform = new WebKitCSSMatrix(style.webkitTransform);
        this.element.style.webkitTransition = '';
        this.animateTo(transform.m42);
    }

    wipe.prototype.onTransitionEnd = function(e){
        this.ctrlEl.style.webkitTransition = 'none';
    }

    wipe.prototype.handleEvent = function(e) {
        switch (e.type) {
            case 'touchstart':
                this.onTouchStart(e);
                break;
            case 'touchmove':
                this.onTouchMove(e);
                break;
            case 'touchend':
                this.onTouchEnd(e);
                break;
            case 'webkitTransitionEnd':
                this.onTransitionEnd(e);
                break;
        }
    };
    
    exports.WipeTouch = wipe;
})(window);

var tz = 5;

var wrapper = document.getElementById('wrapper'),
	content = document.getElementById('content'),
    wide = document.body.clientWidth * -1;

content.className = '_' + tz;
content.left = tz-1;


new WipeTouch(wrapper, {
    min: 80,
    wipeRight: function(){
        if(content.left > 0){
            content.left -= 1;
            content.style.webkitTransform = 'translate3d(' + wide * content.left + 'px,0,0)';
        }else{
            this.rollBack();
        }
    },
    wipeLeft: function(){
        if(content.left < tz - 1){
            content.left += 1;
            content.style.webkitTransform = 'translate3d('+ wide * content.left + 'px,0,0)';
        }else{
            this.rollBack();
        }
    },
    transition: function(disX, e){
        e.preventDefault();
        content.style.webkitTransform = 'translate3d(' + parseInt(disX + content.left * wide) + 'px, 0, 0)';
    },
    rollBack: function(){
        content.style.webkitTransition = '-webkit-transform 500ms cubic-bezier(0.1, 0.3, 0.5, 1)';
        content.style.webkitTransform = 'translate3d(' + content.left * wide + 'px, 0, 0)';
    }
});