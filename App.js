import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import ProductList from "./src/screens/productList";
import Styles from "./assets/styles";
import { StateProvider } from "./src/hook/stateContext";

export default function App() {
  return (
    <StateProvider>
      <SafeAreaView style={Styles.container}>
        <StatusBar style="auto" />
        <ProductList />
      </SafeAreaView>
    </StateProvider>
  );
}
