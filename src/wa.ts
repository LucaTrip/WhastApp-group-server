import { Request, Response } from "express";
import { Client, RemoteAuth } from "whatsapp-web.js";
import { SSETypology } from "./models/types";
import { IKrossReservationUser, IUser } from "./models/models";
import getWelcomeWaGroupMessage from "./utils/utils";

interface ICreateWhatsAppGroup {
  groupName: string;
  guestInfo: IKrossReservationUser;
  adminList: IUser[];
}

let waClient: Client | undefined;

export function initializeWa(store: any, res: Response) {
  console.log("initializing WhatsApp...");

  waClient = new Client({
    puppeteer: {
      args: ["--no-sandbox"],
    },
    webVersion: "2.2407.3",
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html",
    },
    authStrategy: new RemoteAuth({
      store,
      dataPath: "../wwebjs_auth",
      clientId: "umbrianconcierge",
      backupSyncIntervalMs: 300000,
    }),
  });

  waClient.on("remote_session_saved", () => {
    console.log("remote session exist");
    res.write(
      `data: ${JSON.stringify({
        type: SSETypology.wa_authenticated,
        data: true,
      })}\n\n`
    );
  });

  waClient.on("qr", (qr) => {
    console.log("generated qr-code");
    res.write(
      `data: ${JSON.stringify({
        type: SSETypology.wa_qrcode,
        data: qr,
      })}\n\n`
    );
  });

  waClient.on("authenticated", async () => {
    console.log("authenticated on WhatsApp");
    res.write(
      `data: ${JSON.stringify({
        type: SSETypology.wa_authenticated,
        data: true,
      })}\n\n`
    );
  });

  waClient.on("disconnected", async () => {
    console.log("disconnected from WhatsApp");
    res.write(
      `data: ${JSON.stringify({
        type: SSETypology.wa_authenticated,
        data: false,
      })}\n\n`
    );
  });

  waClient.on("ready", () => {
    console.log("Client is ready!");
    res.write(
      `data: ${JSON.stringify({
        type: SSETypology.wa_ready,
        data: true,
      })}\n\n`
    );
  });

  waClient.initialize();
}

export async function createWaGroup(req: Request, res: Response) {
  if (!waClient)
    return res.status(500).json({ message: "whatsapp client is not ready" });

  try {
    const { groupName, guestInfo, adminList }: ICreateWhatsAppGroup = req.body;
    console.log("creating whatsapp group...");

    const response: any = await waClient.createGroup(groupName, [
      ...adminList?.map(({ phoneNumber }: any) => {
        const number = phoneNumber.substring(1);
        return `${number}@c.us`;
      }),
      `${guestInfo.phone.trim().substring(1)}@c.us`,
    ]);

    // console.log("whatsapp group created!", response);

    await waClient.sendMessage(
      response.gid._serialized,
      getWelcomeWaGroupMessage(
        guestInfo.rooms[0].name_room_type,
        guestInfo.label,
        adminList,
        guestInfo.tag
      )
    );

    res
      .status(200)
      .json({ status: "group created and message send into group" });
  } catch (error) {
    console.log("whatsapp group creation error", error);
    res.status(500).json(error);
  }
}
