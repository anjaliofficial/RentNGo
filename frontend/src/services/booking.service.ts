import { apiClient } from "../lib/api-client";
import { CreateBookingInput } from "../types/booking.types";

class BookingService {
  create(data: CreateBookingInput) {
    return apiClient.post("/bookings", data);
  }

  myBookings() {
    return apiClient.get("/bookings/my-bookings");
  }

  ownerBookings() {
    return apiClient.get("/bookings/owner");
  }

  accept(id: string) {
    return apiClient.patch(`/bookings/${id}/accept`);
  }

  reject(id: string) {
    return apiClient.patch(`/bookings/${id}/reject`);
  }

  cancel(id: string) {
    return apiClient.patch(`/bookings/${id}/cancel`);
  }

  pickup(id: string) {
    return apiClient.patch(`/bookings/${id}/pickup`);
  }

  complete(id: string) {
    return apiClient.patch(`/bookings/${id}/complete`);
  }
}

export default new BookingService();
