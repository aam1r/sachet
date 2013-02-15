require 'sinatra'
require 'yaml'

CONFIGURATION = YAML.load_file('data/configuration.yaml')

get '/' do
  erb :index, :locals => {:configuration => CONFIGURATION}
end

post '/download' do
  result = []
  configuration_mapping = CONFIGURATION.group_by{|config| config['id']}

  params.each do |param|
    key = param.first

    # append the vim config syntax
    if configuration_mapping.has_key?(key)
      result << configuration_mapping[key][0]['syntax']
    end
  end

  result.join('<br>')
end
