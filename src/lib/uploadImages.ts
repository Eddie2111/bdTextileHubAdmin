import axios from "axios"

export async function uploadImages(images: File[]) {
  try {
    const uploadedUrls = await Promise.all(
      images.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await axios.post("/api/image", formData)
        return response.data.imageId
      }),
    )

    console.log("Uploaded Image URLs:", uploadedUrls)
    return uploadedUrls
  } catch (error) {
    console.error("Error uploading images:", error)
    throw error
  }
}

