import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";

const DEFAULT_PAGINATE = 15;
export default function App() {
  const [list, setList] = useState([]);
  const [paginate, setPaginate] = useState(DEFAULT_PAGINATE);
  const [refresh, setRefresh] = useState(false);
  const getBeerList = async () => {
    try {
      const { data } = await axios.get(
        `https://api.punkapi.com/v2/beers?page=1&per_page=${paginate}`
      );
      setList(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getBeerList();
  }, [paginate]);

  const getItemCount = (data) => paginate;

  const getItem = (data, index) => {
    return {
      key: index,
      id: Math.random().toString(12).substring(0),
      name: `${index} : ${data[index]?.name}`,
    };
  };
  const getEndReached = () => {
    setPaginate((prev) => prev + 5);
  };
  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
      setPaginate(15);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 20 }}>
            <Text>{item.name}</Text>
          </View>
        )}
        getItemCount={getItemCount}
        getItem={getItem}
        onEndReached={getEndReached}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
});
