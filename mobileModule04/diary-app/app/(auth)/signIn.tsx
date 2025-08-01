import { View, Text } from "../../components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { Button, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as React from "react";
import { createTokenWithCode } from "@/utils/createTokenWithCode";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

// GitHub Endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function SignIn() {
  const currentTheme = useColorScheme();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: [ "identity", "user:email" ],
      redirectUri: makeRedirectUri(),
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {

    if (response?.type === "success") {
      const { code } = response.params;

      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );
      
      if (!access_token) return;

      const credential = GithubAuthProvider.credential(access_token);
      const dataUser = await signInWithCredential(auth, credential);
    }
  }

  return (
    <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>SignIn</Text>
      <Icon.Button
        name="github"
        color={currentTheme === "dark" ? "white" : "black"}
        backgroundColor="transparent"
        size={30}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "500" }}>
          Sign In with Github
        </Text>
      </Icon.Button>
    </View>
  );
}
