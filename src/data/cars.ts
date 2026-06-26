export interface EncarCar {
  Id: string;
  Manufacturer: string;
  Model: string;
  Badge: string;
  BadgeSub?: string;
  SeriesName?: string;
  FormYear: string;
  Year: number;
  FuelType: string;
  Transmission: string;
  CylinderCapacity: number;
  Displacement?: number;
  Mileage: number;
  Color: string;
  InteriorColor?: string;
  Price: number;
  Photo?: string;
  // Encar search results use `location`; detail endpoint uses `RealName`
  Photos?: { location?: string; RealName?: string; type?: string; ordering?: number }[];
  Accident: number;
  AccidentSelf?: number;
  Owners: number;
  OneOwner?: string;
  Certified?: string;
  Region?: string;
  Area?: string;
  // Performance
  EnginePower?: number;
  EngineTorque?: number;
  FuelEfficiency?: number;
  NumberOfCylinders?: number;
  NumberOfGears?: number;
  DriveType?: string;
  // Options / features
  Options?: { Name: string }[];
  // Warranty / ownership
  Warranty?: string;
  // Body / dimensions
  VehicleType?: string;
  SeatingCapacity?: number;
  DoorCount?: number;
  ImportedCar?: string;
  Weight?: number;
  Length?: number;
  Width?: number;
  Height?: number;
  WheelBase?: number;
  FuelTankCapacity?: number;
  MaximumLoad?: number;
  TireCondition?: { FL?: string; FR?: string; RL?: string; RR?: string };
}

// Alias for any remaining legacy references
export type Car = EncarCar;
