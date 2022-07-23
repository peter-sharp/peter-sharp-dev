( function( $ ) {
    if (!$.WM){ $.WM = {}; }


    $.WM.loadBuyFunctions = function(coin){
        let $buy_receive = $('.js__receive');
        $buy_receive.data('receive', coin.buy_price);
        let $buy_abbrev = $('.js__buy-receive--abbreviation');
        $buy_abbrev.find('span').text(coin.sku);
        let $buy_image = $('.js__buy-receive--image');
        $buy_image.html('<img src="' + coin.logo + '" />');

        if($('input.js__buy-amount-fiat').val().length > 0) {
        	var val = $('input.js__buy-amount-fiat').val() / $buy_receive.data('receive');
        	if(val < coin.min_quantity){
        		val=coin.min_quantity*1;
        		$('input.js__buy-amount-fiat').val((val*coin.buy_price).toFixed(2));
        	}
            $buy_receive.val(val.toFixed(8));
        }
    };

    $.WM.loadSellFunctions = function(coin){
        let $sell_amount = $('.js__sell-coin');
        $sell_amount.data('sell', coin.sell_price);
        let $sell_abbrev = $('.js__sell--abbreviation');
        $sell_abbrev.find('span').text(coin.sku);
        let $sell_image = $('.js__sell-receive--image'); //
        $sell_image.html('<img src="' + coin.logo + '" />'); //

        if($sell_amount.val().length > 0) {
            $('.js__receive-amount-fiat').val($sell_amount.val() * $sell_amount.data('sell'));
        }
    };

    $(document).ready(function(){
        $(".js__buy-coins--ajax").select2({
            /* ajax: {
                url: front_desk.coin_json,
                dataType: 'json',
                data: function (params) {
                    return {
                    	search: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.results,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            }, */
        	data: allcoins.results,
            placeholder: 'Select a coin',
            templateResult: formatBuy,
            templateSelection: formatBuySelection,
            width: "100%",
            matcher: matchCustom
        }).on('select2:select',function(e){
        	$(".js__sell-coins--ajax").val(e.params.data.id).trigger('change');
        });

        $(".js__sell-coins--ajax").select2({
            /*ajax: {
                url: front_desk.coin_json,
                dataType: 'json',
                data: function (params) {
                    return {
                    	search: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.results,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },*/
        	data: allcoins.results,
            placeholder: 'Select a coin',
            templateResult: formatSell,
            templateSelection: formatSellSelection,
            width: "100%",
            matcher: matchCustom
        }).on('select2:select',function(e){
        	$(".js__buy-coins--ajax").val(e.params.data.id).trigger('change');
        });
        
        function matchCustom(params, data) {
            if ($.trim(params.term) === '') {
              return data;
            }
            if (typeof data.name === 'undefined') {
              return null;
            }
            if (data.prename.toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
              var modifiedData = $.extend({}, data, true);
              return modifiedData;
            }
            return null;
        }


        function formatBuy (coin) {
            if (coin.loading) {
                return coin.text;
            }
            var $container = $(
                "<div class='select2-result-coin clearfix'>" +
                "<div class='select2-result-coin__image'><img src='" + coin.logo + "' /></div>" +
                "<div class='select2-result-coin__meta'>" +
                "<div class='select2-result-coin__title'></div>" +
                "<div class='select2-result-coin__abbreviation'></div>" +
                "</div>" +
                "</div>"
            );

            $container.find(".select2-result-coin__title").text(coin.name);
            $container.find(".select2-result-coin__abbreviation").text('('+coin.sku+')');
            return $container;
        }
        function formatSell (coin) {
        	if(!coin.can_sell)return false;
            if (coin.loading) {
                return coin.text;
            }
            var $container = $(
                "<div class='select2-result-coin clearfix'>" +
                "<div class='select2-result-coin__image'><img src='" + coin.logo + "' /></div>" +
                "<div class='select2-result-coin__meta'>" +
                "<div class='select2-result-coin__title'></div>" +
                "<div class='select2-result-coin__abbreviation'></div>" +
                "</div>" +
                "</div>"
            );

            $container.find(".select2-result-coin__title").text(coin.name);
            $container.find(".select2-result-coin__abbreviation").text('('+coin.sku+')');
            return $container;
        }

        function formatBuySelection (coin) {
            if (typeof(coin.logo) !== "undefined") {
                var $container = $(
                    "<div class='select2-result-coin clearfix'>" +
                    "<div class='select2-result-coin__image'><img src='" + coin.logo + "' /></div>" +
                    "<div class='select2-result-coin__meta'>" +
                    "<div class='select2-result-coin__title'></div>" +
                    "<div class='select2-result-coin__abbreviation'></div>" +
                    "<div class='select2-result-coin__full_price'></div>" +
                    "</div>" +
                    "</div>"
                );
                $container.find(".select2-result-coin__title").text(coin.name);
                $container.find(".select2-result-coin__abbreviation").text('('+coin.sku+')');
                $container.find(".select2-result-coin__full_price").text('$'+new Intl.NumberFormat().format(coin.buy_price));

                $.WM.loadBuyFunctions(coin);

                return $container;
            }
            return coin.text;
        }

        function formatSellSelection (coin) {
            if (typeof (coin.logo) !== "undefined") {
                var $container = $(
                    "<div class='select2-result-coin clearfix'>" +
                    "<div class='select2-result-coin__image'><img src='" + coin.logo + "' /></div>" +
                    "<div class='select2-result-coin__meta'>" +
                    "<div class='select2-result-coin__title'></div>" +
                    "<div class='select2-result-coin__abbreviation'></div>" +
                    "<div class='select2-result-coin__full_price'></div>" +
                    "</div>" +
                    "</div>"
                );
                $container.find(".select2-result-coin__title").text(coin.name);
                $container.find(".select2-result-coin__abbreviation").text('(' + coin.sku + ')');
                $container.find(".select2-result-coin__full_price").text('$' + new Intl.NumberFormat().format(coin.sell_price));

                $.WM.loadSellFunctions(coin);

                return $container;
            }
        }

        $('input.js__buy-amount-fiat').on('input', function(){
            if ($('.js__receive').data('receive') > 0) {
            	var val = $('input.js__buy-amount-fiat').val() /  $('.js__receive').data('receive');
                $('.js__receive').val(val.toFixed(8));
            }
        });

        $('input.js__sell-coin').on('input', function(){
            if ($('.js__sell-coin').data('sell') > 0) {
                $('.js__receive-amount-fiat').val($('input.js__sell-coin').val() *  $('.js__sell-coin').data('sell'));
            }
        });

        $('input.front-desk--btn.action-buy').one('click', buyit );
        		
        function buyit(e){
        	e.preventDefault();
        	jQuery(this).addClass('loading');
        	var data = {
	          'product_id': $('#front-desk__buy-coin').val(),
	          'quantity': $('#front-desk__buy-coin--receive').val()
	        };
        	
        	var alerts = false;
        	var min=0;
        	if(data.quantity>0){
        		$.each(allcoins.results,function(index,coin){
        			if(coin.id == data.product_id){
        				if((1*data.quantity).toFixed(8)*1<(1*coin.min_quantity).toFixed(8)*1){
        					alerts=true;
        					min=(1*coin.min_quantity).toFixed(8);
        				}
        			}
        		});
        	}
        	if(alerts){
        		alert("The minimum purchase quantity for this coin is "+min+" - Please try again.");
        		$('input.front-desk--btn.action-buy').one('click', buyit );
        		return;
        	}
        	
        	if(!$('body').hasClass('logged-in')){
        		//switch to login pane
        		console.log('loginPlease buy');              
                loginPlease(data);               
        	}
        	
        	//console.log(data);
        	jQuery.ajax({
                type: 'POST',
                url: woocommerce_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart'),
                data: data,
                success: function (response) {
                	if($('body').hasClass('logged-in')){
	        			//redirect to all-coins page
	                    document.location.href="/all-coins/?missing_info";
                	}
                },
            });
        }
        
        $('input.front-desk--btn.action-sell').one('click',function(e){      	
        	e.preventDefault();
        	
        	if($('body').hasClass('logged-in')){  
	        	$.confirm({
	                theme: 'modern',
	                title: '<strong>Transaction Limit Validation</strong>',
	                buttons: {
	                    confirm: function () {
	                        sellCoinOrder = true;
	                        $('#order_form.sell__form').submit();
	                    },
	                    ok: function () {
	                    	document.location.reload();
	                    },
	                    cancel: function () {
	
	                    },
	                },
	                content: function(){
	                    var self = this;
	                    // self.setContent('Checking callback flow');
	                    return $.ajax({
	                        url : customSell.ajax_url,
	                        type : 'post',
	                        dataType: 'json',
	                        data : {
	                            action : 'validateSellTransactionAction',
	                            sellCoinNonce: customSell.sellCoinNonce,
	                            product_id : $('#front-desk__buy-coin').val(),
	                            quantity : $('#front-desk__buy-coin--sell').val(),
	                        },
	                    }).done(function (response) {
	                        self.setTitle(response.title);
	                        self.setContent(response.content);
	                        if(response.validated && response.validated === true){
	                            self.buttons.ok.show();
	                            self.buttons.confirm.hide();
	                        }else{
	                            self.buttons.confirm.show();
	                            self.buttons.ok.hide();
	                        }
	
	                    }).fail(function(response){
	
	                    }).always(function(){
	
	                    });
	                },
	                useBootstrap: false,
	            });
            }
            else{
            	//switch to login pane
        		console.log('login please');
        		loginPlease();
            }
	        });
        
        function loginPlease(data){
            //data is a json array of product_id: val, quantity: val
            var jloginform = $($('#bphh_login_form')[0].content.firstElementChild.cloneNode(true));           
            if(data !== undefined){
                var pre = jloginform.find('form').attr('action');
                jloginform.find('form').attr('action',pre+"%26quantity="+data.quantity+"%26product_id="+data.product_id);
            }
            var $frontDesk = $('.front-desk-container');
        	$frontDesk.empty();
        	$frontDesk.append(jloginform);
            
        }
    });
} )( jQuery );