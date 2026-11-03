export interface EyePower {
  sph: string;
  cyl: string;
  axis: string;
  add?: string;
  va?: string;
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  optometristName: string;
  od: EyePower;
  os: EyePower;
  pd: string;
  lensRecommendation?: string;
  remarks?: string;
}
