require 'sinatra'
require 'yaml'
require 'tempfile'
require 'zipruby'
require './lib/vim_downloadable'

CONFIGURATION = YAML.load_file('data/configuration.yaml')
THEMES = YAML.load_file('data/themes.yaml')

get '/' do
  erb :index, :locals => {:configuration => CONFIGURATION, :themes => THEMES}
end

post '/download' do
  options = CONFIGURATION + THEMES

  # generate vim.rc
  vim = VimDownloadable.new(options)
  vim.process_params(params)

  # serve zip file
  send_file vim.serve_package, :type => 'application/zip',
                               :disposition => 'attachment',
                               :filename => 'sachet.zip'

  vim.cleanup
end
