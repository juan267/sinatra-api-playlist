
class Song < ActiveRecord::Base
  validates_presence_of :title, :artist
  validates_uniqueness_of :title, :scope => :artist, :message =>
      lambda { |msg_symbol, labels|  
        "#{labels[:value]} by that artist is already in the playlist"
      }

  default_scope -> { order(id: :desc) }
end



