'use client';

import { useEffect } from 'react';
import { pixel } from '@/lib/pixel';

export default function PixelViewContent({
  name,
  category,
  ids,
}: {
  name: string;
  category?: string;
  ids?: string[];
}) {
  useEffect(() => {
    pixel.viewContent({ content_name: name, content_category: category, content_ids: ids });
  }, [name, category, ids]);

  return null;
}
