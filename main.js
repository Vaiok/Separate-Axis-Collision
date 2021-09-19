function formatShape(shape) {
  if (shape.type === 'polygon') {
    let tempShape = [];
    for (let shpPnt of shape.pntsArr) {tempShape.push({x: shpPnt.absX, y: shpPnt.absY});}
    return tempShape;
  }
  if (shape.type === 'circle') {return {x: shape.midPnt.absX, y: shape.midPnt.absY, rad: shape.rad};}
}
function gameLoop() {
  for (let sprShp of superShapeArr) {for (let shape of sprShp.subShps) {shape.color = 'green';}}
  // Detect Collisions
  for (let sh1 = 0; sh1 < superShapeArr.length-1; sh1++) {
    for (let sh2 = sh1+1; sh2 < superShapeArr.length; sh2++) {
      for (let shape1 of superShapeArr[sh1].subShps) {
        for (let shape2 of superShapeArr[sh2].subShps) {
          let firstShape = formatShape(shape1);
          let secondShape = formatShape(shape2);
          let collision = sepAx(firstShape, secondShape);
          if (collision) {shape1.color = 'red', shape2.color = 'red';}
        }
      }
    }
  }
  // Draw
  ctx2d.fillStyle = 'black';
  ctx2d.fillRect(0, 0, cnvs.width, cnvs.height);
  for (sprShp of superShapeArr) {
    sprShp.updatePos();
    sprShp.draw();
  }
  if (newShapeArr.length)
  {
    newShapeArr.push({absX: mPosX, absY: mPosY});
    if (vldShp(newShapeArr)) {ctx2d.strokeStyle = 'yellow';}
    else {ctx2d.strokeStyle = 'red';}
    ctx2d.beginPath();
    ctx2d.moveTo(newShapeArr[0].absX, newShapeArr[0].absY);
    for (let pnt = 1; pnt < newShapeArr.length; pnt++) {
      ctx2d.lineTo(newShapeArr[pnt].absX, newShapeArr[pnt].absY);
    }
    ctx2d.closePath();
    ctx2d.stroke();
    newShapeArr.pop();
  }
  window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
