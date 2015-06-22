var app = {}

var message = {
    username: 'shawndrost',
    text: 'trololo',
    roomname: '4chan'};

app.init = function(){

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
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to recieve message');
    }
    })
}
