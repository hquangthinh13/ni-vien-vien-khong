export type gender = "Male" | "Female";

export interface BasicInfoComponent {
  fullName: string;
  dob: string; // ISO date string
  gender: gender;
  email: string;
  phoneNumber: string;
  address: string;
  haveZalo: boolean;
  zaloName: string;
}

// Identity Detail Component //
export type idIssueOrganisation =
  | "Bộ Công An"
  | "Cục Cảnh sát quản lý hành chính về trật tự xã hội"
  | "Cục Cảnh sát đăng ký quản lý cư trú và dữ liệu Quốc gia về dân cư"
  | "Khác";

export enum IdIssueOrganisationEnum {
  BoCongAn = "Bộ Công An",
  CSGT = "Cục Cảnh sát quản lý hành chính về trật tự xã hội",
  CSDangKy = "Cục Cảnh sát đăng ký quản lý cư trú và dữ liệu Quốc gia về dân cư",
  Other = "Khác",
}
export interface IdentityComponent {
  IDNumber: string;
  issueDate: string; // ISO date string
  issueAt: idIssueOrganisation;
  otherIssueOrganisation?: string;
  [key: string]: unknown;
}

//Monastic Detail Component //
export type MonasticRank =
  | "Tỳ Kheo Ni"
  | "Sadini"
  | "Tu nữ"
  | "Cư sĩ nam"
  | "Cư sĩ nữ";
export enum MonasticRankEnum {
  TyKheoNi = "Tỳ Kheo Ni",
  Sadini = "Sadini",
  TuNu = "Tu nữ",
  CuSiNam = "Cư sĩ nam",
  CuSiNu = "Cư sĩ nữ",
}

export type MonasticTradition = "Nam Tông" | "Bắc Tông" | "Khất Sĩ" | "Khác";
export enum MonasticTraditionEnum {
  NamTrong = "Nam Tông",
  BacTrong = "Bắc Tông",
  KhatSi = "Khất Sĩ",
  Other = "Khác",
}

export interface MonasticComponent {
  dharmaName: string;
  monasticRank: string;
  monasticTradition: string;
  otherMonasticTradition?: string;
  currentMonastery: string;
  yearsOfPractice: number;
  [key: string]: unknown;
}

// Relation Detail Component //
export interface RelationComponent {
  fullName: string;
  phoneNumber: string;
  relationship: string;
  [key: string]: unknown;
}

// Routine Detail Component //
export type DietaryRequirement = "Ăn Chay" | "Ăn thường";
export enum DietaryRequirementEnum {
  Vegetarian = "Ăn Chay",
  NonVegetarian = "Ăn thường",
}
export interface RoutineComponent {
  dietaryRequirements: DietaryRequirement;
  medicalConditions: boolean;
  foodAllergies?: string;
  [key: string]: unknown;
}
