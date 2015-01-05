;(function() {
  window.playlists = window.playlists || {};

  window.playlists.PlaylistView = function ($container) {
        this.refresh = function(playlistModel) {
            $container.html('');
            for (var i = 0; i < playlistModel.songs.length; i++) {
                var song = playlistModel.songs[i];
                var $li = $('<li class="song"><a href="/song/' + song['id'] + '">' + song['title'] + '</a> by ' + song['artist'] + '</li>');
                $li.data('song_id', song.id);
                $container.append($li);
            }
        }

        this.onSongClick = function(callback) {
            this._onSongClick = callback;
        };

        var playListView = this;

        $container.on("click", "li.song a", function(event) {
            if (playListView._onSongClick) {
                event.preventDefault();
                var $el = $(event.target);
                var song_id = parseInt($el.closest('li').data('song_id'), 10);
                if (song_id > 0) {
                    playListView._onSongClick(song_id);
                }
            }
        });
    }

  window.playlists.SongFormView = function ($form) {
        var thisView = this;
        this.clearForm = function() {
            console.log("clear");
            $form.find('input.clearable').val('');
            $form.find('.validation_error').text('');
            $form.data('song_id', null);
            $form.find(':submit').val("Add");
            $form.find('input.delete').hide();
        };

        this.updateErrors = function(errors) {
            console.log("updateErrors");
            console.log(errors);
            $form.find('.validation_error').text('');
            for (var prop in errors) {
                if (errors.hasOwnProperty(prop)) {
                    var message = errors[prop][0];
                    $form.find("#song_" + prop + "_error").text(message);
                }
            }
        };

        this.setupEdit = function(id, playlistModel) {
            var song = playlistModel.findSongById(id);
            this.clearForm();

            if (song) {
                $form.data('song_id', song.id);
                $form.find('#song_title').val(song.title);
                $form.find('#song_artist').val(song.artist);
                $form.find(':submit').val("Save");
                $form.find('input.delete').show();
            }
        };

        this.setupAdd = function() {
            this.clearForm();
        };

        this.formData = function() {
            return $form.serialize();
        };

        this.isEditing = function() {
            return this.currentEditingId() > 0;
        };

        this.currentEditingId = function() {
            return parseInt($form.data('song_id'), 10);
        };

        this.onAdd = function(callback) {
            this._onAddCallback = callback;
        };

        this.onEdit = function(callback) {
            this._onEditCallback = callback;
        };

        this.onDelete = function(callback) {
            this._onDeleteCallback = callback;
        };

        thisView.clearForm();


        $form.find("input.reset").click(function() {
            thisView.clearForm();
        });

        $form.find("input.delete").click(function() {
            event.preventDefault();
            if (thisView.isEditing()) {
                if (thisView._onDeleteCallback) {
                    if (confirm("Are you sure you want to delete it?")) {
                        thisView._onDeleteCallback(thisView);
                    }
                }

            }
        });

        $form.submit(function(event) {
            event.preventDefault();
            if (thisView.isEditing()) {
                if (thisView._onEditCallback) {
                    thisView._onEditCallback(thisView);
                }

            } else {
                if (thisView._onAddCallback) {
                    thisView._onAddCallback(thisView);
                }
            }
        });

    }
})();
