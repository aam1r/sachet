require 'rubygems'
require 'sinatra'
require 'yaml'
require 'tempfile'
require 'zipruby'
require './lib/vim_downloadable'

CONFIGURATION = YAML.load_file('data/configuration.yaml')
THEMES = YAML.load_file('data/themes.yaml')
PLUGINS = YAML.load_file('data/plugins.yaml')

get '/' do
  erb :index, :locals => {:configuration => CONFIGURATION,
                          :themes => THEMES,
                          :plugins => PLUGINS}
end

post '/download' do
  options = CONFIGURATION + THEMES + PLUGINS

  # mark selected theme
  params[params['step2']] = 'on'
  params.delete('step2')

  # generate vim.rc
  vim = VimDownloadable.new(options)
  vim.process_params(params)

  # serve zip file
  send_file vim.serve_package, :type => 'application/zip',
                               :disposition => 'attachment',
                               :filename => 'sachet.zip'

  vim.cleanup
end
