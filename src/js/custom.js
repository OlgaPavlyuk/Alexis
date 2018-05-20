function getLeftPosition(element) {
	var $this = $(element);
	var $parent = $this.parent();
	var parentWidth = $parent.width();
	var $arrowPosition = ($this.offset().left - 
		$parent.offset().left+$this.width()/2) * 100 / parentWidth;
	return $arrowPosition || 0;
}

function changeInfo(sel) {
	var $this =  $(sel);								
	var $parent = $this.parent();						
	var $memberInfo = $this.find('.member-info');
	var prevLeft = getLeftPosition('.member--active');

	$('.member--active').removeClass('member--active').removeAttr('data-m').find('.member-info').removeAttr('style');

	$this.addClass('member--active');

	if (window.matchMedia('(max-width: 480px)').matches) {

		$memberInfo.find('.arrow').css('left', prevLeft + '%');
		
		$memberInfo.hide().slideDown('slow', function(){
			$(this).removeAttr('style');
		});
		 	
	} else {

		$memberInfo.find('.arrow').css('left', prevLeft + '%');
		$('.clone').remove();
		var clone = $memberInfo.clone().attr('class', 'member-info clone');

			if (window.matchMedia('(max-width: 768px)').matches) { 

				var index = $this.index();				
	  			if (index % 2 === 0) {
	  				clone.insertAfter($this.next());

	  			} else {
	  				clone.insertAfter($this);	  				
	  			}	
	  		}
	  		else {	  			
	  			clone.insertAfter($parent);
	  		}

	  		clone.find('svg').css('fill', $memberInfo.css('color'));

	  		clone.find('.arrow').animate({
	  			left:  getLeftPosition(sel) + '%'
	  		}, 500, 'swing');
	}
}

function getMatch() {
		var mq;
		if (window.matchMedia('(max-width: 480px)').matches) {
			mq = '480';
		} else {
			if (window.matchMedia('(max-width: 768px)').matches) { 
				mq = '768';
			}
			else {	 
				mq = '992';
			}
		}
	return mq;
}


var prevScrollTop, currentScrollTop = 0,
	navbar = $('#navbar'),
	menu_selector = ".main-menu",
	mainMenu = $(menu_selector),
	firstScreen = $(".page__line--heading"),
	menuToggle = $(".menu-toggle");
   
function menuPosition(scroll_top) {
	if(scroll_top <= firstScreen.height()*0.8) {
		navbar.removeClass("menu--on-scroll").addClass("menu--on-top"); 
	}
	else{
		navbar.addClass("menu--on-scroll").removeClass("menu--on-top");    
	}
}

var menuItems = $(menu_selector + ' a');
var sections = {};

function setSections() {

	menuItems.each(function(){
		var hash = $(this).attr('href');
		var target = $(hash);

		var param = {'top': target.offset().top,
					'height': target.outerHeight()};
		sections[hash] = param;

	});
}

// animation
var animated_elements = $('.animated');
var animated = {};

function setAnimated() {

	animated_elements.each(function(){
		var container = $(this).closest('.page__line');
		var name = container.attr('class').split(' ').join('.');
		var param = {'top': container.offset().top,
					'bottom': container.offset().top + container.outerHeight()};
		animated[name] = param;
	});
}

function checkElemInView(elem, top_bar, bottom_bar) {
	var top = elem.offset().top;
	var bottom = top + elem.outerHeight();
	if ((bottom >= top_bar) && (top <= bottom_bar)) {
		return true;
	} else {
		return false;
	}
}
var counts = 0;
var $window = $(window);


function check_in_view() {

	var w_top = $window.scrollTop();
	var w_bottom = (w_top + $window.height());
	
	for (var key in animated) {
		if (animated[key].top < w_bottom && animated[key].bottom > w_top) {
			$('.' + key + ' .animated').each(function(){

				if (checkElemInView($(this), w_top, w_bottom)) {
					$(this).addClass('in-view');

				} else {
					$(this).removeClass('in-view');
				}

			});
			break;
		}
	}
}

function onScroll(){
	var scroll_top = $(document).scrollTop();

	menuPosition(scroll_top);

	check_in_view();
	//set active menu item on the same section name
	for (var key in sections) {
		
		if ((sections[key].top - 10 ) <= scroll_top && sections[key].top + sections[key].height >= scroll_top) {
			
			$(menu_selector + " a.active").removeClass("active");
			$(menu_selector + " a[href=" + key+ "]").addClass("active");
		}
		else {
			$(menu_selector + " a[href=" + key+ "]").removeClass("active");
		}
	}
	   
	if (prevScrollTop < scroll_top ) {
	    navbar.css("transform", "translateY(-80px)");
	} else if (prevScrollTop > scroll_top) {
	    navbar.css("transform", "translateY(0px)");
	}
	prevScrollTop = scroll_top;
}

function hideText (item) {
	var reg = /\b(\S+)\W*$/g;
		item.classList.add('withHidden');
	var iH = item.parentNode.offsetHeight; 
	var str = item.innerHTML;
	var result;
	var h = iH
	var ii = 0; 

	while (iH == h) {		
				
		result = reg.exec(item.innerHTML);

		item.innerHTML = item.innerHTML.replace(reg, '');
		h = item.parentNode.offsetHeight;

				if (ii > 15) {
					break;
				}
		}

		item.innerHTML = str.substring(0, result.index) + '<span class="hiddenText">'+str.substring(result.index)+'</span>';

}

function showText (item) {
	var str = item.innerHTML;
	var reg = /<.*?>|<\/.*?>/;

	if (reg.exec(str) != -1 ) {
		item.innerHTML = item.innerHTML.replace(reg, '');
		item.classList.remove('withHidden');
	}
}

//blog
var blogContainer = $('.articles');


function cropItems () {

	if (window.matchMedia('(max-width: 992px)').matches) { 
		return; 
	}

	var blogContainerHeight = blogContainer.height();
	var blogItems = $('.article-item').not('.article-item--active');
	var heightItems = 0;

	blogItems.each(function(){
		
		showText(this.querySelector('.text')); // return full text for real height
		heightItems += $(this).height();

	});
	
	var itemsText = blogItems.find('.text');
	
	if (heightItems > blogContainerHeight - 15 ) {

		itemsText.each(function(){ 

			hideText (this);
							
		});
	} else {
		
		itemsText.each(function(){ 

			showText(this);
						
		});
	}
}



$(function () {

	cropItems ();

	//animate scroll to
	$('.logo').on('click', function(){
		$('html, body').animate({
			scrollTop: 0}, 
			'slow');
	});

	$('a.button[href="#portfolio"]').on('click', function(){
		$('html, body').animate({
			scrollTop:  $('#portfolio').offset().top}, 
			'slow');
	});

	// show video
	var clickVideo = $('#video-button');
	clickVideo.on('click', function () {
		$('.video__container').css('zIndex', '150');
		$('.video').css('opacity', '1');
		$('.video__description').css('visibility', 'hidden');
	});

	$('.img--portfolio').error(function(){
		$(this)
			.addClass('not_find_img')
			.parent().next().css('bottom', '0')
			.parent().addClass('error__img');
	});
	$('.img--client').error(function(){
		$(this).parent().addClass('emptyPhoto');
	});


	changeInfo('.member--active');

	$('.member').on('click', function() {
		if (!$(this).parent().hasClass('member--active')) {
			changeInfo($(this).parent());
		}
	});


	var beforeResize = getMatch();

	$( window ).on('resize', function() {
		var newMedia = getMatch();
		if (beforeResize != newMedia) {
			changeInfo('.member--active');
		};
		beforeResize = newMedia; 

		cropItems();

		setSections();
		setAnimated();
	});

//initialization owl-carousel
	$(".owl-carousel").owlCarousel({
		items: 1,
		loop: true,
		autoplay: false
	});	

	$('.article-item').click(function(){

			$(".article-item--active").removeClass("article-item--active");
			$(this).addClass('article-item--active');
			
			var t = document.querySelector('.article-item--active .text');
			showText(t);

			cropItems ();

	});

	$('#btnSubmit').on('click', function () {
    	$(this)
        	.closest('form')
        	.find('[required]')
        	.addClass('required');
	});


	$(".tariff-option").each(function(){
		this.innerHTML = this.innerHTML.replace( /^(.+?\s)/, '<span>$1</span>' );
	});
	$(".item-heading--reasons").each(function(){
		this.innerHTML = this.innerHTML.replace( /^(\S+\s)/, '$1<br>' );
	});



	var $form = $( ".contactForm" );
	var $input = $form.find( "input[name=customBudget]" );

//E-mail Ajax Send
	$form.on('submit', function() { 
		var th = $(this);

		var arr = th.serializeArray();
		
		for (var i = 0; i < arr.length; i++) {
		    arr[i].value = arr[i].value.replace(/[($)\s\._\-]+/g, ''); // Sanitize the values.
		};	        
		event.preventDefault();


		$.ajax({
			type: "POST",
			url: "mail.php", 
			data: th.serialize()
		}).done(function() {
			$(th).find('.messegeResult').addClass('success').css('display', 'flex').hide().fadeIn();
			setTimeout(function() {
				$(th).find('.messegeResult').removeClass('success').fadeOut();
				th.trigger("reset");
				th
				    .find('[required]')
				    .removeClass('required');
			}, 3000);
		});
		return false;
	});

	$input.on( "keyup", function( event ){
	        
	    // When user select text in the document, also abort.
	    var selection = window.getSelection().toString();
	    if ( selection !== '' ) {
	        return;
        }
	        
	        // When the arrow keys are pressed, abort.
        if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
            return;
        }
	        
        var $this = $( this );        
        // Get the value.
        var input = $this.val();        
        var input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseInt( input, 10 ) : 0;
            $this.val( function() {
                return ( input === 0 ) ? "" : input.toLocaleString( "ru-RU" );
            });
	});
	    
//menu
	menuToggle.on('click', function(){
		$(this).toggleClass('menu-toggle--active');
		mainMenu.toggleClass("menu-active");
	
		mainMenu.find('a').on('click', function(){	 	
	 		mainMenu.removeClass("menu-active");
	 		menuToggle.removeClass("menu-toggle--active");
	 	});
	});	

	menuPosition( $(document).scrollTop() );
	setAnimated();
	setSections();

	$(document).on("scroll", onScroll);

	$(".main-menu a[href^=#]").on('click',  function(e){
		e.preventDefault();
		$(document).off("scroll");
		$(menu_selector + " a.active").removeClass("active");
		$(this).addClass("active");
		var hash = $(this).attr("href");
		var target = $(hash);
		$("html, body").animate({
		    scrollTop: Math.ceil(target.offset().top)
		}, 500, function(){
			window.location.hash = hash;
			$(document).on("scroll", onScroll);
			menuPosition($(document).scrollTop());
		});
	});

});
