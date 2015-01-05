get '/' do
  @songs = Song.all
  erb :home
end

