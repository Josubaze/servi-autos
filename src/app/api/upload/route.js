import { NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
});

export async function POST(request){
    const data = await request.formData();
    const image = data.get('image');

    if (!image) {
        return NextResponse.json('No se ha subido ninguna imagen', { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const response = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (err, resul ) => {
            if (err) {
                reject(err);
            }
            resolve(resul);
            return NextResponse.json(resul);
        }).end(buffer)
    })

    return NextResponse.json({
        message: "imagen subida",
        url: response.secure_url
    })
}