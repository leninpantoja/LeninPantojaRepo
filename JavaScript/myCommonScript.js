// *** my JavaScript code ***
// Identify action
// To identify version: v1 = Between 2 Points; v2 = Random Rebound; v3 = Bouncing Ball
let myActionType = document.getElementById("divActionID").getAttribute("actiontype");
var myVersion1Flag = (myActionType == "v1");
// alert(myActionType);
//  *** Buttons control ***
setButtons(true); // Play enabled - Pause disable
function setButtons(pPlayFlag) {
  document.getElementById("btnPlay").disabled = pPlayFlag;
  document.getElementById("btnPause").disabled = !pPlayFlag;
}

// *** Container control ***
const cContainer = {
  width: 500, // px
  height: 500 // px
};

let myContainer = document.getElementById("divContainer");
	// This is used/shared below
setObjectVisibleAndDimension(myContainer, cContainer); // set Container dimension
function setObjectVisibleAndDimension(pObject, cDimensions) {
	pObject.style.visibility = "visible";
  pObject.style.width = cDimensions.width + "px";
  pObject.style.height = cDimensions.height + "px";
}

// *** Ball control ***
const cRadius = 5; // px
const cBall = {
  radious: cRadius,
  width: cRadius * 2,
  height: cRadius * 2,
  milisecondsSpeed: 2
};

var myBall = document.getElementById("divBall");
var myPontA = document.getElementById("divPontA");
var myPontB = document.getElementById("divPontB");

setObjectVisibleAndDimension(myBall, cBall); // set Ball dimension
if (myVersion1Flag) { // just version1 shows all the points, A, B, and Current point
	setObjectVisibleAndDimension(myPontA, cBall); // set PointA dimension
	setObjectVisibleAndDimension(myPontB, cBall); // set PointA dimension
}

// Main object that contains all the properties to apply line-equation-2points and determine ball movement
var myMainObject = {
  pointA: {x:0, y:0},
  pointB: {x:0, y:0},
  slope: 0,
  angle: 0, // not used yet
  increaseByXFlag: false,
  increment: 0,
  currentPostition: {x:0, y:0}
};

setObjects(myMainObject, myPontA, myBall, myPontB);
// This is used/shared below
function setObjects(pMainObject, pPontA, pBall, pPontB) {
  // set myMainObject by using line-equation-2points with Random PointA and PointB and determine ball movement
	setMainObject(pMainObject);
  // alert(Object.values(myMainObject.pointA));
  setObjectPositionAndColor(pBall, pMainObject.pointA); // set Ball Position and Color
	if (myVersion1Flag) { // just version1 shows all the points, A, B, and Current point
	  setObjectPositionAndColor(pPontA, pMainObject.pointA); // set PointA Position and Color
	  setObjectPositionAndColor(pPontB, pMainObject.pointB); // set PointB Position and Color
	}

  function setMainObject(pMainObject) {
  	// true = Keep reach limit/current point as start Point A; false = Point A as random
  	let myInitFlag = areTwoPointsEqualsFlag(pMainObject.pointA, pMainObject.pointB); // if both points are equal, so this is the ini
    let myPointARandomFlag = (myVersion1Flag || myInitFlag);
    pMainObject.pointA = (myPointARandomFlag) ? randomPoint(cContainer, cBall) : setObjectPointValues(pMainObject.currentPostition);
    // just to make sure PointB is different to PointA
    do {
      pMainObject.pointB = randomPoint(cContainer, cBall);
    } while (areTwoPointsEqualsFlag(pMainObject.pointA, pMainObject.pointB));
    // apply math equation and logic to determine ball movement
    pMainObject.slope = getSlope(pMainObject.pointA, pMainObject.pointB);
    pMainObject.increaseByXFlag = increaseByXFlag(pMainObject.slope);
    pMainObject.increment = getIncrement(pMainObject.pointA, pMainObject.pointB, pMainObject.increaseByXFlag); //px
  	// Original assign, but it does not work in ie
    // pMainObject.currentPostition = Object.assign({}, pMainObject.pointA); // Copy the values, NOT the reference, but it doesnot work in ie
    pMainObject.currentPostition = setObjectPointValues(pMainObject.pointA); // Copy the values, NOT the reference

    function areTwoPointsEqualsFlag(pPoint1, pPoint2) {
    	// Original Object comparation, but it does not work in ie
    	// (Object.entries(pMainObject.pointA).toString() === Object.entries(pMainObject.pointB).toString())
    	return (pPoint1.x == pPoint2.x && pPoint1.y == pPoint2.y);
    }
    function setObjectPointValues(pPoint) {
	    let myPoint = {x:0, y:0};
	    myPoint.x = pPoint.x;
	    myPoint.y = pPoint.y;

    	return myPoint;
    }
	  // Get random Point A (xa, ya) and B (xb, yb)
	  function randomPoint(pContainer, pBall) {
	    let myPoint = {x:0, y:0};
	    let myLimit;

	    myLimit = pContainer.width - pBall.width + 1;
	    myPoint.x = randomWithLimitAndRound(myLimit);

	    myLimit = pContainer.height - pBall.height + 1;
	    myPoint.y = randomWithLimitAndRound(myLimit);

	    return myPoint;
	  }
	  // Math references
	  /*
	    https://www.mathsisfun.com/algebra/line-equation-2points.html
	    Step 1: Find the Slope (or Gradient) from 2 Points;
	      m = (ya - yb) / (xa - xb)
	    Step 2: The "Point-Slope Formula"
	      y - y1 = m (x - x1)
	    Step 3: Simplify
	      y = mx + b
	    The Big Exception: vertical line: xa and xb the same; m = undefined
	    So, x = xa (constant)
	  */
	  function getSlope(pPointA, pPointB) {
	    return (pPointA.y - pPointB.y) / (pPointA.x - pPointB.x);
	  }
	  function increaseByXFlag(p_mSlope) {
	    return (isFinite(p_mSlope) && Math.abs(p_mSlope) <= 1.00); // this means x line is equal or larger than y
	  }
	  function getIncrement(pPointA, pPointB, p_increaseByXFlag) {
	    let myScalarPointA = (p_increaseByXFlag) ? pPointA.x : pPointA.y;
	    let myScalarPointB = (p_increaseByXFlag) ? pPointB.x : pPointB.y;

	    return (myScalarPointA < myScalarPointB) ? 0.5 : -0.5; // px
	  }
  }
	function setObjectPositionAndColor(pObject, pPont) {
		setObjectPosition(pObject, pPont)
    pObject.style.backgroundColor = randomRGBColor();

    function randomRGBColor() {
      const cColorLimit = 255;
      const cMinColorValue = Math.round(cColorLimit / 2);
      let myRed, myGreen, myBlue;
      let myGreaterValue = 0; // to set the first greates value to minimize looping
      // to make sure ball in not BLACK to be visible in the container
      do {
        myRed = (myRed == myGreaterValue) ? myGreaterValue : randomWithLimitAndRound(cColorLimit + 1);
        myGreen = (myGreen == myGreaterValue) ? myGreaterValue : randomWithLimitAndRound(cColorLimit + 1);
        myBlue = (myBlue == myGreaterValue) ? myGreaterValue : randomWithLimitAndRound(cColorLimit + 1);
        myGreaterValue = (myGreaterValue == 0) ? Math.max(myRed, myGreen, myBlue) : myGreaterValue;
      } while ((myRed + myGreen + myBlue) < cMinColorValue);
      
      return "rgb(" + myRed + "," + myGreen + "," + myBlue + ")";
    }
	}
  // Random common in this function 
  function randomWithLimitAndRound(pLimit) {
    return Math.floor(Math.random() * pLimit);
  }
}

// This is used/shared below
function setObjectPosition(pObject, pPont) {
  pObject.style.left = pPont.x + "px";
  pObject.style.top = pPont.y + "px";
}
// *** Execution ***
Play();
function Play() {
  setButtons(true); // Play disable - Pause enabled
  myIntervalID = setInterval(movementLogic, cBall.milisecondsSpeed);

  function movementLogic() {
    calculateBallNextMovement(myMainObject);
		setObjectPosition(myBall, myMainObject.currentPostition); // set Ball Current Position

    let myReachLimitFlag = (myVersion1Flag) ? reachLimitFlag(myMainObject.currentPostition, myMainObject.pointB, myMainObject.increaseByXFlag, myMainObject.increment) : needReboundFlag(cContainer, cBall, myMainObject.currentPostition);
    if (myReachLimitFlag) setObjects(myMainObject, myPontA, myBall, myPontB);

    function calculateBallNextMovement(pMainObject) {
      if (pMainObject.increaseByXFlag) {
        pMainObject.currentPostition.x += pMainObject.increment;
        pMainObject.currentPostition.y = getYbasedonX(pMainObject.pointA, pMainObject.slope, pMainObject.currentPostition.x);
      } else {
        pMainObject.currentPostition.y += pMainObject.increment;
        pMainObject.currentPostition.x = getXbasedonY(pMainObject.pointA, pMainObject.slope, pMainObject.currentPostition.y);
      }

		  function getYbasedonX(pPointA, p_mSlope, px) {
		    // y - y1 = m (x - x1)
		    // y = m (x - x1) + y1
		    return p_mSlope * (px - pPointA.x) + pPointA.y;
		  }
		  function getXbasedonY(pPointA, p_mSlope, py) {
		    // y - y1 = m (x - x1)
		    // x - x1 = (y - y1) / m
		    // x = ((y - y1) / m) + x1
		    return ((py - pPointA.y) / p_mSlope) + pPointA.x;
		  }
    }
	  function reachLimitFlag(pCurrentPoint, pPointB, pIncreaseByXFlag, pIncrement) {
	    let myCurrentPointScalar = (pIncreaseByXFlag) ? pCurrentPoint.x : pCurrentPoint.y; // use x or y from CurrentPoint
	    let myPointBScalar = (pIncreaseByXFlag) ? pPointB.x : pPointB.y; // use x or y from PointB
	      
	    return (pIncrement > 0) ? (myCurrentPointScalar >= myPointBScalar) : (myCurrentPointScalar <= myPointBScalar);
	  }
    function needReboundFlag(pContainer, pBall, pCurrentPoint) {
      let myLowLimit = 0; // for both x and y
      let myHighLimit = pContainer.width - pBall.width; // starting for x
      let myXLimitFlag = (pCurrentPoint.x <= myLowLimit || pCurrentPoint.x >= myHighLimit);

      myHighLimit = pContainer.height - pBall.height; // for y
      let myYLimitFlag = (pCurrentPoint.y <= myLowLimit || pCurrentPoint.y >= myHighLimit);

      return (myXLimitFlag || myYLimitFlag);
    }
  }
}

function Pause() {
  setButtons(false); // Play enabled - Pause disable
  clearInterval(myIntervalID);
}
