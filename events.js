// Globals
const cnvs = document.querySelector('canvas');
const ctx2d = cnvs.getContext('2d');
cnvs.width = window.innerWidth;
cnvs.height = window.innerHeight;
let mPosX, mPosY;
let superShape, superShapeArr = [], newShapeArr = [], makingShape = false;

// Events
document.addEventListener('contextmenu', function(e) {e.preventDefault();});
document.addEventListener('mousemove', function(e) {mPosX = e.offsetX, mPosY = e.offsetY;});
// Mouse Click
function createSuperShape(e) {
  superShapeArr.push(new Shape(ctx2d, mPosX, mPosY, 0, 55));
  superShape = superShapeArr[superShapeArr.length-1];
}
function selectSuperShape(e) {
  let shapeFound = false;
  for (let shape of superShapeArr) {
    shape.selected = false;
    if (Math.hypot(mPosX - shape.x, mPosY - shape.y) <= shape.rad) {
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
document.addEventListener('mousedown', function(e) {
  if (!makingShape) {
    if (e.button === 0) {selectSuperShape(e);}
    if (e.button === 2) {
      if (superShape === undefined) {createSuperShape(e);}
      else {makingShape = true;}
    }
  }
  else {
    if (e.button === 0) {
      newShapeArr.push({absX: mPosX, absY: mPosY});
      if (!vldShp(newShapeArr)) {newShapeArr.pop();}
    }
    if (e.button === 2) {
      createShape();
      newShapeArr = [];
      makingShape = false;
    }
  }
});
// Key Pressed
document.addEventListener('keydown', function(e) {
  if (superShape !== undefined) {
    if (e.key === 'w') {superShape.y -= 3;}
    if (e.key === 'd') {superShape.x += 3;}
    if (e.key === 's') {superShape.y += 3;}
    if (e.key === 'a') {superShape.x -= 3;}
    if (e.key === 'q') {superShape.ang -= superShape.tr;}
    if (e.key === 'e') {superShape.ang += superShape.tr;}
  }
});
