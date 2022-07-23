/**
 * Handles document title blinking when message received
 */
var _agile_title_blinker = {

	// Global variables for blink the window with the clickdesk status
	timer : "",

	// Stores original title of document
	original_title : document.title,

	/**
	 * Triggers blinking action of title
	 * 
	 * @param message -
	 *            chat message
	 * @param count -
	 *            no of times to blink
	 */
	trigger : function(message, count) {

		message = (typeof message == "object" && message.file_url) ? "File Received - "
				+ message.file_name
				: message;

		message = this.parse_message(message);

		this.blink(count, message, true);

	},

	/**
	 * Clears blinking action timer and resets the title
	 */
	reset : function() {

		document.title = _agile_title_blinker.original_title;

		if (_agile_title_blinker.timer)
			clearTimeout(_agile_title_blinker.timer);

		// Open call window
		// ClickDesk_Call.focus_window();

	},

	/**
	 * Blinks the title of document
	 * 
	 * @param count -
	 *            no of times
	 * @param message -
	 *            chat message
	 * @param blink -
	 *            flag to blink
	 */
	blink : function(count, message, blink) {

		if (blink) {
			document.title = message;
		} else {
			document.title = this.original_title;
			count-- // decrement the number of times left to blink
			clearTimeout(this.timer);
		}

		if (count > 0) {
			this.timer = setTimeout("_agile_title_blinker.blink(" + count
					+ ", '" + message + "', " + !blink + ")", 800);
		}

	},

	/**
	 * Parses message with unwanted message deletion
	 */
	parse_message : function(message) {

		try {
			if (message.indexOf("[Agent is inviting") != -1
					|| message.indexOf("[Agent is co-browsing") != -1) {

				var message_sub_string = message.substring(
						message.indexOf("["), message.indexOf("]") + 1);

				message = (!message_sub_string) ? message : message_sub_string;
			}
		} catch (e) {
		}

		return message;

	}
};

/**
 * Attach Events to reset blinking on tab focus
 */
 window.onfocus = _agile_title_blinker.reset;/**
 * Agile Livechat API 
 */
var _Agile_lc = {

	parentClassName : "_agile-lc-parent",
	parentId : "_agile_parent_container",
	frameCSS : "background: none;border: 0px;bottom: 0px;float: none;height: 100%;left: 0px;margin: 0px;padding: 0px;position: absolute;right: 0px;top: 0px;width: 100%;",
	frameParentCSS : "background-color: transparent;border: 0px;bottom: 0px;max-height: 100%;overflow: hidden;position: fixed;right: 10px;visibility: visible;z-index: 2147483639;left: auto;opacity: 1;",

    alreadyExists : function(){
        if(document.getElementById(this.parentId))
              return true;
      
        return false;
    },

    start : function() {
         if(this.alreadyExists())
              return;
          
         // Create a div with iframe URL
         this.buildFrameElement();

         // Listener for getting messsages from other origin
         this.addPostMessageEvent();
    },

    getFrameURL : function(){
    	// Construct frame URL with domain and with APIKey
    	if(!agile_id.id)
    		  return;

    	return this.getAgileHostURL() + "/livechat/session?k=" + agile_id.id;
    },

    getAgileHostURL : function() {
    	if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    		return "http://localhost:8888";
    	else if(agile_id.version) {

            var appName = "agile-crm-cloud";
            if(agile_id.beta)            
                appName = "agilecrmbeta";

            return "https://" + agile_id.namespace + "-dot-" + agile_id.version + "-dot-" + appName + ".appspot.com";
        }
    		
    	else
    		return "https://" + agile_id.namespace + ".agilecrm.com";
    },

    buildFrameElement : function() {
    	// Create a div with iframe source
    	var agile_lc_div = document.createElement('div');
    	agile_lc_div.className = this.parentClassName;
    	agile_lc_div.id = this.parentId;

    	// Add it to the document body
		document.body.appendChild(agile_lc_div);
        document.getElementById(this.parentId).setAttribute("style", this.frameParentCSS);

		// Create a iframe src
		var link = this.getFrameURL();
		if(!link)
			return;

		// Create iframe with the source link
		var iframe = document.createElement('iframe');
		iframe.frameBorder=0;
		iframe.width = "100%";
		iframe.height = "100%";
		iframe.id = this.parentId + "_frame";
		iframe.className = this.parentClassName + "_frame";
        iframe.setAttribute("style", this.frameCSS);
		iframe.setAttribute("src", link);
		document.getElementById(this.parentId).appendChild(iframe);

    },

    addPostMessageEvent : function() {
		// listen to message back
		window.addEventListener('message', function(event) {
			console.log('received response: ', event);
			_Agile_lc.handleEventAndProcessAction(event.data);
		}, false);
    },


    handleEventAndProcessAction: function(eventData) {
    	try{eventData = JSON.parse(eventData);}catch(e){}
    	if(eventData.fromHost != "agilecrm.com")
    		  return;
            
        var action = eventData.action;
        if(action == "blink") {
            _agile_title_blinker.trigger(eventData.message, 20);
            return;
        }
		
		if( action == 'blink_reset' )
		{
			_agile_title_blinker.reset();
			return;
		}

        if( action == 'get_visitor_email' )
        {
            var callback = eventData.message.callback || null;
            _agile.get_email({
                success : function(data){
                    // Send message to child dom with callback and email
                    var childData = {};

                    childData.action = "get_visitor_email";
                    childData.email = data.email;
                    childData.callback = callback;

                    _Agile_lc.postMessageToAgileFrame(childData.action, childData);
                }, error : function(data) {

                }
            });
            return;
        }

        if( action == 'set_visitor_email' )
        {
            if( eventData && eventData.message && eventData.message.email )
                    _agile.set_email(eventData.message.email);

            return;
        }

    	var $parent = document.getElementById(this.parentId);
        console.log($parent);
        //var $input = ($parent).closest("form").find("input");
              
        //if($input.hasClass("agile-prechat-form-field"))

        //$("._agile_lc_widget_message").removeAttr('disabled');
        //$("._agile_lc_widget_message").attr("placeholder", "Please enter your Query");

    	$parent.style.visibility = "visible";

    	if(eventData.action == "minimize") {
    		$parent.style.height = "108.25px";
    		$parent.style.width = "108.25px";
    	}
    	else if(eventData.action == "maximize") {
    		$parent.style.height = "100%";
    		$parent.style.width = "400px";
    	}

        this.postMessageToAgileFrame(eventData.action);
    },

    postMessageToAgileFrame : function(action, message) {
        var json = {};
        json.action = action;
        json.message = message;

        // Send message to child
        var iframe = document.getElementById(this.parentId + "_frame").contentWindow;
        iframe.postMessage(json, "*");
    },
};

// Initilize start function
(function() {
	_Agile_lc.start();
})();

