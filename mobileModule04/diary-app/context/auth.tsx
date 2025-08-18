import * as React from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface User {
  uid: string;
  createdAt: string;
  displayName: string;
  lastLoginAt: string;
  photoURL: string;
  providerId: string;
  email: string;
}

const initialState = {
  uid: "",
  createdAt: "",
  displayName: "",
  lastLoginAt: "",
  photoURL: "",
  providerId: "",
  email: "",
};

interface ContextInterface {
  user: User | null;
  signIn: React.Dispatch<React.SetStateAction<User>>;
  signOut: () => void;
}

const contextIninitalState: ContextInterface = {
  user: initialState,
  signIn: () => {},
  signOut: () => {},
};

const AuthContext = React.createContext<ContextInterface>(contextIninitalState);

export function useAuth(): ContextInterface {
  const context = React.useContext<ContextInterface>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an Provider");
  }

  return context;
}

function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [hasNavigated, setHasNavigated] = React.useState(false);

  React.useEffect(() => {
    if (!navigationState.key || hasNavigated) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user.uid && !inAuthGroup) {
      router.replace("/(auth)/signIn");
      setHasNavigated(true);
    } else if (user.uid && inAuthGroup) {
      router.replace("/(tabs)");
      setHasNavigated(true);
    }
  }, [user.uid, segments, navigationState, hasNavigated]);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = React.useState<User>(initialState);

  useProtectedRoute(user);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const dataWeCareAbout = {
          uid: user.providerData[0].uid,
          createdAt: user.metadata.creationTime!,
          displayName: user.providerData[0].displayName ?? "",
          lastLoginAt: user.metadata.lastSignInTime!,
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId,
          email: user.providerData[0].email!,
        };
        setUser(dataWeCareAbout);
        router.replace("/(tabs)");
      } else {
        console.log("User is not authenticated");
        router.replace("/(auth)");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: setUser,
        signOut: () => {
          setUser(initialState);
          signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
