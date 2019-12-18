// *** my JavaScript code ***
// Identify action
// To identify version: v1 = Between 2 Points; v2 = Random Rebound; v3 = Bouncing Ball
let myActionType = document.getElementById("divActionID").getAttribute("actiontype");
var myVersion1Flag = (myActionType == "v1");
var myVersion3Flag = (myActionType == "v3");
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
	let myWidth = (typeof(cDimensions.width) === 'undefined') ? cDimensions.diameter : cDimensions.width;
	let myHeight = (typeof(cDimensions.height) === 'undefined') ? cDimensions.diameter : cDimensions.height;
  pObject.style.width = myWidth + "px";
  pObject.style.height = myHeight + "px";
}

// *** Ball control ***
const cRadius = 5; // px
const cBall = {
  radius: cRadius,
  diameter: cRadius * 2,
  increment: 1, // px
  milisecondsSpeed: 5
};

var myBall = document.getElementById("divBall");
var myPontA = document.getElementById("divPontA");
var myPontB = document.getElementById("divPontB");

setObjectVisibleAndDimension(myBall, cBall); // set Ball dimension
if (myVersion1Flag) { // just version1 shows all the points, A, B, and Current point
	setObjectVisibleAndDimension(myPontA, cBall); // set PointA dimension
	setObjectVisibleAndDimension(myPontB, cBall); // set PointB dimension
}

// Main object that contains all the properties to apply line-equation-2points and determine ball movement
var myMainObject = {
  pointA: {x:0, y:0},
  pointB: {x:0, y:0},
  angle: 0,
  currentPoint: {x:0, y:0},
  limitReachedXY: ""
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
    pMainObject.pointA = (myVersion1Flag || myInitFlag) ? randomPoint(cContainer, cBall) : setObjectPointValues(pMainObject.currentPoint);
    let myReboundAngle = null;
    if (myVersion3Flag && !myInitFlag) {
    	myReboundAngle  = calculateReboundAngle(pMainObject.angle, pMainObject.limitReachedXY);
    	//lap
    } else {
	    // just to make sure PointB is different to PointA
	    do {
	      pMainObject.pointB = randomPoint(cContainer, cBall);
	    } while (areTwoPointsEqualsFlag(pMainObject.pointA, pMainObject.pointB));
    }
    // apply math equation and logic to determine ball movement
  	pMainObject.angle = (myReboundAngle == null) ? calculateAngleInDegrees(pMainObject.pointA, pMainObject.pointB) :  myReboundAngle;
    pMainObject.currentPoint = setObjectPointValues(pMainObject.pointA);

    function areTwoPointsEqualsFlag(pPoint1, pPoint2) {
    	// Original Object comparation, but it does not work in ie
    	// (Object.entries(pMainObject.pointA).toString() === Object.entries(pMainObject.pointB).toString())
    	return (pPoint1.x == pPoint2.x && pPoint1.y == pPoint2.y);
    }
	  // Get random Point A (xa, ya) and B (xb, yb)
	  function randomPoint(pContainer, pBall) {
	    let myLimit;

	    myLimit = pContainer.width - pBall.diameter + 1;
	    let myPointX = randomWithLimitAndRound(myLimit);

	    myLimit = pContainer.height - pBall.diameter + 1;
	    let myPointY = randomWithLimitAndRound(myLimit);

	    return {x:myPointX, y:myPointY};
	  }
    function setObjectPointValues(pPoint) {
	  	// Original assign, but it does not work in ie
	    // pMainObject.currentPoint = Object.assign({}, pMainObject.pointA); // Copy the values, NOT the reference, but it doesnot work in ie
    	return {x:pPoint.x, y:pPoint.y};
    }
    function calculateReboundAngle(pAngle, limitReachedXY) {
    	// refletion angle: if x, (180 - Angle); otherwise y, just set negative angle
    	return (limitReachedXY == "x") ? (180 - pAngle) : - pAngle;
    }
	  // Math references
	  // Original idea
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
    // Math reference
    /*
    	Find angle according to m slope
     	https://math.stackexchange.com/questions/707673/find-angle-in-degrees-from-one-point-to-another-in-2d-space
     	tan(θ)=m
     	θ=tan−1(m)
    */
		function calculateAngleInDegrees(pPointA, pPointB) {
			return (180 * Math.atan2(pPointB.y - pPointA.y, pPointB.x - pPointA.x) / Math.PI);
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
function setObjectPosition(pObject, pPoint) {
  pObject.style.left = pPoint.x + "px";
 	pObject.style.top = cContainer.height - pPoint.y - cBall.diameter + "px";
}
// *** Execution ***
Play();
function Play() {
  setButtons(true); // Play disable - Pause enabled
  myIntervalID = setInterval(movementLogic, cBall.milisecondsSpeed);

  function movementLogic() {
    myMainObject.currentPoint = calculateBallNextMovement(myMainObject.currentPoint, cBall.increment, myMainObject.angle);
		setObjectPosition(myBall, myMainObject.currentPoint); // set Ball Current Position

    //let myReachLimitFlag = (myVersion1Flag) ? reachLimitFlag(myMainObject.currentPoint, myMainObject.pointB, myMainObject.angle) : needReboundFlag(cContainer, cBall, myMainObject.currentPoint, myMainObject.pointA);
    let myReachLimitFlag;
    let myXLimitFlag = false;
    let myYLimitFlag = false;
    if (myVersion1Flag) {
			myReachLimitFlag = reachLimitFlag(myMainObject.currentPoint, myMainObject.pointB, myMainObject.angle)
    } else {
    	// if rebound, need to know if limit reached on X or Y
	    myXLimitFlag = reachContainerLimitFlag(myMainObject.currentPoint.x, 0, cContainer.width - cBall.diameter);
	    myYLimitFlag = reachContainerLimitFlag(myMainObject.currentPoint.y, 0, cContainer.height - cBall.diameter);
	    myReachLimitFlag = (myXLimitFlag || myYLimitFlag);
    }
    if (myReachLimitFlag) {
    	myMainObject.limitReachedXY = (myXLimitFlag) ? "x" : "y";
    	setObjects(myMainObject, myPontA, myBall, myPontB);
    }

    function calculateBallNextMovement(pPointIni, pDist, pAngle) {
			// New one by using the angle with Cos/Sin
    	let myPointX = getNewXPoint(pPointIni.x, pDist, pAngle);
    	let myPointY = getNewYPoint(pPointIni.y, pDist, pAngle);
    	return {x:myPointX, y:myPointY};

			function getNewXPoint(pxIni, pDist, pAngle) {
				return (pDist * Math.cos(pAngle * Math.PI / 180)) + pxIni;
			}
			function getNewYPoint(pyIni, pDist, pAngle) {
				return (pDist * Math.sin(pAngle * Math.PI / 180)) + pyIni;
			}
    }
	  function reachLimitFlag(pCurrentPoint, pPointB, pAngle) {
	  	let myABSAngle = Math.abs(pAngle);
	  	let myCheckByXFlag = (myABSAngle != 90); // consider X if not 90 degrees
	    let myCurrentPointScalar = (myCheckByXFlag) ? pCurrentPoint.x : pCurrentPoint.y; // use x or y from CurrentPoint
	    let myPointBScalar = (myCheckByXFlag) ? pPointB.x : pPointB.y; // use x or y from PointB
	      
	  	let myPositiveIncrementFlag = (myCheckByXFlag) ? (myABSAngle < 90) : (pAngle > 0);

	    return (myPositiveIncrementFlag > 0) ? (myCurrentPointScalar >= myPointBScalar) : (myCurrentPointScalar <= myPointBScalar);
	  }
    function needReboundFlag(pContainer, pBall, pCurrentPoint, pPointA) {
    	// pPointA as initial point
      const myLowLimit = 0; // for both x and y
      let myHighLimit = pContainer.width - pBall.diameter; // starting for x
      let myLimit = (pCurrentPoint.x > pPointA.x) ? myHighLimit : myLowLimit; // for x
      let myXLimitFlag = (myLimit == myLowLimit) ? (pCurrentPoint.x <= myLimit) : (pCurrentPoint.x >= myLimit);

      myHighLimit = pContainer.height - pBall.diameter; // for y; for now it's the same since this is a square
      myLimit = (pCurrentPoint.y > pPointA.y) ? myHighLimit : myLowLimit; // for y
      let myYLimitFlag = (myLimit == myLowLimit) ? (pCurrentPoint.y <= myLimit) : (pCurrentPoint.y >= myLimit);

      return (myXLimitFlag || myYLimitFlag);
    }
    function reachContainerLimitFlag(pCurrentScalarPoint, pLowLimit, pHighLimit) {
      return (pCurrentScalarPoint <= pLowLimit || pCurrentScalarPoint >= pHighLimit);
    }
    // The Law of Reflection reference
    // https://www.rpi.edu/dept/phys/ScIT/InformationTransfer/reflrefr/rr_sample/rrsample_05.html
  }
}

function Pause() {
  setButtons(false); // Play enabled - Pause disable
  clearInterval(myIntervalID);
}
