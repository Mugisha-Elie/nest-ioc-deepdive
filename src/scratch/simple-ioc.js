class SimpleContainer {
  constructor() {
    this.recipes = new Map();
    this.shelf = new Map();
  }
  register(name, recipeFunction){
    this.recipes.set(name, recipeFunction)
  }

  get(name) {
    if (this.shelf.has(name)) {
      return this.shelf.get(name);
    }

    const recipe = this.recipes.get(name)
    if (!recipe) {
      throw new Error(`I don't have a recipe for: ${name}`)
    }

    const instance = recipe(this);
    this.shelf.set(name, instance);
    return instance;
  }
}


class Engine {
  start() {
    console.log("Vroom")
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }

  drive() {
    this.engine.start();
    console.log("Driving down the road")
  }
}

class Driver {
  constructor(car) {
    this.car = car;
  }

  commute() {
    console.log("Driver starting the commute...");
    this.car.drive()
  }
}

const container = new SimpleContainer();
container.register("engine", () => new Engine());
container.register("car", (c) => {
  const engine = c.get("engine")
  return new Car(engine)
})
container.register("driver", (c) => {
  const car = c.get("car");
  return new Driver(car)
})

const myCar = container.get("car");
myCar.drive();

console.log("\nThe Driver:")
const driver = container.get("driver");
driver.commute()