var app = {}
app.friends = [];

app.init = function(){
  $("#main").on('click', '.username', function(){
    app.addFriend($(this).text());
  })
  $("#send").on('click', '.submit', function(){
    debugger;
    var message = {}
    var text = $("#message").val();
    message.text = text;
    message.username = window.location.search.match(/username=(.*)/)[1] //finds username?
    app.addMessage(message);
    app.send(message)
  });

  app.fetch('https://api.parse.com/1/classes/chatterbox');

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
  message = message || {};
  if (message.username === undefined && message.text === undefined) {
    return
  }
  message.username = message.username || "undefined";
  message.text = message.text || "";

  // $('#chats').append('<div class="message">'
  //   + "<span class=username>"
  //   + message.username + "</span>"
  //   + " : " + message.text
  //   + '</div>');
  var current = $('#chats').append('<div class="message"><span class="username"></span><span class="txt"></span></div>');
  current = current.children().last();
  current.find('span.username').text(message.username + " : ");
  current.find('span.txt').text(message.text);
}

app.addRoom = function(room){
  $('#roomSelect').append('<div>' + JSON.stringify(room) + '</div>');
}

app.addFriend = function(username){
  app.friends.push(username);
}

app.handleSubmit = function(message) {
  app.addMessage(message);
}

app.init()
