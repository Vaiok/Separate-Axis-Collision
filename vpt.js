function isConcave(shapeArr) {
  let grtr = [], lssr = [];
  for (let pnt = 0; pnt < shapeArr.length; pnt++) {
    let vPnt1 = pnt - 2, vPnt2 = pnt - 1;
    if (vPnt1 < 0) {vPnt1 += shapeArr.length;}
    if (vPnt2 < 0) {vPnt2 += shapeArr.length;}
    let projVec = {x: -(shapeArr[vPnt2].absY - shapeArr[vPnt1].absY), y: shapeArr[vPnt2].absX - shapeArr[vPnt1].absX};
    let vPntMag = (shapeArr[vPnt2].absX*projVec.x + shapeArr[vPnt2].absY*projVec.y) / (projVec.x**2 + projVec.y**2);
    let nPntMag = (shapeArr[pnt].absX*projVec.x + shapeArr[pnt].absY*projVec.y) / (projVec.x**2 + projVec.y**2);
    if (nPntMag > vPntMag) {grtr.push(vPnt2);}
    if (nPntMag < vPntMag) {lssr.push(vPnt2);}
  }
  if (grtr.length === 0 || lssr.length === 0) {return false;}
  else {return (grtr.length > lssr.length) ? lssr : grtr;}
}
