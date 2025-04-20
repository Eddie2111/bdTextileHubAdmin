import { client } from "@/sanity/lib/client";

export async function fetchImageDetails(imageId: string) {
  const imageQuery = `*[_type == "images" && _id == $imageId]{
    mainImage {
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    }
  }`;

  return await client.fetch(imageQuery, { imageId });
}

export async function deleteImage(id: string) {
  try {
    const imageDetails = await fetchImageDetails(id);
    await client.delete(imageDetails.id);
    return { message: "Image deleted", status: true };
  } catch (err) {
    console.log(err);
    return { message: "Error deleting image", status: false };
  }
}
