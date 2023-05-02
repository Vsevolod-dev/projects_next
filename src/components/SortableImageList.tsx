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

const activationConstraint = {
  delay: 100,
  tolerance: 100,
}

const SortableImageList: FC<{files: Image[], setFiles: Dispatch<SetStateAction<Image[]>>}> = ({files, setFiles}) => {
  const sensors = useSensors(useSensor(MouseSensor, {activationConstraint}), useSensor(TouchSensor, {activationConstraint}));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active && over && active.id !== over.id) {
      setFiles((files) => {
        const oldIndex = files.findIndex(file => file.name === active.id);
        const newIndex = files.findIndex(file => file.name === over.id);

        return arrayMove(files, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files.map(file => file.name)} strategy={rectSortingStrategy} >
          {files && files.map((file, id) => (
            <div key={file.size}>
              <SortableImageItem setFiles={setFiles} file={file} id={file.size}/>
            </div>
          ))}
      </SortableContext>
    </DndContext>
  );
};

export default memo(SortableImageList);
