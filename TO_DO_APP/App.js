import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,TouchableOpacity,FlatList,Image} from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API từ MockAPI
  const fetchData = async () => {
    try {
      const response = await fetch("https://6459e17165bd868e930aa3ad.mockapi.io/users");
      const json = await response.json();
      setData(json); // Cập nhật dữ liệu lấy từ API
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.shopName}>{item.shop}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
  
  const handleAdd = async () => {
    try {
      const newItem = {
        name: "New Product", // Thay đổi giá trị này theo yêu cầu
        shop: "New Shop",    // Thay đổi giá trị này theo yêu cầu
        image: "https://via.placeholder.com/60", // URL hình ảnh mẫu
      };
  
      const response = await fetch("https://6459e17165bd868e930aa3ad.mockapi.io/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem), // Chuyển đổi object thành JSON
      });
  
      if (response.ok) {
        const addedItem = await response.json();
        setData([...data, addedItem]); // Cập nhật lại danh sách với object mới
      } else {
        console.error("Failed to add item");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    try {
      // Sắp xếp danh sách theo id giảm dần
      const sortedData = [...data].sort((a, b) => b.id - a.id);
  
      if (sortedData.length > 0) {
        // Lấy item đầu tiên (item có id cao nhất)
        const itemToDelete = sortedData[0];
  
        // Gửi yêu cầu DELETE đến API
        await fetch(`https://6459e17165bd868e930aa3ad.mockapi.io/users/${itemToDelete.id}`, {
          method: 'DELETE',
        });
  
        // Cập nhật state để loại bỏ item đã xóa
        setData(prevData => prevData.filter(product => product.id !== itemToDelete.id));
      } else {
        console.log("No items to delete");
      }
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.func}>
        <TouchableOpacity style={styles.touch} onPress={handleAdd}>
          <Text style={styles.text}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.text}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch} onPress={handleDelete}>
          <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flatlist}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  touch:{
    backgroundColor: 'blue',
    width: 100,
    height: 50,
    marginHorizontal: 5,
  },
  func:{
    flex: 1,
    color: 'white',
    fontSize: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  text:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  flatlist:{
    flex: 2,
   
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  imageicon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopName: {
    fontSize: 14,
    color: "#666",
  },
  chatButton: {
    backgroundColor: "#F31111",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chatText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
