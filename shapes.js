function Shape(ctx, x = 0, y = 0, ang = 0, rad = 25) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.tr = Math.PI/60;
  this.ang = this.tr*ang;
  this.rad = rad;
  this.selected = true;
  this.subShps = [];
}
Shape.prototype.configShape = function(point) {
  point.relX = point.absX - this.x;
  point.relY = point.absY - this.y;
  point.rad = Math.hypot(point.relX, point.relY);
  let x1 = point.relX, x2 = point.rad, y1 = point.relY, y2 = 0;
  let angle = Math.acos((x1*x2 + y1*y2) / (Math.hypot(x1, y1)*Math.hypot(x2, y2)));
  if (point.relY >= 0) {point.ang = angle - this.ang;}
  else {point.ang = -angle - this.ang;}
  return point;
}
Shape.prototype.updateConfig = function(point) {
  point.relX = Math.cos(point.ang + this.ang)*point.rad;
  point.relY = Math.sin(point.ang + this.ang)*point.rad;
  point.absX = this.x + point.relX;
  point.absY = this.y + point.relY;
  return point;
}
Shape.prototype.addSubShape = function(newShape) {
  if (newShape.type === 'polygon') {
    for (let i = 0; i < newShape.pntsArr.length; i++) {newShape.pntsArr[i] = this.configShape(newShape.pntsArr[i]);}
  }
  if (newShape.type === 'circle') {newShape.midPnt = this.configShape(newShape.midPnt);}
  this.subShps.push(newShape);
}
Shape.prototype.updatePos = function() {
  for (let shape of this.subShps) {
    if (shape.type === 'polygon') {for (let pnt of shape.pntsArr) {pnt = this.updateConfig(pnt);}}
    if (shape.type === 'circle') {shape.midPnt = this.updateConfig(shape.midPnt);}
  }
}
Shape.prototype.draw = function() {
  this.ctx.fillStyle = this.selected ? 'cyan' : 'blue';
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, this.rad, 0, Math.PI*2, true);
  this.ctx.fill();
  for (let shape of this.subShps) {
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = shape.color;
    this.ctx.beginPath();
    if (shape.type === 'polygon') {
      this.ctx.moveTo(shape.pntsArr[0].absX, shape.pntsArr[0].absY);
      for (let i = 1; i < shape.pntsArr.length; i++) {this.ctx.lineTo(shape.pntsArr[i].absX, shape.pntsArr[i].absY);}
    }
    if (shape.type === 'circle') {this.ctx.arc(shape.midPnt.absX, shape.midPnt.absY, shape.rad, 0, Math.PI*2, true);}
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}
