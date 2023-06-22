import { after } from "node:test";

//This will be the class which holds all the functionality
type Position = {
  x: number;
  y: number;
  orientation: string;
};

enum Orientation {
  N = "N", // north
  E = "E", //= "east",
  W = "W", //= "west",
  S = "S", //= "south"
}

enum Commands {
  D = "D", //rotate 90 degrees to the right
  G = "G", //rotate 90 degrees to the left
  A = "A", //move 1 step relative to orientation
}

export class Vacuum {
  ////////////////////////////////////
  //        Global Variables        //
  ////////////////////////////////////
  public initialPosition!: Position;
  public currentPosition!: Position;
  public gridXValue: number;
  public gridYValue: number;
  public isInitialized!: boolean;
  public instructions: string[] = [];

  //ENUMS

  //structs from position
  //constructor
  //Need to initialize the grid/matrix
  ////////////////////////////////////
  //           Constructor          //
  ////////////////////////////////////
  constructor(x: number, y: number) {
    //cannot accept negative x and y -- WRITE CHECK
    this.gridXValue = x;
    this.gridYValue = y;

    this.isInitialized = false;

    //this.initializePosition(0, 0, "N");
  }

  ////////////////////////////////////
  //        Public Functions        //
  ////////////////////////////////////

  /**
   * NOTES:
   * 1. Would this fail if called without initializing class? YES
   * 2. cannot be reinitailized
   * 3. Typescript does not have a primitive char type
   * 4. Based on the instructions, the lower most left is 0,0 so no negative area
   * 5. Check that the initial position is not out of bounds of the grid
   *
   * @param initXPos
   * @param initYPos
   * @param initOrientation
   */
  public initializePosition(
    initXPos: number,
    initYPos: number,
    initOrientation: string
  ): void {
    //Initial out of bounds check
    this.isOutOfBounds(initXPos, initYPos);

    //Check Orientation param
    if (initOrientation in Orientation) {
      if (!this.isInitialized) {
        //Numbers must not be less than zero
        //orientation must be single letter and capital..

        //Keep for logging when showing path
        this.initialPosition = {
          x: initXPos,
          y: initYPos,
          orientation: initOrientation,
        };

        //currentPosition initially is initialPosition
        this.currentPosition = {
          x: this.initialPosition.x,
          y: this.initialPosition.y,
          orientation: this.initialPosition.orientation,
        };

        //set flag
        this.isInitialized = true;

        console.log("Print initial position: ", this.initialPosition);
      } else {
        throw new TypeError("Position is already initialized");
      }
    } else {
      //May need to evaluate each params for better error
      throw new TypeError("Invalid Orientation");
    }
  }

  /**
   * Note:
   * 1. Is there a limit for the length of the instruction?
   * 2. Cannot set new position if isInitialized is False
   * @param instructions "DDAGAG"
   * @returns new position
   */
  public setNewPosition(instructions: string): Position {
    //Param Checks:
    //Parse instructions put in array
    //Must only accept ACCEPTED combination of letters
    //can only set a new position once initialized
    this.checkInstructionsValid(instructions);
    //Do something here to calculate new position
    //calculate new position
    //this.currentPosition = //
    this.calculateNewPosition();

    return this.currentPosition;
  }

  ////////////////////////////////////
  //        Helper Functions        //
  ////////////////////////////////////

  /**
   * Checks if the initial position of the vacuum is out of bounds
   */
  private isOutOfBounds(initXPos: number, initYPos: number): Error | void {
    if (
      initXPos > this.gridXValue ||
      initYPos > this.gridYValue ||
      initXPos < 0 ||
      initYPos < 0
    ) {
      throw new TypeError("Given positions are out of bounds");
    }
    // return initXPos > this.gridXValue || initYPos > this.gridYValue
    //   ? true
    //   : false;
  }

  /**
   * Checks validity of input:
   * only accepts D , G , and A
   *
   * Checks if initialized
   *
   * Stores instructions in an array
   * @param instruction
   */
  private checkInstructionsValid(instruction: string): Error | void {
    if (!this.isInitialized) {
      throw new TypeError("Initial position must be initialized");
    }

    //Parse string
    this.instructions = Array.from(instruction);

    //Traverse array for checks
    for (let i = 0; i < this.instructions.length; i++) {
      if (this.instructions[i] in Commands) {
        //console.log("command: ", this.instructions[i]);
      } else {
        //console.error("Not valid: ", this.instructions[i]);
        throw new TypeError("Given command is invalid");
      }
    }
  }

  /**
   * Process the instructions and returns new position
   * @param instructions
   */
  private calculateNewPosition() {
    if (this.instructions.length != 0) {
      //traverse array
      let currPosition: Position = this.currentPosition;

      console.log("Before", this.currentPosition);

      for (let i = 0; i < this.instructions.length; i++) {
        let currCommand = this.instructions[i];

        console.log("- - -Command- - -", currCommand);

        if (currCommand == Commands.A) {
          //console.log("ENTERED A branch");
          let afterMovePos: Position;
          afterMovePos = this.moveForward(currPosition);

          currPosition.x = afterMovePos.x;
          currPosition.y = afterMovePos.y;
          currPosition.orientation = afterMovePos.orientation;
          // console.log("afterMovePos", afterMovePos);
          // console.log("currPosition", currPosition);
          //currPosition.x = this.moveForward(currPosition).x;
        } else if (currCommand == Commands.D) {
          //console.log("ENTERED D branch");
          //rotate 90 degrees to the right
          //change orientation to either x or y, either pointing N,E,W,S
          let newOrientation = this.changeOrientationRight(
            currPosition.orientation
          );
          currPosition.orientation = newOrientation;
          console.log("current orientation changed to: ", newOrientation);
        } else {
          //currCommand == Commands.G;
          // console.log("ENTERED G branch");

          //rotate 90 degrees to the left
          //change orientation to either x or y, either pointing N,E,W,S
          currPosition.orientation = this.changeOrientationLeft(
            currPosition.orientation
          );

          // console.log(
          //   "current orientation changed to: ",
          //   currPosition.orientation
          // );
        }
      }
      console.log("newPosition after instruction", currPosition);
    } else {
      throw new TypeError("Instructions are empty!");
    }
  }

  /**
   *
   * @param currOrientation
   * @returns
   */
  private changeOrientationRight(currOrientation: string): string {
    let newOrientation = currOrientation;
    console.log("changeOrientationRight from ", currOrientation);

    if (currOrientation === Orientation.N) {
      newOrientation = Orientation.E;
    } else if (currOrientation === Orientation.E) {
      newOrientation = Orientation.S;
    } else if (currOrientation === Orientation.S) {
      newOrientation = Orientation.W;
    } else {
      //if west
      newOrientation = Orientation.N;
    }
    console.log("changeOrientationRight to", newOrientation);

    return newOrientation;
  }

  private changeOrientationLeft(currOrientation: string): string {
    if (currOrientation === Orientation.N) {
      currOrientation = Orientation.W;
    } else if (currOrientation === Orientation.W) {
      currOrientation = Orientation.S;
    } else if (currOrientation === Orientation.S) {
      currOrientation = Orientation.E;
    } else {
      //if east
      currOrientation = Orientation.N;
    }
    return currOrientation;
  }

  //This will depend of the orientation & current position
  //If at the boundary/wall change orientation
  private moveForward(currPos: Position): Position {
    //If hit a wall/boundary then keep turning right until there is a path
    //...other option is to throw an error

    //Evaluate if the current position is at the boundary
    //corners
    //if at a boundary
    if (currPos.x == this.gridXValue || currPos.x == 0) {
      //change orientation
    }

    if (currPos.orientation === Orientation.N) {
      // console.log("N");
      currPos.y += 1;
    } else if (currPos.orientation === Orientation.E) {
      // console.log("E");
      currPos.x += 1;
    } else if (currPos.orientation === Orientation.S) {
      // console.log("S");
      currPos.y -= 1;
    } else {
      // console.log("W");
      //W
      currPos.x -= 1;
    }

    return currPos;
  }

  /**
   * Consider edge cases
   * At northern wall pointing north: N, y = max
   * At southers wall pointing south: S, y = 0
   * At east wall pointing east: E, x = max
   * At western wall points west: W, x = 0
   *
   * corners
   * [0,0] , [max,max] , [0,max], [max,0]
   *
   * @param currPos
   * @returns
   */
  calculatePosition(currPos: number): number {
    let futurePosition = currPos + 1;

    //at boundary
    if (currPos == this.gridXValue || currPos == 0) {
    }
    return currPos;
  }
}
