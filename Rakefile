require_relative 'config/environment'
require 'sinatra/activerecord/rake'

begin
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
  task :default => :spec
rescue LoadError
end


desc 'Start IRB with application environment loaded'
task "console" do
  exec "irb -r./config/environment"
end