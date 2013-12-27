(function(exports){
    var wipe = function(element){
        this.startX = 0, 
        this.startY = 0,
        this.clock = 0,
        this.dx = 0,
        this.dy = 0,
        this.isMoving = false,
        this.el = element;
        this.ctrlEl = element.children[0];
        this.mutiEl = element.children[1];

        var self = this;
        this.config = {
            min: 80,
            minTime: 150,
            wipeLeft: function(){
                if(self.ctrlEl.left < tz - 1){
                    self.ctrlEl.left += 1;
                    var val = 'translate3d('+ wide * self.ctrlEl.left + 'px,0,0)';
                    self.mutiEl.style.webkitTransform = val;
                    self.ctrlEl.style.webkitTransform = val;
                    footer.pos += 20;
                    footer.style.left = footer.pos + 'px';
                }else{
                    self.config.rollBack();
                }
            },
            wipeRight: function(){
                if(self.ctrlEl.left > 0){
                    self.ctrlEl.left -= 1;
                    var val = 'translate3d(' + wide * self.ctrlEl.left + 'px,0,0)';
                    self.ctrlEl.style.webkitTransform = val;
                    self.mutiEl.style.webkitTransform = val;
                    footer.pos -= 20;
                    footer.style.left = footer.pos + 'px';
                }else{
                    self.config.rollBack();
                }
            },
            wipeTop: function(){},
            wipeBottom: function(){},
            transition: function(disX, e){
                e.preventDefault();
                self.mutiEl.style.webkitTransform = 'translate3d(' + parseInt(disX * 0.8 + self.ctrlEl.left * wide) + 'px, 0, 0)';;
                self.ctrlEl.style.webkitTransform = 'translate3d(' + parseInt(disX + self.ctrlEl.left * wide) + 'px, 0, 0)';;
            },
            rollBack: function(){
                self.mutiEl.style.webkitTransition = '-webkit-transform 500ms cubic-bezier(0.1, 0.3, 0.5, 1)';
                self.ctrlEl.style.webkitTransition = '-webkit-transform 500ms cubic-bezier(0.1, 0.3, 0.5, 1)';
                var val = 'translate3d(' + self.ctrlEl.left * wide + 'px, 0, 0)';
                self.ctrlEl.style.webkitTransform = val;
                muti.style.webkitTransform = val;
            }
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
            this.ctrlEl.style.webkitTransition = '-webkit-transform 400ms cubic-bezier(0.2,0.2, 1, .80)';
            this.mutiEl.style.webkitTransition = '-webkit-transform 400ms cubic-bezier(0.2,0.2, 1, .90)';
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
        this.mutiEl.style.webkitTransition = 'none';
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

var tz = 8;
var wrapper = document.getElementById('wrapper'),
    content = document.getElementById('content'),
    footer = document.querySelector('#footer div'),
    wide = document.body.clientWidth * -1;

var page = function(){
    var date = new Date();
    var gmh = date.getUTCHours();
    var gmm = date.getUTCMinutes();
    var gmd = date.getUTCDate();
    var lcd = date.getDate();
    var lcmonth = date.getMonth() + 1;
    var lcy = date.getFullYear();
    var lch = date.getHours();
    var lcm = date.getMinutes() + 1;

    var getTZ = function(){
        if(gmh == 18)
            tz = 1;
        else if(gmh >= 19 && gmh < 22)
            tz = 2;
        else if(gmh >= 22 && gmh < 24)
            tz = 3;
        else if(gmh == 24 || gmh < 6)
            tz = 4;
        else if(gmh >=6 && gmh < 8)
            tz = 5;
        else if(gmh >= 8 && gmh < 12)
            tz = 6;
        else if(gmh >= 12 && gmh < 15)
            tz = 7;
        else if(gmh >= 15 && gmh <18)
            tz = 8;
        
        content.left = tz-1;
        wrapper.className = '_' + tz;
        footer.pos = (-wide + tz*20)/2 - 20;
        footer.style.left = footer.pos + 'px';
    };
    var calcuCounter = function(){
        var list = [3,1.5,1,0.5,0.5,0.5,0.8,2.0,3.2,10,11,4,4,4,10,9,8,4,3,4,4,5,3];
        var goal = 1238142;
        var count = 0;
        var addDot = function(num){
            num = Math.floor(num).toString();
            var list = [];
            for(var i in num)
                list[i] = num[i];

            list = list.reverse();
            for(var i in list){
                if(i > 0 && i % 3 == 0)
                    list[i] = list[i] + '.';
            }
            list = list.reverse();
            list = list.join("");
            return list;
        }
        if(lcm == 1){
            if(lcd > 1)
                count = goal;
            else{
                var queue = list.slice(0,lch + 1);
                for(var i = 0, j = queue.length; i < j; i++){
                    count += goal * queue[i] / 100;
                }
            }
            count = addDot(count);
        }
        var tip = document.getElementById('tip').children[0];
        tip.innerHTML = count;
    };
    var initTime = function(){
        var local = lch + ':' + lcm;
        var sunsets = content.querySelectorAll('.sunset');
        var calcutime = function(el){
            var remote = (gmh + parseInt(el.dataset['dz'])) % 24 + ':' + gmm;
            var str = "<ul><li>" + remote + "</li><li>" + local + "</li></ul>";
            el.innerHTML = str;
        }
        
        document.getElementById('date').innerHTML = lcy + '/' + lcmonth + '/' + lcd;

        for(var i = 0; i < tz; i++){
            calcutime(sunsets[i]);
        }
    };

    getTZ();
    initTime();
    calcuCounter();
};

page();
new WipeTouch(wrapper);

