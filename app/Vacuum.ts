import { after } from "node:test";

//This will be the class which holds all the functionality
type Position = {
  x: number;
  y: number;
  orientation: string;
};

////////////////////////////////////
//           Enums               //
////////////////////////////////////

enum Orientation {
  N = "N", //= "north"
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

  ////////////////////////////////////
  //           Constructor          //
  ////////////////////////////////////
  constructor(x: number, y: number) {
    //cannot accept negative x and y -- WRITE CHECK
    this.gridXValue = x;
    this.gridYValue = y;

    this.isInitialized = false;
  }

  ////////////////////////////////////
  //        Public Functions        //
  ////////////////////////////////////

  /**
   * NOTES:
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

    //Check Orientation params
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
    this.checkInstructionsValid(instructions);
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
      let currPosition: Position = this.currentPosition;

      for (let i = 0; i < this.instructions.length; i++) {
        let currCommand = this.instructions[i];

        console.log("- - -Command- - -", currCommand);

        if (currCommand == Commands.A) {
          let afterMovePos: Position;
          afterMovePos = this.moveForward(currPosition);

          currPosition.x = afterMovePos.x;
          currPosition.y = afterMovePos.y;
          currPosition.orientation = afterMovePos.orientation;
        } else if (currCommand == Commands.D) {
          let newOrientation = this.changeOrientationRight(
            currPosition.orientation
          );
          currPosition.orientation = newOrientation;
        } else {
          currPosition.orientation = this.changeOrientationLeft(
            currPosition.orientation
          );
        }
      }
      console.log("newPosition after instruction", currPosition);
    } else {
      throw new TypeError("Instructions are empty!");
    }
  }

  /**
   * Changes orientation 90 to the right
   *
   * @param currOrientation
   * @returns newOrientation
   */
  private changeOrientationRight(currOrientation: string): string {
    let newOrientation = currOrientation;
    console.log("Orientation changed right from", currOrientation);

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
    console.log("Orientation changed right to", newOrientation);

    return newOrientation;
  }

  /**
   *Changes orientation 90 to the left
   *
   * @param currOrientation
   * @returns currOrientation
   */
  private changeOrientationLeft(currOrientation: string): string {
    console.log("Orientation changed left from: ", currOrientation);
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
    console.log("Orientation changed left to: ", currOrientation);
    return currOrientation;
  }

  /**
   * This will depend of the orientation & current position
   * If at the boundary/wall change orientation
   *
   * NOTE: I made the decision for the vacuum to persist on turning right until it finds a viable path
   *
   * @param currPos
   * @returns
   */
  private moveForward(currPos: Position): Position {
    console.log("Move one forward, from: ", currPos);

    //Evaluate if the current position is at the boundary or corners
    //if at a boundary then change orientation to the right
    //will keep rotating right if keeps on going to hit the wall
    while (
      (currPos.orientation === Orientation.N && currPos.y == this.gridYValue) ||
      (currPos.orientation === Orientation.S && currPos.y == 0) ||
      (currPos.orientation === Orientation.E && currPos.x == this.gridXValue) ||
      (currPos.orientation === Orientation.W && currPos.x == 0)
    ) {
      //change orientation
      console.log(
        "Hit boundary, orientation changed from: ",
        currPos.orientation
      );
      currPos.orientation = this.changeOrientationRight(currPos.orientation);
      console.log(
        "Hit boundary, orientation changed to: ",
        currPos.orientation
      );
    }

    if (currPos.orientation === Orientation.N) {
      //check if at boundary
      if (currPos.y == this.gridYValue) {
        //change orientation
      }
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
    console.log("Move one forward, to ", currPos);
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
   */
}
