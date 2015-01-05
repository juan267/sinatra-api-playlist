before '/api/v1/*' do
  content_type :json
end

get '/api/v1/songs' do
  Song.all.to_json
end

get '/api/v1/song/:id' do
  begin
    Song.find(params[:id]).to_json
  rescue ActiveRecord::RecordNotFound => e
    halt 404, {error: "Song Not Found"}.to_json
  end
end

post '/api/v1/songs/new' do
  song_params = params[:song] || {}
  @song = Song.new(title: song_params[:title], artist: song_params[:artist])
  if @song.save
    @song.to_json
  else
    halt 400, {errors: @song.errors}.to_json
  end
end


post '/api/v1/song/:id' do
  begin
    song_params = params[:song] || {}
    @song = Song.find(params[:id])
    if @song.update_attributes(song_params)
      @song.to_json
    else
      halt 400, {errors: @song.errors}.to_json
    end

  rescue ActiveRecord::RecordNotFound => e
    halt 404, {error: "Song Not Found"}.to_json
  end
end


delete '/api/v1/song/:id' do
  begin
    @song = Song.find(params[:id])
    @song.destroy
    204
  rescue ActiveRecord::RecordNotFound => e
    halt 404
  end
end
