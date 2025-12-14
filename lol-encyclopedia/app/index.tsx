import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#020617",
                padding: 24,
                justifyContent: "center",
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    color: "#f9fafb",
                    fontWeight: "bold",
                    marginBottom: 12,
                }}
            >
                LoL Champion Encyclopedia
            </Text>

            <Text
                style={{
                    color: "#e5e7eb",
                    fontSize: 16,
                    lineHeight: 22,
                    marginBottom: 24,
                }}
            >
                Browse League of Legends champions, their stats, roles, and lore.
            </Text>

            {/* Buttons */}
            <View>
                {/* Go to champions grid */}
                <Link href="/champions" asChild>
                    <Pressable
                        style={{
                            backgroundColor: "#60a5fa",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 999,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#0b1120",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            View champions
                        </Text>
                    </Pressable>
                </Link>

                {/* Go to liked screen */}
                <Link href="/liked" asChild>
                    <Pressable
                        style={{
                            marginTop: 12,
                            backgroundColor: "#111827",
                            borderWidth: 1,
                            borderColor: "#60a5fa",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 999,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#e5e7eb",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            Liked champions
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
