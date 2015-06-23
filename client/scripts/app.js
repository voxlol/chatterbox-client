var app = {}
app.friends = {};

app.init = function(){
  // Event handlers
  $(document).ready(function(){
    // Submit new message handler
    $("#send").on('submit', function(){
      var message = {}
      var text = $("#message").val();
      message.text = text;
      message.username = window.location.search.match(/username=(.*)/)[1] //finds username?

      // May want to check for the form just in case some null data is entered
      app.addMessage(message);
      app.send(message)
    });

    // Add friend handler
    $("#main").on('click', '.username', function(){
      // debugger;
      var username = $(this).text()
      var usernamez = $(".username")

      if(app.addFriend(username)){

        for (var i = 0; i < usernamez.length; i++) {
          if ($(usernamez[i]).text() === username) {
            $(usernamez[i]).addClass("friend")
          }
        }
      }else{
        // remove friend
        for (var i = 0; i < usernamez.length; i++) {
          if ($(usernamez[i]).text() === username) {
            $(usernamez[i]).removeClass("friend")
          }
        }
        // remove a render
        $("#"+username).remove();

        delete app.friends[username];
      }


    })

    // Clear message button handler
    $('#clear').on('submit', function(e){
      e.preventDefault();
      app.clearMessages();
    });

    // Fetch new message handler
    $('#fetch').on('submit', function(e){
      e.preventDefault();
      app.clearMessages();
      app.fetch('https://api.parse.com/1/classes/chatterbox');
    });
  })

  // Initial fetch
  app.fetch('https://api.parse.com/1/classes/chatterbox');

  // Populate room list

  // Clicking on rooms will only show messages in that room

  // Clicking on friends will display friends in the friendlist
    // Add to their username class "friend" which will auto-bold
}

app.send = function(message){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.fetch = function(fetchUrl) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // url: 'https://api.parse.com/1/classes/chatterbox',
    url : fetchUrl,
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      console.log(data);
      // Iterate through each data object and display it
      for(var i = 0; i < data.results.length; i++){
        app.addMessage(data.results[i]);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to recieve message');
    }
  })
}

app.clearMessages = function(){
  $('#chats').html('');
}

app.addMessage = function(message){
  // debugger;
  message = message || {};
  if (message.username === undefined && message.text === undefined)
    return
  message.username = message.username || "undefined";
  message.text = message.text || "";

  // Creates node and fills in values
  var currentNode = $('#chats').append('<div class="message"><span class="username"></span><span class="txt"></span></div>');
  currentNode = currentNode.children().last();
  currentNode.find('span.username').text(message.username);
  currentNode.find('span.txt').text(" : " + message.text);

  // For roomnames
  if(message.roomname)
    currentNode.attr('room', message.roomname);
  else
    currentNode.attr('room', 'default');
}

app.addRoom = function(room){
  $('#roomSelect').append('<div>' + JSON.stringify(room) + '</div>');
}

app.addFriend = function(username){
  // Adds friends to the internal javascript friend array
  var status = false
  // render it nowf
  var addElement = "<li id="+username+">" + username + " </li>"
  if (!app.friends[username]) {
    $("#friends").append(addElement)
    status = true
  }
    // Find the UL with friends (id = #friends)
      // Append an LI tag to the friends
  app.friends[username] = true;
  return status;
}

app.handleSubmit = function(message) {
  app.addMessage(message);
}

app.init()

