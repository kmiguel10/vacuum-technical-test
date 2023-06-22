import { Vacuum } from "../app/Vacuum";
import { describe, expect, test } from "@jest/globals";

//Need a setup function here

describe("Initial parameters", () => {
  test("initial grid values", () => {
    const vacuum = new Vacuum(1, 1);
    expect(vacuum.gridXValue).toBe(1);
    expect(vacuum.gridYValue).toBe(1);
  });

  test("initial vacuum position", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(2, 2, "N");

    expect(vacuum.initialPosition.x).toBe(2);
    expect(vacuum.initialPosition.y).toBe(2);
    expect(vacuum.initialPosition.orientation).toBe("N");
  });

  test("initializing position again should fail", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(2, 2, "N");

    expect(vacuum.initialPosition.x).toBe(2);
    expect(vacuum.initialPosition.y).toBe(2);
    expect(vacuum.initialPosition.orientation).toBe("N");

    expect(() => {
      vacuum.initializePosition(3, 3, "N");
    }).toThrow(TypeError);
  });

  test("initialize Position parameters negative x", () => {
    const vacuum = new Vacuum(1, 1);

    expect(() => {
      vacuum.initializePosition(-1, 3, "W");
    }).toThrow(TypeError);
  });

  test("initialize Position parameters negative y", () => {
    const vacuum = new Vacuum(1, 1);

    expect(() => {
      vacuum.initializePosition(1, -3, "W");
    }).toThrow(TypeError);
  });

  test("initialize Position out of bounds x", () => {
    const vacuum = new Vacuum(10, 10);

    expect(() => {
      vacuum.initializePosition(11, 4, "W");
    }).toThrow(TypeError);
  });

  test("initialize Position out of bounds y", () => {
    const vacuum = new Vacuum(10, 10);

    expect(() => {
      vacuum.initializePosition(10, 11, "W");
    }).toThrow(TypeError);
  });

  test("initialize Position parameters invalid orientation", () => {
    const vacuum = new Vacuum(1, 1);

    expect(() => {
      vacuum.initializePosition(1, 1, "Z");
    }).toThrow(TypeError);
  });
});

describe("set instructions", () => {
  test("invalid instructions input throws error", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(9, 9, "W");

    expect(() => {
      vacuum.setNewPosition("DDd");
    }).toThrow(TypeError);
  });
  test("setting new position without initalizing throws error", () => {
    const vacuum = new Vacuum(10, 10);
    //vacuum.initializePosition(9, 9, "W");

    expect(() => {
      vacuum.setNewPosition("DDd");
    }).toThrow(TypeError);
  });

  //test edge cases here, 4 corners of the grid
  test("set new position, test case 1", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(5, 5, "N");
    let newPos = vacuum.setNewPosition("DADADADAA");
    expect(vacuum.currentPosition.x).toBe(5);
    expect(vacuum.currentPosition.y).toBe(6);
    expect(vacuum.currentPosition.orientation).toBe("N");
    console.log(newPos);
  });

  //Test edge cases
  test("north boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(5, 8, "N");
    let newPos = vacuum.setNewPosition("AAA");
    expect(vacuum.currentPosition.x).toBe(6);
    expect(vacuum.currentPosition.y).toBe(10);
    expect(vacuum.currentPosition.orientation).toBe("E");
    console.log(newPos);
  });

  test("east boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(8, 7, "E");
    let newPos = vacuum.setNewPosition("AAAGA");
    expect(vacuum.currentPosition.x).toBe(10);
    expect(vacuum.currentPosition.y).toBe(5);
    expect(vacuum.currentPosition.orientation).toBe("S");
    console.log(newPos);
  });

  test("south boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(8, 7, "E");
    let newPos = vacuum.setNewPosition("AAAGAAAAAAA");
    expect(vacuum.currentPosition.x).toBe(9);
    expect(vacuum.currentPosition.y).toBe(0);
    expect(vacuum.currentPosition.orientation).toBe("W");
    console.log(newPos);
  });

  test("west boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(4, 2, "S");
    let newPos = vacuum.setNewPosition("DAAAAGADA");
    expect(vacuum.currentPosition.x).toBe(0);
    expect(vacuum.currentPosition.y).toBe(2);
    expect(vacuum.currentPosition.orientation).toBe("N");
    console.log(newPos);
  });

  test("corner (0,0) boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(0, 1, "S");
    let newPos = vacuum.setNewPosition("AA");
    expect(vacuum.currentPosition.x).toBe(0);
    expect(vacuum.currentPosition.y).toBe(1);
    expect(vacuum.currentPosition.orientation).toBe("N");
    console.log(newPos);
  });

  test("corner (0,max) boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(1, 10, "W");
    let newPos = vacuum.setNewPosition("AA");
    expect(vacuum.currentPosition.x).toBe(1);
    expect(vacuum.currentPosition.y).toBe(10);
    expect(vacuum.currentPosition.orientation).toBe("E");
    console.log(newPos);
  });

  test("corner (max,max) boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(10, 9, "N");
    let newPos = vacuum.setNewPosition("AA");
    expect(vacuum.currentPosition.x).toBe(10);
    expect(vacuum.currentPosition.y).toBe(9);
    expect(vacuum.currentPosition.orientation).toBe("S");
    console.log(newPos);
  });

  test("corner (max,0) boundary", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(9, 0, "E");
    let newPos = vacuum.setNewPosition("AA");
    expect(vacuum.currentPosition.x).toBe(9);
    expect(vacuum.currentPosition.y).toBe(0);
    expect(vacuum.currentPosition.orientation).toBe("W");
    console.log(newPos);
  });
});
