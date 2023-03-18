const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);    

const playList = $('.playlist');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const ramdomBtn = $('.btn-random');
const cd = $('.cd');
const reloadBtn = $('.btn-repeat');

// xử lý cd quay / dừng

const app_music ={
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isReload: false,
    song:[
        {
            name: 'Anh Biết',
            singer: 'Xám',
            path: './asset/music/AnhBiet_Xam.mp3',
            image:'./asset/img/anhBiet_Xam.jpg'
        },
        {
            name: 'Ghé Qua',
            singer: 'PC & DicK',
            path: './asset/music/GHEQUA_Dick_PC_Tofu.mp3',
            image:'./asset/img/GheQua.jpg'
        },
        {
            name: 'Già Cùng Nhau Là Được ',
            singer: 'Xám',
            path: './asset/music/GiaCungNhau.mp3',
            image:'./asset/img/GiaCungNhau.jpg'
        },
        {
            name: 'Mười Ngàn Năm',
            singer: 'PC',
            path: './asset/music/MuoiNganNam_PC.mp3',
            image:'./asset/img/muoiNganNam.jpg'
        },
        {
            name: 'Replay Trên Con Guây',
            singer: 'Phúc Du & Dan Ni',
            path: './asset/music/ReplayTrenConGuay_PhucDu.mp3',
            image:'./asset/img/replayTrenConway_PhucDu.jpg'
        },
        {
            name: 'Sống Cho Hết Thời Thanh Xuân',
            singer: 'Dick x Xám x Tuyết',
            path: './asset/music/SongChoHetDoiThanhXuan_Dick_Xám_Tuyết.mp3',
            image:'./asset/img/songChoHetThoiThanhXuan_DickXamTuyet.jpg'
        }   
    ],  
    render: function(){
        const htmls = this.song.map( (song, index)=> {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playList.innerHTML = htmls.join('');
    },
    handleEnents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

  // quay hinh anh
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)' }
        ], {
            duration:10000,
            iterations: Infinity
            }
        )
        cdThumbAnimate.pause();


        // xử lysnphongs to thu nhỏ cd
        document.onscroll= function() {
           // window.scrollY
            const newCdWidth = cdWidth -window.scrollY;
            cd.style.width = newCdWidth> 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xử lý play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.onPause();
            }
            else{
                audio.onPlay();
            }           
        }
        // khi mở nhạc
         audio.onPlay = function(){
            _this.isPlaying = true;
            audio.play();
            player.classList.add('playing');
            cdThumbAnimate.play();
         };
         // Khi tắt nhạc
         audio.onPause = function(){
            _this.isPlaying = false;
            audio.pause();
            player.classList.remove('playing');
            cdThumbAnimate.pause();
         };

         // khi tua bài hát
         audio.ontimeupdate = function(){
                const currentTime = audio.currentTime; 
                if(audio.duration){
                    const curentProgress=  Math.floor(audio.currentTime / audio.duration *100);
                    progress.value = curentProgress;
                }
                
        };
        
        // Xử lý tua
        progress.onchange = function(){
            console.log(progress.value);
            audio.currentTime = (audio.duration / 100) *progress.value ;
            console.log(audio.currentTime);
        };

        // khi next bài hát
        nextBtn.onclick = function(){
           if(_this.isRamdom)
           {
            _this.playRamdomSong();
           } else {
            _this.nextSong();
           }
           audio.onPlay();
           _this.render();
           _this.scrollToActtiveSong();
        };
         // khi prev bai hat
         prevBtn.onclick = function(){
            if(_this.isRamdom)
            {
             _this.playRamdomSong();
            } 
            else {
                _this.prevSong();
            }
            audio.onPlay();
            _this.render();
            _this.scrollToActtiveSong();
         };
         // xử lý ramdom
         ramdomBtn.onclick = function(e){
            _this.isRamdom = !_this.isRamdom;
             ramdomBtn.classList.toggle('active', _this.isRamdom)
         };  
         // xử lý lawpk lại bài hát
         reloadBtn.onclick = function(e){
            _this.isReload = !_this.isReload;
             reloadBtn.classList.toggle('active', _this.isReload)
             console.log(_this.isReload);
         };  
         // xử lý bài hát khi hết bài
         audio.onended = function(){
            if(_this.isReload){
                audio.play();     
            } else{
                nextBtn.click();}
         }
         // lawngs nghe click vaof playlist
         playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active');
            if(songNode){
                console.log(songNode.dataset.index);
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                audio.onPlay();
            }
         }

    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.song[this.currentIndex];
            }
        });
    }, 
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        if(this.currentIndex < this.song.length){

            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentIndex = this.song.length - 1;
            }
            this.loadCurrentSong();
        }
    },
    playRamdomSong: function(){
        let newCurrentIndex;
        do{
             newCurrentIndex= Math.floor(Math.random() * this.song.length)
        }while(newCurrentIndex === this.currentIndex)

        this.currentIndex = newCurrentIndex;
        this.loadCurrentSong();
    },
    scrollToActtiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },1000)
    },
    init: function(){
        this.render();
        this.handleEnents();
    },
    stat: function(){
        // định nghĩa các object
        this.defineProperties();


        // lắng nghe xử lí các sự kiện
        this.handleEnents();

        // loadCurrentSong tải thông tin bài nhát đàu tiên
        this.loadCurrentSong();

        // render playList
        this.render();
    }
}
app_music.stat();



