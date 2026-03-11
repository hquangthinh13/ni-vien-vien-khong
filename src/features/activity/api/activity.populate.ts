import type { FetchActivityByDocumentIdOptions } from "@/features/activity/model/activity.types";

export const ACTIVITY_POPULATE_COURSE_CONTENT = [
  "courseContent",
  "courseContent.videoSection",
  "courseContent.podcastSection",
  "courseContent.highlightedImages",
] as const;

export const ACTIVITY_POPULATE_REGISTRATION_FORM = [
  "registrationForm",
  "registrationForm.customizedComponents.multipleChoiceDetails.options",
  "registrationForm.commitmentMessages",
] as const;

export const ACTIVITY_POPULATE_REGISTRATION_FORM_AND_COURSE_CONTENT = [
  ...ACTIVITY_POPULATE_COURSE_CONTENT,
  ...ACTIVITY_POPULATE_REGISTRATION_FORM,
] as const;

export function mergePopulateOptions(
  options: FetchActivityByDocumentIdOptions,
  populateFields: readonly string[],
): FetchActivityByDocumentIdOptions {
  if (options.populate === "*") {
    return options;
  }

  const currentPopulate = Array.isArray(options.populate)
    ? options.populate
    : options.populate
      ? [options.populate]
      : [];

  return {
    ...options,
    populate: Array.from(new Set([...currentPopulate, ...populateFields])),
  };
}
