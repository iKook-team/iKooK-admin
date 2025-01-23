import { useMemo } from 'react';
import linkifyit from 'linkify-it';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const linkify = new linkifyit();

interface LinkPreviewProps {
  url?: string;
  text?: string;
  className?: string;
}

interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  videoId?: string;
  videoThumbnail?: string;
}

export default function LinkPreview({ url, text, className }: LinkPreviewProps) {
  const link = useMemo(() => {
    if (!url && !text) {
      return '';
    }

    return url ?? (linkify.add('ftp:', null).match(text ?? '')?.[0]?.url as string);
  }, [url, text]);

  const { data } = useQuery({
    queryKey: ['link-preview', link],
    queryFn: async ({ queryKey }) => {
      const [_, link] = queryKey;
      const response = await axios.get(link, {
        responseType: 'document'
      });

      const isYouTubeVideo = isYouTubeURL(link);
      if (isYouTubeVideo) {
        const videoId = extractYouTubeVideoId(link);
        const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        return {
          videoId,
          videoThumbnail
        } as LinkPreviewData;
      } else {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const title = doc.querySelector('title')?.textContent || '';
        const description =
          doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        return {
          title,
          description,
          image
        } as LinkPreviewData;
      }
    },
    enabled: !!link
  });

  if (!data) {
    return null;
  }

  const handleClick = () => {
    window.open(link, '_blank');
  };

  if (data.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }} className={className}>
        <img src={data.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }} className={className}>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      {data.image && <img src={data.image} alt="Link Preview" />}
    </div>
  );
}

const isYouTubeURL = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const extractYouTubeVideoId = (url: string) => {
  const videoIdRegex =
    /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
  const match = url.match(videoIdRegex);
  return match ? match[1] : '';
};
