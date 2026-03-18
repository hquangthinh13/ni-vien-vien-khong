import { ImageResponse } from "next/og";
import { fetchActivityByDocumentIdWithRegistrationFormAndCourseContent } from "@/features/activity/api/activity.api";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const response =
    await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
      documentId: documentId,
    });

  const post = response?.data as Activity;

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={getImageUrl(post.coverImage) || "/placeholder.png"}
        alt={post.activityName || "Course cover image"}
        className="w-full h-full object-cover"
      />
      {post.activityName || "Ni Viện Viên Không"}
    </div>,
  );
}
