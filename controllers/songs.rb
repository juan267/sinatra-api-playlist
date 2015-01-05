
get '/songs' do
  @songs = Song.all.order(id: :asc)
  erb :"songs/index"
end

get '/songs/new' do
  @song = Song.new
  erb :"songs/new"
end

post '/songs/new' do
  song_params = params[:song] || {}
  @song = Song.new(title: song_params[:title], artist: song_params[:artist])
  if @song.save
    redirect '/songs'
  else
    erb :"songs/new"
  end
end

get '/song/:id' do
  begin
    @song = Song.find(params[:id])
    erb :"songs/show"
  rescue ActiveRecord::RecordNotFound => e
    halt 404
  end
end

get '/song/:id/edit' do
  begin
    @song = Song.find(params[:id])
    erb :"songs/edit"
  rescue ActiveRecord::RecordNotFound => e
    halt 404
  end
end

post '/song/:id' do
  begin
    @song = Song.find(params[:id])
    song_params = params[:song] || {}
    if @song.update_attributes(title: song_params[:title], artist: song_params[:artist])
      redirect '/songs'
    else
      erb :"songs/edit"
    end
  rescue ActiveRecord::RecordNotFound => e
    halt 404
  end
end

delete '/song/:id' do
  begin
    @song = Song.find(params[:id])
    @song.destroy
    redirect '/songs'
  rescue ActiveRecord::RecordNotFound => e
    halt 404
  end
end
