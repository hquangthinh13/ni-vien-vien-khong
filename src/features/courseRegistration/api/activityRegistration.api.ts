import { getStrapiURL } from "@/lib/api";
import type {
  ActivityRegistrationFormData,
  ActivityRegistrationResponse,
} from "../model/activityRegistration.types";
import { ActivityRegistrationFormDataBuilder } from "./activityRegistration.formData-builder";

const COURSE_REGISTRATIONS_ENDPOINT = "/api/activity-registrations";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ Create Course Registration (POST) ============

export async function createCourseRegistration(
  formData: ActivityRegistrationFormData,
): Promise<ActivityRegistrationResponse> {
  const url = getStrapiURL(COURSE_REGISTRATIONS_ENDPOINT);

  const requestBody = new ActivityRegistrationFormDataBuilder()
    .withFormData(formData)
    .build();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    body: JSON.stringify({ data: requestBody }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to create course registration: ${res.status} - ${JSON.stringify(errorData)}`,
    );
  }

  return (await res.json()) as ActivityRegistrationResponse;
}
