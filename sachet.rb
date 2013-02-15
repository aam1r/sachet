require 'sinatra'
require 'yaml'

CONFIGURATION = YAML.load_file('data/configuration.yaml')
THEMES = YAML.load_file('data/themes.yaml')

get '/' do
  erb :index, :locals => {:configuration => CONFIGURATION, :themes => THEMES}
end

post '/download' do
  result = []

  # merge all data files and construct a key-value mapping
  options = CONFIGURATION + THEMES
  options_mapping = options.group_by{|config| config['id']}

  # for each selected parameter, add the appropriate line into the generated
  # vim.rc file
  params.each do |param|
    key = param.first

    # append the vim config syntax
    if options_mapping.has_key?(key)
      config = options_mapping[key].first
      syntax = config['syntax']

      # replace tag with actual value
      if config['input_type'] and config['tag']
        syntax[config['tag']] = params[key]
      end

      result << syntax
    end
  end

  result.join('<br>')
end
