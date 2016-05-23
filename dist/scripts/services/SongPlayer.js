(function(){
    
    function SongPlayer(){
        var SongPlayer = {};
        var currentSong = null;
        /** 
        * @desc Buzz object audio file
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
                currentBuzzObject.stop();
                currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentSong = song;
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
        
        /************************************* Public Functions ********************************************/
        
        /**
        * @function play
        * @desc Plays current or new song
        * @param {object} song
        */
        SongPlayer.play = function(song){
            if(currentSong !== song){
                setSong(song);
                playSong(song)              
            }else if(currentSong === song){
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
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        return SongPlayer;
    };
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();