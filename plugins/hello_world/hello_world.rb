# Hello_world server example for Cupd

require 'rubygems'
require 'json'
require 'web_socket'


puts("Hello world Cupd server example")

client = WebSocket.new("ws://192.168.0.42:8001/")

uid = nil

Thread.new() do
  while data = client.receive()
    puts("<<< #{data}")
    data = JSON.parse(data)

    if data['type'] == 'welcome'
      uid = data['uid']

      auth_message = {
        :uid => uid,
        :type => 'auth',
        :name => 'hello_world'
      }

      client.send(auth_message.to_json)

      puts(">>> #{auth_message.to_json}")
    end
  end
end

while true do
  start_time = Time.now

  update_message = {
    :uid => uid,
    :type => 'data',
    :data => { :text => "I love you!" }
  }

  jsonified = update_message.to_json

  client.send(jsonified)
  
  puts(">>> #{jsonified}")

  total_time = Time.now - start_time
  sleep(5.0 - total_time)
end
