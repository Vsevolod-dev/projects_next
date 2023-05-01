import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import React, { FC } from 'react';
import { CSSProperties } from 'react';
import { Image as ImageType } from '@/types';
import Image from 'next/dist/client/image';
import styles from "@/styles/SortableImageItem.module.scss"


const SortableImageItem: FC<{id: number, file: ImageType}> = ({id, file}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: file.name});

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div ref={setNodeRef} style={style} className={styles.item} key={id} {...attributes} {...listeners}>
        <div className={styles.thumbInner}>
            <Image
              width={90}
              height={90}
              src={`${process.env.NEXT_PUBLIC_API_HOST}/image/${file.path}`}
              className={styles.img}
              alt={'dsa'}
            />
        </div>
    </div>
  );
}

export default SortableImageItem