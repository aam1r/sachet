require 'sinatra'
require 'yaml'

get '/' do
  configuration = YAML.load_file('data/configuration.yaml')
  puts configuration.inspect

  erb :index, :locals => {:configuration => configuration}
end
