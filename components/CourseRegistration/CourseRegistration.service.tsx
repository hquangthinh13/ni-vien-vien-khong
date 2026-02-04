import { getStrapiURL } from "@/lib/api";
import type {
  CourseRegistrationFormData,
  CourseRegistrationResponse,
} from "./CourseRegistration.type";

const COURSE_REGISTRATIONS_ENDPOINT = "/api/course-registrations";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ Create Course Registration (POST) ============

export async function createCourseRegistration(
  formData: CourseRegistrationFormData,
): Promise<CourseRegistrationResponse> {
  if (formData.registedCourseId === undefined) {
    throw new Error(
      "Valid registedCourseId is required to create a course registration.",
    );
  }
  const url = getStrapiURL(COURSE_REGISTRATIONS_ENDPOINT);

  const requestBody = {
    data: {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      registedCourse: formData.registedCourseId,
      ...(formData.address && { address: formData.address }),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to create course registration: ${res.status} - ${JSON.stringify(errorData)}`,
    );
  }

  return (await res.json()) as CourseRegistrationResponse;
}
