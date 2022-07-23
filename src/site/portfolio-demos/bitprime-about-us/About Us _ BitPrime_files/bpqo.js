jQuery(document).ready( function () {

	jQuery(document.body).on('wc_fragments_loaded',function(e){
		addlisteners();
    });

	jQuery(document.body).on('wc_fragments_refreshed',function(e){
		addlisteners();
    });

    jQuery(document.body).on('cart_page_refreshed',function(e){
    	addlisteners();
    });

    jQuery(document.body).on('cart_totals_refreshed',function(e){
    	addlisteners();
    });

    jQuery(document.body).on('wc_cart_button_updated',function(){
    	addlisteners();
    });

    jQuery(document.body).on('wallet_update',function(e,data){
    	console.log(data);
    	var $cartitem = data['cartitem'];
    	var $walletid =  data['wallet'];

    	jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            url: wc_add_to_cart_params.ajax_url,
            data: {
                action: "cart_update",
                walletid: $walletid,
                cart_item_key: $cartitem
            },
            success: function(response) {
                if ( ! response || response.error )
                    return;
                jQuery('.address_'+$cartitem+' input').css({'border':'2px solid green'});
                jQuery('.address_'+$cartitem).removeClass('bpqo_loading');
                jQuery(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, jQuery('.address_'+$cartitem)]);

            }
        });

    });

    function addlisteners(){
    	jQuery(".woocommerce-mini-cart-item .amount input").unbind('change.bpqo').on('change.bpqo', qtychange);
    	jQuery(".woocommerce-mini-cart-item .amount input").unbind('keyup.bpqo').on('keyup.bpqo', qtychange);
		jQuery(".woocommerce-mini-cart-item .amount input").unbind('blur.bpqo').on('blur.bpqo',validateCheckout);
		
		jQuery(".woocommerce-mini-cart-item .quantity input").unbind('change.bpqo').on('change.bpqo',priceChange);
    	jQuery(".woocommerce-mini-cart-item .quantity input").unbind('keyup.bpqo').on('keyup.bpqo',priceChange);
		jQuery(".woocommerce-mini-cart-item .quantity input").unbind('blur.bpqo').on('blur.bpqo',validateCheckout);


		jQuery(".woocommerce-cart-tab-container #bank_name").on('change',validateCheckout);
		jQuery(".woocommerce-cart-tab-container #terms").on('change',validateCheckout);


    	jQuery('.woocommerce-mini-cart-item .remove').unbind('click').on('click',function(e){
            e.preventDefault();

            var $a = jQuery(e.target);
            var $product_id = $a.attr('data-product_id');
            var $cartitem = $a.attr('data-cart_item_key');

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: wc_add_to_cart_params.ajax_url,
                data: {
                    action: "product_remove",
                    product_id: $product_id,
                    cart_item_key: $cartitem
                },
                success: function(response) {
                    if ( ! response || response.error )
                        return;

					if(jQuery(".woocommerce-mini-cart-item").length < 2 ){

						jQuery("body").removeClass("woocommerce-cart-tab-is-visible");
					    jQuery(".woocommerce-cart-tab-container").removeClass("woocommerce-cart-tab-container--visible");
					}
					var changeButtonText = jQuery("#coinlist").find("button[data-id='" + $product_id +"']");
					changeButtonText.text("Add to cart");
                    jQuery(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $a]);

                }
            });
			validateCheckout();
        });

    	if(jQuery(".wallet .validatewallet").length === 0){
			jQuery('.wallet:has(input[type="text"])').append("<div class='validatewallet'>Confirm Wallet</div>");
		}

    	jQuery('.validatewallet').unbind('click').on('click', function(e){
    		//alert('woo');

    		var area = jQuery(e.target).parent();
    		area.find('input').css({'border':'2px solid purple'});

    		var product_id = area.find('.wallet-id').attr('data-productid');
    		var cart_id = area.find('.wallet-id').attr('data-cartitem');
    		var walletId = area.find('.wallet-id').val();
			var itemQuantity = area.parent().find('.quantity input').val();
			var itemTotal = area.parent().find('.amount input').val();
    		var tagId = area.find('.tag-id').val();
    		var tagName = area.find('.tag-id').attr('data-name');

    		jQuery('.address_'+cart_id).addClass('bpqo_loading');
			
			validate_wallet(product_id, walletId, tagId, tagName, cart_id, itemQuantity);
			validateCheckout();
    	});

    	// validateCheckout();
	// Validate Wallet
//	jQuery('.wallet-id').unbind('blur').on('blur',function(e){
//
//  		var area = jQuery(e.target).parent().parent();
//    	area.find('input').css({'border':'2px solid purple'});
//
//   		var product_id = area.find('.wallet-id').attr('data-productid');
//   		var cart_id = area.find('.wallet-id').attr('data-cartitem');
//   		var walletId = area.find('.wallet-id').val();
//    	var tagId = area.find('.tag-id').val();
//    	var tagName = area.find('.tag-id').attr('data-name');
//
//   		jQuery('.address_'+cart_id).addClass('bpqo_loading');
//
//		validate_wallet(product_id,walletId,tagId,tagName,cart_id);
//
//		console.log("Hello");
//
//	});

    }

	/**
	 * updates quantity on price change
	 * validates cart
	 */
    function qtychange(e){
		var price = jQuery(e.target);
    	var quantity = jQuery(e.target).closest('.mini_cart_item').find('.quantity input');
    	var orig = quantity.val();
    	var sell = quantity.attr('data-sell');
    	var qty = 0;
		console.log('qtychange ' + sell);


    	if((sell*1)>0){
    		qty = price.val()/sell;
    		qty = parseFloat(qty.toFixed(8));
    		//console.log([qty,jQuery(quantity).attr('min')*1]);
			
    		if(qty >= (quantity.attr('min')*1)){

    			quantity.val(qty);
    			jQuery(e.target).css({'border':'2px solid purple'});	//on save go green
                jQuery('.woocommerce-Price-amount').addClass('bpqo_loading');
				console.log("changing to ",(qty*sell));
				if ((qty * sell) >= (price.attr('min') * 1)){
    				updatecart(quantity, jQuery(e.target));	//save it
    			}
    			
    		}
    	}
    }

	var updatecart = debounce(500,  function _updatecart( quantity, target){
    	var newqty = quantity.val();
    	var cartitem = quantity.attr('data-cartitem');
		console.log('updating cart')
		/*console.log([quantity.val(),quantity.attr('min'),(quantity.val()*1)>=(quantity.attr('min')*1)]);*/

    	if(newqty>0 && (quantity.val()*1)>=(quantity.attr('min')*1)){
			sendUpdate(newqty, cartitem, target);
    	}
    });

	var sendUpdate = debounceCb(function _sendUpdate(delayCb, newqty, cartitem, target) {
		console.log('sending update');
		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: wc_add_to_cart_params.ajax_url,
			data: {
				action: "cart_update",
				qty: newqty,
				cart_item_key: cartitem
			},
			error: function _logError(res) {
				console.error('Update failed');
				console.error(res);
			},
			success: delayCb(function _triggerCartUpdate(response) {
				if (!response || response.error)
					return;
				console.log('updated cart');
				jQuery(target).css({ 'border': '2px solid green' });
				jQuery('.woocommerce-Price-amount').removeClass('bpqo_loading');
				function _triggerAddedToCart() {
					console.log('triggering added to cart')
					jQuery(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, target]);
				}
				if (target.is(':focus')) {
					target.unbind('blur.bpqo-cartupdate').one('blur.bpqo-cartupdate', _triggerAddedToCart);
				} else {
					_triggerAddedToCart();
				}
			})
		});
	});

	function priceChange(e){
		var miniCartAmount = jQuery(e.target).closest('.mini_cart_item').find('.amount input');
		var quantity = jQuery(e.target).closest('.mini_cart_item').find('.quantity input');
    	var orig = miniCartAmount.val();
    	var sell = quantity.attr('data-sell');
    	var price = 0;
		console.log('priceChange' + sell);
    	if(sell>0){
			price = jQuery(e.target).val()*sell;

    		if(price!=orig){
				price = price.toFixed(2);
				

				miniCartAmount.val(price);
    			jQuery(e.target).css({'border':'2px solid purple'});	//on save go green
                jQuery('.woocommerce-Price-amount').addClass('bpqo_loading');
    		
    			updatecart(quantity,jQuery(e.target));
    		
    		}
    	}
		// validateCheckout();
	}


//sparkline.sparkline(document.querySelector(".btc"), btc, options);
//sparkline.sparkline(document.querySelector(".eth"), eth, options);
	/**
	 * Debounces given function using given delay
	 */
	function debounce(delay, fn) {
		var timeoutId;
		return function _debounced() {
			var args = [].slice.call(arguments);
			var that = this;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(function _callDebounced() { fn.apply(that, args) }, delay);
		}
	}

	/**
	 * Debounces callback of given function so that only the response of the last
	 * ajax call is executed
	 * @param {Function} fn 
	 * @returns {Function}
	 */
	function debounceCb(fn) {
		var callsRemaining = 0;
		function _delayTillLastCall(cb) {
			// Add a timeout in case _delayedTillLastCall never called
			var timeoutId = setTimeout(_decrementCalls, 10 * 1000);
			return function _delayedTillLastCall() {
				var args = [].slice.call(arguments);
				clearTimeout(timeoutId);
				_decrementCalls();
				if (callsRemaining <= 0) {
					cb.apply(this, args);
				}
			}
		}
		function _decrementCalls() {
			callsRemaining -= 1;
		}
		return function _debouncedCb() {
			var args = [].slice.call(arguments);
			args.unshift(_delayTillLastCall);

			callsRemaining += 1;
			return fn.apply(this, args);
		}
	}
});


function validateCheckout(){
	var walletsValidated = jQuery( ".woocommerce-mini-cart .wallet-id" );

	jQuery('.woocommerce-mini-cart-item').each(function(){
		if(jQuery(this).find('.quantity input').attr('step')*1==1){
			if(jQuery(this).find('.quantity input').val()==""){
				jQuery(this).find('.quantity input').val(Math.round(jQuery(this).find('.amount input').val()/jQuery(this).find('.amount input').attr('data-product-price')));
			}
			//detect if going up or down, and adjust accordingly
			if(jQuery(this).find('.quantity input').val()>(jQuery(this).find('.quantity input').val()*1).toFixed(0)){
				console.log('gone up');
				jQuery(this).find('.quantity input').val(((jQuery(this).find('.quantity input').val()*1).toFixed(0)*1)+1);
				jQuery(this).find('.quantity input').trigger('change');
			}
			else if(jQuery(this).find('.quantity input').val()<(jQuery(this).find('.quantity input').val()*1).toFixed(0)){
				console.log(['gone down',jQuery(this).find('.quantity input').val()]);
				jQuery(this).find('.quantity input').val(((jQuery(this).find('.quantity input').val()*1).toFixed(0)*1)-1);
				jQuery(this).find('.quantity input').trigger('change');
			}
		}
	});

	jQuery('.checkout-not-validated').show();
	jQuery('.checkout-not-validated').attr('title',"Missing: ");
	var validated = true;

	if(walletsValidated.length > 0 ){
		validated = false;
		jQuery('.checkout-not-validated').attr('title',jQuery('.checkout-not-validated').attr('title')+"Wallet address(es),");
	}
	if (jQuery("#bank_name").val() === "" || jQuery("#bank_name").val() == "please-select" ) {
		validated = false;
		jQuery('.checkout-not-validated').attr('title',jQuery('.checkout-not-validated').attr('title')+" Bank selection,");
	}
	if(!jQuery('.woocommerce-form__label-for-checkbox #terms').is(":checked")){
		validated = false;
		jQuery('.checkout-not-validated').attr('title',jQuery('.checkout-not-validated').attr('title')+" Terms agreement");
	}

	if(validated == true){
		jQuery(':input[id="place_order"]').prop('disabled', false);
		jQuery('.checkout-not-validated').hide();
	}

}
