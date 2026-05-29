import { ActivityRegistrationFormDataBuilder } from "@/features/courseRegistration/api/activityRegistration.formData-builder";
import { createActivityRegistration } from "@/features/courseRegistration/api/activityRegistration.api";
import type {
  BasicInfoComponent,
  IdentityComponent,
  MonasticComponent,
  RelationComponent,
  RoutineComponent,
} from "@/types/form-templates";
import type { DynamicFields, RegistrationFormValues } from "./types";

interface SubmitRegistrationParams {
  values: RegistrationFormValues;
  documentId: string;
  identityDetail: DynamicFields;
  monasticDetail: DynamicFields;
  relationDetail: DynamicFields;
  routineDetail: DynamicFields;
  otherDetail: DynamicFields;
}

export async function submitActivityRegistration({
  values,
  documentId,
  identityDetail,
  monasticDetail,
  relationDetail,
  routineDetail,
  otherDetail,
}: SubmitRegistrationParams): Promise<"active" | "pending" | "unknown"> {
  if (!values.basic.gender) {
    throw new Error("Missing required gender");
  }

  const registreeData: BasicInfoComponent = {
    ...values.basic,
    gender: values.basic.gender,
    email: values.basic.email ?? "",
    address: values.basic.address ?? "",
    zaloName: values.basic.zaloName ?? "",
  };

  const builder = new ActivityRegistrationFormDataBuilder();

  builder.withFormData({
    registreeData,
    firstTimeRegistered: values.firstTimeRegistered,
    registeredActivity: documentId,
  });

  builder.withRegistrationPayload({
    identityDetail: identityDetail as IdentityComponent,
    monasticDetail: monasticDetail as MonasticComponent,
    relationDetail: relationDetail as RelationComponent,
    routineDetail: routineDetail as RoutineComponent,
    otherDetail,
  });

  const finalPayload = builder.build();
  const response = await createActivityRegistration(finalPayload);
  const registration = Array.isArray(response.data)
    ? response.data[0]
    : response.data;

  const status = registration?.registrationStatus;
  if (status === "active" || status === "pending") return status;
  return "unknown";
}
