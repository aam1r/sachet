#!/usr/bin/ruby

# Upon execution, this script downloads each theme/plugin in the data files to
# ensure that sachet delivers up-to-date packages. Ideally, this script should
# run once every 24 hours and should only re-fetch a repository if it has been
# updated.

require 'yaml'

def repository_name(git_url)
  last_chunk = git_url.split('/').last
  last_chunk['.git'] = ''

  last_chunk
end

THEMES = YAML.load_file('data/themes.yaml')

options = THEMES
options.each do |option|
  if option['url']
    repo_name = repository_name(option['url'])
    git_cmd = ''

    if File.directory?('repos/' + repo_name)
      # if folder exists already, do 'git pull'
      puts "do git pull for " + repo_name
      git_cmd = %x[cd repos/#{repo_name}; git pull]
    else
      # clone the repo since it doesn't exist yet
      puts "cloning " + repo_name
      git_cmd = %x[cd repos; git clone #{option['url']}]
    end

    puts git_cmd.inspect
  end
end
