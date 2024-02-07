import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const BASE_URL = process.env['BASE_URL'] || "https://frame-pixels-6dnm.vercel.app";

const frameMetadata = getFrameMetadata({
  buttons: ['start'],
  image: `${BASE_URL}/frame_pixel.png`,
  post_url: `${BASE_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'frame-pixels.xyz',
  description: 'paint for farcaster frames',
  openGraph: {
    title: 'frame-pixels.xyz',
    description: 'paint for farcaster frames',
    images: [`${BASE_URL}/frame_pixel.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  console.log('frame-pixels.xyz paint for farcaster frames');
  return (
    <>
      <h1>frame-pixels.xyz paint for farcaster frames</h1>
    </>
  );
}
