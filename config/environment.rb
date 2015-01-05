require 'bundler/setup'

require 'sinatra'
require 'sinatra/activerecord'

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))
APP_NAME = 'playlist'

configure do
  set :root, APP_ROOT.to_path
end

# Set up the controllers and helpers
Dir[APP_ROOT.join('controllers', '*.rb')].each { |file| require file }

# Set up the database and models
require APP_ROOT.join('config', 'database')
