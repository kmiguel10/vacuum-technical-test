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
  test("set new position", () => {
    const vacuum = new Vacuum(10, 10);
    vacuum.initializePosition(5, 5, "N");
    let newPos = vacuum.setNewPosition("G");
    console.log(newPos);
  });
});
