import {
  FetchVideoPlaylistOptions,
  VideoPlaylistResponse,
  Video,
  FetchVideoPlaylistByDocumentIdOptions,
  VideoPlaylist,
} from "@/features/video/model/video.types";
import {
  fetchVideo,
  fetchVideoByDocumentId,
} from "@/features/video/api/video.api";
import "dotenv/config";

const locale = "vi";
const allVideoPlaylists = async () => {
  try {
    const allVideoPlaylist = await fetchVideo({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
      sort: "publishedAt:desc",
    });
    const videoList = allVideoPlaylist.data as VideoPlaylist[];
    console.log("=== Testing Video Services ===\n");
    console.log("1. Fetching all video playlists (first page, 5 items):");
    console.log(
      `Total video playlists: ${allVideoPlaylist.meta?.pagination?.total || 0}`,
    );
    if (Array.isArray(videoList)) {
      videoList.forEach((videoPlaylist, index) => {
        console.log(
          `  ${index + 1}. ${videoPlaylist.documentId} - ${videoPlaylist.description || "No description"}`,
        );
      });
    }
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error instanceof Error ? error.message : error,
    );
  }
};
allVideoPlaylists();

const videoPlaylistById = async (documentId: string) => {
  try {
    console.log(`\n2. Fetching video playlist by documentId: ${documentId}`);
    const videoPlaylistById = await fetchVideoByDocumentId({
      documentId: documentId,
      locale,
      populate: "*",
    });
    if (videoPlaylistById.data && !Array.isArray(videoPlaylistById.data)) {
      const videoPlaylist = videoPlaylistById.data as VideoPlaylist;
      console.log("Title:", videoPlaylist.title);
      console.log(
        "Description:",
        videoPlaylist.description || "No description",
      );
      console.log("Has cover image:", !!videoPlaylist.coverImage);
      console.log("Videos count:", videoPlaylist.videos?.length || 0);
    }

    const videosPlaylist = videoPlaylistById.data as VideoPlaylist;
    const videos = videosPlaylist.videos as Video[];
    if (Array.isArray(videos)) {
      videos.forEach((video, index) => {
        console.log(
          `  ${index + 1}. ${video.title} - ${video.videoLink || "No link"}`,
        );
      });
    }
  } catch (error) {
    console.error(
      "Error fetching video playlist by documentId:",
      error instanceof Error ? error.message : error,
    );
  }
};
