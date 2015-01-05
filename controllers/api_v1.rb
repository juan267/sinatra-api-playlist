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
    halt 400, {errors: @song.errors}
  end
end