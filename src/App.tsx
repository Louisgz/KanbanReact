import { useState, useEffect } from "react";
import initialData from "./initial-data";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";

function App() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = data.columns[source.droppableId];
    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(source.index, 1);
    if (destination.droppableId === source.droppableId) {
      newSourceTaskIds.splice(destination.index, 0, draggableId);
    }

    const newSourceColumn = {
      ...sourceColumn,
      taskIds: newSourceTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newSourceColumn.id]: newSourceColumn,
      },
    };

    if (destination.droppableId !== source.droppableId) {
      const destinationColumn = data.columns[destination.droppableId];
      const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
      console.log(newDestinationTaskIds);
      console.log(destination.index);
      newDestinationTaskIds.splice(destination.index, 0, draggableId);

      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: newDestinationTaskIds,
      };

      newState.columns[newDestinationColumn.id] = newDestinationColumn;
    }

    setData(newState);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    </div>
  );
}

export default App;

