const vldShp = (function() {
  function findOrien(pnt1, pnt2, pnt3) {
    let projVec = {x: -(pnt2.absY - pnt1.absY), y: pnt2.absX - pnt1.absX};
    let vPntMag = (pnt2.absX*projVec.x + pnt2.absY*projVec.y) / (projVec.x**2 + projVec.y**2);
    let nPntMag = (pnt3.absX*projVec.x + pnt3.absY*projVec.y) / (projVec.x**2 + projVec.y**2);
    if (nPntMag > vPntMag) {return 1;}
    else if (nPntMag < vPntMag) {return -1;}
    else {return 0;}
  }
  function isConcave(shapeArr) {
    let grtr = 0, lssr = 0;
    for (let pnt = 0; pnt < shapeArr.length; pnt++) {
      let vPnt1 = pnt - 2, vPnt2 = pnt - 1;
      if (vPnt1 < 0) {vPnt1 += shapeArr.length;}
      if (vPnt2 < 0) {vPnt2 += shapeArr.length;}
      let orien = findOrien(shapeArr[vPnt1], shapeArr[vPnt2], shapeArr[pnt]);
      if (orien === 1) {grtr++;}
      if (orien === -1) {lssr++;}
      if (grtr > 0 && lssr > 0) {return true;}
    }
    return false;
  }
  function alignedClash(pnt1, pnt2, pnt3) {
    if (pnt1.absX >= Math.min(pnt2.absX, pnt3.absX) && pnt1.absX <= Math.max(pnt2.absX, pnt3.absX)) {return true;}
    else {return false;}
  }
  function linesCross(shapeArr) {
    for (let pnt1 = 0; pnt1 < shapeArr.length; pnt1++) {
      let pnt2 = pnt1 + 1;
      if (pnt2 >= shapeArr.length) {pnt2 -= shapeArr.length;}
      let pnt3 = pnt1 + 2;
      let pnt4 = pnt3 + 1;
      if (pnt3 >= shapeArr.length) {pnt3 -= shapeArr.length;}
      if (pnt4 >= shapeArr.length) {pnt4 -= shapeArr.length;}
      while (pnt1 !== pnt4) {
        let orien1 = findOrien(shapeArr[pnt1], shapeArr[pnt2], shapeArr[pnt3]);
        let orien2 = findOrien(shapeArr[pnt1], shapeArr[pnt2], shapeArr[pnt4]);
        let orien3 = findOrien(shapeArr[pnt3], shapeArr[pnt4], shapeArr[pnt1]);
        let orien4 = findOrien(shapeArr[pnt3], shapeArr[pnt4], shapeArr[pnt2]);
        if (orien1 !== orien2 && orien3 !== orien4) {return true;}
        if (orien1 === 0 && alignedClash(shapeArr[pnt3], shapeArr[pnt1], shapeArr[pnt2])) {return true;}
        if (orien2 === 0 && alignedClash(shapeArr[pnt4], shapeArr[pnt1], shapeArr[pnt2])) {return true;}
        if (orien3 === 0 && alignedClash(shapeArr[pnt1], shapeArr[pnt3], shapeArr[pnt4])) {return true;}
        if (orien4 === 0 && alignedClash(shapeArr[pnt2], shapeArr[pnt3], shapeArr[pnt4])) {return true;}
        pnt3++, pnt4++;
        if (pnt3 >= shapeArr.length) {pnt3 -= shapeArr.length;}
        if (pnt4 >= shapeArr.length) {pnt4 -= shapeArr.length;}
      }
    }
    return false;
  }

  return function(shapeArr) {
    if (shapeArr.length > 3 && (isConcave(shapeArr) || linesCross(shapeArr))) {return false;}
    else {return true;}
  };
})();
