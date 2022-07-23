jQuery( document ).ready(function() {

	var steps = jQuery('#gform_wrapper_1 .gf_page_steps');
	var firstStep = steps.children().first().clone();
	
	firstStep.find('.gf_step_label').html('Register');
	firstStep.removeClass('gf_step_active');
	
	steps.prepend( firstStep.prop('outerHTML') );
	
	
	var allSteps = steps.children();
	var count = 1;
	allSteps.each(function( index ) {
		jQuery(this).find('.gf_step_number').html(count);
		count = count + 1;
	});
});

