#!/usr/bin/ruby

# Upon execution, this script downloads each theme/plugin in the data files to
# ensure that sachet delivers up-to-date packages. Ideally, this script should
# run once every 24 hours and should only re-fetch a repository if it has been
# updated.

require 'yaml'

THEMES = YAML.load_file('data/themes.yaml')
PLUGINS = YAML.load_file('data/plugins.yaml')

# Given a git url, return the name of the repository
#   Example: "git://github.com/vim-scripts/Wombat.git" -> "Wombat"
def repository_name(url)
  last_chunk = url.split('/').last
  last_chunk['.git'] = ''

  last_chunk
end

def fetch_repo(url, target_dir='repos')
  if url
    repo_name = repository_name(url)
    git_cmd = ''

    if File.directory?("#{target_dir}/#{repo_name}")
      # if folder exists already, do 'git pull'
      puts "Doing git pull for " + repo_name
      git_cmd = %x[cd #{target_dir}/#{repo_name}; git pull]
    else
      # clone the repo since it doesn't exist yet
      puts "Cloning " + repo_name
      git_cmd = %x[cd #{target_dir}; git clone #{url}]
    end

    puts git_cmd.inspect
  end
end

# Parse through each configuration file with git urls and fetch HEAD for each
# repository
def refresh()
  options = THEMES + PLUGINS

  # Create directory if it doesn't exist yet
  Dir.mkdir('repos') unless File.directory?('repos')

  options.each do |option|
    fetch_repo(option['url'])
  end

  # Manually fetch pathogen
  fetch_repo('git://github.com/tpope/vim-pathogen.git')
end

# Execute script to fetch each plugin / theme
refresh()
