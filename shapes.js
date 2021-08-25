function Shape(ctx, color = 'white', x = 0, y = 0, ang = 0, rad = 10, pnts = 1) {
  this.ctx = ctx;
  this.color = color;
  this.x = x;
  this.y = y;
  this.tr = Math.PI/60;
  this.ang = this.tr*ang;
  this.rad = rad;
  this.type = '';
  if (pnts > 2) {this.type = 'polygon';}
  else {this.type = 'circle';}
  if (this.type === 'polygon') {
    this.rPnts = [];
    this.aPnts = [];
    for (let i = 0; i < pnts; i++) {
      let rndmAng = Math.floor(Math.random()*Math.PI/18) - Math.PI/36;
      let rndmRad = Math.floor(Math.random()*10) - 5;
      this.rPnts[i] = {x: Math.cos(Math.PI*2/pnts*i + rndmAng + this.ang)*(this.rad + rndmRad),
                    y: Math.sin(Math.PI*2/pnts*i + rndmAng + this.ang)*(this.rad + rndmRad)};
      this.rPnts[i].rad = Math.sqrt(this.rPnts[i].x**2 + this.rPnts[i].y**2);
      let x1 = this.rPnts[i].x, x2 = this.rPnts[i].rad, y1 = this.rPnts[i].y, y2 = 0;
      this.rPnts[i].ang = Math.acos((x1*x2 + y1*y2) / (Math.sqrt(x1**2 + y1**2)*Math.sqrt(x2**2 + y2**2)));
      if (this.rPnts[i].y < 0) {this.rPnts[i].ang *= -1;}
    }
  }
}
Shape.prototype.updatePos = function() {
  if (this.type === 'polygon') {
    for (let i = 0; i < this.rPnts.length; i++) {
      this.rPnts[i].x = Math.cos(this.rPnts[i].ang + this.ang)*this.rPnts[i].rad;
      this.rPnts[i].y = Math.sin(this.rPnts[i].ang + this.ang)*this.rPnts[i].rad;
      this.aPnts[i] = {x: this.x + this.rPnts[i].x, y: this.y + this.rPnts[i].y};
    }
  }
}
Shape.prototype.draw = function() {
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  if (this.type === 'polygon') {
    this.ctx.moveTo(this.aPnts[0].x, this.aPnts[0].y);
    for (let i = 1; i < this.aPnts.length; i++) {this.ctx.lineTo(this.aPnts[i].x, this.aPnts[i].y);}
  }
  if (this.type === 'circle') {this.ctx.arc(this.x, this.y, this.rad, 0, Math.PI*2, true);}
  this.ctx.fill();
}
