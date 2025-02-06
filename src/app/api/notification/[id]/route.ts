import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Notification from "src/schemas/notification.schema";
import { NextRequest } from "next/server";

interface Params {
  params: { id: string };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await connectDB();
  try {
    const notificationDeleted = await Notification.findByIdAndDelete(params.id);
    if (!notificationDeleted) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    const notifications = await Notification.find();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
