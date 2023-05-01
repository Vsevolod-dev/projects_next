import { FC, useCallback, memo, SetStateAction, Dispatch } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import SortableImageItem from "./SortableImageItem";
import { Image } from "@/types";

const SortableImageList: FC<{files: Image[], setFiles: Dispatch<SetStateAction<Image[]>>}> = ({files, setFiles}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setFiles((files) => {
        const oldIndex = files.findIndex(file => file.name === active.id);
        const newIndex = files.findIndex(file => file.name === over.id);

        return arrayMove(files, oldIndex, newIndex);
      });
    }
  }, []);

  const removeFile = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, fileName: string) => {
    e.stopPropagation()
    setFiles(p => [...p.filter(f => f.name !== fileName)])
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files.map(file => file.name)} strategy={rectSortingStrategy}>
          {files && files.map((file, id) => (
            <div key={id}>
              <SortableImageItem file={file} id={id} />
              <p onClick={(e) => removeFile(e, file.name)}>Удалить</p>
            </div>
          ))}
      </SortableContext>
    </DndContext>
  );
};

export default memo(SortableImageList);
