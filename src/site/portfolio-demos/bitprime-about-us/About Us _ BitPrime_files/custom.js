(function fiife(factory){

	factory(jQuery);

})(function bpModule($){
	$(document).ready(function($){


		if (!$.BitPrime){ $.BitPrime = {}; }

		$.BitPrime.Buy = {
			NZDInput: $("#nzd-quantity"),
			CryptoInput: $(".input-text.qty[name!='sell-crypto__crypto-quantity']")
		};

		$.BitPrime.Sell = {
			NZDInput: $("#sell-crypto__nzd-quantity"),
			CryptoInput: $(".input-text.qty[name='sell-crypto__crypto-quantity']")
		};



		if($('.generate-combined-header').length<1){
			$('header').first().wrap('<div class="generate-combined-header"></div>');
		}


		// BUY
		$.BitPrime.Buy.NZDInput.on("keyup mouseup", function NZDTocurrency(e){
		    var price = $(this).attr("data-product-price");
		    var nzd_amount = $(this).val();

		    var quantity = nzd_amount / price;
		    if(quantity<getMin($.BitPrime.Buy.NZDInput))quantity = getMin($.BitPrime.Buy.NZDInput);
		    quantity = (Math.round(quantity*100000000))/100000000;
			  $.BitPrime.Buy.CryptoInput.val(quantity);

              // validation
				hideValidationMessage($(this).closest('#input-wrapper'), 'below');
                var sign = getCurrencySign(document.title);
                validateMin(this, quantity, sign, $.BitPrime.Buy.NZDInput, minCryptoExceededTemplate);
		});

		$.BitPrime.Buy.CryptoInput.on("keyup mouseup", function currencyToNZD(e){
		    var price = $.BitPrime.Buy.NZDInput.attr("data-product-price");
		    var quantity = $(this).val();
		    if($.BitPrime.Buy.CryptoInput.attr('step')==1){
		    	quantity = Math.ceil(quantity);
		    	$(this).val(quantity);
		    	console.log(quantity);
			}

		    var val = price * quantity;
		    val = val.toFixed(2);
			$.BitPrime.Buy.NZDInput.val(val);

            // validation
			hideValidationMessage(this);
            var sign = getCurrencySign(document.title);
            validateMin(this, quantity, sign, $.BitPrime.Buy.NZDInput, minNZDExceededTemplate);
		});





		$.BitPrime.Buy.CryptoInput.on('invalid', function showError(ev) {
            // NOTE ignoring invalid step size for now, unless there's a custom error
            if(this.validity.customError === false && this.validity.stepMismatch === true) return;
			showValidationMessage(this, {
                message: this.validationMessage,
                classes: 'bp-margin-left-15pct' });
		});

		$.BitPrime.Buy.NZDInput.on('invalid', function showError(ev) {

			showValidationMessage($(this).closest('#input-wrapper'), {
                message: this.validationMessage,
                position: 'below',
                classes: 'bp-margin-left-15pct'
            });

		});

        // Cart List
        // NOTE using event delegation here
        var $cartTabContainer = $('.woocommerce-cart-tab-container');

        $(document).on('wc_fragments_refreshed wc_fragments_loaded', function refreshCartTabInvalidEvents() {
            $cartTabContainer.find('.amount input, .quantity input').off('invalid.cartTab', showCartItemError);
            $cartTabContainer.find('.amount input, .quantity input').on('invalid.cartTab', showCartItemError);
        });

        function showCartItemError() {
            // NOTE ignoring invalid step size for now, unless there's a custom error
            if(this.validity.customError === false && this.validity.stepMismatch === true) return;
            var $NZDInput = $(this).closest('.mini_cart_item').find('.amount input');
            var position = ['below'];
            var isCryptoInput = $(this).is('[title="Qty"]');
            if(isCryptoInput) position.push('right');
			showValidationMessage($NZDInput.closest('.amount'), {
                message: this.validationMessage,
                position: position,
                classes: 'bp-margin-top-1 bp-inline-block'
            });
		}

        $cartTabContainer.on("keyup mouseup", '.amount input', function cartNZDTocurrency(e){

            var $NZDInput = $(this);
            var $CryptoInput = $NZDInput.closest('.mini_cart_item').find('.quantity input');
            var price = $NZDInput.attr("data-product-price");
            var nzd_amount = $NZDInput.val();

            var quantity = nzd_amount / price;
            if(quantity < getMin($NZDInput)){
            	quantity = getMin($NZDInput);
            	if($.BitPrime.Buy.CryptoInput.attr('step')==1){
            		quantity=Math.ceil(quantity);
            	}
            }
            quantity = (Math.round(quantity * 100000000)) / 100000000;
            $CryptoInput.val(quantity);
            // validation
            hideValidationMessage($NZDInput.closest('.amount'), 'below');
            var label = $CryptoInput.closest('.mini_cart_item')
                                    .find('.attachment-shop_thumbnail')
                                    .prop('nextSibling')
                                    .textContent;
            var sign = getCurrencySign(label);
            validateMin(this, quantity, sign, $NZDInput, minNZDExceededTemplate);
        });

        $cartTabContainer.on("keyup mouseup", '.quantity input', function cartCurrencyToNZD(e){

            var $CryptoInput = $(this);
            var $NZDInput = $CryptoInput.closest('.mini_cart_item').find('.amount input');
            var price = $NZDInput.attr("data-product-price");
            var quantity = $CryptoInput.val();

            var val = price * quantity;
            val = val.toFixed(2);
            $NZDInput.val(val);

             // validation
            hideValidationMessage($NZDInput.closest('.amount'), 'below');
            var label = $CryptoInput.closest('.mini_cart_item')
                                    .find('.attachment-shop_thumbnail')
                                    .prop('nextSibling')
                                    .textContent;
            var sign = getCurrencySign(label);
            //console.log([price,quantity,val]);
            validateMin(this, quantity, sign, $NZDInput, minCryptoExceededTemplate);
        });

        function validateMin(el, quantity, sign, $NZDInput, messageTemplate) {
            var val = $NZDInput.val();
            var min_val = $NZDInput.prop("min") || $NZDInput.attr("data-min-val");

            if (parseFloat(val) < parseFloat(min_val)) {

                var minQuantity = getMin($NZDInput);

                quantity = parseFloat(quantity || 0);
                el.setCustomValidity(messageTemplate({
                    quantity: quantity,
                    sign: sign,
                    val: val,
                    minQuantity: minQuantity,
                    min_val: min_val
                }));

            } else {

                el.setCustomValidity("");

            }

            el.checkValidity();
        }

        function minNZDExceededTemplate(x) {
            return "$"+x.val+" ("+x.quantity+" "+x.sign+") is below minimum purchase of $"+x.min_val+" ("+x.minQuantity+" "+x.sign+")";
        }
        function minCryptoExceededTemplate(x) {
            return x.quantity+" "+x.sign+" ($"+x.val+") is below minimum purchase of "+x.minQuantity+" "+x.sign+" ($"+x.min_val+")";
        }

        /**
         * [showValidationMessage description]
         * @param  {[type]} el      [description]
         * @param  {Object} options { position, classes }
         * @return {void}
         */
		function showValidationMessage(el, options) {
            options = options || {};
			var $el = $(el);
            var position = $.isArray(options.position) ? options.position : [options.position];
            options.position = position;
			var $toolTip;
			if(position.indexOf('below') > -1) {
			    $toolTip = $el.next('[data-validation-tooltip]');
		    } else {
			    $toolTip = $el.prev('[data-validation-tooltip]');
			}
			if(!$toolTip.length) {

				$toolTip = createValidationTooltip(options);

                if(position.indexOf('below') > -1) {
                    $el.after($toolTip);
                } else {
                    $el.before($toolTip);
                }

			}

            $toolTip.toggleClass('bp-validation-tooltip--right', position.indexOf('right') > -1);

			$toolTip.text(options.message);

			$toolTip.removeClass('hidden');

		}

		function hideValidationMessage(el, position) {

			var $el = $(el);

            var $toolTip;
            if('below' == position) {
			    $toolTip = $el.next('[data-validation-tooltip]');
		    } else {
			    $toolTip = $el.prev('[data-validation-tooltip]');
			}

			if($toolTip.length) $toolTip.addClass('hidden');

		}


        /**
         * [createValidationTooltip description]
         * @param  {Object} options { position, classes }
         * @return {jQuery}         [description]
         */
		function createValidationTooltip(options) {
            var position = options.position;
			var $toolTip = $('<p class="bp-validation-tooltip clear-both" data-validation-tooltip></p>');
            if(position.indexOf('below') > -1) $toolTip.addClass('bp-validation-tooltip--below');
            if(options.classes) $toolTip.addClass(options.classes);
            return $toolTip;
		}



		function getCurrencySign(src) {

			var signRegex = /\S*\s\((\S*)\)/;

			var matches = src.match(signRegex);

			if(matches && matches[1])return matches[1] || '';
			return '';
		}

		$.BitPrime.Buy.CryptoInput.on("blur", function forceNZDMin(){
			setMin($.BitPrime.Buy.NZDInput, $.BitPrime.Buy.CryptoInput);
			hideValidationMessage(this);
		});

		$.BitPrime.Buy.NZDInput.on("blur", function forceCryptoMin(){
			setMin($.BitPrime.Buy.NZDInput, $.BitPrime.Buy.CryptoInput);
			hideValidationMessage($(this).closest('#input-wrapper'), 'below');
		});

        $cartTabContainer.on("blur", '.amount input', function forceCartNZDMin() {
            var $NZDInput = $(this);
            var $CryptoInput = $NZDInput.closest('.mini_cart_item').find('.quantity input');
            setMin($NZDInput, $CryptoInput);
            hideValidationMessage($NZDInput.closest('.amount'), 'below');
        });
        $cartTabContainer.on("blur", '.quantity input', function forceCartCryptoMin() {
            var $CryptoInput = $(this);
            var $NZDInput = $CryptoInput.closest('.mini_cart_item').find('.amount input');
            setMin($NZDInput, $CryptoInput);
            hideValidationMessage($NZDInput.closest('.amount'), 'below');
        });



		$( document ).ready(function initMin() {

			//Buy Crypto
			var min_val_buy = $.BitPrime.Buy.NZDInput.attr("data-min-val");
		    var quantity = getMin($.BitPrime.Buy.NZDInput);
		    if($.BitPrime.Buy.NZDInput.length>0) {	/*  && $.BitPrime.Buy.CryptoInput.attr('step')!=1 */
				$.BitPrime.Buy.CryptoInput.val(quantity).trigger('keyup');
			}
		    if(min_val_buy) {
				$.BitPrime.Buy.NZDInput.val(min_val_buy);
			}

		});


		function setMin(nzd_input, crypto_input){
			var min_val = nzd_input.prop("min") || nzd_input.attr("data-min-val");
			var nzd_amount = nzd_input.val();
			var quantity = crypto_input.val();
			if(crypto_input.attr('step')!==1){
				if(parseInt(nzd_amount) < parseInt(min_val)){
				   quantity = getMin(nzd_input);
				   crypto_input.val(quantity);
			       nzd_input.val(min_val);
				}
			}
		}

		function getMin(nzd_input){
		    var price = nzd_input.attr("data-product-price");
		    var min_val = nzd_input.prop("min") || nzd_input.attr("data-min-val");
		    if(!min_val || min_val==1){
		    	nzd_input.attr("data-min-val",price);
		    	return 1;
		    }
		    var amt = 1/(price/min_val);
		    amt = (Math.round(amt*100000000))/100000000;
		    return amt;
		}


		var alert = $('p.woocommerce-store-notice').clone(true);
		$('p.woocommerce-store-notice').remove();
		$('body').prepend(alert);
		
	});
});


