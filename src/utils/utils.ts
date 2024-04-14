import { IUser } from "../models/models";

export default function getWelcomeWaGroupMessage(
  roomName: string,
  guestName: string,
  adminList: IUser[],
  roomTag: string
) {
  return `*${roomName}*

  Buongiorno *${guestName}*,
  ${adminList.length ? "noi siamo Marco" : "sono Marco"}, ${adminList.map(
    (admin) => admin.fullName.split(" ")[0]
  )}
  ${adminList.length ? "i Tuoi" : "il Tuo"} Concierge a Perugia! 😊

  A questo link potrai trovare tutte le info riguardanti la tua camera https://umbnbsolutions.kross.travel/guest/my-reservation?tag=${roomTag}.

  Benvenuto/a nella Tua
  Smart Reception
`;
}
