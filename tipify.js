(function(){
	var livetooltiplist = [];
	var globalStyle = {
		tooltipPosition: 'top',
		backgroundColor: '#333333',
		color: '#ffffff',
		textAlign: 'center',
		padding: '3px 7px',
		borderRadius: '5px'
	};
	function createTooltip(target, tooltipPosition, content){
		if(tooltipPosition === undefined) tooltipPosition = 'top';
		var tooltipBody = document.createElement('div');
		var arrow = document.createElement('div');

		tooltipBody.style.position = 'absolute';		
		tooltipBody.style.backgroundColor = globalStyle.backgroundColor;
		tooltipBody.style.color = globalStyle.color;
		tooltipBody.style.textAlign = globalStyle.textAlign;
		tooltipBody.style.padding = globalStyle.padding;
		tooltipBody.style.borderRadius = globalStyle.borderRadius;
		tooltipBody.innerHTML = content;
				
		arrow.style.position = 'absolute';		
		arrow.style.width = 0; 
		arrow.style.height = 0; 
		var arrowSize = 5;

		var arrowPosition = '';
		if(tooltipPosition == 'top') arrowPosition = 'bottom';
		else if(tooltipPosition == 'bottom') arrowPosition = 'top';
		else if(tooltipPosition == 'left') arrowPosition = 'right';
		else if(tooltipPosition == 'right') arrowPosition = 'left';

		if(arrowPosition == 'left'){
			arrow.style.borderTop = arrowSize + 'px solid transparent';
			arrow.style.borderBottom = arrowSize + 'px solid transparent';
			arrow.style.borderRight = arrowSize + 'px solid ' + globalStyle.backgroundColor;	
		}
		else if(arrowPosition == 'right'){
			arrow.style.borderTop = arrowSize + 'px solid transparent';
			arrow.style.borderBottom = arrowSize + 'px solid transparent';
			arrow.style.borderLeft = arrowSize + 'px solid ' + globalStyle.backgroundColor;	
		}
		else if(arrowPosition == 'top'){
			arrow.style.borderLeft = arrowSize + 'px solid transparent';
			arrow.style.borderRight = arrowSize + 'px solid transparent';
			arrow.style.borderBottom = arrowSize + 'px solid ' + globalStyle.backgroundColor;	
		}
		else if(arrowPosition == 'bottom'){
			arrow.style.borderLeft = arrowSize + 'px solid transparent';
			arrow.style.borderRight = arrowSize + 'px solid transparent';
			arrow.style.borderTop = arrowSize + 'px solid ' + globalStyle.backgroundColor;	
		}
		
		document.body.appendChild(tooltipBody);	
		document.body.appendChild(arrow);
		var divTop = 0;
		var divLeft = 0;
		var arrowTop = 0;
		var arrowLeft = 0;
		if(tooltipPosition == 'bottom'){
			divTop = target.offsetTop + target.offsetHeight + arrow.offsetHeight;
			divLeft = target.offsetLeft + (target.offsetWidth / 2) - (tooltipBody.offsetWidth / 2);
			arrowTop = divTop - arrow.offsetHeight;
			arrowLeft = divLeft + (tooltipBody.offsetWidth / 2) - (arrow.offsetWidth / 2);
		}
		else if(tooltipPosition == 'top'){
			divTop = target.offsetTop - arrow.offsetHeight - tooltipBody.offsetHeight;
			divLeft = target.offsetLeft + (target.offsetWidth / 2) - (tooltipBody.offsetWidth / 2);	
			arrowTop = divTop + tooltipBody.offsetHeight;
			arrowLeft = divLeft + (tooltipBody.offsetWidth / 2) - (arrow.offsetWidth / 2);
		}
		else if(tooltipPosition == 'left'){
			divTop = target.offsetTop + (target.offsetHeight / 2) - (tooltipBody.offsetHeight / 2);
			divLeft = target.offsetLeft - arrow.offsetWidth - tooltipBody.offsetWidth;	
			arrowTop = divTop + (tooltipBody.offsetHeight / 2) - (arrow.offsetHeight / 2);
			arrowLeft = divLeft + tooltipBody.offsetWidth;
		}
		else if(tooltipPosition == 'right'){
			divTop = target.offsetTop + (target.offsetHeight / 2) - (tooltipBody.offsetHeight / 2);
			divLeft = target.offsetLeft + target.offsetWidth + arrow.offsetWidth;	
			arrowTop = divTop + (tooltipBody.offsetHeight / 2) - (arrow.offsetHeight / 2);
			arrowLeft = divLeft - arrow.offsetWidth;
		}
	
		tooltipBody.style.top = divTop;
		tooltipBody.style.left = divLeft;

		arrow.style.top = arrowTop;
		arrow.style.left = arrowLeft;

		livetooltiplist.push({
			target: target,
			elements: [tooltipBody, arrow]
		});
	}
	var handler = function(){
		'use strict';
		document.addEventListener('mouseover', function(e){
			if(e.target.hasAttribute('data-tipify')){
				var content = e.target.getAttribute('data-tipify');
				createTooltip(e.target, globalStyle.tooltipPosition, content);
			}		
			else{
				// search up the bubble path if there's a tipify-enabled element, 
				// otherwise hovering over child elements won't trigger tooltip
				for(var i = 0; i < e.path.length - 2 /* -2 because document and window don't need to be checked */; i++){
					if(e.path[i].hasAttribute('data-tipify')){
						var content = e.path[i].getAttribute('data-tipify');
						createTooltip(e.path[i], globalStyle.tooltipPosition, content);
						break;
					}
				}
			}
		});
		document.addEventListener('mouseout', function(e){
			if(e.target.hasAttribute('data-tipify')){				
				livetooltiplist.filter(function(el){
					return el.target === e.target;
				}).map(function(el){
					livetooltiplist.splice(livetooltiplist.indexOf(el), 1);					
					el.elements.map(function(item){
						document.body.removeChild(item);	
					})					
				});
			}	
			else{
				// search up the bubble path if there's a tipify-enabled element, 
				// otherwise hovering over child elements won't trigger tooltip
				for(var i = 0; i < e.path.length - 2 /* -2 because document and window don't need to be checked */; i++){
					if(e.path[i].hasAttribute('data-tipify')){
						livetooltiplist.filter(function(el){
							return el.target === e.path[i];
						}).map(function(el){
							livetooltiplist.splice(livetooltiplist.indexOf(el), 1);					
							el.elements.map(function(item){
								document.body.removeChild(item);	
							})					
						});
						break;
					}
				}
			}
		});
	};

	document.addEventListener('DOMContentLoaded', handler, false);
})();