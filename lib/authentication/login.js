import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  authentication,
  firebaseApplication,
} from "../FirebaseCRUD/components/firebase";
import { getDatabase, ref, set } from "firebase/database"; // Import necessary functions
import { TouchableOpacity } from "react-native";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addUserToDB = (userId) => {
    const db = getDatabase(firebaseApplication);
    const userRef = ref(db, "users/" + userId);

    const userObject = {
      email: email,
      password: password,
    };

    set(userRef, userObject)
      .then(() => {
        setMessage("User added to database successfully!");
      })
      .catch((error) => {
        console.error("Error adding user to database:", error);
        setMessage("Error adding user to database");
      });
  };

  const handleSignUp = () => {
    if (email === "" || password === "") {
      alert("fill all the fields please");
      return;
    }
    setLoading(true);
    setMessage("Creating Account ...");
    createUserWithEmailAndPassword(authentication, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setMessage("Account Created");
        setEmail("");
        setPassword("");
        console.log("User  signed up:", user);
        addUserToDB(user.uid);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setMessage("Error While Signing Up: " + errorMessage);
        console.error("Error signing up:", errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      ) : (
        <>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            required
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            placeholder="Password"
            required
          />
          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableOpacity>
          <Text style={styles.loadingText}>{message}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    width: 250,
  },
  button: {
    marginTop: 16,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SignUpScreen;
