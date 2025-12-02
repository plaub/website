export enum PaceType {
  Pace = "Pace",
  Speed = "Speed",
}

export enum PaceUnit {
  Run = "min/km",
  Swim = "min/100m",
}

export enum SpeedUnit {
  Bike = "km/h",
}

export enum DistanceUnit {
  Bike = "km",
  Run = "m",
  Swim = "m",
}

// Helper function to get PaceUnit from string
export const getPaceUnitFromString = (unit: string): PaceUnit => {
  switch (unit) {
    case "min/100m":
      return PaceUnit.Swim;
    case "min/km":
    default:
      return PaceUnit.Run;
  }
};

// Helper function to get DistanceUnit from string
export const getDistanceUnitFromString = (unit: string): DistanceUnit => {
  switch (unit) {
    case "km":
      return DistanceUnit.Bike;
    case "m":
    default:
      return DistanceUnit.Run;
  }
};

export enum SportsType {
  Swim = "Schwimmen",
  Bike = "Radfahren",
  Run = "Laufen",
  Rowing = "Rudern",
  Hiking = "Wandern",
  Walking = "Gehen",
}

export enum CompetitionType {
  Individual = "individual",
  Sprint = "sprint",
  Olympic = "olympic",
  MiddleDistance = "md",
  LongDistance = "ld",
  Duathlon = "duathlon",
}

export interface SportActivity {
  type: SportsType;
  distance: number; // in meters (for Run/Swim) or km (for Bike)
  time: number; // in seconds
  paceOrSpeed: number; // pace in sec/100m (Swim) or sec/km (Run) or speed in km/h (Bike)
}

export interface PaceCalculation {
  id: string;
  name: string;
  timestamp: number;
  activities: SportActivity[];
  transitionTimes: Record<number, number>;
  dayTimeStart: number;
  presetType: string;
  totalTime: number;
}
