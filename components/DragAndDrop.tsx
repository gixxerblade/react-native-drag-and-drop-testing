import React, { Component } from "react";
import { Text, View, Animated, PanResponder, StyleSheet } from "react-native";

// interface ListProps {
//   lists: [
//     {
//       title: string;
//       item: string;
//     }
//   ];
// }
// interface ListState {}

class DragAndDrop extends Component<{ lists: string[] }> {
  pan = new Animated.ValueXY();
  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.pan.setOffset({
        x: this.pan.x._value,
        y: this.pan.y._value,
      });
    },
    onPanResponderMove: Animated.event([
      null,
      { dx: this.pan.x, dy: this.pan.y },
    ]),
    onPanResponderRelease: () => {
      this.pan.flattenOffset();
    },
  });
  render() {
    const { lists } = this.props;
    console.log(lists);
    return (
      <View style={styles.dragAndDrop}>
        {lists.map((list, listIdx: number) => {
          <View key={"" + listIdx} style={styles.dNDGroup}>
            <Text style={styles.groupTitle}>{list.title}</Text>
            {list.items.map((item: string, itemIdx: number) => {
              return (
                <Text key={"" + itemIdx} style={styles.dNDItem}>
                  {item}
                </Text>
              );
            })}
          </View>;
        })}
      </View>
    );
  }
}
export default DragAndDrop;

const styles = StyleSheet.create({
  dragAndDrop: {
    padding: 0.5,
    flex: 1,
  },
  dNDGroup: {
    backgroundColor: "#49505e",
    borderRadius: 5,
    padding: 0.5,
  },
  dNDItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    color: "#282c34",
    fontWeight: "bold",
  },
  groupTitle: {
    textAlign: "center",
    marginBottom: 0.5,
    fontSize: 1.5,
  },
});
