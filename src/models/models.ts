export interface IUser {
  fullName: string;
  phoneNumber: string;
}

interface Room {
  arrival: string; // "2023-06-30";
  cod_configuration: string; // "MAT";
  departure: string; // "2023-07-01";
  id_rate: string; // "1";
  id_reservation: number; // 7363;
  id_room: number; //  19;
  id_room_4_reservation: number; //  7409;
  id_room_type: number; //  19;
  name_configuration: string; // "Matrimoniale";
  name_rate: string; // "Standard";
  name_room_type: string; // "Alcova Romantica";
  number: string; // "Alcova Romantica";
  qt_guests: 2;
  r4r_code: null;
}

export interface IKrossReservationUser {
  accommodation_total_amount: number;
  arrival: string; // "2023-07-07";
  charge_total_amount: number;
  city_tax_amount: number;
  cleaning_fee_amount: number;
  cod_channel: string; // "BOOKING";
  cod_country: string; // "DE";
  cod_reservation_status: string; // "CONF";
  currency: string; // "EUR";
  date_reservation: string; //"2022-07-27 10:02:37";
  departure: string; //"2023-07-10";
  email: string; //"frost@virtualvision.de";
  id_property: number;
  id_reservation: number;
  label: string; // "Frost Michael";
  lang: string; //"en";
  last_update: string; //"2022-07-31 19:49:32";
  lead_source: string; //"OTA";
  ota_account_id: string; //"5096956";
  ota_commissions_collected: number;
  ota_id: string; //"3953273968";
  other_extra_total_amount: number;
  payment_total_amount: number;
  phone: string; //"+49 175 2015625";
  preview_arrival_time: string; //"16:00";
  rooms: Room[];
  tag: string;
  is_selected: boolean;
}
