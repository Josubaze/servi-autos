import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Notification from "src/schemas/notification.schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const notifications = await Notification.find().populate('product', '_id name');
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data: Notification = await request.json();
    const newNotification = new Notification(data);
    const savedNotification = await newNotification.save();

    return NextResponse.json(savedNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
