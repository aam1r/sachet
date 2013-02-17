class VimDownloadable
  attr_accessor :lines, :options, :tmp_package, :packages

  def initialize(options)
    @lines = []
    @packages = []
    @options = options
    @tmp_package = Tempfile.new("temp-sachet-#{Time.now}")
  end

  def to_s
    prepend = []

    # add mandatory pathogen code to enable ~/.vim/bundle functionality
    prepend.push('" Pathogen', 'call pathogen#infect()', 'call pathogen#helptags()', ' ')

    # other misc. code for vimrc
    prepend.push('set nocompatible')
    prepend.push('set statusline=%<\ %n:%f\ %m%r%y%=%-35.(line:\ %l\ of\ %L,\ col:\ %c%V\ (%P)%)')
    prepend.push('filetype plugin indent on', ' ')

    vimrc = @lines.reject(&:nil?)
    vimrc.unshift(prepend).join("\n")
  end

  def cleanup
    @tmp_package.close
  end

  def serve_package
    # generates the files and serves it as a downloadable archive
    Zip::Archive.open(@tmp_package.path, Zip::CREATE) do |ar|
      ar.add_buffer('vimrc', to_s)

      # manually add pathogen and INSTRUCTIONS
      ar.add_dir('vim')
      ar.add_dir('vim/autoload')
      ar.add_file('vim/autoload/pathogen.vim', 'repos/vim-pathogen/autoload/pathogen.vim')
      ar.add_file('INSTRUCTIONS.md')

      @packages.each do |package|
        folder = _repo_folder(package['url'])

        # recursively add directory
        Dir.glob("repos/#{folder}/**/*").each do |src_path|
          dest_path = 'vim/' + src_path.gsub(/repos/, 'bundle')

          if File.directory?(src_path)
            ar.add_dir(dest_path)
          else
            ar.add_file(dest_path, src_path)
          end
        end
      end
    end

    @tmp_package.path
  end

  def _repo_folder(url)
    last_chunk = url.split('/').last
    last_chunk['.git'] = ''
    last_chunk
  end

  def process_params(params)
    options_mapping = @options.group_by{|config| config['id']}

    # for each selected parameter, add the appropriate line into the generated
    # vim.rc file
    params.each do |param|
      key = param.first

      # skip over empty text boxes
      if param.last.empty?
        next
      end

      # append the vim config syntax
      if options_mapping.has_key?(key)
        config = options_mapping[key].first
        syntax = config['syntax']

        # turn multiple statements into a single string
        if syntax.is_a?(Array)
          syntax = syntax.join("\n") + "\n"
        end

        # replace tags with actual value
        if config.has_key?('input_type') and config.has_key?('tag')
          syntax.gsub!(config['tag'], params[key])
        end

        # keep track of packages
        if config.has_key?('url')
          @packages << config
        end

        @lines << syntax
      end
    end
  end
end
