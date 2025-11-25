import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  User,
  Edit2,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Settings,
} from "lucide-react-native";
import { useTheme } from "../../theme/index";
import { useAuthStore } from "../../store/index";
import Button from "../../components/Button";
import Card from "../../components/Card";

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme.isDark);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile editing will be available in a future update.",
      [{ text: "OK" }],
    );
  };

  const settingsItems = [
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Receive order updates and promotions",
      icon: Bell,
      type: "switch",
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      id: "theme",
      title: "Dark Mode",
      subtitle: "Use dark theme for better night viewing",
      icon: darkModeEnabled ? Moon : Sun,
      type: "switch",
      value: darkModeEnabled,
      onValueChange: setDarkModeEnabled,
    },
  ];

  const menuItems = [
    {
      id: "orders",
      title: "My Orders",
      subtitle: "View and track your delivery history",
      icon: Settings,
      onPress: () => router.push("/(tabs)/orders"),
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.card.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
      }}
      disabled={item.type === "switch"}
      onPress={item.onPress}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.primary + "15",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <item.icon size={20} color={theme.colors.primary} strokeWidth={1.5} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-SemiBold",
            color: theme.colors.text.primary,
            marginBottom: 2,
            fontWeight: "600",
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Quicksand-Regular",
            color: theme.colors.text.secondary,
          }}
        >
          {item.subtitle}
        </Text>
      </View>

      {item.type === "switch" ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + "40",
          }}
          thumbColor={
            item.value ? theme.colors.primary : theme.colors.text.tertiary
          }
        />
      ) : (
        <ChevronRight
          size={20}
          color={theme.colors.text.tertiary}
          strokeWidth={1.5}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Quicksand-Bold",
              color: theme.colors.text.primary,
              marginBottom: 8,
              fontWeight: "700",
            }}
          >
            Profile
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Quicksand-Regular",
              color: theme.colors.text.secondary,
            }}
          >
            Manage your account and preferences
          </Text>
        </View>

        {/* User Info Card */}
        <Card style={{ marginHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.primary + "20",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              {user?.avatar ? (
                <Text>Avatar</Text> // Placeholder for avatar image
              ) : (
                <User
                  size={36}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "Quicksand-Bold",
                  color: theme.colors.text.primary,
                  marginBottom: 4,
                  fontWeight: "700",
                }}
              >
                {user?.name || "User Name"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Mail
                  size={16}
                  color={theme.colors.text.secondary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Quicksand-Regular",
                    color: theme.colors.text.secondary,
                    marginLeft: 8,
                  }}
                >
                  {user?.email || "user@example.com"}
                </Text>
              </View>

              {user?.phone && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Phone
                    size={16}
                    color={theme.colors.text.secondary}
                    strokeWidth={1.5}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Quicksand-Regular",
                      color: theme.colors.text.secondary,
                      marginLeft: 8,
                    }}
                  >
                    {user.phone}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleEditProfile}
              style={{
                padding: 8,
              }}
            >
              <Edit2 size={20} color={theme.colors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Menu Items */}
        {menuItems.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Quicksand-SemiBold",
                color: theme.colors.text.primary,
                paddingHorizontal: 20,
                marginBottom: 12,
                fontWeight: "600",
              }}
            >
              Quick Actions
            </Text>

            <View
              style={{
                backgroundColor: theme.colors.card.background,
                marginHorizontal: 20,
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={item.onPress}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.divider,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.colors.info + "15",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <item.icon
                      size={20}
                      color={theme.colors.info}
                      strokeWidth={1.5}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Quicksand-SemiBold",
                        color: theme.colors.text.primary,
                        marginBottom: 2,
                        fontWeight: "600",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Quicksand-Regular",
                        color: theme.colors.text.secondary,
                      }}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  <ChevronRight
                    size={20}
                    color={theme.colors.text.tertiary}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Quicksand-SemiBold",
              color: theme.colors.text.primary,
              paddingHorizontal: 20,
              marginBottom: 12,
              fontWeight: "600",
            }}
          >
            Settings
          </Text>

          <View
            style={{
              backgroundColor: theme.colors.card.background,
              marginHorizontal: 20,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            {settingsItems.map((item, index) => (
              <View
                key={item.id}
                style={{
                  borderBottomWidth: index < settingsItems.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.divider,
                }}
              >
                {renderSettingItem(item)}
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20 }}>
          <Button
            title="Sign Out"
            leftIcon={LogOut}
            onPress={handleLogout}
            variant="outline"
            style={{
              borderColor: theme.colors.error,
              paddingVertical: 16,
            }}
            textStyle={{
              color: theme.colors.error,
              fontSize: 16,
              fontFamily: "Quicksand-SemiBold",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
