(function(){
    
    function SongPlayer($rootScope, Fixtures){
        var SongPlayer = {};
        /**
        * @desc Current album info object returned from fixture's getAlbum function
        * @type {object}
        */
        var currentAlbum = Fixtures.getAlbum();
        /** 
        * @desc Private Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /***************************************** Private functions ***********************************************/
        
        /** 
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {object} song
        */
        var setSong = function(song){
            if(currentBuzzObject){
                stopSong(SongPlayer.currentSong);
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function(){
                $rootScope.$apply(function(){
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
        /** 
        * @function playSong
        * @desc Plays the currentBuzzObject and sets song's playing attribute to true
        * @param {object} song
        */
        var playSong = function(song){
            if(currentBuzzObject){
                currentBuzzObject.play();
                song.playing = true;
            }  
        };
        
        /**
        * @function getSongIndex
        * @desc returns the index of the current song in the album
        * @param {object} song
        * @return {integer} index of current song
        */
        var getSongIndex = function(song){
            return currentAlbum.songs.indexOf(song);  
        };
        
        /** 
        * @function stopSong
        * @desc Stops the current playing song
        */
        var stopSong = function(song){
            currentBuzzObject.stop();
            song.playing = null;
        };
        
        /************************************* Public Functions ********************************************/
        
        /**
        * @desc Public Active song object from list of songs
        * @type {object}
        */
        SongPlayer.currentSong = null;
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {number}
        */
        SongPlayer.currentTime = null;
        /**
        * @function play
        * @desc Plays current or new song
        * @param {object} song
        */
        SongPlayer.play = function(song){
            song = song || SongPlayer.currentSong;
            if(SongPlayer.currentSong !== song){
                setSong(song);
                playSong(song)              
            }else if(SongPlayer.currentSong === song){
                if(currentBuzzObject.isPaused()){
                    playSong(song);
                }
            }
        };
        
        /**
        * @function pause
        * @desc Pauses the current song
        * @param {object} song
        */
        SongPlayer.pause = function(song){
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc Sets song to previous song in album
        */
        SongPlayer.previous = function(){
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if(currentSongIndex < 0){
                stopSong(SongPlayer.currentSong);
            }else{
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /** 
        * @function next
        * @desc Plays the next song in the album (if it exists)
        */
        SongPlayer.next = function(){
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if(currentSongIndex == currentAlbum.songs.length){
                stopSong(SongPlayer.currentSong);
            }else{
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {number} time
        */
        SongPlayer.setCurrentTime = function(time){
            if(currentBuzzObject){
                currentBuzzObject.setTime(time);
            }
        };
        
        return SongPlayer;
    };
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();