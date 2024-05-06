require 'yaml'
require 'erb'


# 定义config实体类
class Config
    attr_accessor :api_server, :site, :site_name, :im_app_id
    def initialize(options = {})
      @api_server = options['API_SERVER']
      @site = options['SITE']
      @site_name = options['SITE_NAME']
      @im_app_id = options['IM_APP_ID']
    end
end

class ConfigGenerator  
    attr_accessor :config

    def initialize(project_env, config_yml, js_file_path)
      config = YAML.load_file(config_yml)
      args = %w[]
      if project_env == 'default'
        args = config['services']['nginx']['build']['args']
      elsif project_env == 'admin'
        args = config['services']['nginx-admin']['build']['args']  
      end
    
      options = {}
      args.each do |arg|
        value = arg.split('=')
        options[value[0]] = value[1]
      end
    
      @config = Config.new(options)
  
      File.open(js_file_path, "w+") do |f|
        f.puts(js_file)
      end  

    end
  
    def js_file
      ERB.new(File.read('template/config.js.erb'), nil, '>').result(binding)
    end
  
end

ConfigGenerator.new(ARGV[0], ARGV[1], 'public/config/config.js')
