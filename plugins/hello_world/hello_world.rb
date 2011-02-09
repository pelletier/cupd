# Hello_world server example for Cupd

require 'rubygems'
require 'json'
require './web_socket.rb'


puts("Hello world Cupd server example")

puts("Please enter IP address of the Cupd Websocket server: ")
ip = gets.chomp

client = WebSocket.new("ws://#{ip}:8001/")

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
     :data => { :text => start_time.strftime("%Y-%m-%d %H:%M:%S") }
  }

  jsonified = update_message.to_json

  client.send(jsonified)
  
  puts(">>> #{jsonified}")

  total_time = Time.now - start_time
  sleep(1.0 - total_time)
end
