import { Tabs } from "expo-router";
import { Home, Package, Calendar, User } from "lucide-react-native";
import { useTheme } from "../../theme/index";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBar.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: theme.colors.tabBar.active,
        tabBarInactiveTintColor: theme.colors.tabBar.inactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Quicksand-Medium",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={22} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={22} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="errands"
        options={{
          title: "Errands",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={22} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={22} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
