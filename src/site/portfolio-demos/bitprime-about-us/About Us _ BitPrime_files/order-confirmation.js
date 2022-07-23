jQuery( document ).ready(function() {
		
		var confirmed=false;
		
		jQuery(document).on("change", ".wc-terms-and-conditions .woocommerce-form__input-checkbox", function () {
			
			if(this.checked && !confirmed) {
				jQuery(this).prop('checked', false);
				
				jQuery.confirm({
					theme: 'modern',
	    			title: '<strong>Payments</strong>',
	    			content: 'Please ensure you are paying from an account under your name. Third party payments will be rejected',
	    			buttons: {
	        			confirm: {
							btnClass: 'btn-blue',
							text: 'I Accept',
								action: function(){
									confirmed = true;
									jQuery('.wc-terms-and-conditions .woocommerce-form__input-checkbox').prop('checked', true);
								},
			        		},
		        			cancel: function () {
		        			
		        			},
		    			},
					useBootstrap: false,
				});		
			}
		});
});