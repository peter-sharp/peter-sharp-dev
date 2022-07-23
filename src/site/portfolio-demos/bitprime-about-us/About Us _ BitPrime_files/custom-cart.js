var submittingOrder=false;
jQuery( document ).ready(function() {
	if(jQuery( "#order_form" ).data( "product-id" )){

		var product_id = jQuery( "#order_form" ).data( "product-id" );
		if((product_id==114778 || product_id==129984)){
			jQuery('.wallet-id').parent().hide();
			jQuery( '.wallet-id' ).val('Thank you!');
			submittingOrder = true;
			
			console.log("submittingOrder");
		}
		jQuery('#order_form').submit(function(e){

			var product_id = jQuery( "#order_form" ).data( "product-id" );
			var walletId = jQuery( '.wallet-id' ).val();
			var tagId = jQuery( '.tag-id' ).val();
			var tagName = jQuery( '.tag-id' ).data( "name" );
			
			if(!submittingOrder){
				e.preventDefault();
				validate_wallet(product_id,walletId,tagId,tagName,'product');
			}
		
		});
	}
});

function validate_wallet(product_id, walletId, tagId, tagName, type, itemQuantity){
	var cartItemKey = type == 'product' ? null : type;
	jQuery.confirm({
		theme: 'modern',
		title: '<strong>Confirm $type Address</strong>',
		buttons: {
			confirm: function () {
				submittingOrder = true;
				btnClass: 'btn-blue';
				if(type=='product'){
					if(tagId && tagId != ''){
						jQuery( '.wallet-id' ).val(walletId + "::" + tagName + ":" + tagId);
					}									
					jQuery('#order_form').submit();
				}
				else{
					var send = walletId;
					if(tagId && tagId != '')send = walletId + "::" + tagName + ":" + tagId;
					jQuery(document.body).trigger('wallet_update',{'cartitem':type,'wallet':send});
				}
    		},
			cancel: function () {
			
			},
		},
	    content: function(){
	        var self = this;
	        self.setContent('Checking callback flow');
	        return jQuery.ajax({
	        	url : custom_cart.ajax_url,
				type : 'post',
				dataType: 'json',
				data : {
					action : 'custom_cart_validate',
					product_id : product_id,
					wallet_id : walletId,
					tag_id : tagId,
					cart_item_key: cartItemKey,
					item_quantity: itemQuantity,
				},
	        }).done(function (response) {
	        	
	        	self.setTitle(response.title);
	        	self.setContent(response.content);
	            
	        	if(response.validated && response.validated == true){
	        		self.buttons.confirm.show();
	        	}else{
	        		self.buttons.confirm.hide();
	        	}
	        	
	        }).fail(function(){
	            //self.setContentAppend('<div>Fail!</div>');
	            //self.buttons.confirm.hide();
	        }).always(function(){
	            //self.setContentAppend('<div>Always!</div>');
	            //self.buttons.confirm.hide();
	        });
	    },		    			
		useBootstrap: false,
	});
}