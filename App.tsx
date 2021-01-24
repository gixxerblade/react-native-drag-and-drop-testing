import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";
import DragAndDrop from "./components/DragAndDrop";

const defaultData = [
  {
    title: "TODO",
    items: ["Item 1", "Item 2", "Item 3"],
  },
  {
    title: "COMPLETE",
    items: ["Item 4", "Item 5"],
  },
];

export default function App() {
  // const dragItem = useRef();
  // let dragItemNode = useRef();
  const [list, setList] = useState(defaultData);
  const [dragging, setDragging] = useState(false);
  // let listArr = [];
  let listArr = defaultData.map(({ title, items }) => Array.from(items));
  let listArrFlat = listArr.flat();

  const pan = listArrFlat.map(() => new Animated.ValueXY());
  let coords = { x: 0, y: 0 };

  const panResponder = (item: string, index: { [key: string]: number }) => {
    const { listIdx, itemIdx, idx } = index;
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        console.log("setting responder...item: ", item, "Array: ", idx);

        return true;
      },
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log("Granting...item selected:::", idx);
        setDragging(true);

        pan[idx].setOffset({ x: coords.x, y: coords.y });
        pan[idx].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log("We are moving...");
        pan[idx].setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
        return Animated.event([null, { dx: pan[idx].x, dy: pan[idx].y }]);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log("We released...", item, "index: ", idx);
        // setDragging(false);
        Animated.spring(pan[idx], {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      // onPanResponderTerminate: (evt, gestureState) => {},
      // onShouldBlockNativeResponder: (evt, gestureState) => {
      //   return true;
      // },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dragAndDrop}>
        {defaultData.map((list, listIdx) => {
          return (
            <View style={styles.dndGroup} key={"" + listIdx}>
              <Text style={styles.groupTitle}>{list.title}</Text>
              <View style={styles.dndColumn}>
                {list.items.map((item: string, itemIdx: number) => {
                  let idx = listArrFlat.findIndex((i) => i === item);
                  return (
                    <Animated.View
                      {...panResponder(item, { listIdx, itemIdx, idx })
                        .panHandlers}
                      key={"" + itemIdx}
                      style={[pan[idx].getLayout(), styles.dndItem]}
                    >
                      <Text>{item}</Text>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dragAndDrop: {
    padding: 0,
    flex: 1,
  },
  dndGroup: {
    backgroundColor: "#49505e",
    borderRadius: 5,
    padding: 10,
    marginBottom: 50,
    display: "flex",
    justifyContent: "space-between",
    zIndex: 0,
  },
  dndColumn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 0,
  },
  dndItem: {
    zIndex: 99,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 3,
    color: "#282c34",
    fontWeight: "bold",
    margin: 10,
  },
  groupTitle: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
