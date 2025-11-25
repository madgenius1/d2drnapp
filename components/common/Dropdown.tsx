import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { useTheme } from "../theme/index";

export default function Dropdown({
  label,
  placeholder = "Select an option",
  value,
  onSelect,
  options = [],
  error,
  disabled = false,
  style = {},
  renderItem,
  keyExtractor,
}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) =>
    keyExtractor ? keyExtractor(option) === value : option.value === value,
  );

  const getSelectedText = () => {
    if (selectedOption) {
      return renderItem
        ? renderItem(selectedOption, true)
        : selectedOption.label || selectedOption.name;
    }
    return placeholder;
  };

  const handleSelect = (option) => {
    const optionValue = keyExtractor ? keyExtractor(option) : option.value;
    onSelect(optionValue, option);
    setIsOpen(false);
  };

  const renderDropdownItem = ({ item }) => {
    const isSelected = keyExtractor
      ? keyExtractor(item) === value
      : item.value === value;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
        }}
        onPress={() => handleSelect(item)}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-Regular",
            color: isSelected
              ? theme.colors.primary
              : theme.colors.text.primary,
            flex: 1,
          }}
        >
          {renderItem ? renderItem(item, false) : item.label || item.name}
        </Text>
        {isSelected && <Check size={20} color={theme.colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-Medium",
            color: theme.colors.text.primary,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.colors.input.background,
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.input.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          opacity: disabled ? 0.6 : 1,
        }}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-Regular",
            color: selectedOption
              ? theme.colors.text.primary
              : theme.colors.input.placeholder,
            flex: 1,
          }}
        >
          {getSelectedText()}
        </Text>
        <ChevronDown
          size={20}
          color={theme.colors.text.tertiary}
          style={{
            transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {error && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Quicksand-Regular",
            color: theme.colors.error,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              maxHeight: "60%",
              width: "85%",
              maxWidth: 400,
            }}
          >
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Quicksand-SemiBold",
                  color: theme.colors.text.primary,
                  textAlign: "center",
                }}
              >
                {label || "Select Option"}
              </Text>
            </View>

            <FlatList
              data={options}
              renderItem={renderDropdownItem}
              keyExtractor={(item, index) =>
                keyExtractor
                  ? keyExtractor(item)
                  : item.value || index.toString()
              }
              showsVerticalScrollIndicator={false}
              style={{
                maxHeight: 300,
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
