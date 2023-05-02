import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { CSSProperties } from 'react';
import { Image as ImageType } from '@/types';
import Image from 'next/dist/client/image';
import styles from "@/styles/SortableImageItem.module.scss"
import { Input } from 'antd';


const SortableImageItem: FC<{id: number, file: ImageType, setFiles: Dispatch<SetStateAction<ImageType[]>>}> = ({id, file, setFiles}) => {
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

  const removeFile = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    e.stopPropagation()
    setFiles(p => [...p.filter(f => f.name !== file.name)])
  }

  const changeFileDesc = (e) => {
    setFiles(p => [...p.map(f => {
      if (f.path === file.path) {
        f.desc = e.target.value
      }
      return f 
    })])
  }
  
  return (
    <div ref={setNodeRef} style={style} className={styles.item} key={id} {...attributes} {...listeners}>
        <div className={styles.thumbInner}>
            <Image
              width={90}
              height={90}
              src={`${process.env.NEXT_PUBLIC_API_HOST}/image/${file.path}`}
              className={styles.img}
              alt={'Image'}
            />
        </div>
        <Input onClick={e => e.stopPropagation()} onChange={changeFileDesc} defaultValue={file.desc} className={styles.inputFile} />
        <p onClick={removeFile} className={styles.removeFile}>Удалить</p>
    </div>
  );
}

export default SortableImageItem