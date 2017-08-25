(function($, Models, Collections, Views) {
	$(document).ready(function() {
		
		$('.fre-chosen-single').chosen({
			width: '100%',
            inherit_select_classes: true
		});

		var calendar = $('.fre-calendar').datetimepicker({
			format: 'MM/DD/YYYY',
			icons: {
				previous: 'fa fa-angle-left',
    			next: 'fa fa-angle-right'
			},
			debug: true
		});

		$('.project-filter-title').on('click', function(ev) {
			ev.preventDefault();
			var target = ev.currentTarget;
			$('.fre-project-filter-box').toggleClass('active');
		});
		$('.profile-filter-title').on('click', function(ev) {
			ev.preventDefault();
			var target = ev.currentTarget;
			$('.fre-profile-filter-box').toggleClass('active');
		});

		$('.fre-skill-item').on('click', function(ev) {
			ev.preventDefault();
			var target = ev.currentTarget;
			$(this).toggleClass('active');
			var skill_field = [];
			$('.fre-skill-dropdown li').each(function(index, el) {
				if($(this).find('a').hasClass('active')) {
					skill_field.push($(this).find('a').text());
				}
			});
			$('.fre-skill-field').val(skill_field);
		});

		$('.fre-search-skill-dropdown').keyup(function() {
			var _this = this;
			$('.fre-skill-dropdown li').each(function(index, el) {
				if($(this).find('a').text().indexOf($(_this).val()) != -1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			if($(_this).val() == '') {
				$('.fre-skill-dropdown li').each(function(index, el) {
					$(this).show();
				});
			}
		});

		$(document.body).on('click', function(event) {
            if($(event.target).closest('.fre-skill-dropdown').length) {
                $('.fre-skill-dropdown').parent().addClass('keep-menu-open');
            } else {
            	$('.fre-skill-dropdown').parent().removeClass('keep-menu-open');
            }
        });

		// $('.fre-post-project-next-btn').on('click', function(ev) {
		// 	ev.preventDefault();
		// 	var target = ev.currentTarget;
		// 	$(target).closest('.fre-post-project-step').removeClass('active');
		// 	$(target).closest('.fre-post-project-step').next().addClass('active');
		// });
		// $('.fre-post-project-previous-btn').on('click', function(ev) {
		// 	ev.preventDefault();
		// 	var target = ev.currentTarget;
		// 	$(target).closest('.fre-post-project-step').removeClass('active');
		// 	$(target).closest('.fre-post-project-step').prev().addClass('active');
		// });

	});
}(jQuery, window.AE.Models, window.AE.Collections, window.AE.Views))