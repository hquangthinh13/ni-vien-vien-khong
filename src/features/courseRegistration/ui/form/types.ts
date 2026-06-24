import type {
  Activity,
  CustomizedComponent,
  MultipleChoiceOption,
  RegistrationFormTemplate,
} from "@/features/activity/model/activity.types";
import type {
  BasicInfoComponent,
  IdentityComponent,
  MonasticComponent,
  RelationComponent,
  RoutineComponent,
} from "@/types/form-templates";

export type DynamicFieldValue =
  | string
  | number
  | boolean
  | string[];

export interface DynamicFields {
  [key: string]: DynamicFieldValue;
}

export interface RegistrationFormValues {
  firstTimeRegistered: boolean;
  basic: Omit<
    BasicInfoComponent,
    "gender" | "email" | "address" | "ward" | "province" | "zaloName"
  > & {
    gender?: BasicInfoComponent["gender"];
    email?: string;
    address?: string;
    ward?: string;
    province?: string;
    zaloName?: string;
  };
  identityDetail: Partial<IdentityComponent> & DynamicFields;
  monasticDetail: Partial<MonasticComponent> & DynamicFields;
  relationDetail: Partial<RelationComponent> & DynamicFields;
  routineDetail: Partial<RoutineComponent> & DynamicFields;
  otherDetail: DynamicFields;
  commitments: Record<string, boolean>;
  dynamicOthers: Record<string, string>;
}

export interface CustomizedComponentWithDetails extends CustomizedComponent {
  multipleChoiceDetails?: MultipleChoiceOption;
}

export interface RegistrationFormContext {
  template: RegistrationFormTemplate | null;
  activity: Activity | null;
  documentId: string;
}
