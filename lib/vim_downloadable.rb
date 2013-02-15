class VimDownloadable
  attr_accessor :lines, :options, :tmp_package

  def initialize(options)
    @lines = []
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

      # append the vim config syntax
      if options_mapping.has_key?(key)
        config = options_mapping[key].first
        syntax = config['syntax']

        # replace tag with actual value
        if config['input_type'] and config['tag']
          syntax[config['tag']] = params[key]
        end

        @lines << syntax
      end
    end
  end
end
