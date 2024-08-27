import React from "react";
import {
  Stage,
  Layer,
  Circle,
  Rect,
  Text,
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";

const Table = ({
  shapeProps,
  onSelect,
  onChange,
  isSelected,
  stageRef,
}) => {
  const Component = shapeProps.shape === "rectangle" ? Rect : Circle;

  const groupRef = React.useRef<Konva.Group>(null);

  const trRef = React.useRef<Konva.Transformer | null>(null);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragAndResize = () => {
    const group = groupRef.current;
    const box = group.getClientRect();
    const absPos = group.getAbsolutePosition();
    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

    const newAbsPos = { ...absPos };
    if (box.x < 0) {
      newAbsPos.x = -offsetX;
    }
    if (box.y < 0) {
      newAbsPos.y = -offsetY;
    }
    const stage = stageRef?.current?.attrs;
    if (box.x + box.width > stage.width) {
      newAbsPos.x = stage.width - box.width - offsetX;
    }
    if (box.y + box.height > stage.height) {
      newAbsPos.y = stage.height - box.height - offsetY;
    }
    group.setAbsolutePosition(newAbsPos);
  };

  return (
    <React.Fragment>
      <Group
        ref={groupRef}
        draggable
        onClick={onSelect}
        onDragMove={handleDragAndResize}
        onTransform={handleDragAndResize}
        onDragEnd={() => {
          onChange({
            ...shapeProps,
          });
        }}
        onTransformEnd={() => {
          onChange({
            ...shapeProps,
          });
        }}
      >
         <Component
          radius={shapeProps.shape === "rectangle" ? 0 : 100}
          // Adjust the offset for rectangles
          offsetX={shapeProps.shape === "rectangle" ? shapeProps.width * 0.5 : 0} 
          offsetY={shapeProps.shape === "rectangle" ? shapeProps.height * 0.5 : 0}
          {...shapeProps}
        />
        <Text 
          text={shapeProps.id}
          x={shapeProps.width / 2}
          y={shapeProps.height / 2}
          width={shapeProps.width}
          height={shapeProps.height}
          fill="white"
          align="center"
          verticalAlign="middle"
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          anchorCornerRadius={10}
          keepRatio={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              Math.abs(newBox.width) < 100 ||
              Math.abs(newBox.height) < 100 ||
              Math.abs(newBox.width) > 350 ||
              Math.abs(newBox.height) > 350
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const TableLayout = () => {
  const initTables = [
    {
      id: "1",
      capacity: 4,
      minimum_seating: 2,
      fill: "blue",
      description: "A small table for two.",
      name: "Small Table 1",
      qr_code: "SmallTable1QRCode",
      status: "available",
      active: true,
      height: 100,
      width: 100,
      x: 100,
      y: 100,
      shape: "rectangle",
      // Add other table properties as needed
    },
    {
      id: "2",
      capacity: 6,
      minimum_seating: 4,
      fill: "red",
      description: "A medium table for four.",
      name: "Medium Table 2",
      qr_code: "MediumTable2QRCode",
      status: "occupied",
      active: true,
      height: 100,
      width: 100,
      x: 100,
      y: 100,
      shape: "circle",
      // Add other table properties as needed
    },
  ];

  const [tables, setTables] = React.useState(initTables);

  const [selectedId, selectTable] = React.useState(null);

  const [stageSize, setStageSize] = React.useState({ width: 0, height: 0 });

  const containerRef = React.useRef(null);
  
  const stageRef = React.useRef<Konva.Stage>(null);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize({ width, height });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const checkDeselect = (e: { target: { getStage: () => any } }) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectTable(null);
    }
  };

  return (
    <div className="flex flex-col overflow-auto w-full h-full">
      <div ref={containerRef} className="w-full h-full border">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {tables.map((table, i) => {
              return (
                <Table
                  key={i}
                  shapeProps={table}
                  stageRef={stageRef}
                  isSelected={table.id === selectedId}
                  onSelect={() => {
                    selectTable(table.id);
                  }}
                  onChange={(newAttrs: {
                    id: string;
                    capacity: number;
                    minimum_seating: number;
                    fill: string;
                    description: string;
                    name: string;
                    qr_code: string;
                    status: string;
                    active: boolean;
                    height: number;
                    width: number;
                    x: number;
                    y: number;
                    shape: string;
                  }) => {
                    const tbs = tables.slice();
                    tbs[i] = newAttrs;
                    setTables(tbs);
                  }}
                />
              );
            }
          )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default TableLayout; 