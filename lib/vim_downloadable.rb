class VimDownloadable
  attr_accessor :lines, :options

  def initialize(options)
    @lines = []
    @options = options
  end

  def to_s
    @lines
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
