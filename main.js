const cnvs = document.querySelector('canvas');
const ctx2d = cnvs.getContext('2d');
cnvs.width = window.innerWidth;
cnvs.height = window.innerHeight;

let superShape, superShapeArr = [], newShapeArr = [], makingShape = false;

function createSuperShape(e) {
  superShapeArr.push(new Shape(ctx2d, e.offsetX, e.offsetY, 0, 55));
  superShape = superShapeArr[superShapeArr.length-1];
}

function selectSuperShape(e) {
  let shapeFound = false;
  for (let shape of superShapeArr) {
    shape.selected = false;
    if (Math.hypot(e.offsetX - shape.x, e.offsetY - shape.y) <= shape.rad) {
      shape.selected = true;
      superShape = shape;
      shapeFound = true;
    }
  }
  if (!shapeFound) {createSuperShape(e);}
}

function createShape() {
  if (newShapeArr.length < 2) {return;}
  else if (newShapeArr.length === 2) {
    let rad = Math.hypot(newShapeArr[1].absX - newShapeArr[0].absX, newShapeArr[1].absY - newShapeArr[0].absY);
    superShape.addSubShape({type: 'circle', color: 'green', midPnt: newShapeArr[0], rad: rad});
  }
  else {superShape.addSubShape({type: 'polygon', color: 'green', pntsArr: newShapeArr});}
}

function mouseDown(e) {
  if (!makingShape) {
    if (e.button === 0) {selectSuperShape(e);}
    if (e.button === 2) {
      if (superShape === undefined) {createSuperShape(e);}
      else {
        newShapeArr = [];
        makingShape = true;
      }
    }
  }
  else {
    if (e.button === 0) {newShapeArr[newShapeArr.length] = {absX: e.offsetX, absY: e.offsetY};}
    if (e.button === 2) {
      createShape();
      makingShape = false;
    }
  }
}

function keyPressed(e) {
  if (superShape !== undefined) {
    if (e.key === 'w') {superShape.y -= 3;}
    if (e.key === 'd') {superShape.x += 3;}
    if (e.key === 's') {superShape.y += 3;}
    if (e.key === 'a') {superShape.x -= 3;}
    if (e.key === 'q') {superShape.ang -= superShape.tr;}
    if (e.key === 'e') {superShape.ang += superShape.tr;}
  }
}

document.addEventListener('contextmenu', function(e) {e.preventDefault();});
document.addEventListener('mousedown', mouseDown);
document.addEventListener('keydown', keyPressed);

function gameLoop() {
  for (let sprShp of superShapeArr) {for (let shape of sprShp.subShps) {shape.color = 'green';}}
  // Detect Collisions
  for (let sh1 = 0; sh1 < superShapeArr.length-1; sh1++) {
    for (let sh2 = sh1+1; sh2 < superShapeArr.length; sh2++) {
      for (let shape1 of superShapeArr[sh1].subShps) {
        for (let shape2 of superShapeArr[sh2].subShps) {
          let firstShape = [], secondShape = [];
          if (shape1.type === 'polygon') {
            for (let shpPnt of shape1.pntsArr) {firstShape.push({x: shpPnt.absX, y: shpPnt.absY});}
          }
          if (shape2.type === 'polygon') {
            for (let shpPnt of shape2.pntsArr) {secondShape.push({x: shpPnt.absX, y: shpPnt.absY});}
          }
          if (shape1.type === 'circle') {firstShape = {x: shape1.midPnt.absX, y: shape1.midPnt.absY, rad: shape1.rad};}
          if (shape2.type === 'circle') {secondShape = {x: shape2.midPnt.absX, y: shape2.midPnt.absY, rad: shape2.rad};}
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
  window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
