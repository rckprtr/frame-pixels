import { NextRequest, NextResponse } from 'next/server';
import Jimp from 'jimp';
import { Point2D, getMap, getUser } from '../../lib';


export async function GET(req: NextRequest): Promise<NextResponse>  {
    const border = 10;
    const width = 600;
    const height = 300;
    const backgroundWidth = width + border * 2;
    const backgroundHeight = height + border * 2;
    
    const borderColor = 0x000000ff; // Black border color or any color of your choice
    const backgroundColor = 0x363838ff; // Grey background with full opacity (RGBA)
    const redColor = 0xff0000ff; // Red color with full opacity
    const purpleColor = 0xa487c1ff;
    const whiteColor = 0xffffffff;

    const fid = req.nextUrl.searchParams.get('fid');
    const mode = req.nextUrl.searchParams.get('mode');
  
    let userPoint: Point2D | null = null;
    if(fid) {
        let user = await getUser(fid);
        userPoint = user.settings.coords;
    }

    let grid_width = 120;
    let grid_height = 60;
    let grid_multiplier = 5;

    //create grid
    let grid: number[][] = [];

    let map = await getMap();
    grid = map.grid;

    try {
        // Create a new image with a grey background
        const image = new Jimp(width, height, backgroundColor);
        //draw grid
        for (let y = 0; y < grid_height; y++) {
            for (let x = 0; x < grid_width; x++) {
                if (grid[y][x] == 1) {
                    drawSquare(image, x, y, purpleColor, grid_multiplier);
                }
                else if (grid[y][x] == 2) {
                    drawSquare(image, x, y, whiteColor, grid_multiplier);
                }
            }
        }

        // Draw a red dot in the center
        if(userPoint){
            const dotRadius = 5/1.5;
            let user_x = userPoint.x * grid_multiplier;
            let user_y = userPoint.y * grid_multiplier;
            for (let y = -dotRadius; y <= dotRadius; y++) {
                for (let x = -dotRadius; x <= dotRadius; x++) {
                    if (x * x + y * y <= dotRadius * dotRadius) {
                        const drawX = user_x + x;
                        const drawY = user_y + y;
                        if (drawX >= 0 && drawX < width && drawY >= 0 && drawY < height) {
                            image.setPixelColor(redColor, drawX, drawY);
                        }
                    }
                }
            }
        }

        const backgroundImage = new Jimp(backgroundWidth, backgroundHeight, borderColor);

        // Composite the original image onto the background image with an offset
        backgroundImage.composite(image, border, border);
       
        // Get the buffer of the image
        const buffer = await backgroundImage.getBufferAsync(Jimp.MIME_PNG);

        // Set the content type to the response
        return new NextResponse(buffer, { 
            status: 200, 
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'max-age=10',
            }
        })
    } catch (error) {
        console.error('Error creating image:', error);
        return new NextResponse('error', { 
            status: 400, 
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'max-age=10',
            }
        })
    }
}

function drawSquare(image: Jimp, x: number, y: number, color: number, grid_multiplier: number, offset: number = 0) {
    for (let i = 0; i < grid_multiplier; i++) {
        for (let j = 0; j < grid_multiplier; j++) {
            const drawX = x * grid_multiplier + i + offset;
            const drawY = y * grid_multiplier + j + offset;
            if (drawX >= 0 && drawX < image.getWidth() && drawY >= 0 && drawY < image.getHeight()) {
                image.setPixelColor(color, drawX, drawY);
            }
        }
    }
}


// export async function POST(req: NextRequest, res: NextApiResponse): Promise<Response> {
//     return getResponse(req);
// }

export const dynamic = 'force-dynamic';
