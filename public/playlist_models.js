;(function() {
  window.playlists = window.playlists || {};

  playlists.PlaylistModel = function () {
        this.loaded = false;
        this.songs = [];
        this.callbacks = [];

        this.load = function(songs) {
            this.songs = songs;
            this.notifySubscribers();
            this.loaded = true;
        };

        this.reload = function(callback) {
            var playlist = this;
            playlist.loading = true;
            var promise = $.ajax({
                type: "GET",
                url: '/api/v1/songs',
                dataType: 'json'
            });
            promise.done(function(data) {
                playlist.load(data);
                playlist.loading = false;
                if (callback) {
                    callback();
                }
            });
            promise.fail(function(data) {
                playlist.loading = false;
                debugger;
                console.log(data);
                console.log(playlist);
            });
        };

        this.findSongById = function(id) {
            for (var i = 0; i < this.songs.length; i++) {
                if (this.songs[i]['id'] == id) {
                    return this.songs[i];
                }
            }
            return null;
        };

        this.deleteSong = function(songIdRaw, options) {
            var songId = parseInt(songIdRaw, 10);
            if (songId > 0) {
                var playlist = this;
                var promise = $.ajax({
                    type: "POST",
                    url: '/api/v1/song/' + songId,
                    method: 'DELETE',
                    dataType: 'json'
                });

                promise.done(function(data) {
                    if (options.success) {
                        options.success();
                    }
                    playlist.reload();
                });

                promise.fail(function(response) {
                    var json = response.responseJSON;
                    var errors = json ? json.errors : [];
                    console.log(errors); // show response from the php script.
                    if (options.errors) {
                        options.errors(errors);
                    }
                });
            } else {
                throw "Invalid Song Id " + songIdRaw
            }
        };

        this.editSong = function(songIdRaw, options) {
            var songId = parseInt(songIdRaw, 10);

            if (songId > 0) {
                var playlist = this;
                var promise = $.ajax({
                    type: "POST",
                    url: '/api/v1/song/' + songId,
                    dataType: 'json',
                    data: options.data
                });

                promise.done(function(data) {
                    if (options.success) {
                        options.success();
                    }
                    playlist.reload();
                });

                promise.fail(function(response) {
                    var errors = response.responseJSON.errors;
                    console.log(errors); // show response from the php script.
                    if (options.errors) {
                        options.errors(errors);
                    }
                });
            } else {
                throw "Invalid Song Id " + songIdRaw
            }
        };

        this.addNewSong = function(options) {
            var playlist = this;
            var promise = $.ajax({
                type: "POST",
                url: '/api/v1/songs/new',
                dataType: 'json',
                data: options.data
            });

            promise.done(function(data) {
                if (options.success) {
                    options.success();
                }
                playlist.reload();
            });

            promise.fail(function(response) {
                var errors = response.responseJSON.errors;
                console.log(errors); // show response from the php script.
                if (options.errors) {
                    options.errors(errors);
                }
            });
        };

        this.notifySubscribers = function() {
            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i](this);
            }
        };
        this.subscribe = function(subscriberFunction) {
            this.callbacks.push(subscriberFunction)
        };
    }

})();
