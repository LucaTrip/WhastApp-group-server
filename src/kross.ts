import axios from "axios";

export async function kross(dayToCheck: string) {
  const baseUrl = process.env.KROSS_API_URL;

  const getTokenResponse = await axios.post(`${baseUrl}/auth/get-token`, {
    api_key: process.env.KROSS_API_KEY,
    hotel_id: process.env.KROSS_HOTEL_ID,
    username: process.env.KROSS_USERNAME,
    password: process.env.KROSS_PASSWORD,
  });

  const getListResponse = await axios.post(`${baseUrl}/reservations/get-list`, {
    auth_token: getTokenResponse.data.data.auth_token,
    data: {
      date_reservation_from: `${dayToCheck} 00:00`,
      date_reservation_to: `${dayToCheck} 23:59`,
      cod_reservation_status: "CONF",
      with_rooms: true,
    },
  });

  return getListResponse.data;
}
