var app = {}
app.friends = {};
app.rooms = {};

app.init = function(){
  // Event handlers
  $(document).ready(function(){
    //Add room
    $('#addRoom').on("submit", function(e){
      debugger

      e.preventDefault()
      var roomname = $("#addRoomName").val()
      app.addRoom(roomname)
    })
    // Rooms dropdown event handler
    $('#roomSelect').on('change', function(){
        app.clearMessages();
        app.fetch('https://api.parse.com/1/classes/chatterbox', true);
    });
    // Submit new message handler
    $("#send").on('submit', function(e){
      // debugger;
      e.preventDefault();
      var message = {}
      var text = $("#message").val();
      message.text = text;
      message.username = window.location.search.match(/username=(.*)/)[1] //finds username?
      message.roomname = $("#roomSelect").val()

      // May want to check for the form just in case some null data is entered
      // app.addMessage(message);
      app.send(message);
      app.clearMessages();
      app.fetch('https://api.parse.com/1/classes/chatterbox');
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

app.fetch = function(fetchUrl, roomChange) {
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
      if (roomChange) {
        var currentRoom = $("#roomSelect").val(); //check current room
        if (currentRoom !== "main"){
          var $message = $(".message")
          for (var i = 0; i < $message.length; i++){
            if ($($message[i]).attr("room") !== currentRoom){
              $($message[i]).remove()
            }
          }
        }
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
  message.roomname = message.roomname || 'main';

  // Check for if it's in the room or not
  if(!(message.roomname in app.rooms)){
    //if its in room, switch to room
    app.addRoom(message.roomname);
  }

  // Creates node and fills in values
  var currentNode = $('#chats').append('<div class="message"><span class="username"></span><span class="txt"></span></div>');
  currentNode = currentNode.children().last();
  currentNode.find('span.username').text(message.username);
  currentNode.find('span.txt').text(" : " + message.text);
  currentNode.attr('room', message.roomname);

 // If the message is made by a friend, then autobold
  if (message.username in app.friends) {
    currentNode.find('span.username').addClass('friend');
  }
}

app.addRoom = function(room){
  if (!(room in app.rooms)){
    $('#roomSelect').append('<option value='+room+'>' + room + '</option>');
    app.rooms[room] = 1;
  }
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

