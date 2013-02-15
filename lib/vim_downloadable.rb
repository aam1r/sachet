class VimDownloadable
  attr_accessor :lines, :options, :tmp_package, :packages

  def initialize(options)
    @lines = []
    @packages = []
    @options = options
    @tmp_package = Tempfile.new("temp-sachet-#{Time.now}")
  end

  def to_s
    @lines
  end

  def cleanup
    @tmp_package.close
  end

  def serve_package
    puts "Package selected:"
    puts @packages.inspect

    # generates the files and serves it as a downloadable archive
    Zip::ZipOutputStream.open(@tmp_package.path) do |z|
      z.put_next_entry('.vimrc')
      z.print(@lines.join("\n"))
    end

    @tmp_package.path
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

        # replace tag with actual value
        if config.has_key?('input_type') and config.has_key?('tag')
          syntax[config['tag']] = params[key]
        end

        # keep track of packages
        if config.has_key?('url')
          @packages << syntax
        end

        @lines << syntax
      end
    end
  end
end
