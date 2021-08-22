const cnvs = document.querySelector('canvas');
const ctx2d = cnvs.getContext('2d');
cnvs.width = window.innerWidth;
cnvs.height = window.innerHeight;
let pointDiv = document.querySelector('#pointDiv');
let pointDivX, pointDivY;
pointDiv.style.width = cnvs.width/30 + 'px';
pointDiv.style.height = cnvs.height/20 + 'px';
pointDiv.style.display = 'none';
let shapeToBind, shapeArr = [], pointCount = 2;

function createShape(e) {
  pointDivX = e.offsetX;
  pointDivY = e.offsetY;
  pointDiv.style.display = 'grid';
  pointDiv.style.left = (pointDivX - pointDiv.style.width.replace('px', '')/2) + 'px';
  pointDiv.style.top = (pointDivY - pointDiv.style.height.replace('px', '')/2) + 'px';
}
function selectShape(e) {
  for (let shape of shapeArr) {
    let dist = Math.sqrt((shape.x - e.offsetX)**2 + (shape.y - e.offsetY)**2);
    if (dist <= shape.r) {shapeToBind = shape;}
  }
}
function mouseDown(e) {
  if (pointDiv.style.display === 'none')
  {
    if (e.button === 0) {selectShape(e);}
    if (e.button === 2) {createShape(e);}
  }
}

function keyPressed(e) {
  if (shapeToBind !== undefined) {
    if (e.key === 'w') {shapeToBind.y -= 3;}
    if (e.key === 'd') {shapeToBind.x += 3;}
    if (e.key === 's') {shapeToBind.y += 3;}
    if (e.key === 'a') {shapeToBind.x -= 3;}
    if (e.key === 'q') {shapeToBind.a -= shapeToBind.tr;}
    if (e.key === 'e') {shapeToBind.a += shapeToBind.tr;}
  }
}

document.addEventListener('contextmenu', function(e) {e.preventDefault();});
document.addEventListener('mousedown', mouseDown);
document.addEventListener('keydown', keyPressed);
document.querySelector('#pointButton').onclick = function() {
  pointCount = document.querySelector('#pointPicker').value;
  shapeArr.push(new Shape(ctx2d, 'green', pointDivX, pointDivY, 0, 55, pointCount));
  pointDiv.style.display = 'none';
}

function gameLoop() {
  for (let shape of shapeArr) {shape.color = 'green';}
  // Detect Collisions
  for (let sh1 = 0; sh1 < shapeArr.length-1; sh1++) {
    for (let sh2 = sh1+1; sh2 < shapeArr.length; sh2++) {
      let shape1 = shapeArr[sh1], shape2 = shapeArr[sh2];
      if (shape1.ap) {shape1 = shape1.ap;}
      if (shape2.ap) {shape2 = shape2.ap;}
      let collision = sepAx(shape1, shape2);
      if (collision) {shapeArr[sh1].color = 'red';  shapeArr[sh2].color = 'red';}
    }
  }
  // Draw
  ctx2d.fillStyle = 'black';
  ctx2d.fillRect(0, 0, cnvs.width, cnvs.height);
  for (let shape of shapeArr) {
    if (shape.updatePos) {shape.updatePos();}
    shape.draw();
  }
  window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
