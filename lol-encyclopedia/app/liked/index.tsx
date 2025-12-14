import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Champion } from "../champions";

const API_URL = "https://sampleapis.assimilate.be/lol/champions";
const STORAGE_KEY = "likedChampions";

export default function LikedScreen() {
    const [likedChampions, setLikedChampions] = useState<Champion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                const likedIds: number[] = stored ? JSON.parse(stored) : [];

                if (likedIds.length === 0) {
                    setLikedChampions([]);
                    setLoading(false);
                    return;
                }

                const response = await fetch(API_URL);
                const data = await response.json();

                const mapped: Champion[] = data
                    .map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        image: { full: item.image.full },
                    }))
                    .filter((champ: Champion) => likedIds.includes(champ.id));

                setLikedChampions(mapped);
            } catch (err) {
                console.error("Error loading liked champions:", err);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#020617",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
                <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
                    Loading liked champions...
                </Text>
            </View>
        );
    }

    if (likedChampions.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#020617",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                }}
            >
                <Text
                    style={{
                        color: "#e5e7eb",
                        fontSize: 16,
                        textAlign: "center",
                    }}
                >
                    You haven't liked any champions yet.{"\n"}
                    Go to the champions screen and tap the hearts.
                </Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#020617",
                paddingHorizontal: 12,
                paddingTop: 16,
            }}
        >
            <Text
                style={{
                    color: "#f9fafb",
                    fontSize: 22,
                    fontWeight: "bold",
                    marginBottom: 8,
                }}
            >
                Liked champions
            </Text>

            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {likedChampions.map((champion) => (
                        <Link
                            key={champion.id}
                            href={{
                                pathname: "/champions/[id]",
                                params: { id: champion.id.toString() },
                            }}
                            asChild
                        >
                            <Pressable
                                style={{
                                    width: "30%",
                                    marginBottom: 16,
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={{ uri: champion.image.full }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        marginBottom: 4,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "#e5e7eb",
                                        fontSize: 12,
                                        textAlign: "center",
                                    }}
                                    numberOfLines={1}
                                >
                                    {champion.name}
                                </Text>
                            </Pressable>
                        </Link>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
