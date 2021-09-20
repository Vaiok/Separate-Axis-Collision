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
  function compareMags(projVec, magn, obj1, obj2, magType) {
    projVec.x *= 1/magn;
    projVec.y *= 1/magn;
    let mainMag = polyMags(obj1, projVec);
    let otherMag = magType(obj2, projVec);
    return (mainMag.max < otherMag.min || mainMag.min > otherMag.max) ? false : true;
  }
  function projectCompare(vPoint, obj1, obj2, magType) {
    let othInd = vPoint + 1;
    if (vPoint === obj1.length-1) {othInd = 0;}
    let projVec = {x: -(obj1[othInd].y - obj1[vPoint].y), y: obj1[othInd].x - obj1[vPoint].x};
    return (!compareMags(projVec, Math.hypot(projVec.x, projVec.y), obj1, obj2, magType)) ? false : true;
  }
  function polyToPoly(obj1, obj2) {
    for (let obj = 0; obj < 2; obj++) {
      let mainObj = obj1, otherObj = obj2;
      if (obj === 1) {mainObj = obj2, otherObj = obj1;}
      for (let vPoint = 0; vPoint < mainObj.length; vPoint++) {
        if (!projectCompare(vPoint, mainObj, otherObj, polyMags)) {return false;}
      }
    }
    return true;
  }
  function polyToCircle(obj1, obj2) {
    let cPoint, cDist;
    for (let vPoint = 0; vPoint < obj1.length; vPoint++) {
      let newDist = Math.hypot(obj1[vPoint].x - obj2.x, obj1[vPoint].y - obj2.y);
      if (cDist === undefined || cDist > newDist) {
        cDist = newDist;
        cPoint = vPoint;
      }
      if (!projectCompare(vPoint, obj1, obj2, circleMags)) {return false;}
    }
    let projVec = {x: obj1[cPoint].x - obj2.x, y: obj1[cPoint].y - obj2.y};
    return (!compareMags(projVec, cDist, obj1, obj2, circleMags)) ? false : true;
  }
  function circleToCircle(obj1, obj2) {
    let dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
    return (dist > obj1.rad + obj2.rad) ? false : true;
  }

  return function(obj1, obj2) {
    return (Array.isArray(obj1) && Array.isArray(obj2)) ? polyToPoly(obj1, obj2) :
          (Array.isArray(obj1) && !Array.isArray(obj2)) ? polyToCircle(obj1, obj2) :
          (!Array.isArray(obj1) && Array.isArray(obj2)) ? polyToCircle(obj2, obj1) :
          circleToCircle(obj1, obj2);
  };
})();
