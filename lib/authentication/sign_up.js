import React, { useState, useEffect } from "react";
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
import { getDatabase, ref, set } from "firebase/database";
import { TouchableOpacity } from "react-native";
import signInWithEmailAndPassExceptions from "../exceptions/auth_exceptions";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setMessage("");
    console.log("screeen updated ");
  });

  const addUserToDB = (userId) => {
    setMessage("Adding Data to Firebase");
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
        setIsError(true);
        console.error("Error adding user to database:", error);
        setMessage("Error adding user to database");
      });
  };

  const handleSignUp = () => {
    if (email === "" || password === "") {
      setIsError(true);
      setMessage("Please fill out All fields");
      return;
    }
    setLoading(true);
    setIsError(false);
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
        setMessage("Alert!!! " + signInWithEmailAndPassExceptions(error));
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setMessage("");
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Form</Text>
      <View style={styles.form}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text
              style={{
                ...styles.loadingText,
                color: isError ? "red" : "green",
              }}
            >
              {message}
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
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
              onChangeText={handlePasswordChange}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              placeholder="Password"
              required
            />
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
              <Text style={styles.buttonText}> Sign Up </Text>
            </TouchableOpacity>
            <Text
              style={{
                ...styles.loadingText,
                color: isError ? "red" : "green",
              }}
            >
              {message}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#000",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#d5d5e8",
    shadowRadius: 200,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "white",
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
    fontSize: 20,
    fontWeight: 600,
  },
});

export default SignUpScreen;
