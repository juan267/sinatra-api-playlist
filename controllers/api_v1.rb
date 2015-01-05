before '/api/v1/*' do
  content_type :json
end

get '/api/v1/songs' do
  Song.all.to_json
end
