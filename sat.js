const sepAx = (function() {
  function polyMags(obj, vec) {
    let minPoint = maxPoint = null;
    for (let point = 0; point < obj.length; point++) {
      let pointMag = (obj[point].x*vec.x + obj[point].y*vec.y) / (vec.x**2 + vec.y**2);
      if (point === 0) {minPoint = maxPoint = pointMag;}
      if (pointMag < minPoint) {minPoint = pointMag;}
      if (pointMag > maxPoint) {maxPoint = pointMag;}
    }
    return {min: minPoint, max: maxPoint};
  }
  function circleMags(obj, vec) {
    let pointMag = (obj.x*vec.x + obj.y*vec.y) / (vec.x**2 + vec.y**2);
    return {min: pointMag - obj.rad, max: pointMag + obj.rad};
  }
  function polyToPoly(obj1, obj2) {
    for (let obj = 0; obj < 2; obj++) {
      let mainObj = obj1, otherObj = obj2;
      if (obj === 1) {mainObj = obj2, otherObj = obj1;}
      for (let vPoint = 0; vPoint < mainObj.length; vPoint++) {
        let othInd = vPoint + 1;
        if (vPoint === mainObj.length-1) {othInd = 0;}
        let projVec = {x: -(mainObj[othInd].y - mainObj[vPoint].y), y: mainObj[othInd].x - mainObj[vPoint].x};
        let mainMag = polyMags(mainObj, projVec);
        let otherMag = polyMags(otherObj, projVec);
        if (mainMag.max < otherMag.min || mainMag.min > otherMag.max) {return false;}
      }
    }
    return true;
  }
  function polyToCircle(obj1, obj2) {
    for (let vPoint = 0; vPoint < obj1.length; vPoint++) {
      let othInd = vPoint + 1;
      if (vPoint === obj1.length-1) {othInd = 0;}
      let projVec = {x: -(obj1[othInd].y - obj1[vPoint].y), y: obj1[othInd].x - obj1[vPoint].x};
      let magn = Math.sqrt(projVec.x**2 + projVec.y**2);
      projVec.x *= 1/magn;
      projVec.y *= 1/magn;
      let mainMag = polyMags(obj1, projVec);
      let otherMag = circleMags(obj2, projVec);
      if (mainMag.max < otherMag.min || mainMag.min > otherMag.max) {return false;}
    }
    return true;
  }
  function circleToCircle(obj1, obj2) {
    let dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
    if (dist > obj1.rad + obj2.rad) {return false;}
    else {return true;}
  }

  return function(obj1, obj2) {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {return polyToPoly(obj1, obj2);}
    if (Array.isArray(obj1) && !Array.isArray(obj2)) {return polyToCircle(obj1, obj2);}
    if (!Array.isArray(obj1) && Array.isArray(obj2)) {return polyToCircle(obj2, obj1);}
    if (!Array.isArray(obj1) && !Array.isArray(obj2)) {return circleToCircle(obj1, obj2);}
  };
})();
