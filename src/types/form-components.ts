export type ComponentType =
  | "short text"
  | "long text"
  | "bool"
  | "date"
  | "datetime"
  | "number"
  | "multiple choice";

export type FormSection =
  | "Thông tin cơ bản (Basic Information)"
  | "Thông tin CCCD (Identity Detail)"
  | "Thông tin tu học (Monatic Detail)"
  | "Thông tin thân nhân (Relation Detail)"
  | "Thông tin sinh hoạt (Routine Detail)"
  | "Thông tin khác (Others)";

export type FormComponentEnum = {
  label: string;
  type: ComponentType;
  section: FormSection;
};

// ENUMS

export enum FormSectionEnum {
  BasicInfo = "Thông tin cơ bản (Basic Information)",
  Identity = "Thông tin CCCD (Identity Detail)",
  Monastic = "Thông tin tu học (Monatic Detail)",
  Relation = "Thông tin thân nhân (Relation Detail)",
  Routine = "Thông tin sinh hoạt (Routine Detail)",
  Others = "Thông tin khác (Others)",
}

export enum ComponentTypeEnum {
  ShortText = "short text",
  LongText = "long text",
  Bool = "bool",
  Date = "date",
  DateTime = "datetime",
  Number = "number",
  MultipleChoice = "multiple choice",
}
