var loadProgress = function(){
	var progress,
		filler,
		_percent,
		count,
		opt,
		proClock,
		pitems = [],
		tl = [],
		progress = document.getElementById('progress'),
		filler = progress.querySelector('.filler'),
		img = document.createElement('img');

	var initData = function(){
		if(!!opt.els.length){
			for(var i = 0, j = opt.els.length; i < j; i++){
				var pitemd = opt.els[i].querySelectorAll('.pitem');
				var ar = Array.prototype.slice.call(pitemd, 0);
				pitems = pitems.concat(ar);
			}
		}else{
			var pitemd = opt.els.querySelectorAll('.pitem');
			pitems = Array.prototype.slice.call(pitemd, 0);
		}
		_percent = 0;
		count = 0;
		progress.style.width = 0;

		if(!!progress.dataset['title'])
			progress.classList.add('titled');
	},
	setStyle = function(){
		for(key in opt.style){
			progress.style[key] = opt.style[key];
			if(key == 'height' || key == 'backgroundColor')
				filler.style[key] = opt.style[key];
		}
	},
	successLoad = function(){
		if(!!opt.els.length){
			for(var i = 0, j = opt.els.length; i < j; i++)
				opt.els[i].style.opacity = 1;
		}else
			opt.els.style.opacity = 1;
		progress.style.width = '100%';
		progress.classList.add('done');
		clearInterval(proClock);
		return true;
	},
	checkLoaded = function(){
		for(var i = 0, j = pitems.length; i < j; i++){
			img.src = pitems[i].dataset['o'];
			if(img.width > 0){
				_percent += 1/j;
				tl.push(i);
				progress.style.width = _percent * 100 + '%';
				filler.style.webkitAnimation = 'none';
				filler.style.width = '0px';
				filler.style.webkitAnimation = 'during 10s linear 1';
				count = 0;
				if(_percent == 1){
					successLoad();
				}
			}
		}

		for(var i = 0, j = tl.length; i < j; i++)
			pitems.splice(tl[i] - i, 1);
	};

	return {
		loading: function(options){
			opt = {
				els: options.el || document.body,
				timeCell: options.fre || 200,
				position: options.pos || 'top',
				style: options.style || {}
			};

			initData();
			setStyle();
			proClock = setInterval(function(){
				checkLoaded();

				if(count > 20)
					successLoad();

				tl = [];
				count ++;
			}, opt.timeCell);
		}
	};
}();