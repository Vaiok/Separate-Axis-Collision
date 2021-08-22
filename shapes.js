// New
function CompShape(ctx, x, y) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
}
CompShape.prototype.addShape = function(shape, x, y, rot) {

}

function Shape(ctx, color = 'white', x = 0, y = 0, a = 0, r = 10, p = 1) {
  this.ctx = ctx;
  this.color = color;
  this.x = x;
  this.y = y;
  this.tr = Math.PI/60;
  this.a = this.tr*a;
  this.r = r;
  this.t = '';
  if (p > 2) {this.t = 'polygon';}
  else {this.t = 'circle';}
  if (this.t === 'polygon') {
    this.rp = [];
    this.ap = [];
    for (let i = 0; i < p; i++) {
      this.rp[i] = {x: Math.cos(Math.PI*2/p*i + this.a)*this.r,
                    y: Math.sin(Math.PI*2/p*i + this.a)*this.r};
    }
  }
}
Shape.prototype.updatePos = function() {
  if (this.t === 'polygon') {
    for (let i=0; i<this.rp.length; i++) {
      this.rp[i] = {x: Math.cos(Math.PI*2/this.rp.length*i+this.a)*this.r,
                    y: Math.sin(Math.PI*2/this.rp.length*i+this.a)*this.r};
      this.ap[i] = {x: this.x+this.rp[i].x, y: this.y+this.rp[i].y};
    }
  }
}
Shape.prototype.draw = function() {
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  if (this.t === 'polygon') {
    this.ctx.moveTo(this.ap[0].x, this.ap[0].y);
    for (let i = 1; i < this.ap.length; i++) {this.ctx.lineTo(this.ap[i].x, this.ap[i].y);}
  }
  if (this.t === 'circle') {this.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);}
  this.ctx.fill();
}
// // New
/* Old
function Shape(ctx, color = 'white', x = 0, y = 0, r = 10, p = 1) {
  this.ctx = ctx;
  this.color = color;
  this.x = x;
  this.y = y;
  this.r = r;
  this.t = '';
  if (p > 2) {this.t = 'polygon';}
  else {this.t = 'circle';}
  if (this.t === 'polygon') {
    this.rp = [];
    this.ap = [];
    for (let i = 0; i < p; i++) {this.rp[i] = {x: Math.cos(Math.PI*2/p*i)*r, y: Math.sin(Math.PI*2/p*i)*r};}
  }
}
Shape.prototype.updatePos = function() {
  if (this.t === 'polygon') {
    for (let i=0; i<this.rp.length; i++) {this.ap[i] = {x: this.x+this.rp[i].x, y: this.y+this.rp[i].y};}
  }
}
Shape.prototype.draw = function() {
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  if (this.t === 'polygon') {
    this.ctx.moveTo(this.ap[0].x, this.ap[0].y);
    for (let i = 1; i < this.ap.length; i++) {this.ctx.lineTo(this.ap[i].x, this.ap[i].y);}
  }
  if (this.t === 'circle') {this.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);}
  this.ctx.fill();
}
*/ // Old
