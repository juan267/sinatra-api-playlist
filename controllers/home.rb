get '/' do
  @songs = Song.all.order(id: :asc)
  erb :home
end

