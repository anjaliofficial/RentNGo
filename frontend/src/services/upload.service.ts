import { apiClient } from "../lib/api-client";

class UploadService {
  uploadSingle(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  uploadMultiple(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return apiClient.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export default new UploadService();
