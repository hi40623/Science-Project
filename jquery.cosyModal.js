
(function($){
	
	$.cosyModal = {
		
		configuration : {
			width : 400,
			height : 'auto',
			showTime : 500,
			hideTime : 250
		},
		
		
		counter : 0,
		
	
		animating : false,
		
		init : function(elmModal, options){
			
			if (typeof(elmModal) == 'object'){
				elmModal = $(elmModal);
			}
			
			else if ($('#'+elmModal).length){
				elmModal = $('#'+elmModal);
			}
			
			else{
				
				return false;
			}
			
			
			if (!$('#cosyModal-overlay').length){
				
				$('<div></div>')
					.attr('class', 'cosyModal-overlay')
					.attr('id', 'cosyModal-overlay')
					.appendTo('body');
			}
			
			
			if (elmModal.data('cosyModal')){
				// Return true
				return true;
			}
			
			
			options = $.extend({}, $.cosyModal.configuration, options);
			
			
			options.id = elmModal.attr('id');
			
			
			options.counter = $.cosyModal.counter;
			
			
			elmModal.addClass('cosyModal');
			
			
			elmClose = elmModal.find('.close');
			if (!elmClose.length){
				elmClose = $('<div></div>')
					.attr('class', 'close')
					.html('&times;')
					.click(function(e){
						$(this).parents('.cosyModal').cosyModal('hide');
					})
					.appendTo(elmModal);
			}
			else{
				elmClose.click(function(e){
					$(this).parents('.cosyModal').cosyModal('hide');
				});
			}
			
			
			elmModal.find('.cosyModal-close').each(function(index, elm){
				$(elm).click(function(e){
					$(this).parents('.cosyModal').cosyModal('hide');
				});
			});
			
			
			elmModal.data('cosyModal', options);
			
			
			elmModal.detach().appendTo('body');
			
			
			maxHeight = $(window).height();
			maxHeight-= (elmModal.outerHeight(true) - elmModal.height());
			if (maxHeight < 100){
				maxHeight = 100;
			}
			
			
			elmModal.css({
				width : options.width,
				height : options.height,
				maxHeight : maxHeight
			});
			elmModal.css({
				marginTop : -elmModal.outerHeight(true),
			});
			
			
			elmModal.hide();
			
			
			$.cosyModal.counter++;
			
			
			return true;
		},
		
		show : function(elmModal){
			
			if ($.cosyModal.animating){
				
				return;
			}
			
			
			elmModal = $(elmModal);
			if (!elmModal){
				
				return false;
			}
			
			
			modalConfig = elmModal.data('cosyModal');
			if (!modalConfig){
				
				return false;
			}
			
			
			elmModal.trigger('cosyModalShow', [ elmModal[0] ]);
			
			
			elmModal.css({
				display : 'block',
				opacity : 0
			});
			
			
			animateOptions = {
				marginTop : 50,
				opacity : 1
			};
			
			
			$.cosyModal.animating = true;
			
			
			elmModal.animate(animateOptions, modalConfig.showTime, function(){
				$(this).show();
				$.cosyModal.animating = false;
				
				
				$(document).on('keydown.cosyModal', function(e){
					
					if (e.keyCode == 27){
						
						$('.cosyModal:visible').cosyModal('hide');
					}
				});
				
				
				$(this).trigger('cosyModalShowed', [ this ]);
			});
			
			
			elmOverlay = $('#cosyModal-overlay');
			
			
			if (elmOverlay.length){
				
				elmOverlay.bind('click', function(){
					
					$('.cosyModal:visible').cosyModal('hide');
				});
				
				
				elmOverlay.css({
					display : 'block',
					opacity : 0
				});
				
				
				elmOverlay.animate({ opacity : 1 }, modalConfig.showTime, function(){ $(this).show(); });
			}
			
			
			return true;
		},
		
		hide : function(elmModal){
			
			if ($.cosyModal.animating){
				
				return;
			}
			
			
			elmModal = $(elmModal);
			if (!elmModal){
				
				return false;
			}
			
			
			modalConfig = elmModal.data('cosyModal');
			if (!modalConfig){
				// Configuration is not set
				return false;
			}
			
			
			elmModal.trigger('cosyModalHide', [ elmModal[0] ]);
			
			
			elmModal.css({
				display : 'block',
				opacity : 1
			});
			
			
			animateOptions = {
				marginTop : -elmModal.outerHeight(true),
				opacity : 0
			};
			
			
			$.cosyModal.animating = true;
			
			
			elmModal.animate(animateOptions, modalConfig.hideTime, function(){
				$(this).hide();
				$.cosyModal.animating = false;
				
				
				$(document).off('keydown.cosyModal');
				
				
				$(this).trigger('cosyModalHided', [ this ]);
			});
			
			
			elmOverlay = $('#cosyModal-overlay');
			
			if (elmOverlay.length){
				
				elmOverlay.css({
					display : 'block',
					opacity : 1
				});
				
				
				elmOverlay.animate({ opacity : 0.0 }, modalConfig.showTime, function(){ $(this).hide(); });
			}
			
			
			return true;
		}
	};
	
	
	$.fn.extend({
		cosyModal : function(){
			if (typeof(arguments[0]) == 'string'){
				switch (arguments[0]){
					case 'show':
					case 'open':
						return this.each(function(){
							$.cosyModal.show(this);
						});
					break;
					case 'hide':
					case 'close':
						return this.each(function(){
							$.cosyModal.hide(this);
						});
					break;
				}
			}
			else{
				options = arguments[0];
				return this.each(function(){
					$.cosyModal.init(this, options);
				});
			}
		}
	});
	
	
	$(document).ready(function(){
		$('a[rel="modal:show"]').each(function(index, elm){
			if (elm.href.indexOf('#')){
				$(this.href.substr(this.href.indexOf('#'))).cosyModal();
				
				$(this).on('click.cosyModal', function(e){
					e.preventDefault();
					$(this.href.substr(this.href.indexOf('#'))).cosyModal('show');
				});
			}
		});
	});
	
	
	$(document).ready(function(){
		$('a[rel="modal:hide"]').each(function(index, elm){
			if (elm.href.indexOf('#')){
				$(this).on('click.cosyModal', function(e){
					e.preventDefault();
					$(this.href.substr(this.href.indexOf('#'))).cosyModal('hide');
				});
			}
		});
	});
})(jQuery);