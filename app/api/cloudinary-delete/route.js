// app/api/cloudinary-delete/route.js
// This route requires your Cloudinary API Key and Secret
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,      // IMPORTANT: This should be a server-side only variable
    api_secret: process.env.CLOUDINARY_API_SECRET, // IMPORTANT: This should be a server-side only variable
    secure: true
});

export async function POST(req) {
    try {
        const { public_id } = await req.json();

        if (!public_id) {
            return NextResponse.json({ message: "Public ID is required." }, { status: 400 });
        }

        // Use the destroy method to delete the asset
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            return NextResponse.json({ message: `Image ${public_id} deleted successfully.` }, { status: 200 });
        } else {
            // Cloudinary might return 'not found' if the image doesn't exist, which is fine for rollback
            if (result.result === 'not found') {
                return NextResponse.json({ message: `Image ${public_id} not found on Cloudinary (may have already been deleted).` }, { status: 200 });
            }
            return NextResponse.json({ message: `Failed to delete image ${public_id}. Result: ${result.result}` }, { status: 500 });
        }

    } catch (error) {
        console.error("Cloudinary Delete API Error:", error);
        return NextResponse.json({ message: "Internal server error during image deletion." }, { status: 500 });
    }
}