const WIDTH = $("#map-container").width();
const HEIGHT = $("#map-container").height();
let gData;
const COLORS = {
  default: "#b3b3cc",
  begin1: "#ffcce6",
  slight1: "#ff99c2",
  medium1: "#ff4d94",
  serious1: "#ff0066",
  dark: "#990033",

  begin2: "#ffe6cc",
  slight2: "#ffa94d",
  medium2: "#ff8400",
  serious2: "#994f00",

  selected: "#ff99ff",
};


const init = () => {

  const getPrefColor = (prefCode) => {
    let type = $("#select-pref-type").val();
    let ret = COLORS.default;
    let value = gData["prefectures-data"][type][prefCode-1];
    // gData["prefectures-data"][type][gData["prefectures-data"][type].length - 1][parseInt(prefCode) + 2];
    let a = 0;
    let b = 200;
    let c = 500;
    let d = 1000;
    let e =2000;
    if (type=="origin"){
      if (value > a && value <= b) {
        ret = COLORS.begin1;
      }
      else if(value > b && value <= c){
        ret = COLORS.slight1;
        }
      else if(value > c && value <= d){
        ret = COLORS.medium1;
      }
      else if(value > d && value <=e){
        ret = COLORS.serious1;
      }
      else if(value > e){
        ret = COLORS.dark;
      }
      else ret = COLORS.default;
    }
    
    if(type=="planA"){
      if (value > a && value <= b) {
        ret = COLORS.begin2;
      }
      else if(value > b && value <= c){
        ret = COLORS.slight2;
        }
      else if(value > c && value <= d){
        ret = COLORS.medium2;
      }
      else if(value > d && value <=e){
        ret = COLORS.serious2;
      }
      else if(value > e){
        ret = COLORS.dark;
      }
      else ret = COLORS.default;
    }

      // if (value >= gThresholds[type] && gThresholds[type] >= 1) ret = COLORS.default;
      return ret;
    }

  

  const drawJapanMap = () => {
    $("#map-container").empty();
    const WIDTH = $("#map-container").width();

    let prefs = [];
    gData["prefectures-map"].forEach(function(pref, i){
      prefs.push({
        code: pref.code,
        jp: pref.ja,
        en: pref.en,
        color: getPrefColor(pref.code),
        hoverColor: COLORS.selected,
        prefectures: [pref.code]
      });
    });

        
      $("#map-container").japanMap({
        areas: prefs,
        selection: "prefecture",
        width: WIDTH,
        height: HEIGHT,
        borderLineColor: "#242a3c",
        borderLineWidth : 0.25,
        lineColor : "#ccc",
        lineWidth: 1,
        drawsBoxLine: false,
        showsPrefectureName: false,
        movesIslands : true,
        onHover:function(data){
          // $("#text").html("asdasdadas");
          // $("#text").css("background", data.prefs.color);
        }
      });
    }

// setup canvas
  function drawCanvas(pName) {
    // let n = pName.toString();

    const canvas = document.getElementById(pName);
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    
    function random(min,max) {
      const num = Math.random()*(max-min) + min;
      return num;
    }
    
    
  function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(255,0,0)';
          balls[j].velX = random(-0.1,0.1);
          balls[j].velX = random(-0.1,0.1);
        }
      }
    }
  }
  let balls = [];

  while (balls.length < 100) {
    let size = 1;
    let ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-0.2,0.2),
      random(-0.2,0.2),
      'rgb(0,255,0)',
      size
    );

    balls.push(ball);
  }

  function loop() {
    ctx.fillStyle = 'rgba(0, 34, 68, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
    balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
  }

  loop();
  }

  function drawCompartments() {
    let prefsname = [];
    for (var i=0; i<47; i++)
    {
      prefsname.push(gData["prefectures-map"][i].en);
      console.log(prefsname[i],prefsname.length);
      // drawCanvas(prefsname[i]);
    }
    console.log(prefsname)

      for (var j=0; j<prefsname.length; j++)
      {
        let name = prefsname[j];
        drawCanvas(name);
      }
    

    

  }


  const loadData = () => {
    //$.getJSON("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/data.json", function(data){
    $.getJSON("a.json", function(data){
      gData = data;
      drawJapanMap();
      drawCompartments();
      // $("#container").addClass("show");
    })
  }

  const bindEvents = () => {
    $("#select-pref-type").on("change", function(){
      drawJapanMap();
    });
  }
  loadData();
  bindEvents();
};

$(function(){
  init();
});









// const canvas = document.getElementById('1');
// const ctx = canvas.getContext('2d');

// const width = canvas.width ;
// const height = canvas.height ;

// function to generate random number


