before '/api/v1/*' do
  content_type :json
end

get '/api/v1/songs' do
  Song.all.to_json
end

get '/api/v1/song/:id' do
  begin
    Song.find(params[:id]).to_json
  rescue ActiveRecord::RecordNotFound
    halt 404, { error: 'Song Not Found' }.to_json
  end
end
