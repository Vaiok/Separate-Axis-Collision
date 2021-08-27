function Shape(ctx, x = 0, y = 0, ang = 0, rad = 25) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.tr = Math.PI/60;
  this.ang = this.tr*ang;
  this.rad = rad;
  this.subShps = [];
}
Shape.prototype.addSubShape = function(newShape) {
  if (newShape.type === 'polygon') {
    for (let i = 0; i < newShape.pntsArr.length; i++) {
      newShape.pntsArr[i].relX = newShape.pntsArr[i].absX - this.x;
      newShape.pntsArr[i].relY = newShape.pntsArr[i].absY - this.y;
      newShape.pntsArr[i].rad = Math.hypot(newShape.pntsArr[i].relX, newShape.pntsArr[i].relY);
      let x1 = newShape.pntsArr[i].relX, x2 = newShape.pntsArr[i].rad, y1 = newShape.pntsArr[i].relY, y2 = 0;
      let angle = Math.acos((x1*x2 + y1*y2) / (Math.hypot(x1, y1)*Math.hypot(x2, y2)));
      if (newShape.pntsArr[i].relY >= 0) {newShape.pntsArr[i].ang = angle - this.ang;}
      else {newShape.pntsArr[i].ang = -angle - this.ang;}
    }
  }
  if (newShape.type === 'circle') {
    newShape.midPnt.relX = newShape.midPnt.absX - this.x;
    newShape.midPnt.relY = newShape.midPnt.absY - this.y;
    newShape.midPnt.rad = Math.hypot(newShape.midPnt.relX, newShape.midPnt.relY);
    let x1 = newShape.midPnt.relX, x2 = newShape.midPnt.rad, y1 = newShape.midPnt.relY, y2 = 0;
    let angle = Math.acos((x1*x2 + y1*y2) / (Math.hypot(x1, y1)*Math.hypot(x2, y2)));
    if (newShape.midPnt.relY >= 0) {newShape.midPnt.ang = angle - this.ang;}
    else {newShape.midPnt.ang = -angle - this.ang;}
  }
  this.subShps.push(newShape);
}
Shape.prototype.updatePos = function() {
  for (let shape of this.subShps) {
    if (shape.type === 'polygon') {
      for (let pnt of shape.pntsArr) {
        pnt.relX = Math.cos(pnt.ang + this.ang)*pnt.rad;
        pnt.relY = Math.sin(pnt.ang + this.ang)*pnt.rad;
        pnt.absX = this.x + pnt.relX;
        pnt.absY = this.y + pnt.relY;
      }
    }
    if (shape.type === 'circle') {
      shape.midPnt.relX = Math.cos(shape.midPnt.ang + this.ang)*shape.midPnt.rad;
      shape.midPnt.relY = Math.sin(shape.midPnt.ang + this.ang)*shape.midPnt.rad;
      shape.midPnt.absX = this.x + shape.midPnt.relX;
      shape.midPnt.absY = this.y + shape.midPnt.relY;
    }
  }
}
Shape.prototype.draw = function() {
  for (let shape of this.subShps) {
    this.ctx.fillStyle = shape.color;
    this.ctx.beginPath();
    if (shape.type === 'polygon') {
      this.ctx.moveTo(shape.pntsArr[0].absX, shape.pntsArr[0].absY);
      for (let i = 1; i < shape.pntsArr.length; i++) {this.ctx.lineTo(shape.pntsArr[i].absX, shape.pntsArr[i].absY);}
    }
    if (shape.type === 'circle') {this.ctx.arc(shape.midPnt.absX, shape.midPnt.absY, shape.rad, 0, Math.PI*2, true);}
    this.ctx.fill();
  }
}
