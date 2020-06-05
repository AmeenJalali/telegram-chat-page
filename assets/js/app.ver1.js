/*
    Developer: Ameen Jalali (jalali.ameen@gmail.com)
    - This app is using localStorage to store the messages
*/

(function($){
    "use strict";

    // variables
    var body = $('body'),
    chatHeader = $('#chat-header'),
    sendMessageButton = $('button.send'),
    messageWrapper = $('#messages-wrapper'),
    messageInput = $('#message'),
    overlay = $('#overlay'),
    myMessages = [],
    otherMessgaes = [];


    // document is ready
    $(function(){


        // load and render old messages from local storage
        loadAndRenderOldMessages();


        // scroll to bottom of the messages wrapper
        scrollMessagesWrapper();


        // open profile modal when clicked on header
        chatHeader.on("click", function(){
            showOverlay();
            openModal('profile');
            return false;
        })


        // close modals with close button
        $('.modal').each(function(){
            var thiz = $(this);
            thiz.find('button.close').on('click', function(){
                closeModal(thiz.attr('id'));
                hideOverlay();
                false;
            })
        })


        // close all modals when clicked on overlay
        body.on('click', function(event) {
            if ($(event.target).attr('id') === 'overlay') {
                closeAllModalsAndHideOverlay();
                return false;
            }
        });


        // close all modals when escape button pressed
        body.on('keyup', function(event){
            if (event.key === "Escape") { 
                closeAllModalsAndHideOverlay();
                return false;
            }
        });


        // send message when send button clicked
        sendMessageButton.on("click", function(){
            var message = messageInput.val();
            if (messageIsValid(message)) {
                sendMessage(message, true);
                messageSuccessfullySent();
                return false;
            }
        });


        // send message when enter pressed
        messageInput.keypress(function(event){
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode === 13) {
                var message = $(this).val();
                if (messageIsValid(message)) {
                    sendMessage(message, true);
                    messageSuccessfullySent();
                    return false;
                }
            }
        });


    });

    
    function loadAndRenderOldMessages() {
        myMessages = localStorage.getItem('my-messages') ? JSON.parse(localStorage.getItem('my-messages')) : [];
        otherMessgaes = localStorage.getItem('other-messages') ? JSON.parse(localStorage.getItem('other-messages')) : [];
        
        // retrive all old message data and merge them
        var allOldMessages = myMessages.concat(otherMessgaes);

        // sort the messages based on date time
        allOldMessages = arraySortBasedOnDate(allOldMessages);

        renderAllOldMessages(allOldMessages);
    }

    // render all old messages (after refreshing the page)
    function renderAllOldMessages(oldMessages) {
        oldMessages.forEach(message => {
            renderMessage(message.message, message.isMine);
        });
    }


    // sort arrays based on their date
    function arraySortBasedOnDate(array) {
        return array.sort(function(a, b) {
                var c = new Date(a.date);
                var d = new Date(b.date);
                return c - d;
            });
    }


    function messageSuccessfullySent() {
        messageInput.val(""); // clear the message text input
        autoResponse();
        scrollMessagesWrapper();
    }


    // auto response message to client, it sents a message to client after 2 seconds
    function autoResponse() {
        setTimeout(function(){
            var message = 'We appreciate you contacting us. One of our colleagues will get back in touch with you soon! <p>Have a great day!🤩</p>';
            sendMessage(message, false);
            scrollMessagesWrapper();
        }, 2000);
    }


    // close all modals and hide the overlay
    function closeAllModalsAndHideOverlay() {
        $('.modal').each(function(){
            closeModal($(this).attr('id'));
        })
        hideOverlay();
    }


    function showOverlay() {
        overlay.fadeIn(200);
    }


    function hideOverlay() {
        overlay.fadeOut(200);
    }


    function openModal(modalId) {
        modalId = '#' + modalId;
        $(modalId).fadeIn(200);
    }


    function closeModal(modalId) {
        modalId = '#' + modalId;
        $(modalId).fadeOut(200);
    }


    // check message length to validatation, empty messages are not valid
    function messageIsValid(message) {
        if (message.trim().length === 0)
            return false;
        return true;
    }


    /*
        Send message core function
        message = (string) the message we want to store and show
        isMine = (boolean) when the client send a message, it's true, otherwise, it's false
    */
    function sendMessage(message, isMine = false) {
        renderMessage(message, isMine);
        if (isMine) {
            myMessages.push({
                "date": new Date(),
                "message": message,
                "isMine": true
            });
            localStorage.setItem('my-messages', JSON.stringify(myMessages));
        } else {
            otherMessgaes.push({
                "date": new Date(),
                "message": message,
                "isMine": false
            });
            localStorage.setItem('other-messages', JSON.stringify(otherMessgaes));
        }
    }


    // render the messages
    function renderMessage(message, isMine) {
        messageWrapper.append('<div class="message' + (isMine ? ' mine ' : ' ') + 'wrap">' + message + '</div>');
    }


    // scroll to bottom of messages wrapper
    function scrollMessagesWrapper() {
        messageWrapper.scrollTop(messageWrapper.prop('scrollHeight'));
    }


})(jQuery);